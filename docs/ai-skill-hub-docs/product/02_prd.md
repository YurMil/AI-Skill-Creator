# Product Requirements Document

## 1. Overview

AI Skill Hub is a web application for managing LLM and agent skill packages. It supports catalog search, skill authoring, visual composition, validation, review, versioning, knowledge sharing, and secure distribution.

## 2. Objectives

- Provide a central skill catalog.
- Let users create and edit skills in the browser.
- Let users upload and validate existing skill packages.
- Let authors publish versioned skills.
- Let reviewers approve or block unsafe skills.
- Let organizations maintain private approved registries.

## 3. User roles

### Guest

Can browse public catalog, read public documentation, and download public verified skills where allowed.

### Registered user

Can create skills, upload ZIP packages, run validation, save drafts, download own packages, and create collections.

### Skill author

Can publish skills, manage versions, add examples, create changelogs, and respond to review comments.

### Reviewer

Can review submitted skills, run deeper scans, request changes, approve, reject, deprecate, or block skills.

### Organization admin

Can manage members, private registry, approval policies, trusted authors, audit logs, and organization settings.

## 4. User stories

### Search and download

As a developer, I want to search for a skill by task, platform, and risk level so that I can quickly find a reusable package.

### Create from template

As a skill author, I want to start from a validated template so that I can create a correct package without remembering the folder structure.

### Upload and validate

As a user, I want to upload a skill ZIP and receive clear validation errors so that I can fix the package before using or publishing it.

### Visual composition

As an automation specialist, I want to combine multiple skills into a skill pack so that I can support a larger workflow.

### Review and approval

As a reviewer, I want to inspect package contents, validation results, and security findings so that I can approve only safe and useful skills.

### Private registry

As an organization admin, I want an internal approved registry so that employees only use trusted skills.

## 5. Functional modules

### Catalog

- List skills.
- Filter by category, tags, compatibility, trust level, author, license, and risk level.
- Show skill cards.
- Show version history.
- Download selected version.

### Search

- Full-text search over metadata and package content.
- Semantic search by user intent.
- Recommendation flow based on platform and task.

### Builder

- Create skill from template.
- Edit `SKILL.md`.
- Manage references, scripts, assets, examples, and evals.
- Preview package structure.
- Export ZIP.

### Canvas

- Place skill nodes.
- Configure node metadata.
- Connect skills into packs.
- Export composed package.

### Validation

- Validate package structure.
- Validate YAML frontmatter.
- Validate naming rules.
- Validate size limits.
- Validate metadata completeness.
- Return human-readable errors and warnings.

### Security

- Scan for prompt injection patterns.
- Scan scripts for destructive operations.
- Scan files for secrets.
- Flag network access and dependency risks.
- Assign risk level.

### Review

- Submit skill for review.
- Reviewer comments.
- Approve, reject, request changes, deprecate, or block.
- Publish verified badge.

### Knowledge base

- Explain skill concepts.
- Provide best practices.
- Provide examples and templates.
- Link validation errors to relevant documentation.

## 6. Success metrics

- Number of valid skills created.
- Upload-to-valid-package conversion rate.
- Search success rate.
- Download rate of verified skills.
- Review turnaround time.
- Number of blocked high-risk packages.
- Percentage of skills with examples and evals.

## 7. Release criteria

MVP can be released when:

- Users can register and log in.
- Skills can be created, edited, uploaded, validated, saved, and downloaded.
- Catalog and skill cards are usable.
- Basic review workflow exists.
- Basic knowledge base exists.
- All P0 acceptance criteria pass.
