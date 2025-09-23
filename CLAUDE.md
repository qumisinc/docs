# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- `<Columns>`: Responsive column layouts
- `<Frame>`: Image/video containers with captions
- `<AccordionGroup>`/`<Accordion>`: Collapsible sections
- `<Info>`, `<Tip>`, `<Warning>`, `<Note>`: Callout boxes
- `<CardGroup>`: Groups of related cards
- `<Steps>`: Step-by-step instructions

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
