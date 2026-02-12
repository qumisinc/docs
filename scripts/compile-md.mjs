/**
 * Compiles .mdx files into clean .md files for LLM consumption.
 *
 * Parses MDX via remark + remark-mdx, walks the AST to convert or remove
 * Mintlify JSX components, then serializes back to Markdown.
 *
 * Usage: node scripts/compile-md.mjs
 * Output: md/ directory mirroring the source structure
 */

import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";
import { visit, SKIP } from "unist-util-visit";

const OUTPUT_DIR = "md";
const FULL_TXT = path.join("md", "qumis-full.llms.txt");
const EXCLUDE = ["snippets/**", "node_modules/**", `${OUTPUT_DIR}/**`];

// Components whose title attribute becomes a heading, children kept
const HEADING_COMPONENTS = new Set([
  "Step",
  "Accordion",
  "Tab",
]);

// Callout components → blockquote with prefix
const CALLOUT_COMPONENTS = new Map([
  ["Tip", "Tip"],
  ["Warning", "Warning"],
  ["Info", "Info"],
  ["Note", "Note"],
]);

/**
 * Extract a named attribute value from an mdxJsxFlowElement or
 * mdxJsxTextElement node.
 */
function getAttr(node, name) {
  const attr = node.attributes?.find(
    (a) => a.type === "mdxJsxAttribute" && a.name === name
  );
  return attr?.value ?? null;
}

/**
 * Prepend a bold prefix to the first paragraph child of a callout.
 * If the first child is already a paragraph, inject the prefix at the start.
 * Otherwise, create a new paragraph with just the prefix.
 */
function buildCalloutChildren(prefix, children) {
  const prefixNodes = [
    { type: "strong", children: [{ type: "text", value: `${prefix}:` }] },
    { type: "text", value: " " },
  ];

  const first = children[0];
  if (first && first.type === "paragraph") {
    return [
      {
        type: "paragraph",
        children: [...prefixNodes, ...first.children],
      },
      ...children.slice(1),
    ];
  }

  return [
    { type: "paragraph", children: prefixNodes },
    ...children,
  ];
}

/**
 * Remark plugin that transforms Mintlify JSX into plain Markdown nodes.
 */
function remarkStripMdx() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (!parent || index == null) return;

      // Remove ESM import/export statements
      if (node.type === "mdxjsEsm") {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }

      // Handle JSX elements (both flow and text)
      if (
        node.type === "mdxJsxFlowElement" ||
        node.type === "mdxJsxTextElement"
      ) {
        const tag = node.name;

        // Self-closing elements with no children → remove entirely
        if (!node.children || node.children.length === 0) {
          parent.children.splice(index, 1);
          return [SKIP, index];
        }

        // Heading components: emit ### title then children
        if (HEADING_COMPONENTS.has(tag)) {
          const title = getAttr(node, "title");
          const replacement = [];
          if (title) {
            replacement.push({
              type: "heading",
              depth: 3,
              children: [{ type: "text", value: title }],
            });
          }
          replacement.push(...node.children);
          parent.children.splice(index, 1, ...replacement);
          return [SKIP, index];
        }

        // Callout components: wrap children in a blockquote with prefix
        if (CALLOUT_COMPONENTS.has(tag)) {
          const prefix = CALLOUT_COMPONENTS.get(tag);
          const replacement = {
            type: "blockquote",
            children: buildCalloutChildren(prefix, node.children),
          };
          parent.children.splice(index, 1, replacement);
          return [SKIP, index];
        }

        // All other JSX elements: unwrap (keep children, drop the tag)
        parent.children.splice(index, 1, ...node.children);
        return [SKIP, index];
      }

      // Remove JSX expression nodes ({...})
      if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });
  };
}

const processor = remark()
  .use(remarkFrontmatter, ["yaml"])
  .use(remarkMdx)
  .use(remarkStripMdx)
  .use(remarkStringify, {
    bullet: "-",
    emphasis: "*",
    strong: "*",
    rule: "-",
    fences: true,
  });

const files = await glob("**/*.mdx", {
  ignore: EXCLUDE,
  cwd: process.cwd(),
});

console.log(`Found ${files.length} MDX files`);

let success = 0;
let errors = 0;

for (const file of files) {
  const src = await fs.readFile(file, "utf8");
  const outPath = path.join(OUTPUT_DIR, file.replace(/\.mdx$/, ".md"));

  try {
    const result = await processor.process(src);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, String(result), "utf8");
    success++;
  } catch (err) {
    console.error(`ERROR ${file}: ${err.message}`);
    errors++;
  }
}

console.log(`Done: ${success} compiled, ${errors} errors`);
if (errors > 0) process.exit(1);

// --- Build qumis-*.llms.txt: all pages concatenated in navigation order ---

/**
 * Recursively extract page slugs from docs.json navigation in order.
 */
function extractNavPages(items) {
  const pages = [];
  for (const item of items) {
    if (typeof item === "string") {
      pages.push(item);
    } else if (Array.isArray(item.pages)) {
      pages.push(...extractNavPages(item.pages));
    } else if (Array.isArray(item.groups)) {
      pages.push(...extractNavPages(item.groups));
    }
  }
  return pages;
}

const docsJson = JSON.parse(await fs.readFile("docs.json", "utf8"));
const navSlugs = extractNavPages(docsJson.navigation.tabs);

// Map slug → output .md path
const allOutputFiles = new Set(
  files.map((f) => f.replace(/\.mdx$/, ""))
);

// Ordered: nav pages first, then remaining pages sorted alphabetically
const ordered = [
  ...navSlugs.filter((s) => allOutputFiles.has(s)),
  ...[...allOutputFiles].filter((s) => !navSlugs.includes(s)).sort(),
];

const docsDescription = docsJson.description || "";

/**
 * Read a compiled .md file and return a formatted section for the combined file.
 * Returns null if the file is missing.
 */
async function readPageSection(slug) {
  const mdPath = path.join(OUTPUT_DIR, slug + ".md");
  try {
    let content = await fs.readFile(mdPath, "utf8");
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
    let title = slug;
    if (fmMatch) {
      const titleMatch = fmMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
      if (titleMatch) title = titleMatch[1];
      content = content.slice(fmMatch[0].length);
    }
    return `---\n\n# ${title}\n\nSource: ${slug}\n\n${content.trim()}\n`;
  } catch {
    return null;
  }
}

/**
 * Build a combined .txt.md file from a list of slugs.
 */
async function buildCombinedFile(filename, heading, slugs) {
  const outPath = path.join(OUTPUT_DIR, filename);
  const parts = [`# ${heading}\n\n${docsDescription}\n`];
  for (const slug of slugs) {
    const section = await readPageSection(slug);
    if (section) parts.push(section);
  }
  await fs.writeFile(outPath, parts.join("\n"), "utf8");
  const count = parts.length - 1; // exclude header
  console.log(`Generated ${outPath} (${count} pages)`);
}

const externalSlugs = ordered.filter((s) => !s.startsWith("internal/"));
const internalSlugs = ordered.filter((s) => s.startsWith("internal/"));
const engineeringSlugs = ordered.filter((s) => s.startsWith("internal/engineering/"));
const messagingSlugs = ordered.filter((s) => s.startsWith("internal/messaging/"));

await buildCombinedFile("qumis-full.llms.txt", docsJson.name, ordered);
await buildCombinedFile("qumis-external.llms.txt", `${docsJson.name} — External`, externalSlugs);
await buildCombinedFile("qumis-internal.llms.txt", `${docsJson.name} — Internal`, internalSlugs);
await buildCombinedFile("qumis-engineering.llms.txt", `${docsJson.name} — Engineering`, engineeringSlugs);
await buildCombinedFile("qumis-messaging.llms.txt", `${docsJson.name} — Messaging`, messagingSlugs);

// Copy combined files to assets so Mintlify serves them as downloadable static files
const LLM_ASSETS_DIR = path.join("assets", "internal", "llms");
for (const f of [
  "qumis-full.llms.txt", "qumis-external.llms.txt", "qumis-internal.llms.txt",
  "qumis-engineering.llms.txt", "qumis-messaging.llms.txt",
]) {
  await fs.copyFile(path.join(OUTPUT_DIR, f), path.join(LLM_ASSETS_DIR, f));
}
console.log(`Copied combined files to ${LLM_ASSETS_DIR}`);
