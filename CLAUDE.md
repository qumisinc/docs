# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Mintlify documentation

## Working relationship
- You can push back on ideas-this can lead to better documentation. Cite sources and explain your reasoning when you do so
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up information

## Project context
- Format: MDX files with YAML frontmatter
- Config: docs.json for navigation, theme, settings
- Components: Mintlify components
- Icons: Lucide only (`icons.library: "lucide"` in docs.json). NEVER use Font Awesome icon names. Browse valid icons at https://lucide.dev/icons/ and use kebab-case names (e.g., `shield-check`, `rotate-ccw`, `megaphone`)

## Content strategy
- Document just enough for user success - not too much, not too little
- Prioritize accuracy and usability of information
- Make content evergreen when possible
- Search for existing information before adding new content. Avoid duplication unless it is done for a strategic reason
- Check existing patterns for consistency
- Start by making the smallest reasonable changes

## docs.json

- Refer to the [docs.json schema](https://mintlify.com/docs.json) when building the docs.json file and site navigation
- ALWAYS update docs.json navigation when adding or modifying pages to keep navigation in sync with content

## Page cross-linking

When creating or modifying a page, ensure it is properly linked from all relevant parent/index pages:
- If adding a page under a section (e.g., `/internal/foo/bar`), check the section's index page (e.g., `/internal/foo/index.mdx`) and add a link using Mintlify components (`<Card>`, `<CardGroup>`, etc.) that match the existing pattern on that index page
- If no index page exists for the section, check for any overview or landing page that serves as the entry point and add a link there
- Also check for any other pages that reference related content and should cross-link to the new/modified page
- Use `<Card>` with an appropriate `icon` and `href` for consistency with existing index pages
- When renaming or moving a page, update all pages that link to it

## Frontmatter requirements for pages
- title: Clear, descriptive page title
- description: Concise summary for SEO/navigation

## Writing standards
- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples before publishing
- Match style and formatting of existing pages
- Include both basic and advanced use cases
- Language tags on all code blocks
- Alt text on all images
- Relative paths for internal links
- After writing or modifying .mdx files, use the mdx-mintlify-converter agent to convert standard Markdown to Mintlify-specific components (callouts, CodeGroup, Steps, etc.)

## Git workflow
- NEVER use --no-verify when committing
- Ask how to handle uncommitted changes before starting
- Create a new branch when no clear branch exists for changes
- Commit frequently throughout development
- NEVER skip or disable pre-commit hooks

## Do not
- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Include untested code examples
- Make assumptions - always ask for clarification

## Project Overview

This is the Qumis documentation site built with Mintlify - a documentation platform for insurance professionals. The docs cover both public-facing product documentation and internal engineering resources.

## Development Commands

```bash
# Install Mintlify CLI globally (prerequisite)
npm i -g mint

# Start local development server (default: http://localhost:3000)
mint dev
mint dev --port 3333  # Use custom port

# Validate all documentation links
mint broken-links

# Update Mintlify CLI to latest version
mint update
```

**Troubleshooting:**
- If dev environment isn't running: Run `mint update` to get the latest CLI version
- If a page loads as 404: Verify you're running in a folder with valid `docs.json`

## High-level Architecture

**Site Configuration (`docs.json`):**
- Defines 4 navigation tabs: Documentation, Guides, Workflows, Internal
- Theme: "willow" with light mode default (strict appearance mode)
- Custom Qumis branding with light/dark logos
- Global navigation anchors for demo booking, support, and main site
- GTM integration for analytics
- SOC 2 compliant infrastructure documentation

**Content Organization:**
- **Public Documentation** (`/features/`, `/roles/`, `/tools/`, `/workflows/`): Product features, user guides, and role-based content for insurance professionals
- **Internal Documentation** (`/internal/`): Engineering resources including deployment procedures, AWS infrastructure guides, monitoring setup, and troubleshooting
- **Shared Resources**: `/images/` for screenshots and diagrams, `/videos/` for demos, `/snippets/` for reusable content blocks

**Navigation Structure:**
- Documentation tab: Core features, tools, and role-based guides
- Guides tab: User guides and troubleshooting
- Workflows tab: Insurance-specific workflows (broker, claims, risk management)
- Internal tab: Engineering documentation (deployment, infrastructure, operations)

## MDX Content Requirements

**Required Frontmatter:**
```yaml
---
title: "Page title"
description: "SEO and navigation description"
---
```

**Mintlify Components:**
- `<Card>`: Feature cards with icons and links
- `<CardGroup>`: Groups of related cards (use `cols={2}` or `cols={3}` for layout)
- `<Steps>` / `<Step>`: Step-by-step instructions with titles
- `<Accordion>` / `<AccordionGroup>`: Collapsible sections
- `<Info>`, `<Tip>`, `<Warning>`, `<Note>`: Callout boxes
- `<Frame>`: Image/video containers with captions
- `<Columns>`: Responsive column layouts
- `<CodeGroup>`: Multiple code examples with language tabs

## Writing Guidelines

- Use second-person voice ("you") for all user-facing content
- Structure content for insurance professionals (brokers, claims leaders, attorneys, risk managers)
- Include role-specific examples and use cases
- Maintain consistent formatting with existing pages
- Use root-relative paths for internal links (e.g., `/features/chat-with-documents`)
- Add descriptive captions to all images and videos

## Internal Documentation Standards

When working on `/internal/` content:
- Include AWS environment specifics (production, staging, blue/green clusters)
- Reference the qumis-cli tool for operations
- Document Rails-specific commands and procedures
- Include CloudWatch monitoring and alert configurations
- Provide clear rollback procedures for deployments
