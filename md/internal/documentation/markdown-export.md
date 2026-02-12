---
title: "Markdown Export"
description: "Export documentation pages as Markdown for AI tools and external integrations"
icon: "download"
noindex: true
# groups: ["internal"]
---

## Overview

Markdown provides structured text that AI tools can process more efficiently than HTML, resulting in better response accuracy, faster processing times, and lower token usage.

Qumis documentation automatically generates Markdown versions of pages that are optimized for AI tools and external integrations.

## Export Methods

### URL Extension

Add `.md` to any page's URL to view a Markdown version.

### Keyboard Shortcut

Press Command + C (Ctrl + C on Windows) to copy a page as Markdown to your clipboard.

## Usage Examples

### Auto-Detect Current Page

The simplest usage automatically detects the current page and appends `.md`:

```jsx
<MarkdownExportButton />
```

### Relative URL

Export a specific page using a relative path:

```jsx
<MarkdownExportButton href="/features/policy-analysis.md">
  Export Policy Analysis
</MarkdownExportButton>
```

Export Policy Analysis

### Custom Title

Add a custom hover tooltip with the `title` prop:

```jsx
<MarkdownExportButton
  href="/features/claims-assessment.md"
  title="Download claims assessment guide in Markdown format"
>
  Export Claims Guide
</MarkdownExportButton>
```

Export Claims Guide

### Multiple Export Options

You can provide multiple export options for different formats or sections:

Quote Evaluation Guide

Coverage Assessment

Broker Workflows

## Benefits

### For AI Tools

- **Structured Content**: Clean, hierarchical text format
- **Token Efficiency**: 30-50% reduction in token usage
- **Better Context**: Preserves document structure and relationships
- **Faster Processing**: Optimized for LLM consumption

### For Integrations

- **Version Control**: Track documentation changes in Git
- **Static Site Generators**: Import into Jekyll, Hugo, or other SSGs
- **Knowledge Bases**: Integrate with internal wikis and documentation systems
- **Automation**: Process documentation with scripts and workflows

## Implementation

To add the Markdown export button to your own pages, import the component:

```jsx
import { MarkdownExportButton } from '/snippets/markdown-export-button.jsx';
```

Then use it anywhere in your MDX content:

```jsx
<MarkdownExportButton />
```

The component accepts three optional props:

- `href`: Target URL (defaults to current page + .md)
- `children`: Button text (defaults to "Export as Markdown")
- `title`: Hover tooltip text
