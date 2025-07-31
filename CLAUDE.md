# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Mintlify Documentation Site

This is a Mintlify documentation starter kit containing example pages and structure for building documentation sites.

## Development Commands

**Start local development server:**
```bash
mint dev
```
- Runs on `http://localhost:3000`
- Use `--port` flag for custom port (e.g., `mint dev --port 3333`)

**Install/Update Mintlify CLI:**
```bash
npm i -g mint     # Install
mint update       # Update to latest version
```

**Validate documentation links:**
```bash
mint broken-links
```

**Prerequisites:**
- Node.js version 19 or higher
- Mintlify CLI installed globally

## Project Architecture

**Configuration:**
- `docs.json` - Main configuration file defining navigation, theme, colors, and site structure
- Navigation organized in tabs ("Guides", "API reference") with grouped pages
- Custom branding via logo files in `/logo/` directory

**Content Structure:**
- All content written in MDX format with YAML frontmatter
- Pages organized by logical groupings defined in `docs.json`
- API documentation auto-generated from `api-reference/openapi.json`
- Reusable content snippets stored in `/snippets/` directory
- Images stored in `/images/` directory

**Key Content Areas:**
- Getting started pages (`index.mdx`, `quickstart.mdx`, `development.mdx`)
- Essential documentation guides in `/essentials/`
- AI tools section in `/ai-tools/`
- API reference in `/api-reference/`

## Working Relationship
- You can push back on ideas - this can lead to better documentation. Cite sources and explain your reasoning when you do so
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up information

## Content Strategy
- Document just enough for user success - not too much, not too little
- Prioritize accuracy and usability of information
- Make content evergreen when possible
- Search for existing information before adding new content. Avoid duplication unless it is done for a strategic reason
- Check existing patterns for consistency
- Start by making the smallest reasonable changes

## MDX File Requirements

**Frontmatter (required for all .mdx files):**
```yaml
---
title: "Clear, descriptive page title"
description: "Concise summary for SEO/navigation"
icon: "optional-icon-name"  # Some pages include icons
---
```

**Mintlify Components Available:**
- `<Card>` - Feature cards with titles, icons, and links
- `<Columns>` - Multi-column layouts
- `<Steps>` - Step-by-step procedures
- `<Info>`, `<Tip>`, `<Warning>` - Callout boxes
- `<Frame>` - Image frames with styling
- `<AccordionGroup>`, `<Accordion>` - Collapsible content
- `<Latex>` - LaTeX math expressions

## Writing Standards
- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples before publishing
- Match style and formatting of existing pages
- Include both basic and advanced use cases
- Language tags on all code blocks
- Alt text on all images
- Use root-relative paths for internal links (e.g., `/essentials/markdown`)

## Git Workflow
- NEVER use --no-verify when committing
- Ask how to handle uncommitted changes before starting
- Create a new branch when no clear branch exists for changes
- Commit frequently throughout development
- NEVER skip or disable pre-commit hooks

## Critical Rules
- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Include untested code examples
- Make assumptions - always ask for clarification
