# Privacy and Data Protection

## Data categories

### Account data

- Email.
- Display name.
- Avatar URL.
- Authentication identifiers.

### Product data

- Skill metadata.
- Draft file contents.
- Uploaded archives.
- Public catalog content.
- Reviews and comments.
- Collections.

### Operational data

- Logs.
- Metrics.
- Audit events.
- Validation reports.
- Security reports.
- Download events.

### Potentially sensitive data

- Private skill content.
- Internal documentation in `references/`.
- Secrets accidentally included in packages.
- Organization approval records.

## Data storage

- Relational metadata stored in PostgreSQL.
- Archives stored in object storage.
- Searchable text stored in search index.
- Embeddings stored in vector index.
- Audit logs stored in append-friendly table or logging system.

## Private package handling

- Private packages must not be indexed into public search.
- Private package content must be accessible only to authorized users.
- Private package downloads must be logged.
- Organization private registries must be tenant-isolated.

## Public package handling

- Public skills may be indexed and displayed in catalog.
- Public package contents may be previewed in UI.
- Authors must confirm they have rights to publish included content.

## Secret handling

- Uploaded files must be scanned for secrets.
- High-confidence secrets must block public publication.
- Reports must redact secret values.
- Logs must not contain raw file contents unless explicitly safe.

## Retention

Recommended default policy:

- Drafts: retained until user deletion or inactivity policy.
- Public versions: retained while published or archived.
- Original uploads: retained for limited time or until normalized, depending on policy.
- Audit logs: retained according to compliance requirement.
- Validation reports: retained with version history.

## Deletion

Users should be able to delete:

- Personal drafts.
- Private skills they own.
- Collections.

Deletion of public verified packages may require deprecation instead of hard deletion if users depend on versioned archives.

## Search index privacy

When private skills are deleted or visibility changes, search and vector indexes must be updated or purged.

## LLM data use

If LLM APIs are used for generation or improvement:

- User must understand what content may be sent to the provider.
- Organization admins must be able to disable external LLM processing for private packages.
- Sensitive content should not be sent to external LLM providers without policy approval.

## Audit and access review

Organization admins should be able to review:

- Who published a private skill.
- Who approved a skill.
- Who downloaded a private skill.
- Which integrations accessed organization resources.
