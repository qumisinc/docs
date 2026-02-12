---
title: "Common Issues"
description: "Solutions to frequently encountered problems in development and production"
icon: "circle-alert"
noindex: true
# groups: ["internal"]
---

This guide provides solutions to common issues you might encounter while working with the Qumis platform.

## Development Issues

### Local Environment

### Rails server won't start

**Symptoms**: Rails server fails to start, bundle errors

**Solutions**:

```bash
# Update dependencies
bundle install

# Check Ruby version
ruby --version
rbenv install 3.2.2  # If wrong version

# Database issues
rails db:create
rails db:migrate
rails db:seed

# Clear cache
rails tmp:clear
rails cache:clear
```

### Database connection errors

**Symptoms**: Can't connect to PostgreSQL, connection refused

**Solutions**:

```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql@14

# Check database exists
psql -l | grep qumis

# Create database
rails db:create

# Check database.yml configuration
cat config/database.yml
```

### Node/npm issues

**Symptoms**: npm install fails, version mismatch

**Solutions**:

```bash
# Check Node version
node --version
nvm use 20  # Use correct version

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use correct registry
npm config set registry https://registry.npmjs.org/
```

### Git and Version Control

### Can't push to GitHub

**Symptoms**: Permission denied, authentication failed

**Solutions**:

```bash
# Check GitHub authentication
gh auth status

# Re-authenticate
gh auth login

# Check remote URL
git remote -v

# Update to HTTPS if using SSH without keys
git remote set-url origin https://github.com/qumisinc/repo-name.git

# Check branch protection
# You might need PR approval to merge to main
```

### Merge conflicts

**Symptoms**: Can't merge PR, conflicts with main

**Solutions**:

```bash
# Update your branch
git checkout main
git pull origin main
git checkout your-branch
git rebase main

# Resolve conflicts
# Edit conflicted files
git add .
git rebase --continue

# Or merge instead of rebase
git merge main
# Resolve conflicts
git add .
git commit
```

## qumis-cli Issues

### qumis command not found

**Problem**: Command not recognized

**Solution**:

```bash
# Check installation
which qumis

# Add to PATH
echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.zshrc
source ~/.zshrc

# Reinstall
cd /path/to/qumis-cli
make deploy
```

### AWS authentication failures

**Problem**: Can't access AWS resources

**Solution**:

```bash
# Re-authenticate
qumis aws login dev

# Check SSO session
aws sso login --profile qumis_dev

# Verify credentials
aws sts get-caller-identity --profile qumis_dev

# Clear cached credentials
rm -rf ~/.aws/sso/cache/*
```

### GitHub token expired

**Problem**: qumis GitHub operations failing

**Solution**:

```bash
# Generate new token at GitHub
# https://github.com/settings/tokens

# Update qumis config
qumis config github.token <new-token>

# Verify
qumis doctor
```

## ECS Issues

### ECS service not starting

**Symptoms**: Tasks failing to start, service stuck in pending

**Solutions**:

```bash
# Check service events (blue cluster)
aws ecs describe-services \
  --cluster blue-prod \
  --services api \
  --profile qumis_prod \
  --query 'services[0].events[:10]'

# Check task failures
aws ecs list-tasks \
  --cluster blue-prod \
  --service-name api \
  --desired-status STOPPED \
  --profile qumis_prod

# Get task failure reason
TASK_ARN=$(aws ecs list-tasks --cluster blue-prod --service-name api --desired-status STOPPED --profile qumis_prod --query 'taskArns[0]' --output text)
aws ecs describe-tasks \
  --cluster blue-prod \
  --tasks $TASK_ARN \
  --profile qumis_prod \
  --query 'tasks[0].stoppedReason'

# Common fixes:
# - Check container image exists in ECR
# - Verify IAM task execution role permissions
# - Check memory/CPU limits are sufficient
# - Review health check configuration
```

### Container keeps restarting

**Symptoms**: Container health checks failing, continuous restarts

**Solutions**:

```bash
# Check container logs (blue cluster)
aws logs tail ecs/blue/prod/api --profile qumis_prod --follow

# Check health check configuration
aws ecs describe-task-definition \
  --task-definition api-prod \
  --profile qumis_prod \
  --query 'taskDefinition.containerDefinitions[0].healthCheck'

# Monitor memory usage
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name MemoryUtilization \
  --dimensions Name=ServiceName,Value=api Name=ClusterName,Value=blue-prod \
  --start-time $(date -u -d '1 hour ago' --iso-8601) \
  --end-time $(date -u --iso-8601) \
  --period 300 \
  --statistics Average,Maximum \
  --profile qumis_prod

# Solutions:
# - Increase health check grace period
# - Adjust memory/CPU limits
# - Fix application startup issues
# - Check for missing environment variables
```

### Sidekiq jobs not processing

**Symptoms**: Jobs stuck in queue, Sidekiq not picking up work

**Solutions**:

```bash
# Check Sidekiq service status (blue cluster)
aws ecs describe-services \
  --cluster blue-prod \
  --services sidekiq \
  --profile qumis_prod \
  --query 'services[0].[status,runningCount,desiredCount]'

# Check Sidekiq logs
aws logs tail ecs/blue/prod/sidekiq \
  --profile qumis_prod \
  --follow

# Check Redis connectivity
qumis services exec api \
  --env prod \
  --reason "Check Redis connection" \
  --confirm prod \
  -- rails runner "puts Sidekiq.redis { |c| c.ping }"

# Check queue sizes
qumis services exec api \
  --env prod \
  --reason "Check Sidekiq queues" \
  --confirm prod \
  -- rails runner "
    require 'sidekiq/api'
    stats = Sidekiq::Stats.new
    puts 'Processed: ' + stats.processed.to_s
    puts 'Failed: ' + stats.failed.to_s
    puts 'Queues: ' + Sidekiq::Queue.all.map { |q| q.name + ': ' + q.size.to_s }.join(', ')
  "

# Restart Sidekiq service if needed (blue cluster)
aws ecs update-service \
  --cluster blue-prod \
  --service sidekiq \
  --force-new-deployment \
  --profile qumis_prod
```

## Deployment Issues

### Build Failures

### GitHub Actions workflow failing

**Symptoms**: Deployment workflow fails to complete

**Solutions**:

### Check GitHub Actions page for error details

Review the workflow run logs to identify the specific failure point

### Apply common fixes

```bash
# Retry deployment
qumis deploy api --env dev --reason "Retry after fix"

# Check workflow file exists
git pull origin main
ls .github/workflows/

# Verify branch has latest changes
git fetch --all
git rebase origin/main
```

### Docker build errors

**Symptoms**: Container fails to build

**Solutions**:

```bash
# Clear Docker cache
docker system prune -a

# Check Dockerfile
docker build -t test .

# Test locally
docker run -it test /bin/bash

# Check base image availability
docker pull ruby:3.2.2-alpine
```

### Runtime Errors

### Lambda function timeout

**Symptoms**: Function times out after 30 seconds

**Solutions**:

```bash
# Check function configuration
aws lambda get-function-configuration \
  --function-name qumis-api-prod \
  --profile qumis_prod

# Increase timeout (via Infrastructure as Code)
# Update serverless.yml or terraform

# Check for slow queries
qumis services exec api \
  --env prod \
  --reason "Check slow queries" \
  --confirm prod \
  -- rails runner "ActiveRecord::Base.logger = Logger.new(STDOUT); User.all.to_a"
```

### Memory errors

**Symptoms**: Lambda running out of memory

**Solutions**:

```bash
# Check current memory setting
aws lambda get-function-configuration \
  --function-name qumis-api-prod \
  --profile qumis_prod \
  --query 'MemorySize'

# Monitor memory usage
aws logs filter-log-events \
  --log-group-name /aws/lambda/qumis-api-prod \
  --filter-pattern "[REPORT]" \
  --profile qumis_prod \
  --query 'events[*].message' \
  --output text | grep "Memory"

# Solutions:
# 1. Increase Lambda memory allocation
# 2. Optimize code to use less memory
# 3. Process in batches
```

## Database Issues

### Connection pool exhausted

**Symptoms**: ActiveRecord::ConnectionTimeoutError

**Solutions**:

```bash
# Check current connections
qumis services exec api \
  --env prod \
  --reason "Check DB connections" \
  --confirm prod \
  -- rails runner "puts ActiveRecord::Base.connection_pool.stat"

# Clear stale connections
qumis services exec api \
  --env prod \
  --reason "Clear stale connections" \
  --confirm prod \
  -- rails runner "ActiveRecord::Base.clear_active_connections!"

# Long-term fix: Adjust pool size in database.yml
```

### Migration failures

**Symptoms**: PG::Error during migration

**Solutions**:

```bash
# Check migration status
qumis services exec api --env uat -- rails db:migrate:status

# Run specific migration
qumis services exec api --env uat -- rails db:migrate:up VERSION=20240101120000

# Rollback if needed
qumis services exec api --env uat -- rails db:rollback

# Fix and retry
qumis services exec api --env uat -- rails db:migrate
```

### Slow queries

**Symptoms**: Timeouts, high response times

**Solutions**:

```bash
# Enable query logging
qumis services exec api \
  --env prod \
  --reason "Debug slow queries" \
  --confirm prod \
  -- rails console
> ActiveRecord::Base.logger = Logger.new(STDOUT)
> User.includes(:posts).limit(10).to_a

# Check for missing indexes
# Add indexes in migration
# Use includes() to avoid N+1 queries
```

## API and Integration Issues

### CORS errors

**Symptoms**: Cross-origin request blocked

**Solutions**:

```ruby
# Check CORS configuration in Rails
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://app.qumis.ai'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options]
  end
end

# Restart application after changes
```

### Authentication failures

**Symptoms**: 401 Unauthorized errors

**Solutions**:

```bash
# Check JWT token expiration
qumis services exec api \
  --env prod \
  --reason "Check auth config" \
  --confirm prod \
  -- rails runner "puts ENV['JWT_SECRET'].present?"

# Verify token generation
# Check authentication middleware
# Ensure cookies are being set correctly
```

### Rate limiting

**Symptoms**: 429 Too Many Requests

**Solutions**:

```bash
# Check rate limit configuration
# Implement exponential backoff
# Use caching to reduce API calls
# Consider increasing limits for production
```

## Monitoring and Alerting Issues

### Missing CloudWatch logs

**Symptoms**: Logs not appearing in CloudWatch

**Solutions**:

```bash
# Check Lambda has CloudWatch permissions
aws lambda get-function-configuration \
  --function-name qumis-api-prod \
  --profile qumis_prod \
  --query 'Role'

# Check log group exists
aws logs describe-log-groups \
  --log-group-name-prefix /aws/lambda/qumis \
  --profile qumis_prod

# Create log group if missing
aws logs create-log-group \
  --log-group-name /aws/lambda/qumis-api-prod \
  --profile qumis_prod
```

### Alerts not firing

**Symptoms**: No notifications for issues

**Solutions**:

```bash
# Check alarm state
aws cloudwatch describe-alarms \
  --alarm-names qumis-api-prod-errors \
  --profile qumis_prod

# Check SNS subscriptions
aws sns list-subscriptions-by-topic \
  --topic-arn arn:aws:sns:us-east-1:729033428609:prod-alerts \
  --profile qumis_prod

# Test SNS topic
aws sns publish \
  --topic-arn arn:aws:sns:us-east-1:729033428609:prod-alerts \
  --message "Test alert" \
  --subject "Test" \
  --profile qumis_prod
```

## Quick Diagnostic Commands

### Health Check Script

```bash
#!/bin/bash
# health-check.sh

echo "Running system health check..."

# Check qumis-cli
echo -n "qumis-cli: "
qumis --version || echo "NOT INSTALLED"

# Check AWS access
echo -n "AWS Dev: "
aws sts get-caller-identity --profile qumis_dev &>/dev/null && echo "OK" || echo "FAIL"

echo -n "AWS Prod: "
aws sts get-caller-identity --profile qumis_prod &>/dev/null && echo "OK" || echo "FAIL"

# Check GitHub
echo -n "GitHub: "
gh auth status &>/dev/null && echo "OK" || echo "FAIL"

# Check services
for ENV in dev qa uat prod; do
  echo -n "API $ENV: "
  if [ "$ENV" = "prod" ]; then
    curl -sf https://api.qumis.ai/health &>/dev/null && echo "OK" || echo "DOWN"
  else
    qumis services info api --env $ENV &>/dev/null && echo "OK" || echo "ERROR"
  fi
done
```

### Debug Information Collector

```bash
#!/bin/bash
# collect-debug-info.sh

OUTPUT="debug_$(date +%Y%m%d_%H%M%S).txt"

echo "Collecting debug information..." > $OUTPUT

echo -e "\n=== System Info ===" >> $OUTPUT
uname -a >> $OUTPUT

echo -e "\n=== qumis-cli ===" >> $OUTPUT
qumis --version >> $OUTPUT
qumis doctor >> $OUTPUT

echo -e "\n=== AWS Configuration ===" >> $OUTPUT
aws configure list >> $OUTPUT

echo -e "\n=== Recent Errors (Prod) ===" >> $OUTPUT
aws logs filter-log-events \
  --log-group-name /aws/lambda/qumis-api-prod \
  --start-time $(date -u -d '1 hour ago' '+%s')000 \
  --filter-pattern "ERROR" \
  --profile qumis_prod \
  --max-items 10 >> $OUTPUT 2>&1

echo "Debug information saved to $OUTPUT"
```

## Getting Help

> **Info:** If you can't resolve an issue, follow these escalation steps:
>
> 1. **Search existing documentation** - Check other guides in this documentation
> 2. **Ask in Slack** - Post in #engineering with error details
> 3. **Check runbooks** - Look for specific runbooks for your service
> 4. **Escalate if critical** - Page on-call for production issues

### Information to Provide

> **Note:** When asking for help, include:
>
> - Environment (dev/qa/uat/prod)
> - Error message (full stack trace)
> - Recent changes (deployments, config changes)
> - Steps to reproduce
> - What you've already tried

## Additional Resources

- [Debugging Production](/internal/engineering/troubleshooting/debugging-production)
- [CloudWatch Monitoring](/internal/engineering/infrastructure/cloudwatch-monitoring)
- [Rollback Procedures](/internal/engineering/deployment/rollback-procedures)
- [qumis-cli Reference](/internal/engineering/operations/qumis-cli-reference)
