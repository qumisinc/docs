---
title: "Creating Custom Templates"
description: "Learn how to create and manage custom document templates in Qumis"
---

# Creating Custom Templates

Custom templates in Qumis help you standardize document creation and streamline workflows for your organization. This guide will walk you through creating, managing, and using custom templates.

## Understanding Templates

Templates in Qumis are pre-formatted documents that serve as starting points for common insurance documents such as:

- Policy documents
- Claims forms
- Risk assessment reports
- Compliance checklists
- Client correspondence

## Creating Your First Template

### Access Template Builder

Navigate to **Tools** → **Template Builder** from the main dashboard.

### Choose Template Type

Select the type of template you want to create:

- Document Template
- Email Template
- Report Template
- Form Template

### Design Your Template

Use the visual editor to:

- Add text fields and placeholders
- Insert dynamic variables (e.g., `{{client_name}}`, `{{policy_number}}`)
- Format sections with headers and styles
- Add conditional logic for dynamic content

### Save and Test

- Name your template descriptively
- Add tags for easy discovery
- Test with sample data to ensure proper formatting

## Template Variables

Templates support dynamic variables that automatically populate with relevant data:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{client_name}}` | Client's full name | John Smith |
| `{{policy_number}}` | Policy identification number | POL-2024-001234 |
| `{{effective_date}}` | Policy effective date | January 1, 2024 |
| `{{coverage_amount}}` | Total coverage amount | $1,000,000 |
| `{{agent_name}}` | Assigned agent name | Sarah Johnson |

## Advanced Features

### Conditional Logic

Add conditional sections that appear based on specific criteria:

```handlebars
{{#if coverage_type == "comprehensive"}}
  This policy includes comprehensive coverage with...
{{/if}}
```

### Calculated Fields

Include calculations in your templates:

```handlebars
Premium Total: {{monthly_premium * 12}}
```

### Nested Templates

Embed one template within another for modular document creation:

```handlebars
{{include "standard_terms_template"}}
```

## Managing Templates

### Organizing Templates

- Use folders to organize templates by department or document type
- Apply tags for quick filtering and search
- Set permissions to control who can edit or use templates

### Version Control

Qumis automatically maintains version history for all templates:

View previous versions

Compare changes between versions

Restore earlier versions if needed

Track who made changes and when

### Sharing Templates

Templates can be shared across your organization:

### Team Sharing

Share with specific teams or departments with customizable permissions

### Organization-Wide

Make templates available to all users in your organization

### External Sharing

Export templates for use with partners or other systems

## Best Practices

### Naming Conventions

- Use clear, descriptive names
- Include version numbers or dates for frequently updated templates
- Prefix with department codes (e.g., "CLAIMS\_Initial\_Report")

### Testing

- Always test templates with various data scenarios
- Verify all variables populate correctly
- Check formatting across different export formats (PDF, Word, etc.)

### Maintenance

- Review templates quarterly for accuracy
- Update for regulatory changes
- Archive outdated templates rather than deleting

## Common Use Cases

Create standardized policy documents that automatically populate with client and coverage information.

Design claim forms that include all required fields and automatically calculate totals.

Build email templates for common communications like renewals, updates, and notifications.

## Troubleshooting

> **Warning:** If variables are not populating correctly, ensure:
>
> - Variable names match exactly (case-sensitive)
> - Data sources are properly connected
> - Required fields are present in the source data

## Related Resources

- [Managing Your Account](/guides/managing-your-account)
- [Policy Analysis](/reports/policy-analysis)
- [Compare Documents](/reports/comparisons)
