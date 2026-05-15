# Wireframes Specification

## Screen: Home

### Content blocks

1. Header with navigation.
2. Hero statement.
3. Global skill search input.
4. Primary actions: Browse Catalog, Create Skill, Learn Best Practices.
5. Featured verified skills.
6. Category grid.
7. Safety explanation.

### Required states

- Logged out.
- Logged in.
- Loading featured skills.
- Search empty state.

## Screen: Catalog

### Layout

```text
Header
Search bar
Filter sidebar | Results grid
Pagination
```

### Result card fields

- Title.
- Short description.
- Category.
- Tags.
- Trust badge.
- Risk badge.
- Compatibility chips.
- Latest version.

## Screen: Skill detail

### Layout

```text
Title and badges
Actions: Download, Fork, Add to Collection, Validate
Tabs: Overview | Files | Versions | Reviews | Security | Examples
Sidebar: metadata, author, license, compatibility
```

### Required warnings

- Unverified package.
- Deprecated version.
- High risk.
- Scripts present.
- Network behavior.

## Screen: Builder editor

### Layout

```text
Top bar: draft name, save status, validate, export, submit
Left: file tree
Center: editor
Right: preview/inspector
Bottom or panel: validation results
```

### Editor requirements

- Markdown syntax highlighting.
- YAML frontmatter highlight.
- Inline errors.
- File dirty state.
- Keyboard shortcuts.

## Screen: Canvas builder

### Layout

```text
Left: skill library
Center: canvas
Right: selected node configuration
Bottom: validation and export status
```

### Node visual states

- Normal.
- Selected.
- Warning.
- Invalid.
- Verified.
- Deprecated.

## Screen: Validation report

### Layout

```text
Status summary
Error count / warning count
Grouped issues
Suggested fixes
Links to documentation
```

### Issue item fields

- Severity.
- Code.
- Message.
- File path.
- Line if available.
- Suggested fix.
- Documentation link.

## Screen: Review detail

### Layout

```text
Submission summary
Package metadata
Validation report
Security report
File browser
Diff viewer
Reviewer checklist
Decision panel
```

### Decision panel

- Approve.
- Request changes.
- Reject.
- Block.
- Notes field.

## Screen: Knowledge base article

### Layout

```text
Article title
Summary
Table of contents
Body
Related validation errors
Related articles
```

## Responsive behavior

- Catalog filters collapse into drawer on mobile.
- Builder editor is desktop-first; mobile should show read-only or simplified editing.
- Admin screens are desktop-first.
