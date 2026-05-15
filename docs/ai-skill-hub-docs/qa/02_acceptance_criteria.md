# Acceptance Criteria

## MVP acceptance criteria

### Account

- User can register and log in.
- User can log out.
- User can access personal dashboard.

### Catalog

- Guest can view approved public skills.
- Guest can filter by category and tags.
- Guest can open skill detail page.
- Guest can download approved skill ZIP if downloads are enabled.

### Builder

- Authenticated user can create a skill from template.
- User can edit `SKILL.md`.
- User can add files to allowed folders.
- User can save draft.
- User can export draft as ZIP.

### Upload

- User can upload valid ZIP.
- System rejects unsupported file types.
- System rejects unsafe archive paths.
- System creates draft from uploaded valid package.

### Validation

- System detects missing `SKILL.md`.
- System detects invalid YAML frontmatter.
- System detects missing name and description.
- System detects invalid skill name.
- System returns actionable errors.

### Review

- User can submit validated skill for review.
- Reviewer can view submission.
- Reviewer can approve.
- Reviewer can reject with notes.
- Approved skill appears in catalog.
- Rejected skill does not appear in catalog.

### Knowledge base

- User can browse articles.
- User can search articles.
- Validation errors link to relevant article where available.

## Production acceptance criteria

- Organization workspace exists.
- Private registry exists.
- RBAC enforced.
- Audit logs exist for sensitive actions.
- Security scanner integrated.
- Search index can be rebuilt.
- Backups tested.
- Monitoring dashboards configured.

## Quality bar

- No P0 bugs open.
- No known authorization bypass.
- No validation bypass for basic invalid packages.
- No public publication without approval.
- Documentation covers core flows.

## Definition of done for a feature

- Requirements implemented.
- Unit tests added.
- Integration tests added where applicable.
- UI state tested.
- Error states handled.
- Accessibility basics checked.
- Documentation updated if user-facing.
- Observability added for critical backend paths.
