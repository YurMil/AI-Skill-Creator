# Skill Review Policy

## Purpose

This policy defines how skills move from draft to public or organization-approved status.

## Review statuses

```text
draft
submitted
changes_requested
approved
rejected
deprecated
blocked
```

## Trust levels

```text
unverified
community
scanned
verified
organization-approved
deprecated
blocked
```

## Publication rules

- Draft skills are visible only to owner or organization members with access.
- Submitted skills are visible to reviewers.
- Public catalog must show only approved public skills.
- Blocked skills must not be downloadable from public catalog.
- Deprecated skills may remain visible with warning and replacement recommendation.

## Review requirements by package type

### Markdown-only skill

Minimum checks:

- Validation pass.
- Prompt injection scan.
- Reviewer preview.

### Skill with references and assets

Minimum checks:

- Validation pass.
- Content scan.
- File type scan.
- Reviewer preview.

### Skill with scripts

Minimum checks:

- Validation pass.
- Static script scan.
- Manual reviewer approval.
- Sandbox run when available.

### Skill with network behavior

Minimum checks:

- Manual review.
- Explicit permission notes.
- Security justification.
- High-risk label unless fully controlled.

## Reviewer checklist

- Is the skill purpose clear?
- Is the description specific enough?
- Are activation contexts accurate?
- Does the package include hidden or irrelevant files?
- Are scripts necessary?
- Do scripts perform unsafe actions?
- Are secrets present?
- Are examples and docs accurate?
- Is the license acceptable?
- Is the risk label correct?

## Reasons to request changes

- Vague description.
- Missing examples.
- Broken references.
- Unclear output expectations.
- Unnecessary scripts.
- Missing license for public package.
- Warnings that need author clarification.

## Reasons to reject

- Fails validation.
- Misleading description.
- Poor quality or unusable instructions.
- Unsupported package format.
- Repeated unresolved warnings.

## Reasons to block

- Malicious instructions.
- Data exfiltration behavior.
- Policy bypass content.
- Destructive scripts.
- Credential theft.
- Malware indicators.
- Attempted review bypass.

## Version review

Approval applies to a specific content hash. Any file change creates a new version and requires review before it inherits verified status.

## Appeals

Authors may request reconsideration of rejected or blocked submissions. Appeals must be reviewed by a different reviewer or admin where possible.

## Audit

All review decisions must be logged with actor, timestamp, decision, and notes.
