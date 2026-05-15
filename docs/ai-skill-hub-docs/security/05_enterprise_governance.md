# Enterprise Governance Guide

## Purpose

Enterprise governance enables organizations to use skill packages safely at scale.

## Organization workspace

Each organization workspace contains:

- Members.
- Roles.
- Private skills.
- Private collections.
- Approval workflows.
- Audit logs.
- Policies.
- Allowed integrations.

## Organization roles

```text
owner
admin
reviewer
author
member
viewer
```

## Private registry

A private registry is an organization-scoped catalog of approved skills.

### Private registry requirements

- Visible only to organization members with access.
- Supports internal approval status.
- Supports pinned versions.
- Supports deprecation notices.
- Supports download tracking.

## Approval policies

Organizations should be able to configure:

- Whether all skills require approval.
- Whether scripts are allowed.
- Whether network behavior is allowed.
- Whether public skills can be imported.
- Whether only verified public skills can be used.
- Whether external LLM generation is allowed for private content.

## Policy examples

### Strict policy

```json
{
  "allow_public_unverified_skills": false,
  "require_review_for_all_skills": true,
  "allow_scripts": false,
  "allow_network_access": false,
  "allow_external_llm_processing": false
}
```

### Balanced policy

```json
{
  "allow_public_unverified_skills": false,
  "require_review_for_scripts": true,
  "allow_scripts": true,
  "allow_network_access": false,
  "allow_external_llm_processing": true
}
```

## Audit log events

- Member added or removed.
- Role changed.
- Skill uploaded.
- Skill submitted for approval.
- Skill approved or rejected.
- Skill downloaded.
- Policy changed.
- Integration enabled or disabled.

## Version pinning

Organizations should pin approved skill versions. A new public version should not automatically become organization-approved.

## Exceptions

Admins may grant exceptions for specific skills, users, or projects. Exceptions must be time-limited and logged.

## Reporting

Enterprise reporting should include:

- Number of approved skills.
- Number of deprecated skills.
- Skills with scripts.
- Skills with high risk.
- Downloads by team.
- Pending reviews.
- Policy violations.

## Incident response

Organization admins must be able to:

- Block a skill immediately.
- Remove a skill from private registry.
- Notify users who downloaded it.
- Export audit log.
- Create an incident note.
