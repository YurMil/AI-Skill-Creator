# Design System Requirements

## Design principles

- Clear over decorative.
- Safety status always visible.
- Technical content must be readable.
- Actions must explain consequences.
- Warnings must be actionable.

## Core components

### Badge

Used for trust, risk, status, category, compatibility.

Required variants:

```text
trust-unverified
trust-scanned
trust-verified
trust-org-approved
risk-low
risk-medium
risk-high
risk-blocked
status-draft
status-submitted
status-approved
status-rejected
status-blocked
```

### Skill card

Fields:

- Title.
- Short description.
- Badges.
- Tags.
- Version.
- Updated date.
- Primary action.

### File tree

Capabilities:

- Expand/collapse folders.
- File type icon.
- Add/rename/delete.
- Dirty state.
- Validation issue marker.

### Code editor wrapper

Features:

- Syntax highlighting.
- Read-only mode.
- Inline validation.
- Copy button.
- File path display.

### Validation issue item

Fields:

- Severity icon.
- Error code.
- Message.
- Path.
- Suggested fix.
- Documentation link.

### Empty state

Required empty states:

- No catalog results.
- No drafts.
- No validation issues.
- No review submissions.
- No organization skills.

### Confirmation dialog

Required for:

- Delete draft.
- Delete file.
- Publish skill.
- Block skill.
- Change organization policy.

## Status colors

Use consistent color mapping, but never rely on color alone. Always include text labels and icons.

## Typography

- Use readable font sizes for documentation.
- Use monospace for code, paths, package names, and commands.
- Keep line length reasonable in article pages.

## Accessibility

- All interactive elements must be keyboard reachable.
- Badges need text labels.
- Forms need labels and errors.
- Modal dialogs must trap focus.
- Contrast must be sufficient.

## Content style

- Use short, direct labels.
- Prefer actionable error messages.
- Avoid vague warnings.
- Use examples for technical fields.

## Example validation message

```text
Invalid skill name
The name "CSV Analyzer" is not valid. Use lowercase hyphen-separated words, for example "csv-analyzer".
```
