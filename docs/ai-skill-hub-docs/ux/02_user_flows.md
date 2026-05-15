# User Flows

## Flow 1: Search and download a skill

```text
Open Catalog
  -> Enter search query
  -> Apply filters
  -> Open skill card
  -> Review trust level and package contents
  -> Select version
  -> Download ZIP
```

### Key UX requirements

- Show trust and risk badges in search results.
- Show compatibility before download.
- Show package preview.
- Warn if skill is unverified or deprecated.

## Flow 2: Create skill from template

```text
Open Builder
  -> New Skill
  -> Select template
  -> Enter name and description
  -> Edit SKILL.md
  -> Add references/scripts/assets
  -> Run validation
  -> Fix issues
  -> Export ZIP or submit for review
```

### Key UX requirements

- Provide inline frontmatter validation.
- Provide examples for description writing.
- Show file tree and markdown preview.
- Show validation errors with fix guidance.

## Flow 3: Upload and validate ZIP

```text
Open Import
  -> Upload ZIP
  -> System extracts safely
  -> System creates draft
  -> Validation runs
  -> User views report
  -> User fixes package or submits for review
```

### Key UX requirements

- Upload progress.
- Clear error state for invalid ZIP.
- Validation report grouped by severity.
- One-click open file at issue location where possible.

## Flow 4: Publish skill

```text
Open draft
  -> Run validation
  -> Resolve blocking issues
  -> Add changelog and license
  -> Submit for review
  -> Reviewer approves
  -> Skill appears in catalog
```

### Key UX requirements

- Disable submit button if validation has blocking errors.
- Show review status timeline.
- Notify author when review changes.

## Flow 5: Reviewer approves skill

```text
Open Admin Submissions
  -> Select submitted skill
  -> Inspect metadata and package files
  -> Review validation report
  -> Review security report
  -> Add notes
  -> Approve, reject, request changes, or block
```

### Key UX requirements

- Show diff if this is not the first version.
- Show dangerous files first.
- Provide reviewer checklist.
- Require notes for reject/block.

## Flow 6: Generate skill from prompt

```text
Open Builder
  -> Generate Skill
  -> Describe task
  -> Answer setup questions
  -> System creates draft
  -> User reviews generated files
  -> Run validation
  -> Edit and export
```

### Key UX requirements

- Make generated content clearly editable.
- Do not auto-publish generated skills.
- Encourage user to add examples and evals.

## Flow 7: Organization approval

```text
Member imports public skill
  -> Requests organization approval
  -> Reviewer checks package and reports
  -> Admin approves specific version
  -> Skill appears in private registry
```

### Key UX requirements

- Organization-approved status must be version-specific.
- Show policy requirements.
- Log all decisions.
