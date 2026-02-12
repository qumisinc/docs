---
title: "Visual Regression Testing"
description: "Run Playwright + Chromatic visual regression tests for qumis-web"
icon: "eye"
noindex: true
# groups: ["internal"]
---

Playwright + Chromatic visual regression tests detect UI changes across builds using automated browser testing and visual diffing.

> **Info:** **For comprehensive documentation** including viewport strategy, architecture details, and test structure, see the [qumis-web README](https://github.com/qumisinc/qumis-web/blob/main/README.md).

## Quick Start

### Install Playwright Browsers

```bash
pnpm playwright:install
```

Installs Chromium and dependencies needed to run tests.

### Set Chromatic Project Token

Set your Chromatic project token as an environment variable:

```bash
export CHROMATIC_PROJECT_TOKEN=chpt_your_token_here
```

Or add to your `.env` file (recommended):

```bash
CHROMATIC_PROJECT_TOKEN=chpt_your_token_here
```

### Run Tests Locally

Test without Chromatic integration:

```bash
pnpm playwright:test
```

### Run Chromatic Visual Regression

Upload screenshots to Chromatic for visual diffing:

```bash
pnpm chromatic
```

## Common Commands

### Local Development

```bash Run all tests locally
pnpm playwright:test
```

```bash Run tests in UI mode (debugging)
pnpm playwright:ui
```

```bash Run specific test file
pnpm playwright:test chromatic-visual.spec.ts
```

### Chromatic Integration

```bash Upload to Chromatic (uses .env token)
pnpm chromatic
```

```bash Upload with explicit token
pnpm exec chromatic --playwright --project-token=chpt_your_token_here
```

## CI/CD Workflow

### Automatic Triggers

The Chromatic workflow runs automatically on:

- Push to `main` or `release` branches
- Pull requests to `main` or `release` branches
- Manual workflow dispatch

### Manual Trigger via GitHub CLI

```bash Trigger on Current Branch
gh workflow run chromatic.yml --ref "$(git rev-parse --abbrev-ref HEAD)"
```

```bash Force Rebuild (Skip Cache)
gh workflow run chromatic.yml \
  --ref "$(git rev-parse --abbrev-ref HEAD)" \
  --field force_rebuild=true
```

```bash Watch Workflow Status
gh run watch
```

### Manual Trigger via GitHub UI

### Navigate to Workflow

Go to **Actions** → **Chromatic** workflow → **Run workflow**

### Select Branch

Select your branch from the dropdown

### Configure Options

Optionally check **Force Chromatic to rebuild** to skip cache

### Run Workflow

Click **Run workflow** to start the build

## Test Configuration

### Default Viewport Coverage

By default, tests run on **TIER1 + TIER2 viewports** (7 total):

- **TIER1** (4 viewports): Primary business workflows - desktop Full HD, laptops, windowed displays
- **TIER2** (3 viewports): Extended desktop coverage - QHD, ultrawide, legacy laptops

See `playwright.config.ts` in qumis-web for active configuration.

### Performance Considerations

- **TIER1 only** (4 viewports): ~2-4 minutes per test suite
- **TIER1 + TIER2** (7 viewports): ~4-7 minutes per test suite
- **All tiers** (11 viewports): ~7-12 minutes per test suite

> **Tip:** For PR builds, consider using TIER1 only for fast feedback. Use TIER1 + TIER2 for main/release branches.

## Resources

Full documentation on viewport strategy and test architecture

Official Playwright documentation

Chromatic visual regression documentation

View the full CI/CD workflow configuration

## Troubleshooting

### Tests failing locally but passing in CI

- Ensure you're using the same Node/pnpm versions as CI
- Run `pnpm playwright:install` to update browser binaries
- Clear Playwright cache: `rm -rf ~/.cache/ms-playwright`

### Chromatic token not found

- Verify `CHROMATIC_PROJECT_TOKEN` is set in your environment
- Check your `.env` file in the qumis-web root directory
- Get token from Chromatic project settings

### Visual diffs showing unexpected changes

- Review changes in Chromatic dashboard
- Check if viewport configuration changed
- Verify CSS/component changes are intentional
- Accept baseline if changes are expected

> **Warning:** **Production token required**: The `CHROMATIC_PROJECT_TOKEN` secret must be set in GitHub repository settings for CI/CD workflows to run.
