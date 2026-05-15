# Threat Model

## Scope

This threat model covers AI Skill Hub as a platform for uploading, editing, validating, publishing, and downloading LLM/agent skill packages.

## Assets

- User accounts.
- Private skill packages.
- Public verified skill packages.
- Organization registries.
- Uploaded archives.
- Validation reports.
- Security reports.
- API keys and integration credentials.
- Audit logs.
- Knowledge base content.

## Trust boundaries

```text
User browser <-> API service
API service <-> database
API service <-> object storage
API service <-> queue
Worker <-> extracted package contents
Worker <-> sandbox environment
Public internet <-> upload endpoint
Organization user <-> private registry
```

## Threat actors

- Malicious public user.
- Compromised skill author account.
- Careless legitimate author.
- Malicious organization member.
- External attacker targeting upload pipeline.
- Supply chain attacker hiding instructions in skill files.

## Main threats

### T1: Malicious SKILL.md instructions

A package may contain instructions that attempt to override user, developer, or system rules, exfiltrate data, hide behavior, or trigger unsafe tool usage.

Mitigations:

- Prompt injection scanner.
- Review workflow.
- Trust level labels.
- Clear package preview.
- Warnings for high-risk instructions.

### T2: Destructive scripts

Scripts may delete files, access secrets, install malware, or perform network exfiltration.

Mitigations:

- Static script analysis.
- Sandbox execution.
- Network disabled by default.
- Blocked command patterns.
- Manual review for scripts.

### T3: ZIP path traversal

Uploaded archive may try to write outside extraction directory.

Mitigations:

- Safe extraction.
- Path normalization.
- Reject absolute paths and `..` segments.
- Extract in isolated temporary directory.

### T4: ZIP bomb or resource exhaustion

Archive may expand to huge size or contain too many files.

Mitigations:

- Compressed and uncompressed size limits.
- File count limits.
- Extraction timeouts.
- Worker isolation.

### T5: Secret leakage

A package may contain tokens, private keys, credentials, or internal data.

Mitigations:

- Secret scanning.
- Warning before publication.
- Redaction in logs.
- Block publication when high-confidence secrets are found.

### T6: Unsafe public catalog

Unreviewed skills may be presented as trusted.

Mitigations:

- Public catalog approval gate.
- Trust badges.
- Risk labels.
- Default sorting favors verified low-risk skills.

### T7: Organization data exposure

Private skills may be visible to unauthorized users.

Mitigations:

- RBAC.
- Tenant isolation.
- Authorization checks on every resource.
- Audit logs.

### T8: Dependency supply chain risk

Scripts may include dependency files that install unsafe packages.

Mitigations:

- Dependency manifest detection.
- Vulnerability scanning in later phases.
- Disallow installs in sandbox by default.
- Reviewer warnings.

### T9: Review bypass

Author may attempt to publish without review or modify approved package after approval.

Mitigations:

- Immutable version archives.
- Approval tied to exact content hash.
- Any content change creates new review requirement.
- Audit log.

### T10: Knowledge base abuse

Public documentation or examples may contain unsafe instructions.

Mitigations:

- KB editor roles.
- Review for published KB articles.
- Content moderation.

## Risk matrix

| Threat | Likelihood | Impact | Priority |
|---|---:|---:|---:|
| Malicious instructions | High | High | P0 |
| Destructive scripts | Medium | High | P0 |
| ZIP traversal | Medium | High | P0 |
| Secret leakage | Medium | High | P0 |
| Private data exposure | Medium | High | P0 |
| ZIP bomb | Medium | Medium | P1 |
| Dependency risk | Medium | Medium | P1 |
| Review bypass | Low | High | P1 |

## Security posture

The platform must treat all uploaded skills as untrusted until validated, scanned, and reviewed.
