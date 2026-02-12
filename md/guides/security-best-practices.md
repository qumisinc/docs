---
title: 'Security Best Practices'
description: 'Essential security guidelines for protecting your data and ensuring safe use of Qumis'
icon: 'shield-check'
---

## Overview

Security is fundamental to Qumis. This guide provides best practices to help you maintain the highest level of security when using our platform.

## Account Security

### Strong Password Requirements

Your Qumis password should meet these criteria:

At least 12 characters

Mix of uppercase, lowercase, numbers, and symbols

Unique to your Qumis account

Changed every 90 days

### Multi-Factor Authentication (MFA)

> **Note:** We strongly recommend enabling MFA for all accounts to add an extra layer of security.

### Enable MFA

Go to Account Settings and enable Multi-Factor Authentication

### Choose Authentication Method

Select your preferred method: Authenticator app (recommended) or SMS

### Backup Codes

Save your backup codes in a secure location

### Test Your Setup

Log out and verify MFA is working correctly

## Data Protection

### Document Handling Best Practices

> **Tip:** Always verify document sensitivity levels before uploading to Qumis.

#### Before Uploading Documents

- **Review Content**: Check for sensitive information that should be redacted
- **Classify Data**: Understand your document's confidentiality level
- **Remove Metadata**: Clean documents of unnecessary metadata
- **Scan for Malware**: Ensure documents are virus-free

#### Document Storage

- **Organized Structure**: Use clear folder hierarchies and naming conventions
- **Access Controls**: Set appropriate permissions for shared documents
- **Regular Audits**: Review and remove outdated documents periodically
- **Version Control**: Maintain clear version history for important documents

### Data Privacy Measures

| Practice | Description | Frequency |
|----------|-------------|-----------|
| Access Review | Audit who has access to your documents | Monthly |
| Permission Updates | Remove access for users who no longer need it | As needed |
| Activity Monitoring | Review access logs and user activity | Weekly |
| Data Cleanup | Remove unnecessary or outdated documents | Quarterly |

## Network Security

### Secure Connection Practices

> **Warning:** Never access Qumis over unsecured public Wi-Fi without a VPN.

#### Recommended Network Security

1. **Use HTTPS Only**: Always verify the URL starts with `https://app.qumis.ai`
2. **VPN Usage**: Connect through a VPN when using public networks
3. **Network Monitoring**: Be aware of unusual network activity
4. **Firewall Configuration**: Ensure your firewall allows secure Qumis connections

### Browser Security

#### Essential Browser Settings

- **Enable automatic updates** to receive security patches
- **Block third-party cookies** for enhanced privacy
- **Use private/incognito mode** when accessing from shared computers
- **Clear cache regularly** to remove stored sensitive data

## User Access Management

### Role-Based Access Control

Implement these principles for team accounts:

### Principle of Least Privilege

Grant users only the minimum access required for their role

### Regular Access Reviews

Audit user permissions quarterly and adjust as needed

### Immediate Deprovisioning

Remove access immediately when employees leave or change roles

### Segregation of Duties

Separate critical functions among different users to prevent conflicts

### Session Management

Best practices for secure sessions:

- **Auto-Logout**: Enable automatic session timeout after 15 minutes of inactivity
- **Single Session**: Avoid multiple concurrent sessions when possible
- **Logout Completely**: Always use the logout button instead of just closing the browser
- **Clear Session Data**: Clear cookies and cache after using shared computers

## Incident Response

### What to Do If You Suspect a Security Breach

### Immediate Action

Change your password immediately and log out all sessions

### Enable MFA

If not already enabled, activate multi-factor authentication

### Review Activity

Check recent activity logs for unauthorized access

### Contact Support

Report the incident to support@qumis.ai immediately

### Document Everything

Keep records of suspicious activity for investigation

## Compliance and Regulations

### Industry Standards

Qumis maintains compliance with:

- **SOC 2 Type II**: Annual audits for security controls
- **GDPR**: Data protection for European users
- **CCPA**: California consumer privacy compliance
- **HIPAA**: Healthcare information protection where applicable

### Your Compliance Responsibilities

As a Qumis user, you should:

- Understand your industry's regulatory requirements
- Configure Qumis settings to meet compliance needs
- Maintain audit logs as required by regulations
- Report compliance concerns promptly

## Security Training

### Recommended Training Topics

Recognize and avoid phishing attempts

Use password managers and secure practices

Understand data sensitivity levels

Identify manipulation tactics

## Security Checklist

Regular security tasks to maintain:

- \[ ] Monthly password review and updates
- \[ ] Quarterly access permission audits
- \[ ] Weekly activity log reviews
- \[ ] Daily verification of HTTPS connections
- \[ ] Annual security training completion
- \[ ] Regular MFA token/device updates
- \[ ] Periodic document access reviews
- \[ ] Routine browser security updates

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** publicly disclose the issue
2. Email security@qumis.ai with details
3. Include steps to reproduce if possible
4. Allow time for our team to investigate and respond

> **Info:** We appreciate responsible disclosure and will acknowledge security researchers who help improve Qumis.

## Additional Resources

- [System Requirements](/guides/system-requirements)
- [Common Issues](/guides/common-issues)
- [Managing Your Account](/guides/managing-your-account)
- [Contact Support](/guides/contact-support)
