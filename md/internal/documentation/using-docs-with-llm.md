---
title: "Using Docs with an LLM"
description: "Give any LLM full context on Qumis by sharing the auto-generated llms-full.txt file"
icon: "bot"
noindex: true
# groups: ["internal"]
---

## Overview

Mintlify automatically generates a single text file containing all public Qumis documentation, optimized for LLM consumption. This file lives at a fixed URL and stays in sync with the docs site — no manual export required.

Use it to give ChatGPT, Claude, Gemini, or any other LLM complete context on the Qumis product in one paste.

## How to Use It

### Open the URL

Navigate to [docs.qumis.ai/llms-full.txt](https://docs.qumis.ai/llms-full.txt) in your browser.

### Copy the content

Select all (Cmd+A on Mac, Ctrl+A on Windows) and copy (Cmd+C / Ctrl+C).

### Paste into your LLM

Start a new conversation in your LLM of choice and paste the content as context at the beginning.

### Ask your question

Reference the docs in your prompt. For example:

```
Based on the Qumis documentation above, how does the Document Vault feature work?
```

> **Tip:** **Public docs only.** The `llms-full.txt` file contains all public-facing documentation. For internal context like the company overview or design system, see the [Prompt Library](/internal/documentation/prompt-library#llm-context-files).

## When to Use This

- Writing or updating documentation pages
- Answering product questions with full context
- Creating marketing or sales content based on product capabilities
- Onboarding new team members who want to explore the product
- Building demos or presentations that reference specific features

## Related Resources

Internal LLM context files (company overview, design system) and reusable prompts

Export individual documentation pages as clean Markdown
