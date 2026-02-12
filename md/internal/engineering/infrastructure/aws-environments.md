---
title: "AWS Environments"
description: "Overview of all AWS environments and their configurations"
icon: "cloud"
noindex: true
# groups: ["internal"]
---

This guide provides a comprehensive overview of our AWS environments, their purposes, and access patterns.

## AWS Console Access

> **Info:** **AWS SSO Portal**: Access all AWS accounts through the single sign-on portal
>
> [**https://qumis.awsapps.com/start/#/?tab=accounts**](https://qumis.awsapps.com/start/#/?tab=accounts)
>
> This is the main entrypoint for accessing AWS consoles across all environments. Bookmark this URL for quick access.

**Using the AWS SSO Portal:**

### Navigate to AWS SSO Portal

Go to the [AWS SSO Portal](https://qumis.awsapps.com/start/#/?tab=accounts)

### Select Environment

Select the appropriate environment from the list (e.g., "Qumis - Production" as shown in the screenshot)

### Access Console

Click **"Management console"** or **"AdministratorAccess"** to access the AWS Console for that environment

### View Available Environments

You'll see all environments you have permissions to access, including Development, QA, UAT, Production, and Shared Services

> **Note:** The environments displayed depend on your IAM permissions. New engineers typically start with access to Dev, QA, and UAT. Production access requires senior engineer permissions.

## Environment Overview

### Deployment Environments

> **Info:** These environments are used for deploying and running our applications at different stages of the development lifecycle.

| Environment | Account ID | Email | Purpose | Access Level |
|------------|------------|--------|---------|--------------|
| **Development** | 080970846004 | shiv+aws-dev@qumis.ai | Active development and testing | All engineers |
| **QA** | 340452546718 | shiv+aws-qa@qumis.ai | Quality assurance testing | All engineers |
| **UAT** | 499854674638 | shiv+aws-uat@qumis.ai | User acceptance testing | All engineers |
| **Production** | 729033428609 | shiv+aws-production@qumis.ai | Live production environment | Senior engineers |

### Infrastructure Environment

| Environment | Account ID | Email | Purpose | Access Level |
|------------|------------|--------|---------|--------------|
| **Shared Services** | 355867115367 | shiv+aws-shared-service@qumis.ai | Cross-environment infrastructure, CI/CD, shared resources | DevOps team |

> **Warning:** **Shared Services** is not a deployment environment. It contains infrastructure that supports all other environments (e.g., CI/CD pipelines, artifact storage, shared databases).

## Environment Details

### Development (dev)

**Account ID**: 080970846004
**AWS Profile**: `qumis_dev`
**Purpose**: Active development and experimentation

**Characteristics**:

- Frequent deployments
- Experimental features
- Test data only
- Relaxed security policies
- Auto-shutdown for cost savings

**Common Operations**:

```bash Login
qumis aws login dev
```

```bash Deploy
qumis deploy api --env dev --reason "Test new feature"
```

```bash Access Console
qumis services exec api --env dev -- rails console
```

### QA Environment

**Account ID**: 340452546718
**AWS Profile**: `qumis_qa`
**Purpose**: Automated and manual QA testing

**Characteristics**:

- Stable builds for testing
- Automated test suites run here
- QA team validation
- Production-like configuration
- Regular data refreshes from production (sanitized)

**Common Operations**:

```bash Login
qumis aws login qa
```

```bash Deploy for QA Testing
qumis deploy api --env qa --reason "QA testing sprint 23"
```

```bash Check Logs
aws logs tail /aws/lambda/qumis-api-qa --profile qumis_qa
```

### UAT Environment

**Account ID**: 499854674638
**AWS Profile**: `qumis_uat`
**Purpose**: User acceptance testing and staging

**Characteristics**:

- Production mirror
- Stakeholder demos
- Final testing before production
- Production-like data (sanitized)
- Same configuration as production

**Common Operations**:

```bash Login
qumis aws login uat
```

```bash Deploy Release Candidate
qumis deploy api --env uat --reason "Release candidate v1.2.3"
```

```bash Verify Deployment
qumis services info api --env uat
```

### Production Environment

**Account ID**: 729033428609
**AWS Profile**: `qumis_prod`
**Purpose**: Live production environment serving customers

**Characteristics**:

- Strict access control
- Change approval required
- Full monitoring and alerting
- Regular backups
- High availability configuration
- Audit logging for all operations

**Common Operations**:

```bash Login (Requires Elevated Permissions)
qumis aws login prod
```

```bash Deploy with Confirmation
qumis deploy api \
  --env prod \
  --reason "Release v1.2.3 - ENG-123" \
  --confirm prod
```

```bash Production Console (With Audit Log)
qumis services exec api \
  --env prod \
  --reason "Debug customer issue #456" \
  --confirm prod \
  -- rails console
```

### Shared Services

**Account ID**: 355867115367
**AWS Profile**: `qumis_shared`
**Purpose**: Infrastructure and services shared across environments

**Components**:

- CI/CD pipelines (GitHub Actions runners)
- Docker registry (ECR)
- Artifact storage (S3)
- Secrets management (Parameter Store)
- DNS management (Route53)
- Certificate management (ACM)

> **Warning:** Direct access to Shared Services is restricted to DevOps team members. Most engineers interact with it indirectly through CI/CD pipelines.

## Access Management

### AWS SSO Configuration

### Access AWS Console

**Primary Method**: Use the AWS SSO Portal to access the AWS Console for any environment:

[**https://qumis.awsapps.com/start/#/?tab=accounts**](https://qumis.awsapps.com/start/#/?tab=accounts)

This portal provides direct browser access to all AWS accounts you have permissions for.

### Configure SSO Profile

For CLI access, configure your `~/.aws/config` file with the appropriate SSO profiles.

> **Info:** See the complete AWS configuration template in [Tools Setup → AWS Configuration](/internal/engineering/tools-setup#aws-configuration).
>
> The configuration includes all environment profiles (dev, qa, uat, prod, sharedservices) using:
>
> - SSO URL: `https://qumis.awsapps.com/start/`
> - Region: `us-east-2`

### Login to Environment

```bash
# Using qumis-cli
qumis aws login dev

# Or directly with AWS CLI
aws sso login --profile qumis_dev
```

### Verify Access

```bash
# Check current identity
aws sts get-caller-identity --profile qumis_dev

# List S3 buckets
aws s3 ls --profile qumis_dev
```

### Permission Levels

| Role | Dev | QA | UAT | Prod | Shared Services |
|------|-----|----|----|------|-----------------|
| Junior Engineer | Full | Full | Read | No | No |
| Engineer | Full | Full | Full | Read | No |
| Senior Engineer | Full | Full | Full | Full | Read |
| DevOps | Full | Full | Full | Full | Full |
| Team Lead | Full | Full | Full | Full | Full |

## Service Architecture

### Lambda Functions

Each environment runs Lambda functions for our services:

```
qumis-api-{environment}
qumis-web-{environment}
qumis-llm-{environment}
```

View functions:

```bash
# List all Lambda functions
qumis lambda list-functions --env dev
qumis lambda list-functions --env prod

# Get function details
qumis lambda describe-function qumis-api --env dev
```

### RDS Databases

- **Dev**: Single instance, minimal resources
- **QA**: Single instance, production-like config
- **UAT**: Multi-AZ for testing failover
- **Production**: Multi-AZ with read replicas

### S3 Buckets

Naming convention: `qumis-{service}-{environment}-{region}`

Examples:

- `qumis-api-dev-us-east-1`
- `qumis-api-prod-us-east-1`
- `qumis-uploads-prod-us-east-1`

## Monitoring by Environment

### CloudWatch Log Groups

Log group naming: `/aws/lambda/qumis-{service}-{environment}`

```bash
# View logs for different environments
aws logs tail /aws/lambda/qumis-api-dev --profile qumis_dev
aws logs tail /aws/lambda/qumis-api-prod --profile qumis_prod --follow
```

### Metrics and Alarms

- **Dev**: Basic metrics, no alarms
- **QA**: Standard metrics, test alarms
- **UAT**: Full metrics, staging alarms
- **Production**: Comprehensive metrics, critical alarms with PagerDuty integration

## Cost Management

### Environment Costs (Monthly Estimates)

| Environment | Typical Cost | Cost Controls |
|------------|--------------|---------------|
| Dev | $500-800 | Auto-shutdown, smaller instances |
| QA | $800-1200 | Scheduled scaling, cleanup jobs |
| UAT | $1500-2000 | On-demand scaling |
| Production | $5000-8000 | Reserved instances, Savings Plans |
| Shared Services | $300-500 | Minimal resources |

### Cost Optimization

**Development**:

- Auto-stop Lambda functions after hours
- Use spot instances where possible
- Regular cleanup of old resources

**Production**:

- Reserved instances for predictable workloads
- Auto-scaling based on demand
- Regular cost analysis and optimization

## Security Considerations

### Network Isolation

- Each environment has its own VPC
- No direct connectivity between environments
- Bastion hosts for emergency access
- VPN access for production (when required)

### Data Protection

- **Dev/QA**: Synthetic test data only
- **UAT**: Sanitized production data
- **Production**: Full encryption at rest and in transit
- **Backups**: Daily snapshots, 30-day retention

### Compliance

- SOC 2 compliance for production
- HIPAA compliance where applicable
- Regular security audits
- Penetration testing quarterly

## Emergency Procedures

### Environment Down

### Check AWS Status

Visit https://status.aws.amazon.com/ to check for AWS service outages

### Verify Access

Authenticate to the affected environment:

```bash
qumis aws login {env}
```

### Check Key Services

Verify Lambda, RDS, and S3 are operational:

```bash Lambda
qumis lambda list-functions --env {env}
```

```bash RDS
aws rds describe-db-instances --profile qumis_{env}
```

```bash S3
aws s3 ls --profile qumis_{env}
```

### Escalate if Needed

Contact DevOps team if services are down or unresponsive

### Cross-Environment Issues

If issues span multiple environments:

### Check Shared Services First

Verify the Shared Services account is operational as it supports all environments

### Verify CI/CD Pipeline Status

Check GitHub Actions and deployment pipeline health

### Check DNS and Certificates

Verify Route53 and ACM configurations are working correctly

### Review Recent Infrastructure Changes

Check CloudTrail for recent changes that may have affected multiple environments

## Best Practices

1. **Environment Progression**: Always deploy dev → qa → uat → prod
2. **Access Principle**: Use minimum required permissions
3. **Cost Awareness**: Clean up unused resources regularly
4. **Security First**: Never copy production data to lower environments without sanitization
5. **Documentation**: Document any manual changes made to environments

## Additional Resources

- [AWS SSO Portal](https://qumis.awsapps.com/start/#/?tab=accounts) - Main entrypoint for AWS console access
- [CloudWatch Monitoring](/internal/engineering/infrastructure/cloudwatch-monitoring)
- [CloudWatch Alerts](/internal/engineering/infrastructure/cloudwatch-alerts)
- [Production Deployment](/internal/engineering/deployment/production-deployment)
