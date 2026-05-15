# Deployment Plan

## Environments

### Local development

Purpose: developer workflow.

Components:

- Web app.
- API service.
- Worker service.
- PostgreSQL.
- Redis.
- Local object storage emulator.
- Search service.

Recommended command:

```bash
docker compose up
```

### Staging

Purpose: pre-production testing.

Characteristics:

- Production-like infrastructure.
- Test data only.
- External auth sandbox.
- Separate object storage bucket.
- Separate search index.

### Production

Purpose: live user traffic.

Characteristics:

- Managed database.
- Managed object storage.
- Managed queue or Redis.
- Autoscaled web/API/worker containers.
- Monitoring and alerting.
- Backup and restore procedures.

## Deployment units

```text
web
api
worker
postgres
redis
search
object-storage
```

## Infrastructure recommendations

- Use containerized workloads.
- Use managed PostgreSQL where possible.
- Use S3-compatible object storage.
- Use CDN for public static assets and public downloads where appropriate.
- Use separate storage prefixes for public, private, quarantine, and generated archives.

## Configuration

Environment variables should include:

```text
DATABASE_URL
REDIS_URL
OBJECT_STORAGE_ENDPOINT
OBJECT_STORAGE_BUCKET
OBJECT_STORAGE_ACCESS_KEY
OBJECT_STORAGE_SECRET_KEY
AUTH_SECRET
SEARCH_URL
VECTOR_DB_URL
LLM_PROVIDER_API_KEY
```

Secrets must be managed through a secure secret manager in staging and production.

## Release process

1. Merge to main.
2. Run CI tests.
3. Build containers.
4. Push container images.
5. Run database migrations.
6. Deploy API and workers.
7. Deploy web app.
8. Run smoke tests.
9. Monitor metrics and logs.

## Rollback process

- Keep previous container image available.
- Database migrations must be backward-compatible where possible.
- Archive format changes must be versioned.
- Roll back web/API first, then workers if needed.

## Backup

- PostgreSQL daily backups.
- Point-in-time recovery if available.
- Object storage versioning for archives.
- Search index rebuild process from database and archive metadata.

## Disaster recovery

Minimum recovery plan:

- Restore database backup.
- Verify object storage archives.
- Rebuild search indexes.
- Restart workers.
- Run consistency checks.
