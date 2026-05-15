# Functional Requirements

## FR-001: User authentication

The system shall allow users to register, log in, log out, and manage a basic profile.

### Acceptance criteria

- User can create an account.
- User can log in and access personal workspace.
- User cannot access private resources without permission.

## FR-002: Skill catalog

The system shall provide a catalog of public and private skills.

### Required capabilities

- List skills.
- Search skills.
- Filter by category, tag, compatibility, risk level, trust level, license, and author.
- Open skill detail page.
- Download approved skill archive.

## FR-003: Skill detail page

The system shall display full information about a selected skill.

### Required fields

- Name.
- Title.
- Description.
- Category.
- Tags.
- Author.
- Trust level.
- Risk level.
- Latest version.
- Version history.
- Package structure.
- `SKILL.md` preview.
- Changelog.
- Compatibility.
- Validation status.
- Security status.
- Download action.

## FR-004: Skill creation

The system shall allow authenticated users to create a skill from a template.

### Required capabilities

- Select template.
- Enter name and description.
- Generate folder structure.
- Edit `SKILL.md`.
- Add supporting files.
- Save draft.
- Export ZIP.

## FR-005: Skill editor

The system shall provide a browser-based editor for skill package files.

### Required capabilities

- File tree.
- Markdown editor.
- YAML frontmatter validation.
- Markdown preview.
- Add, rename, delete files.
- Basic file type restrictions.
- Unsaved change warning.

## FR-006: Visual skill builder

The system shall provide a canvas for composing skills into packs.

### Required capabilities

- Add skill node.
- Configure node metadata.
- Connect nodes.
- Group nodes.
- Export package or collection.
- Save canvas state.

## FR-007: Upload and import

The system shall support uploading a skill ZIP.

### Required capabilities

- Accept `.zip` file.
- Reject unsupported file types.
- Scan for package shape.
- Normalize folder structure.
- Create draft or version.
- Run validation.

## FR-008: Export and download

The system shall export skills as downloadable archives.

### Required capabilities

- Export current draft as ZIP.
- Export selected version as ZIP.
- Generate archive with a single top-level folder.
- Preserve file paths.
- Include only allowed files.

## FR-009: Validation engine

The system shall validate skill packages.

### Required checks

- Exactly one `SKILL.md` entrypoint.
- Valid YAML frontmatter.
- Required fields present.
- Skill name format valid.
- Description present and sufficiently specific.
- Package size within limits.
- File count within limits.
- No blocked file types.

## FR-010: Security scanner

The system shall scan skills for security risks.

### Required checks

- Prompt injection patterns.
- Policy bypass instructions.
- Hidden behavior.
- Destructive shell commands.
- Secrets and tokens.
- Suspicious network calls.
- Dependency risk markers.

## FR-011: Versioning

The system shall maintain immutable skill versions.

### Required capabilities

- Create version.
- Store archive snapshot.
- Store content hash.
- Store changelog.
- Compare versions.
- Restore previous version as draft.

## FR-012: Review workflow

The system shall allow submitted skills to be reviewed before public publication.

### Required statuses

- Draft.
- Submitted.
- Changes requested.
- Approved.
- Rejected.
- Deprecated.
- Blocked.

## FR-013: Knowledge base

The system shall provide knowledge base articles.

### Required capabilities

- List articles.
- Search articles.
- Link validation errors to articles.
- Provide code and package examples.

## FR-014: Admin panel

The system shall provide an admin interface for reviewers and platform admins.

### Required capabilities

- View submitted skills.
- Inspect validation and security reports.
- Approve or reject submissions.
- Manage categories and tags.
- Block unsafe packages.

## FR-015: Organization workspaces

The system shall support organization workspaces in post-MVP phases.

### Required capabilities

- Members.
- Roles.
- Private skills.
- Private registry.
- Approval policies.
- Audit logs.
