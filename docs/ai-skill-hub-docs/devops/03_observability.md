# Observability Plan

## Goals

- Detect failures quickly.
- Understand user-impacting incidents.
- Monitor validation and scan pipelines.
- Track catalog and download usage.
- Support security investigations.

## Logs

Use structured JSON logs.

Required fields:

```text
timestamp
level
service
request_id
user_id
organization_id
action
resource_type
resource_id
message
metadata
```

## Metrics

### API metrics

- Request count.
- Request latency.
- Error rate.
- Status code distribution.
- Authentication failures.

### Catalog/search metrics

- Search latency.
- Search zero-result rate.
- Popular queries.
- Filter usage.
- Result click-through rate.

### Upload metrics

- Upload count.
- Upload failure rate.
- Average archive size.
- Rejected uploads.

### Validation metrics

- Validation job count.
- Validation duration.
- Validation pass/fail rate.
- Common error codes.
- Queue depth.

### Security metrics

- Security scan count.
- Risk level distribution.
- Blocked packages.
- Secret findings.
- Prompt injection findings.

### Download metrics

- Download count.
- Download failures.
- Most downloaded skills.
- Private registry downloads.

## Tracing

Trace important flows:

- Search request.
- Upload and validation.
- Export ZIP.
- Review approval.
- Download.

## Dashboards

### Platform dashboard

- API health.
- Error rate.
- Latency.
- Database health.
- Queue depth.

### Validation dashboard

- Jobs by status.
- Average duration.
- Failure rate.
- Common errors.

### Security dashboard

- Risk distribution.
- Blocked skills.
- Findings by type.
- Review backlog.

### Product dashboard

- Active users.
- Skill creations.
- Downloads.
- Search success.
- Published skills.

## Alerts

Critical alerts:

- API error rate above threshold.
- Database unavailable.
- Queue not processing.
- Object storage unavailable.
- Validation failure spike.
- Suspicious upload spike.
- Private access authorization failures.

## Audit logs

Audit logs are not ordinary debug logs. They must be retained according to policy and protected from tampering.

## Privacy in logs

- Do not log raw package contents.
- Do not log secrets.
- Redact tokens and credentials.
- Avoid logging full private file paths if sensitive.
