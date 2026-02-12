---
title: "Tools Setup"
description: "Install and configure qumis-cli and other essential development tools"
icon: "wrench"
noindex: true
# groups: ["internal"]
---

This guide covers the installation and configuration of all essential tools for Qumis development.

## qumis-cli Installation

> **Info:** **qumis-cli** is our internal CLI tool that streamlines development workflows, deployments, and operations.
>
> Repository: [github.com/qumisinc/qumis-cli](https://github.com/qumisinc/qumis-cli) (Private)

### Prerequisites for qumis-cli

```bash
# Check Go version (need 1.21+)
go version

# If Go is not installed or outdated:
brew install go
# OR use asdf for version management:
asdf plugin-add golang
asdf install golang 1.21.0
asdf global golang 1.21.0
```

### Install qumis-cli

```bash Full Install (Recommended)
# Clone the repository
git clone https://github.com/qumisinc/qumis-cli.git
cd qumis-cli

# Build and install
make deploy

# Verify installation
qumis --version

# Add shell integration to your ~/.zshrc or ~/.bashrc
echo "source $(pwd)/shell/qumis.sh" >> ~/.zshrc
source ~/.zshrc
```

```bash Binary Only
git clone https://github.com/qumisinc/qumis-cli.git /tmp/qumis-cli && \
cd /tmp/qumis-cli && \
make deploy && \
cd - && \
rm -rf /tmp/qumis-cli
```

> **Note:** **Full Install** includes shell integration with helpful aliases and completions. **Binary Only** is faster but lacks these conveniences.

### Configure qumis-cli

### Generate GitHub Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` and `workflow`
4. Generate and copy the token

```bash
qumis config github.token <your-github-token>
```

### Configure Linear API Key

1. Go to [Linear Settings → API](https://linear.app/settings/api)
2. Create a new personal API key
3. Copy the key

```bash
qumis config linear.token <your-linear-api-key>
```

### Verify Configuration

Run the diagnostic command:

```bash
qumis doctor
```

This should show all green checkmarks for configured services.

## Essential Development Tools

### Required Tools

```bash
# Package managers and version control
brew install git gh

# Highly recommended for git operations
brew install pygitup  # For smart git sync

# AWS CLI for cloud operations
brew install awscli

# Directory visualization
brew install tree
```

### Node.js Installation

```bash Homebrew (Simple)
brew install node
```

```bash nvm (Version Management)
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20
```

> **Tip:** Use **nvm** if you need to manage multiple Node.js versions across different projects. Use **Homebrew** for a simpler single-version setup.

### Optional but Recommended

```bash
# Linear CLI for ticket management
brew install schpet/tap/linear

# Repository packing for AI tools
brew install repomix

# JSON processing
brew install jq

# HTTP client for API testing
brew install httpie

# Docker for containerized development
brew install --cask docker
```

## AWS Configuration

### Configure AWS SSO

### Install AWS CLI

```bash
brew install awscli
```

### Configure AWS Profiles

Create or update your `~/.aws/config` file with the following configuration:

```ini
# AWS Configuration for Qumis
# ================================
# AWS CLI configuration file
# Location: ~/.aws/config
#
# After updating this file, authenticate with: aws sso login --profile qumis_<env>
# Example: aws sso login --profile qumis_prod

# AWS SSO Session Configuration
# --------------------------------
# Shared SSO session used by all Qumis AWS profiles
[sso-session qumis_sso]
sso_start_url = https://qumis.awsapps.com/start/
sso_region = us-east-2
sso_registration_scopes = sso:account:access

# Default Profile
# --------------------------------
[default]

# Development Environment
# --------------------------------
# Account: 080970846004
# Region: us-east-2
# Use: Local development and testing
[profile qumis_dev]
sso_session = qumis_sso
sso_account_id = 080970846004
sso_role_name = AdministratorAccess
region = us-east-2
output = json

# QA Environment
# --------------------------------
# Account: 340452546718
# Region: us-east-2
# Use: Quality assurance testing
[profile qumis_qa]
sso_session = qumis_sso
sso_account_id = 340452546718
sso_role_name = AdministratorAccess
region = us-east-2
output = json

# UAT Environment
# --------------------------------
# Account: 499854674638
# Region: us-east-2
# Use: User acceptance testing (pre-production)
[profile qumis_uat]
sso_session = qumis_sso
sso_account_id = 499854674638
sso_role_name = AdministratorAccess
region = us-east-2
output = json

# Production Environment
# --------------------------------
# Account: 729033428609
# Region: us-east-2
# Use: Production deployments and operations
# WARNING: Exercise caution when using this profile
[profile qumis_prod]
sso_session = qumis_sso
sso_account_id = 729033428609
sso_role_name = AdministratorAccess
region = us-east-2
output = json

# Shared Services
# --------------------------------
# Account: 355867115367
# Region: us-east-2
# Use: Shared infrastructure and services
[profile qumis_sharedservices]
sso_session = qumis_sso
sso_account_id = 355867115367
sso_role_name = AdministratorAccess
region = us-east-2
output = json
```

> **Info:** **Note**: The region is set to `us-east-2` for all profiles. Adjust the `sso_role_name` if you have a different role assigned.

### Test Access

```bash qumis-cli (Recommended)
# Login to an environment
qumis aws login dev

# Verify access
qumis lambda list-functions --env dev
```

```bash AWS CLI Direct
# Login directly via AWS CLI
aws sso login --profile qumis_dev

# Verify access
aws s3 ls --profile qumis_dev

# Check your identity
aws sts get-caller-identity --profile qumis_dev
```

> **Tip:** Use `qumis aws login` for a streamlined experience. It handles profile selection and SSO automatically.

## Ruby Development Setup

For API development:

```bash
# Install Ruby version manager
brew install rbenv ruby-build

# Install required Ruby version
rbenv install 3.2.2  # Check .ruby-version in qumis-api
rbenv global 3.2.2

# Install bundler
gem install bundler

# Install Rails dependencies
cd qumis-api
bundle install
```

## Node.js Development Setup

For web development:

```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Install dependencies
cd qumis-web
npm install

# Install useful global packages
npm install -g typescript tsx prettier eslint
```

## Editor Configuration

### VS Code Extensions

Recommended extensions for Qumis development:

```bash
# Install via command palette or terminal
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension rebornix.ruby
code --install-extension castwide.solargraph
code --install-extension golang.go
code --install-extension hashicorp.terraform
code --install-extension amazonwebservices.aws-toolkit-vscode
```

### Git Configuration

```bash
# Set up your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@qumis.ai"

# Useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.pl pull
git config --global alias.ps push
```

## Shell Enhancements

### qumis-cli Aliases

If you installed with shell integration, you get these aliases:

```bash
q status      # Same as: qumis status
q sync        # Same as: qumis sync
q pr view     # Same as: qumis pr view
```

### Useful Shell Aliases

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# Navigation shortcuts
alias qa='qumis aws login qa'
alias dev='qumis aws login dev'
alias prod='qumis aws login prod'

# Common operations
alias gst='git status'
alias gco='git checkout'
alias gup='git up'  # Requires pygitup

# Rails shortcuts
alias rc='qumis services exec api --env dev -- rails console'
alias rdbm='qumis services exec api --env dev -- rails db:migrate'
```

## Verification Checklist

After setup, verify everything works:

- \[ ] `qumis --version` shows the current version
- \[ ] `qumis doctor` shows all green checkmarks
- \[ ] `qumis aws login dev` successfully authenticates
- \[ ] `git clone https://github.com/qumisinc/qumis-api.git` works
- \[ ] `aws s3 ls --profile qumis_dev` lists S3 buckets
- \[ ] `gh auth status` shows you're logged in to GitHub

## Troubleshooting

### Common Issues

### qumis: command not found

Add Go bin directory to your PATH:

```bash
echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.zshrc
source ~/.zshrc
```

### AWS SSO token expired

Refresh your SSO session:

```bash
aws sso login --profile qumis_dev
# OR
qumis aws login dev
```

### GitHub authentication failed

Re-authenticate with GitHub:

```bash
gh auth login
# Choose GitHub.com, HTTPS, and authenticate via browser
```

### Permission denied for qumis repositories

Ensure you have been added to the Qumis GitHub organization. Contact your team lead if you're getting 404 errors on private repositories.

## Next Steps

Once your tools are set up:

1. Review the [Git Branching Strategies](/internal/engineering/guides/git-branching-strategies)
2. Learn about [Production Deployment](/internal/engineering/deployment/production-deployment)
3. Explore [qumis-cli commands](/internal/engineering/operations/qumis-cli-reference)
