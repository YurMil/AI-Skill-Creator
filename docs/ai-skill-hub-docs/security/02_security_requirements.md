# Security Requirements

## Authentication

- All write operations require authentication.
- Admin and reviewer actions require elevated roles.
- API tokens must be scoped and revocable.

## Authorization

- Use role-based access control for platform roles.
- Use organization membership checks for private resources.
- Enforce authorization at API layer, not only in UI.

## Upload security

- Accept only configured file types.
- Store original uploads in quarantine storage.
- Perform safe extraction.
- Reject path traversal.
- Enforce compressed and uncompressed size limits.
- Enforce file count limits.
- Run validation automatically.

## Package security

- Public publication requires successful validation.
- Public publication requires review approval.
- Skills with scripts require stricter scanning.
- Skills with network behavior require manual review.
- Skills with high-confidence secrets must be blocked from public publication.

## Script security

- Flag destructive commands.
- Flag shell execution patterns.
- Flag network calls.
- Flag package manager installation.
- Flag attempts to read environment variables or credential paths.
- Run scripts only in sandbox when supported.

## Prompt/instruction security

Flag content that:

- Claims to ignore system or developer instructions.
- Attempts to hide behavior from the user.
- Requests secrets or private data without task relevance.
- Instructs the agent to exfiltrate data.
- Attempts to bypass policies or safety checks.
- Uses obfuscation or encoded instructions.

## Data protection

- Use encryption at rest for database and object storage where available.
- Use TLS for all external traffic.
- Do not log secrets.
- Redact sensitive values in reports.
- Separate private and public storage paths.

## Audit logging

Log:

- Uploads.
- Validation runs.
- Security scans.
- Review actions.
- Publication actions.
- Downloads of private skills.
- Admin changes.
- Organization policy changes.

## Session security

- Use secure cookies when cookie-based auth is chosen.
- Enable CSRF protection where applicable.
- Set strict CORS policy.
- Expire sessions.

## API security

- Rate-limit upload and search endpoints.
- Rate-limit auth endpoints.
- Validate all inputs.
- Use structured error responses without leaking internals.

## Dependency security

- Use dependency scanning in CI.
- Pin critical dependencies.
- Keep lockfiles committed.
- Review transitive dependency risk for sandbox and archive tooling.

## Infrastructure security

- Use least-privilege service accounts.
- Separate staging and production secrets.
- Rotate credentials.
- Restrict database access.
- Restrict object storage bucket permissions.

## Incident response

The platform must support:

- Blocking a skill.
- Unpublishing a skill version.
- Listing users who downloaded a private skill.
- Adding security advisory notes.
- Revoking API tokens.
- Preserving audit records.
