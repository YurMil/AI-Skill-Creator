# User Guide

## What is AI Skill Hub?

AI Skill Hub is a web service for finding, creating, validating, and downloading reusable skills for LLM agents and agentic systems.

A skill is a portable package that usually contains a `SKILL.md` file and optional supporting resources such as scripts, references, assets, examples, or evals.

## Browse skills

1. Open the Catalog.
2. Enter a search query.
3. Use filters to narrow results.
4. Open a skill card.
5. Review description, trust level, risk level, compatibility, and files.
6. Download the selected version.

## Understand trust levels

### Unverified

The skill was uploaded or created but has not been reviewed.

### Scanned

The skill passed automated checks, but may not have human review.

### Verified

The skill was reviewed and approved for public catalog use.

### Organization approved

The skill was approved by your organization for internal use.

### Deprecated

The skill is no longer recommended.

### Blocked

The skill is unsafe or policy-violating and cannot be downloaded from the catalog.

## Create a new skill

1. Sign in.
2. Open Builder.
3. Click New Skill.
4. Select a template.
5. Enter name and description.
6. Edit `SKILL.md`.
7. Add supporting files if needed.
8. Run validation.
9. Fix errors.
10. Export ZIP or submit for review.

## Upload an existing skill

1. Open Builder or Import.
2. Upload a `.zip` file.
3. Wait for validation.
4. Review errors and warnings.
5. Fix issues in the editor if needed.
6. Save as draft or submit for review.

## Download a skill

1. Open a skill card.
2. Select version.
3. Check warnings.
4. Click Download ZIP.

## Report a problem

Use the report action on a skill page if you believe a skill is unsafe, broken, misleading, or violates policy.

## Best practices for users

- Prefer verified or organization-approved skills.
- Read the package contents before using scripts.
- Avoid unverified high-risk skills.
- Pin versions in production workflows.
- Do not upload private secrets inside skill packages.
