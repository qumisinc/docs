---
title: "Debugging Production"
description: "Safe techniques and best practices for debugging production issues"
icon: "bug"
noindex: true
# groups: ["internal"]
---

> **Warning:** **Production debugging requires extreme caution**. Always:
>
> - Get approval for production access
> - Use read-only operations when possible
> - Document all actions taken
> - Have a rollback plan ready

## Production Debugging Principles

### Safety First

> **Note:** Follow these critical safety principles when debugging production:
>
> 1. **Read-only by default** - Start with non-destructive operations
> 2. **Audit everything** - All commands are logged with reasons
> 3. **Test in UAT first** - Reproduce issues in UAT when possible
> 4. **Pair debugging** - Have another engineer review critical operations
> 5. **Time-box investigations** - Set limits to prevent extended downtime

## Initial Assessment

### Quick Health Check

```bash
# 1. Check service status
curl -f https://api.qumis.ai/health || echo "Service unhealthy"

# 2. Check ECS service status (blue cluster)
aws ecs describe-services \
  --cluster blue-prod \
  --services api web sidekiq \
  --profile qumis_prod \
  --query 'services[*].[serviceName,status,runningCount,desiredCount]' \
  --output table

# 3. Check recent errors across all ECS services (last 15 minutes)
for SERVICE in api web sidekiq; do
  echo "=== $SERVICE errors ==="
  aws logs filter-log-events \
    --log-group-name ecs/blue/prod/$SERVICE \
    --start-time $(date -u -d '15 minutes ago' '+%s')000 \
    --filter-pattern "ERROR" \
    --profile qumis_prod \
    --max-items 10
done

# 4. Check ECS cluster metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=api Name=ClusterName,Value=blue-prod \
  --start-time $(date -u -d '1 hour ago' --iso-8601) \
  --end-time $(date -u --iso-8601) \
  --period 300 \
  --statistics Average,Maximum \
  --profile qumis_prod
```

### Incident Timeline

### Establish Timeline

```bash
# Find when issues started
aws logs filter-log-events \
  --log-group-name /aws/lambda/qumis-api-prod \
  --start-time $(date -u -d '2 hours ago' '+%s')000 \
  --filter-pattern "ERROR" \
  --profile qumis_prod \
  --query 'events[0].timestamp' \
  --output text | xargs -I {} date -d @{}
```

### Check Recent Changes

```bash
# Recent deployments
git log --oneline --grep="Deploy to prod" -5

# Check GitHub Actions
gh run list --workflow deploy.yml --limit 5

# Infrastructure changes
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=UpdateFunctionConfiguration \
  --profile qumis_prod \
  --max-items 10
```

### Correlate Events

Match error timing with:

- Deployment times
- Configuration changes
- Traffic spikes
- External service issues

## Safe Debugging Techniques

### Read-Only Console Access

```bash
# Use sandbox mode for safety
qumis services exec api \
  --env prod \
  --reason "Debug issue #12345 - READ ONLY" \
  --confirm prod \
  -- rails console --sandbox

# In console:
> User.count  # Safe read
> User.where(created_at: 1.hour.ago..Time.now).count
> # Any changes will be rolled back on exit
```

### Query Specific Data

```bash
# Run specific queries without console
qumis services exec api \
  --env prod \
  --reason "Check user status for support ticket #789" \
  --confirm prod \
  -- rails runner "
    user = User.find_by(email: 'user@example.com')
    if user
      puts 'User found:'
      puts '  ID: ' + user.id.to_s
      puts '  Status: ' + user.status
      puts '  Created: ' + user.created_at.to_s
      puts '  Last login: ' + user.last_sign_in_at.to_s
    else
      puts 'User not found'
    end
  "
```

### Trace Request Flow

```bash
# Find specific request in logs
REQUEST_ID="abc-123-def-456"

# Get all logs for request
aws logs filter-log-events \
  --log-group-name /aws/lambda/qumis-api-prod \
  --filter-pattern "\"$REQUEST_ID\"" \
  --profile qumis_prod \
  --query 'events[*].message' \
  --output text

# Follow request through services
for SERVICE in api web llm; do
  echo "=== $SERVICE ==="
  aws logs filter-log-events \
    --log-group-name /aws/lambda/qumis-$SERVICE-prod \
    --filter-pattern "\"$REQUEST_ID\"" \
    --profile qumis_prod \
    --max-items 10
done
```

## Common Production Issues

### High Error Rate

### Diagnosis

```bash
# Get error breakdown
aws logs filter-log-events \
  --log-group-name /aws/lambda/qumis-api-prod \
  --start-time $(date -u -d '30 minutes ago' '+%s')000 \
  --filter-pattern "ERROR" \
  --profile qumis_prod \
  --query 'events[*].message' \
  --output text | \
  grep -oE "([A-Za-z]+Error|[A-Za-z]+Exception)" | \
  sort | uniq -c | sort -rn

# Check for pattern
aws logs insights start-query \
  --log-group-names /aws/lambda/qumis-api-prod \
  --start-time $(date -u -d '1 hour ago' '+%s') \
  --end-time $(date -u '+%s') \
  --query-string '
    fields @timestamp, @message
    | filter @message like /ERROR/
    | stats count() by bin(5m)
  ' \
  --profile qumis_prod
```

### Common Causes

**Database Issues**:

```bash
# Check database connectivity
qumis services exec api \
  --env prod \
  --reason "Check DB connection" \
  --confirm prod \
  -- rails runner "puts ActiveRecord::Base.connection.active?"

# Check connection pool
qumis services exec api \
  --env prod \
  --reason "Check connection pool" \
  --confirm prod \
  -- rails runner "puts ActiveRecord::Base.connection_pool.stat"
```

**External Service Issues**:

```bash
# Test external APIs
qumis services exec api \
  --env prod \
  --reason "Test external service connectivity" \
  --confirm prod \
  -- rails runner "
    require 'net/http'
    uri = URI('https://external-api.example.com/health')
    response = Net::HTTP.get_response(uri)
    puts 'External API Status: ' + response.code
  "
```

### Performance Degradation

### Identify Bottlenecks

```bash
# Check Lambda duration
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=qumis-api-prod \
  --start-time $(date -u -d '2 hours ago' --iso-8601) \
  --end-time $(date -u --iso-8601) \
  --period 300 \
  --statistics Average,Maximum,Minimum \
  --profile qumis_prod

# Find slow endpoints
aws logs filter-log-events \
  --log-group-name /aws/lambda/qumis-api-prod \
  --filter-pattern "[SLOW]" \
  --profile qumis_prod \
  --query 'events[*].message' \
  --output text | \
  grep -oE "POST|GET|PUT|DELETE [^ ]+" | \
  sort | uniq -c | sort -rn
```

### Database Performance

```bash
# Check for slow queries
qumis services exec api \
  --env prod \
  --reason "Identify slow queries" \
  --confirm prod \
  -- rails runner "
    ActiveRecord::Base.logger = Logger.new(STDOUT)
    ActiveRecord::Base.logger.level = Logger::DEBUG

    # Run suspected slow query with timing
    start = Time.now
    User.includes(:posts, :comments).where(active: true).limit(100).to_a
    puts 'Query time: ' + (Time.now - start).to_s + ' seconds'
  "

# Check for missing indexes
qumis services exec api \
  --env prod \
  --reason "Check indexes" \
  --confirm prod \
  -- rails runner "
    ActiveRecord::Base.connection.tables.each do |table|
      indexes = ActiveRecord::Base.connection.indexes(table)
      puts table + ': ' + indexes.map(&:name).join(', ')
    end
  "
```

### Memory Issues

```bash
# Check memory usage patterns
aws logs filter-log-events \
  --log-group-name /aws/lambda/qumis-api-prod \
  --filter-pattern "REPORT" \
  --profile qumis_prod \
  --query 'events[*].message' \
  --output text | \
  grep "Memory Size\|Max Memory Used" | \
  tail -20

# Check for memory leaks
qumis services exec api \
  --env prod \
  --reason "Check memory usage" \
  --confirm prod \
  -- rails runner "
    puts 'Initial memory: ' + (\`ps -o rss= -p \#{Process.pid}\`.to_i / 1024).to_s + ' MB'

    # Perform operation
    1000.times { User.first }

    GC.start
    puts 'After GC: ' + (\`ps -o rss= -p \#{Process.pid}\`.to_i / 1024).to_s + ' MB'
  "
```

### Data Inconsistencies

> **Warning:** Be extremely careful when investigating data issues. Never modify production data without approval and backups.

```bash
# Investigate data issue (READ ONLY)
qumis services exec api \
  --env prod \
  --reason "Investigate data inconsistency - ticket #456" \
  --confirm prod \
  -- rails console --sandbox

# In console:
> # Find problematic records
> problematic = User.left_joins(:profile).where(profiles: {id: nil})
> puts "Found #{problematic.count} users without profiles"
>
> # Analyze pattern
> problematic.limit(5).each do |user|
>   puts "User #{user.id}: created #{user.created_at}, status: #{user.status}"
> end
>
> # DO NOT FIX IN PRODUCTION - Create fix script for review
```

## Advanced Debugging Tools

### CloudWatch Insights

```sql
-- Find specific error patterns
fields @timestamp, @message, @requestId
| filter @message like /ActiveRecord::RecordNotFound/
| sort @timestamp desc
| limit 20

-- Analyze request patterns
fields @timestamp, @requestId, @duration
| filter @type = "REPORT"
| stats avg(@duration) as avg_duration,
        max(@duration) as max_duration,
        count() as request_count
by bin(5m)

-- Find memory issues
fields @timestamp, @maxMemoryUsed, @memorySize
| filter @type = "REPORT"
| filter @maxMemoryUsed / @memorySize > 0.9
| sort @timestamp desc
```

### X-Ray Tracing

```bash
# Get trace summaries
aws xray get-trace-summaries \
  --start-time $(date -u -d '1 hour ago' --iso-8601) \
  --end-time $(date -u --iso-8601) \
  --filter-expression "service(\"qumis-api-prod\") AND error" \
  --profile qumis_prod

# Get detailed trace
aws xray get-traces \
  --trace-ids "1-5f4d6e7c-1234567890abcdef" \
  --profile qumis_prod
```

### Custom Debug Scripts

```bash
#!/bin/bash
# production-debug.sh

set -e

REASON="$1"
if [ -z "$REASON" ]; then
  echo "Usage: $0 'reason for debugging'"
  exit 1
fi

echo "Starting production debug session..."
echo "Reason: $REASON"

# Create debug report
REPORT="debug_$(date +%Y%m%d_%H%M%S).txt"

echo "=== Production Debug Report ===" > $REPORT
echo "Date: $(date)" >> $REPORT
echo "Reason: $REASON" >> $REPORT
echo "" >> $REPORT

# Collect metrics
echo "=== Error Count (Last Hour) ===" >> $REPORT
aws logs filter-log-events \
  --log-group-name /aws/lambda/qumis-api-prod \
  --start-time $(date -u -d '1 hour ago' '+%s')000 \
  --filter-pattern "ERROR" \
  --profile qumis_prod \
  --query 'length(events)' \
  --output text >> $REPORT

# Add more debug commands as needed

echo "Debug report saved to $REPORT"
```

## Production Fix Workflow

### Emergency Fixes

### Identify Root Cause

Use read-only debugging to understand the issue

### Develop Fix

Create fix in development environment and test thoroughly

### Test in UAT

```bash
# Deploy to UAT
qumis deploy api --env uat --reason "Test fix for production issue"

# Verify fix
qumis services exec api --env uat -- rails runner "# test script"
```

### Deploy to Production

```bash
# Deploy fix
qumis deploy api \
  --env prod \
  --reason "HOTFIX: Issue #123 - [description]" \
  --confirm prod

# Monitor closely
aws logs tail /aws/lambda/qumis-api-prod --profile qumis_prod --follow
```

### Verify Resolution

Confirm issue is resolved and no new issues introduced

## Post-Incident Actions

### Documentation

> **Info:** Create incident report with:
>
> - Timeline of events
> - Root cause analysis
> - Actions taken
> - Lessons learned
> - Prevention measures

### Monitoring Improvements

```bash
# Add new alarm for detected issue
aws cloudwatch put-metric-alarm \
  --alarm-name "qumis-api-prod-[specific-issue]" \
  --alarm-description "Alert for [issue description]" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=qumis-api-prod \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:729033428609:prod-alerts \
  --profile qumis_prod
```

## Best Practices

> **Tip:** Follow these best practices for safe production debugging:
>
> 1. **Always use `--reason` flag** for audit trail
> 2. **Start with read-only operations**
> 3. **Test fixes in lower environments first**
> 4. **Document all debugging steps**
> 5. **Set time limits for debugging sessions**
> 6. **Have rollback plan ready**
> 7. **Communicate with team throughout**
> 8. **Create runbooks for common issues**

## Additional Resources

- [Common Issues Guide](/internal/engineering/troubleshooting/common-issues)
- [CloudWatch Monitoring](/internal/engineering/infrastructure/cloudwatch-monitoring)
- [Rollback Procedures](/internal/engineering/deployment/rollback-procedures)
- [Production Deployment](/internal/engineering/deployment/production-deployment)
