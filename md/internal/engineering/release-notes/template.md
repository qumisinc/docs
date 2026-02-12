---
title: "Release Notes Template"
description: "Template for creating new release notes"
icon: "file-text"
noindex: true
# groups: ["internal"]
---

> **Note:** **Template:** Copy this file to `release-notes/YYYY/YYYY-MM-DD.mdx` and fill in the details.
>
> Delete any sections that don't apply. Remove this note when done.

---

> **Info:** **Deployment Date:** MONTH DAY, YEAR
>
> **Deployed By:** NAME\_OR\_TEAM
>
> **Previous Deployment:** DATE(S)\_WITH\_PER\_SERVICE\_INFO\_IF\_THEY\_DIFFER

API Web LLM Service

## What's New

- **FEATURE\_NAME** — one-line user-facing description
- **FEATURE\_NAME** — one-line user-facing description
- X bug fixes and X improvements

*Narrative paragraph summarizing the release for non-technical readers. Use **bold** to highlight key features and explain user value. Example: "Users get a **completely redesigned onboarding experience** that guides new sign-ups through their first report, **real-time progress tracking** so they can see exactly what's happening, and a **new legal citations option** for reports."*

Brief summary

Brief summary

Brief summary

**+X** / **-X** lines

---

## Features

### FEATURE\_NAME

Plain-language description of what users will see or experience. 1-2 sentences explaining the value.

- Benefit or change 1
- Benefit or change 2
- Benefit or change 3

**Linear:** [ENG-XXXX](https://linear.app/qumis/issue/ENG-XXXX)

### FEATURE\_NAME\_2

Plain-language description.

- Benefit or change

**Linear:** [ENG-XXXX](https://linear.app/qumis/issue/ENG-XXXX)

---

## Bug Fixes

### User-Facing Fixes (X)

| Issue | Description | Ticket |
|-------|-------------|--------|
| Issue name | Plain-language description | [ENG-XXXX](https://linear.app/qumis/issue/ENG-XXXX) |

### Backend Fixes (X)

| Issue | Description | Ticket |
|-------|-------------|--------|
| Issue name | Description | [ENG-XXXX](https://linear.app/qumis/issue/ENG-XXXX) |

---

## Improvements

- **Improvement name** — description ([ENG-XXXX](https://linear.app/qumis/issue/ENG-XXXX))

---

## Technical Details

### Services Deployed

| Service | Commit | Files | Lines Changed |
|---------|--------|-------|---------------|
| API | `COMMIT` | X | +X / -X |
| Web | `COMMIT` | X | +X / -X |
| LLM Service | `COMMIT` | X | +X / -X |

**Previous deployment:** DATE\_OF\_LAST\_DEPLOYMENT

### Pull Requests (X total)

**API (X PRs)**
| PR | Description |
|----|-------------|
| [#XXX](https://github.com/qumisinc/qumis-api/pull/XXX) | Title |

**Web (X PRs)**
| PR | Description |
|----|-------------|
| [#XXX](https://github.com/qumisinc/qumis-web/pull/XXX) | Title |

**LLM Service (X PRs)**
| PR | Description |
|----|-------------|
| [#XXX](https://github.com/qumisinc/qumis-llm-service/pull/XXX) | Title |

### Related Linear Tickets

**Major Features:**

- [ENG-XXXX](https://linear.app/qumis/issue/ENG-XXXX) — Description

**Bug Fixes:**

- [ENG-XXXX](https://linear.app/qumis/issue/ENG-XXXX) — Description

**Improvements:**

- [ENG-XXXX](https://linear.app/qumis/issue/ENG-XXXX) — Description
