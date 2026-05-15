# Operations Runbook

## Incident: API is down

### Symptoms

- Health check failing.
- Users cannot load catalog or dashboard.
- Elevated 5xx errors.

### Checks

1. Check API container status.
2. Check recent deployment.
3. Check database connectivity.
4. Check environment variables.
5. Check error logs.

### Mitigation

- Roll back latest deployment if correlated.
- Restart API containers if safe.
- Disable non-critical integrations if causing failures.

## Incident: Validation queue is stuck

### Symptoms

- Validation jobs remain queued.
- Queue depth increasing.
- Users do not receive validation reports.

### Checks

1. Check worker container status.
2. Check Redis/queue availability.
3. Check worker logs.
4. Check object storage access.
5. Check recent validation rule changes.

### Mitigation

- Restart workers.
- Pause problematic job type.
- Roll back validator update.
- Requeue failed jobs if safe.

## Incident: Search is unavailable

### Symptoms

- Search endpoint fails.
- Catalog filters work but search does not.

### Checks

1. Check search service health.
2. Check API search integration logs.
3. Check index status.

### Mitigation

- Fall back to database search if available.
- Rebuild search index if corrupted.
- Display degraded mode message.

## Incident: Malicious skill published

### Symptoms

- User report.
- Security scanner finding.
- Reviewer identifies issue after publication.

### Immediate actions

1. Block the skill version.
2. Remove from public catalog.
3. Disable downloads.
4. Preserve audit logs and archive.
5. Identify downloads.
6. Notify affected users if required.

### Follow-up

- Review how it passed validation.
- Add test fixture.
- Update scanner rules.
- Document incident.

## Incident: Secret found in public package

### Immediate actions

1. Block package version.
2. Redact previews.
3. Notify author.
4. Recommend secret rotation.
5. Preserve audit event.

## Routine task: Rebuild search index

1. Put indexer in maintenance mode if needed.
2. Create new index version.
3. Re-index approved public skills.
4. Re-index private skills by tenant.
5. Swap alias.
6. Verify search results.

## Routine task: Restore database backup

1. Select backup point.
2. Restore to staging first.
3. Verify data integrity.
4. Plan production restore window.
5. Restore production.
6. Rebuild derived indexes.
7. Run smoke tests.

## Routine task: Rotate storage credentials

1. Create new credentials.
2. Deploy updated secrets.
3. Verify read/write access.
4. Revoke old credentials.
5. Monitor errors.
