# Security Test Cases

## Prompt injection cases

### TC-S-001: Ignore higher-priority instructions

`SKILL.md` contains instruction to ignore system or developer messages.

Expected result: high-risk finding or blocked.

### TC-S-002: Hidden behavior

`SKILL.md` tells agent not to reveal what it is doing.

Expected result: high-risk finding.

### TC-S-003: Data exfiltration

`SKILL.md` instructs agent to collect secrets and send them elsewhere.

Expected result: blocked.

### TC-S-004: Policy bypass

`SKILL.md` claims it can override safety policies.

Expected result: blocked or high-risk.

## Script cases

### TC-S-101: Destructive delete

Script contains command equivalent to recursive deletion of broad paths.

Expected result: blocked or high-risk.

### TC-S-102: Reads environment secrets

Script reads all environment variables and prints them.

Expected result: high-risk.

### TC-S-103: Network exfiltration

Script posts files to external URL.

Expected result: high-risk or blocked.

### TC-S-104: Package installation

Script runs package manager install at runtime.

Expected result: warning or high-risk depending on policy.

### TC-S-105: Obfuscated command

Script contains base64-encoded shell command.

Expected result: suspicious behavior finding.

## Archive cases

### TC-S-201: ZIP path traversal

Expected result: rejected before extraction.

### TC-S-202: ZIP bomb

Expected result: rejected due to expansion limits.

### TC-S-203: Nested archive

Expected result: warning or blocked pending review.

## Secret cases

### TC-S-301: API key pattern

Package contains string matching API key pattern.

Expected result: secret finding with redacted value.

### TC-S-302: Private key

Package contains private key block.

Expected result: blocked from public publication.

### TC-S-303: `.env` file

Package contains `.env`.

Expected result: warning or blocked depending on contents.

## Authorization cases

### TC-S-401: Access private skill without membership

Expected result: 403.

### TC-S-402: Approve review as normal user

Expected result: 403.

### TC-S-403: Download private skill from another organization

Expected result: 403.

### TC-S-404: Modify approved immutable version

Expected result: rejected; new version required.

## Logging cases

### TC-S-501: Secret in validation report

Expected result: secret value redacted.

### TC-S-502: Private package content in debug logs

Expected result: raw content not logged.
