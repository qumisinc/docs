---
title: "API Reference"
description: "Explore the Qumis Documentation API with MCP-enabled endpoints for AI assistants and programmatic access"
---

## Overview

The Qumis Documentation API provides programmatic access to our comprehensive insurance AI documentation. All endpoints are **MCP-enabled**, allowing AI assistants and development tools to seamlessly discover and navigate our knowledge base.

> **Info:** **Model Context Protocol (MCP)** integration enables AI assistants like Claude to directly access and reference Qumis documentation during conversations.

## Features

All documentation endpoints are exposed as MCP tools for AI assistant integration

Access guides for features, reports, playbooks, and internal engineering docs

Retrieve documentation tailored for brokers, claims professionals, and service teams

Documentation reflects the latest Qumis platform capabilities

## Base URL

```
https://docs.qumis.ai
```

> **Note:** All available endpoints are listed in the navigation sidebar. Each endpoint has its own dedicated page with an interactive API playground.

## MCP Integration

All endpoints support the Model Context Protocol, enabling AI assistants to:

1. **Discover** available documentation programmatically
2. **Navigate** between related topics and guides
3. **Reference** accurate, up-to-date information during conversations
4. **Suggest** relevant documentation based on user queries

### Example MCP Tool Call

When an AI assistant needs information about Qumis chat features, it can invoke:

```json
{
  "tool": "Get Chat Features",
  "description": "Access documentation for Qumis AI chat capabilities",
  "endpoint": "https://docs.qumis.ai/features/chats"
}
```

## Usage with AI Assistants

### Claude Desktop

Configure Claude Desktop to access Qumis documentation:

### Enable MCP

Ensure MCP is enabled in your Claude Desktop settings

### Reference Documentation

Ask Claude questions about Qumis - it will automatically access relevant documentation

### Get Contextual Help

Claude can provide guidance based on the most current documentation

### Cursor & VS Code

Development tools with MCP support can reference Qumis documentation when:

- Building integrations with Qumis APIs
- Understanding feature capabilities for implementation
- Following deployment and infrastructure best practices

## Response Format

All endpoints return HTML documentation content optimized for:

- **Human readability** with Mintlify styling
- **AI parsing** with semantic HTML structure
- **Rich media** including images, code examples, and videos

## Support

Need help with the API or MCP integration?

Email our support team for assistance

Download the complete OpenAPI specification
