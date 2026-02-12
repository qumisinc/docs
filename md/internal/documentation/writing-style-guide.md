---
title: "Documentation Style Guide"
description: "Standards and best practices for writing Qumis documentation"
icon: "pen-line"
noindex: true
# groups: ["internal"]
---

This guide ensures consistency, clarity, and maintainability across all Qumis documentation. Follow these standards when creating or editing documentation.

## Project Context

Documentation for Qumis, an AI platform for insurance professionals

Built with Mintlify using MDX (Markdown with JSX)

### Target Audiences

### Public

Insurance professionals including:

- Brokers
- Claims leaders
- Attorneys
- Risk managers

### Internal

Qumis engineers with dedicated sections covering:

- Deployment procedures
- Infrastructure management
- Operations and monitoring

## File Structure & Frontmatter

Every `.mdx` page must begin with YAML frontmatter containing metadata.

### Required Fields

The primary title of the page

Concise summary used for SEO and navigation menus

### Optional Fields

Lucide icon name to display in navigation

Set to `true` for internal pages that shouldn't be indexed by search engines

### Example Frontmatter

```yaml
---
title: "Production Deployment"
description: "Complete guide for deploying services to production using qumis-cli"
icon: "rocket"
noindex: true
# groups: ["internal"]
---
```

## Core Writing Principles

### Voice and Tone

> **Info:** Write in the second person ("you") for all user-facing instructional content. Maintain a professional, clear, and direct tone.

### Content Structure

### Start with prerequisites

Begin procedural content with a "Prerequisites" section listing required knowledge or tools

### Use logical grouping

Group related information with clear, descriptive headings

### Break down complex procedures

Use numbered steps for multi-part processes

### Internal Links

> **Warning:** Always use root-relative paths for internal links to ensure proper navigation.

- ✅ Correct: `href="/features/chat-with-documents"`
- ❌ Incorrect: `href="../features/chat-with-documents"`

## Mintlify Components

### Callout Components

Use callouts to highlight important information:

### Note - Supplementary Information

```mdx
<Note>
  Supplementary information that supports the main content.
</Note>
```

### Tip - Best Practices

```mdx
<Tip>
  Expert advice, shortcuts, or best practices.
</Tip>
```

### Warning - Critical Information

```mdx
<Warning>
  Critical cautions, breaking changes, or destructive actions.
</Warning>
```

### Info - Background Context

```mdx
<Info>
  Neutral background information or context.
</Info>
```

### Check - Success Confirmation

```mdx
<Check>
  Positive confirmations or success indicators.
</Check>
```

### Structural Components

#### Steps Component

For sequential instructions:

```mdx
<Steps>
  <Step title="Install dependencies">
    Run `npm install` to install required packages.
  </Step>
  <Step title="Configure environment">
    Create a `.env` file with your API credentials.
  </Step>
</Steps>
```

#### Tabs Component

For platform-specific content or alternatives:

````mdx
<Tabs>
  <Tab title="macOS">
    ```bash
    brew install node
    ```
  </Tab>
  <Tab title="Windows">
    ```powershell
    choco install nodejs
    ```
  </Tab>
</Tabs>
````

#### Accordion Component

For collapsible content sections:

```mdx
<AccordionGroup>
  <Accordion title="Troubleshooting connection issues">
    - **Firewall blocking**: Ensure ports 80 and 443 are open
  </Accordion>
  <Accordion title="Advanced configuration">
    Details about advanced settings.
  </Accordion>
</AccordionGroup>
```

### Card Components

#### Individual Cards

```mdx
<Card title="Getting started guide" icon="rocket" href="/quickstart">
  A complete walkthrough to get you started.
</Card>
```

#### Card Groups

```mdx
<CardGroup cols={2}>
  <Card title="Authentication" icon="key" href="/auth">
    Learn how to authenticate requests.
  </Card>
  <Card title="Rate limiting" icon="clock" href="/rate-limits">
    Understand rate limits and best practices.
  </Card>
</CardGroup>
```

### Code Components

#### Standard Code Blocks

Use triple backticks with language identifier and optional filename:

````mdx
```javascript config.js
const apiConfig = {
  baseURL: 'https://api.example.com'
};
```
````

#### Code Groups

Show examples in multiple languages:

````mdx
<CodeGroup>
  ```javascript Node.js
  const response = await fetch('/api/endpoint');
  ```
  ```python Python
  import requests
  response = requests.get('/api/endpoint')
  ```
</CodeGroup>
````

### API Documentation

#### Request/Response Examples

````mdx
<RequestExample>
  ```bash cURL
  curl -X POST 'https://api.example.com/users'
  ```
</RequestExample>

<ResponseExample>
  ```json Success
  {
    "id": "user_123",
    "name": "John Doe"
  }
  ```
</ResponseExample>
````

#### Parameter Documentation

```mdx
<ParamField path="user_id" type="string" required>
  Unique identifier for the user.
</ParamField>

<ParamField body="email" type="string" required>
  User's email address.
</ParamField>
```

#### Response Field Documentation

```mdx
<ResponseField name="user" type="object">
  Complete user object.
  <Expandable title="User properties">
    <ResponseField name="profile" type="object">
      User profile information.
    </ResponseField>
  </Expandable>
</ResponseField>
```

### Media Components

> **Tip:** Always wrap images and videos in a Frame component with descriptive captions.

```mdx
<Frame caption="The analytics dashboard provides real-time insights">
  <img src="/images/analytics.png" alt="Analytics dashboard with charts" />
</Frame>
```

## Internal Documentation Standards

When creating content for the `/internal/` directory:

### Add noindex to frontmatter

Always include `noindex: true` to prevent search engine indexing

### Reference qumis-cli

Use the internal `qumis-cli` tool for operational commands

### Specify AWS environments

Be explicit about environments (dev, qa, uat, prod) and services

### Provide clear commands

Include copy-pasteable shell commands for all procedures

### Example Internal Documentation

```bash
# Deploy to Production
qumis deploy api \
  --deploy-branch "main" \
  --env "prod" \
  --reason "Deploy feature XYZ - Ticket ENG-123" \
  --workflow-ref "main" \
  --confirm "prod"
```

## Best Practices Checklist

Use second-person voice ("you") consistently

Start procedures with prerequisites

Use root-relative paths for internal links

Include descriptive captions for all media

Add `noindex: true` to internal documentation

Provide role-specific examples for insurance professionals

Include rollback procedures for deployments
