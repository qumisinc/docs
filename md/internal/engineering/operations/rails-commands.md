---
title: "Rails Commands via qumis-cli"
description: "Execute Rails commands on the API service using qumis-cli"
icon: "database"
noindex: true
# groups: ["internal"]
---

This guide covers how to run Rails commands on our API service across different environments using qumis-cli.

## Basic Syntax

```bash
qumis services exec api \
  --env [environment] \
  --reason "[reason for audit log]" \
  --confirm "[environment]" \  # Required for production only
  -- [rails command]
```

> **Warning:** **Production commands** require:
>
> - `--reason` flag with clear explanation
> - `--confirm prod` flag for safety
> - Audit log entry is automatically created

## Common Rails Commands

### Rails Console

### Development

```bash
# Open interactive console
qumis services exec api --env dev -- rails console

# Short version
qumis services exec api --env dev -- rails c
```

### Production

```bash
# Production console (requires confirmation)
qumis services exec api \
  --env prod \
  --reason "Debug customer issue #12345" \
  --confirm prod \
  -- rails console

# Read-only console (safer)
qumis services exec api \
  --env prod \
  --reason "Investigate data issue" \
  --confirm prod \
  -- rails console --sandbox
```

### Database Migrations

### Check Migration Status

```bash
# Development
qumis services exec api --env dev -- rails db:migrate:status

# Production
qumis services exec api \
  --env prod \
  --reason "Check migration status before deployment" \
  --confirm prod \
  -- rails db:migrate:status
```

### Run Migrations

```bash
# Development
qumis services exec api --env dev -- rails db:migrate

# UAT (test before production)
qumis services exec api --env uat -- rails db:migrate

# Production
qumis services exec api \
  --env prod \
  --reason "Apply migration for feature ENG-123" \
  --confirm prod \
  -- rails db:migrate
```

### Rollback if Needed

```bash
# Rollback last migration
qumis services exec api --env dev -- rails db:rollback

# Rollback specific number of migrations
qumis services exec api --env dev -- rails db:rollback STEP=2

# Production rollback (use with extreme caution)
qumis services exec api \
  --env prod \
  --reason "ROLLBACK: Migration causing issues" \
  --confirm prod \
  -- rails db:rollback
```

### Rails Runner

Execute Ruby code in the Rails environment:

```bash
# Simple commands
qumis services exec api --env dev -- rails runner "puts User.count"

# Complex scripts
qumis services exec api --env dev -- rails runner "User.where(created_at: 1.day.ago..Time.now).count"

# Production queries
qumis services exec api \
  --env prod \
  --reason "Get metrics for daily report" \
  --confirm prod \
  -- rails runner "puts User.active.count"
```

### Database Tasks

### Development Only

```bash
# Create database
qumis services exec api --env dev -- rails db:create

# Drop database (DANGER!)
qumis services exec api --env dev -- rails db:drop

# Reset database (drop, create, migrate, seed)
qumis services exec api --env dev -- rails db:reset

# Load schema
qumis services exec api --env dev -- rails db:schema:load

# Seed database
qumis services exec api --env dev -- rails db:seed
```

### Safe for All Environments

```bash
# Check database version
qumis services exec api --env dev -- rails db:version

# Run specific migration
qumis services exec api --env dev -- rails db:migrate:up VERSION=20240101120000

# Check pending migrations
qumis services exec api --env dev -- rails runner "puts ActiveRecord::Base.connection.migration_context.needs_migration?"
```

## Data Queries and Manipulation

### Safe Read Operations

```bash Count Records
qumis services exec api --env prod \
  --reason "Get user metrics" \
  --confirm prod \
  -- rails runner "puts User.count"
```

```bash Find Specific Records
qumis services exec api --env prod \
  --reason "Check specific user status" \
  --confirm prod \
  -- rails runner "puts User.find_by(email: 'user@example.com')&.attributes"
```

```bash Generate Reports
qumis services exec api --env prod \
  --reason "Generate usage report" \
  --confirm prod \
  -- rails runner "
    puts 'Daily Active Users: ' + User.where(last_sign_in_at: 1.day.ago..Time.now).count.to_s
  "
```

### Data Modifications

> **Warning:** **DANGER**: Data modifications in production should be:
>
> - Tested in UAT first
> - Approved by team lead
> - Wrapped in transactions when possible
> - Backed up before execution

```bash
# UAT testing first
qumis services exec api --env uat -- rails runner "
  User.find_by(email: 'test@example.com')&.update(status: 'active')
"

# Production update (with extreme caution)
qumis services exec api \
  --env prod \
  --reason "Fix user status per support ticket #789" \
  --confirm prod \
  -- rails runner "
    ActiveRecord::Base.transaction do
      user = User.find_by(email: 'user@example.com')
      if user
        user.update!(status: 'active')
        puts 'Updated user ' + user.id.to_s
      else
        puts 'User not found'
        raise ActiveRecord::Rollback
      end
    end
  "
```

## Rake Tasks

### Built-in Tasks

```bash List All Rake Tasks
qumis services exec api --env dev -- rails -T
```

```bash Stats
qumis services exec api --env dev -- rake stats
```

```bash Routes
qumis services exec api --env dev -- rake routes
```

```bash Middleware
qumis services exec api --env dev -- rake middleware
```

### Custom Rake Tasks

```bash
# Run custom task
qumis services exec api --env dev -- rake custom:task

# With arguments
qumis services exec api --env dev -- rake data:import[file.csv]

# Production rake task
qumis services exec api \
  --env prod \
  --reason "Run scheduled cleanup task" \
  --confirm prod \
  -- rake maintenance:cleanup
```

## Testing Commands

### Running Tests

```bash Run All Tests
qumis services exec api --env dev -- rails test
```

```bash Run Specific Test File
qumis services exec api --env dev -- rails test test/models/user_test.rb
```

```bash Run RSpec Tests
qumis services exec api --env dev -- rspec
```

```bash Run Specific RSpec File
qumis services exec api --env dev -- rspec spec/models/user_spec.rb
```

```bash Run Specific Test Line
qumis services exec api --env dev -- rspec spec/models/user_spec.rb:42
```

### Test Database

```bash
# Prepare test database
qumis services exec api --env dev -- rails db:test:prepare

# Load test fixtures
qumis services exec api --env dev -- rails db:fixtures:load
```

## Cache and Assets

### Cache Management

```bash Clear Rails Cache (Dev)
qumis services exec api --env dev -- rails cache:clear
```

```bash Clear Rails Cache (Production)
qumis services exec api \
  --env prod \
  --reason "Clear cache after configuration change" \
  --confirm prod \
  -- rails cache:clear
```

### Asset Management

```bash
# Precompile assets
qumis services exec api --env dev -- rails assets:precompile

# Clean assets
qumis services exec api --env dev -- rails assets:clean

# Clobber assets (remove all)
qumis services exec api --env dev -- rails assets:clobber
```

## Debugging and Troubleshooting

### Check Application State

```bash
# Rails environment
qumis services exec api --env dev -- rails runner "puts Rails.env"

# Database connection
qumis services exec api --env dev -- rails runner "puts ActiveRecord::Base.connection.active?"

# Loaded gems
qumis services exec api --env dev -- rails runner "puts Gem.loaded_specs.keys.sort"

# Environment variables
qumis services exec api --env dev -- rails runner "puts ENV.select { |k,v| k.start_with?('RAILS_') }"
```

### Performance Analysis

```bash
# Database query analysis
qumis services exec api --env dev -- rails runner "
  ActiveRecord::Base.logger = Logger.new(STDOUT)
  User.includes(:posts).where(active: true).limit(10).each { |u| u.posts.count }
"

# Memory usage
qumis services exec api --env dev -- rails runner "
  puts 'Memory: ' + (`ps -o rss= -p \#{Process.pid}`.to_i / 1024).to_s + ' MB'
"
```

## Best Practices

### Safety Guidelines

1. **Always test in development first**
   ```bash
   # Test in dev
   qumis services exec api --env dev -- rails runner "YOUR_COMMAND"
   # Then in UAT
   qumis services exec api --env uat -- rails runner "YOUR_COMMAND"
   # Finally in production
   qumis services exec api --env prod --reason "Tested in UAT" --confirm prod -- rails runner "YOUR_COMMAND"
   ```

2. **Use transactions for data modifications**
   ```ruby
   ActiveRecord::Base.transaction do
     # Your changes here
     # Will rollback if any error occurs
   end
   ```

3. **Use sandbox mode for exploration**
   ```bash
   qumis services exec api --env prod --reason "Safe exploration" --confirm prod -- rails console --sandbox
   ```

### Audit Log Best Practices

Good reason examples:

- ✅ "Debug customer issue #12345"
- ✅ "Apply migration for feature ENG-789"
- ✅ "Generate monthly usage report for finance"
- ✅ "Fix data inconsistency per bug report #456"

Bad reason examples:

- ❌ "Testing"
- ❌ "Fix stuff"
- ❌ "Running command"

### Performance Considerations

1. **Avoid N+1 queries**
   ```ruby
   # Bad
   User.all.each { |u| puts u.posts.count }

   # Good
   User.includes(:posts).each { |u| puts u.posts.count }
   ```

2. **Use batch processing for large datasets**
   ```ruby
   User.find_each(batch_size: 1000) do |user|
     # Process user
   end
   ```

3. **Add timeouts for long-running operations**
   ```ruby
   Timeout::timeout(300) do
     # Operation that shouldn't take more than 5 minutes
   end
   ```

## Common Patterns

### Daily Operations Check

```bash
#!/bin/bash
# daily-check.sh

echo "Checking API health across environments..."

for ENV in dev qa uat prod; do
  echo "Environment: $ENV"

  if [ "$ENV" = "prod" ]; then
    qumis services exec api \
      --env prod \
      --reason "Daily health check" \
      --confirm prod \
      -- rails runner "puts 'DB Connected: ' + ActiveRecord::Base.connection.active?.to_s"
  else
    qumis services exec api --env $ENV -- rails runner "puts 'DB Connected: ' + ActiveRecord::Base.connection.active?.to_s"
  fi
done
```

### Data Export Script

```bash
# Export user data for analysis
qumis services exec api \
  --env prod \
  --reason "Export data for monthly analytics" \
  --confirm prod \
  -- rails runner "
    require 'csv'
    CSV.open('/tmp/users_export.csv', 'w') do |csv|
      csv << ['ID', 'Email', 'Created At', 'Status']
      User.find_each do |user|
        csv << [user.id, user.email, user.created_at, user.status]
      end
    end
    puts 'Export complete: /tmp/users_export.csv'
  "
```

## Troubleshooting

### Command times out

Long-running commands may timeout. Consider:

- Running in background with nohup
- Breaking into smaller batches
- Using rake tasks instead of runner

### Memory errors

For memory-intensive operations:

- Process in batches
- Use `find_each` instead of `all`
- Clear cache between operations

### Permission denied

Ensure you have:

- Proper AWS credentials
- Access to the environment
- Required permissions in qumis-cli

## Additional Resources

- [qumis-cli Reference](/internal/engineering/operations/qumis-cli-reference)
- [Production Deployment](/internal/engineering/deployment/production-deployment)
- [Database Best Practices](https://guides.rubyonrails.org/active_record_querying.html)
- [Rails Command Line Guide](https://guides.rubyonrails.org/command_line.html)
