---
title: "CloudWatch Alerts"
description: "Set up and manage CloudWatch alarms for proactive monitoring"
icon: "bell"
noindex: true
# groups: ["internal"]
---

This guide covers how to set up, manage, and respond to CloudWatch alerts for our applications.

## Alert Overview

### Current Alert Structure

| Environment | Critical Alerts | Warning Alerts | Notification Channel |
|------------|-----------------|----------------|---------------------|
| Development | None | Basic | Slack (#dev-alerts) |
| QA | Errors only | Performance | Slack (#qa-alerts) |
| UAT | Same as prod | Same as prod | Slack (#uat-alerts) |
| Production | Full suite | Full suite | PagerDuty + Slack |

## Critical Production Alerts

### Application Health

### High Error Rate

**Alarm**: `qumis-api-prod-high-error-rate`
**Threshold**: >10 errors in 5 minutes
**Action**: Page on-call engineer

```bash
# Create alarm via CLI
aws cloudwatch put-metric-alarm \
  --alarm-name qumis-api-prod-high-error-rate \
  --alarm-description "High error rate in production API" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=qumis-api-prod \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:729033428609:prod-critical-alerts \
  --profile qumis_prod
```

### Function Failures

**Alarm**: `qumis-api-prod-function-failures`
**Threshold**: >5 consecutive failures
**Action**: Page on-call engineer

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name qumis-api-prod-function-failures \
  --alarm-description "Lambda function failing repeatedly" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Average \
  --period 60 \
  --threshold 1 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=qumis-api-prod \
  --evaluation-periods 5 \
  --datapoints-to-alarm 5 \
  --alarm-actions arn:aws:sns:us-east-1:729033428609:prod-critical-alerts \
  --profile qumis_prod
```

### Availability

**Alarm**: `qumis-api-prod-availability`
**Threshold**: `<99%` success rate
**Action**: Alert team

```bash
# Using CloudWatch math expressions
aws cloudwatch put-metric-alarm \
  --alarm-name qumis-api-prod-availability \
  --alarm-description "API availability below 99%" \
  --metrics '[
    {
      "Id": "e1",
      "Expression": "(m1-m2)/m1*100"
    },
    {
      "Id": "m1",
      "MetricStat": {
        "Metric": {
          "Namespace": "AWS/Lambda",
          "MetricName": "Invocations",
          "Dimensions": [{"Name": "FunctionName", "Value": "qumis-api-prod"}]
        },
        "Period": 300,
        "Stat": "Sum"
      }
    },
    {
      "Id": "m2",
      "MetricStat": {
        "Metric": {
          "Namespace": "AWS/Lambda",
          "MetricName": "Errors",
          "Dimensions": [{"Name": "FunctionName", "Value": "qumis-api-prod"}]
        },
        "Period": 300,
        "Stat": "Sum"
      }
    }
  ]' \
  --threshold 99 \
  --comparison-operator LessThanThreshold \
  --evaluation-periods 2 \
  --profile qumis_prod
```

### Performance Alerts

### High Latency

**Alarm**: `qumis-api-prod-high-latency`
**Threshold**: >3000ms average duration
**Action**: Alert team

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name qumis-api-prod-high-latency \
  --alarm-description "API response time exceeding 3 seconds" \
  --metric-name Duration \
  --namespace AWS/Lambda \
  --statistic Average \
  --period 300 \
  --threshold 3000 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=qumis-api-prod \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:729033428609:prod-performance-alerts \
  --profile qumis_prod
```

### Throttling

**Alarm**: `qumis-api-prod-throttles`
**Threshold**: >5 throttles
**Action**: Alert team

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name qumis-api-prod-throttles \
  --alarm-description "Lambda function being throttled" \
  --metric-name Throttles \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 60 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=qumis-api-prod \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:729033428609:prod-performance-alerts \
  --profile qumis_prod
```

### Memory Usage

**Alarm**: `qumis-api-prod-high-memory`
**Threshold**: >90% memory utilization
**Action**: Alert team

```bash
# Custom metric from application logs
aws cloudwatch put-metric-alarm \
  --alarm-name qumis-api-prod-high-memory \
  --alarm-description "High memory usage detected" \
  --metric-name MemoryUtilization \
  --namespace Qumis/API \
  --statistic Maximum \
  --period 300 \
  --threshold 90 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:729033428609:prod-performance-alerts \
  --profile qumis_prod
```

### Database Alerts

```bash
# RDS CPU utilization
aws cloudwatch put-metric-alarm \
  --alarm-name qumis-rds-prod-high-cpu \
  --alarm-description "RDS CPU usage above 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=DBInstanceIdentifier,Value=qumis-prod-db \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:729033428609:prod-database-alerts \
  --profile qumis_prod

# Database connections
aws cloudwatch put-metric-alarm \
  --alarm-name qumis-rds-prod-connections \
  --alarm-description "Database connections near limit" \
  --metric-name DatabaseConnections \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=DBInstanceIdentifier,Value=qumis-prod-db \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:729033428609:prod-database-alerts \
  --profile qumis_prod
```

## Setting Up New Alerts

### Via AWS Console

### Navigate to CloudWatch

1. Login to AWS Console
2. Go to CloudWatch service
3. Click "Alarms" in left navigation
4. Click "Create alarm"

### Select Metric

1. Click "Select metric"
2. Choose namespace (e.g., AWS/Lambda)
3. Select metric dimension
4. Choose specific metric
5. Click "Select metric"

### Configure Conditions

1. Set statistic (Average, Sum, Maximum, etc.)
2. Choose period (1 minute, 5 minutes, etc.)
3. Set threshold type and value
4. Configure evaluation periods

### Configure Actions

1. Select SNS topic for notifications
2. Add email/SMS/PagerDuty as needed
3. Configure auto-scaling actions if applicable

### Name and Create

1. Provide descriptive name
2. Add detailed description
3. Review and create alarm

### Via AWS CLI

```bash
#!/bin/bash
# create-standard-alarms.sh

FUNCTION_NAME="qumis-api-prod"
SNS_TOPIC="arn:aws:sns:us-east-1:729033428609:prod-alerts"
PROFILE="qumis_prod"

# Error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "${FUNCTION_NAME}-error-rate" \
  --alarm-description "Error rate for ${FUNCTION_NAME}" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=${FUNCTION_NAME} \
  --evaluation-periods 1 \
  --alarm-actions ${SNS_TOPIC} \
  --profile ${PROFILE}

echo "Created error rate alarm for ${FUNCTION_NAME}"

# Duration alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "${FUNCTION_NAME}-duration" \
  --alarm-description "Duration alarm for ${FUNCTION_NAME}" \
  --metric-name Duration \
  --namespace AWS/Lambda \
  --statistic Average \
  --period 300 \
  --threshold 3000 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=FunctionName,Value=${FUNCTION_NAME} \
  --evaluation-periods 2 \
  --alarm-actions ${SNS_TOPIC} \
  --profile ${PROFILE}

echo "Created duration alarm for ${FUNCTION_NAME}"
```

## Alert Response Procedures

### Alert Severity Levels

| Level | Response Time | Action Required | Examples |
|-------|--------------|-----------------|-----------|
| **Critical** | Immediate | Page on-call, immediate investigation | Service down, data loss |
| **High** | 15 minutes | Alert team, investigate soon | High error rate, performance degradation |
| **Medium** | 1 hour | Review and plan fix | Increased latency, warning thresholds |
| **Low** | Next business day | Monitor and track | Minor issues, trending concerns |

### Response Playbook

### Acknowledge Alert

1. Respond in PagerDuty (if paged)
2. Post in #incidents channel
3. Start incident timer

### Initial Assessment

```bash
# Check service health
curl -f https://api.qumis.ai/health

# Check recent errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/qumis-api-prod \
  --start-time $(date -u -d '10 minutes ago' '+%s')000 \
  --filter-pattern "ERROR" \
  --profile qumis_prod \
  --max-items 20
```

### Investigate Root Cause

- Review CloudWatch logs
- Check recent deployments
- Verify external dependencies
- Review database status

### Take Action

- Apply immediate fix
- Rollback if necessary
- Scale resources if needed
- Contact relevant teams

### Document Resolution

- Update incident ticket
- Post resolution in Slack
- Schedule RCA if needed

## Managing Alert Fatigue

### Alert Tuning

```bash View Alarm History
aws cloudwatch describe-alarm-history \
  --alarm-name qumis-api-prod-high-error-rate \
  --profile qumis_prod \
  --max-records 50
```

```bash Check Alarm State Changes
aws cloudwatch describe-alarms \
  --alarm-names qumis-api-prod-high-error-rate \
  --profile qumis_prod \
  --query 'MetricAlarms[0].StateTransitionReason'
```

### Best Practices

1. **Avoid noise**: Set appropriate thresholds based on historical data
2. **Use composite alarms**: Combine related metrics for better accuracy
3. **Implement delays**: Use evaluation periods to avoid transient spikes
4. **Regular review**: Monthly review of alarm effectiveness
5. **Document context**: Include runbook links in alarm descriptions

## SNS Topics and Subscriptions

### Production SNS Topics

| Topic | Purpose | Subscribers |
|-------|---------|------------|
| prod-critical-alerts | Service down, critical errors | PagerDuty, Slack, Email |
| prod-performance-alerts | Performance degradation | Slack, Email |
| prod-database-alerts | Database issues | Slack, DBA team |
| prod-security-alerts | Security events | Security team, Slack |

### Managing Subscriptions

```bash List SNS Topics
aws sns list-topics --profile qumis_prod
```

```bash List Subscriptions for a Topic
aws sns list-subscriptions-by-topic \
  --topic-arn arn:aws:sns:us-east-1:729033428609:prod-critical-alerts \
  --profile qumis_prod
```

```bash Add Email Subscription
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:729033428609:prod-critical-alerts \
  --protocol email \
  --notification-endpoint your-email@qumis.ai \
  --profile qumis_prod
```

## Integration with External Services

### PagerDuty Integration

```bash
# PagerDuty integration via SNS
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:729033428609:prod-critical-alerts \
  --protocol https \
  --notification-endpoint https://events.pagerduty.com/integration/YOUR_INTEGRATION_KEY/enqueue \
  --profile qumis_prod
```

### Slack Integration

Using AWS Chatbot or Lambda:

```python
# Lambda function for Slack notifications
import json
import urllib3

http = urllib3.PoolManager()

def lambda_handler(event, context):
    url = "YOUR_SLACK_WEBHOOK_URL"
    msg = json.loads(event['Records'][0]['Sns']['Message'])

    slack_message = {
        "text": f"🚨 CloudWatch Alarm: {msg['AlarmName']}",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Alarm:* {msg['AlarmName']}\n*Status:* {msg['NewStateValue']}\n*Reason:* {msg['NewStateReason']}"
                }
            }
        ]
    }

    response = http.request('POST', url,
                          body=json.dumps(slack_message).encode('utf-8'),
                          headers={'Content-Type': 'application/json'})

    return {'statusCode': 200}
```

## Dashboard Creation

### Create Monitoring Dashboard

```bash
# Create dashboard via CLI
aws cloudwatch put-dashboard \
  --dashboard-name QumisProductionDashboard \
  --dashboard-body '{
    "widgets": [
      {
        "type": "metric",
        "properties": {
          "metrics": [
            ["AWS/Lambda", "Invocations", {"stat": "Sum"}],
            [".", "Errors", {"stat": "Sum"}],
            [".", "Duration", {"stat": "Average"}]
          ],
          "period": 300,
          "stat": "Average",
          "region": "us-east-1",
          "title": "Lambda Performance"
        }
      }
    ]
  }' \
  --profile qumis_prod
```

## Maintenance and Review

### Monthly Alert Review

```bash
#!/bin/bash
# alert-review.sh

echo "Monthly Alert Review - $(date)"
echo "=========================="

# Get all alarms
aws cloudwatch describe-alarms \
  --profile qumis_prod \
  --query 'MetricAlarms[*].[AlarmName,StateValue,StateUpdatedTimestamp]' \
  --output table

# Get alarm statistics
echo -e "\nAlarm trigger count (last 30 days):"
aws cloudwatch describe-alarm-history \
  --start-date $(date -u -d '30 days ago' --iso-8601) \
  --end-date $(date -u --iso-8601) \
  --profile qumis_prod \
  --query 'AlarmHistoryItems[?HistoryItemType==`StateUpdate`]' \
  --output json | jq -r '.[].AlarmName' | sort | uniq -c | sort -rn
```

## Additional Resources

- [CloudWatch Monitoring](/internal/engineering/infrastructure/cloudwatch-monitoring)
- [Production Deployment](/internal/engineering/deployment/production-deployment)
- [Incident Response Runbook](/internal/engineering/troubleshooting/debugging-production)
- [AWS CloudWatch Alarms Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)
