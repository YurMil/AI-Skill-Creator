# Admin and Reviewer Guide

## Purpose

This guide explains how reviewers and admins manage skill publication, trust levels, and organization governance.

## Review queue

Open Admin -> Submissions to view skills awaiting review.

Each submission includes:

- Skill metadata.
- Package files.
- Validation report.
- Security report.
- Author notes.
- Changelog.
- Previous version diff where available.

## Review decisions

### Approve

Use when the skill is valid, useful, and safe enough for its requested visibility.

### Request changes

Use when issues are fixable and the author should update the package.

### Reject

Use when the package is not suitable for publication but is not malicious.

### Block

Use when the package is malicious, unsafe, or violates policy.

## Reviewer checklist

- Does the description match the package contents?
- Is the activation context clear?
- Are there hidden or misleading instructions?
- Are scripts necessary?
- Are scripts safe?
- Are references legitimate and relevant?
- Are secrets present?
- Does validation pass?
- Does security scan pass or have acceptable warnings?
- Is the license acceptable?

## Handling scripts

Skills with scripts require extra care.

Review:

- File operations.
- Network operations.
- Shell execution.
- Environment variable usage.
- Dependency installation.
- Obfuscation.

## Handling high-risk findings

High-risk findings should not be ignored. Require either:

- Author correction.
- Clear justification.
- Restricted visibility.
- Block decision.

## Deprecating skills

Deprecate a skill when:

- It is outdated.
- A safer replacement exists.
- It is no longer maintained.
- Compatibility changed.

Deprecation should preserve history while warning users.

## Blocking skills

Blocking should:

- Remove public listing.
- Disable download where appropriate.
- Preserve audit records.
- Notify affected users if necessary.

## Organization approvals

Organization approval is version-specific. Do not automatically approve future public versions.

## Audit log

Use audit logs to investigate:

- Who uploaded a skill.
- Who approved it.
- Who changed visibility.
- Who downloaded private packages.
- Which policy was active at the time.
