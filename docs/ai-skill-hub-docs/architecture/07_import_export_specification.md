# Import and Export Specification

## Supported import sources

### MVP

- ZIP upload.
- Manual editor creation.

### Post-MVP

- GitHub repository URL.
- GitHub folder path.
- Raw `SKILL.md`.
- Existing public catalog fork.
- Documentation-to-skill generator.

## ZIP import rules

1. File must be a ZIP archive.
2. Archive must not exceed configured size limit.
3. Archive must be extracted using safe path normalization.
4. Path traversal entries must be rejected.
5. Package must contain a valid top-level skill folder.
6. Original upload must be stored for audit if policy allows.
7. Normalized package must be stored separately.
8. Validation must run automatically.

## GitHub import rules

1. User provides repository URL.
2. System verifies URL format.
3. User selects branch and folder path if needed.
4. System fetches files using integration credentials or public access.
5. System detects `SKILL.md`.
6. System creates draft or version.
7. Validation runs automatically.

## Export targets

### ZIP

Default export format. Must include a single top-level folder.

### Agent-compatible folder

Export as a folder intended for `.agents/skills/<skill-name>/` or similar local usage.

### OpenAI-compatible package

Export should preserve required package structure and metadata assumptions for OpenAI-compatible skill workflows.

### Generic Agent Skills package

Export should follow generic `SKILL.md` + resources package conventions.

### GitHub PR

Post-MVP flow for creating a pull request in a repository.

## Export ZIP rules

- Include exactly one top-level folder.
- Include `SKILL.md`.
- Preserve relative paths.
- Exclude temporary files.
- Exclude system metadata unless explicitly requested.
- Include README and LICENSE if present.
- Include generated `metadata.json` if enabled.

## Export naming

Recommended archive name:

```text
<skill-name>-<version>.zip
```

For draft export:

```text
<skill-name>-draft.zip
```

## Package normalization

The platform should normalize:

- Path separators.
- Duplicate slashes.
- Unsafe relative paths.
- Unsupported hidden files.
- Line endings for text files where safe.

## Import result statuses

```text
uploaded
extracting
normalized
validation_queued
validation_failed
ready_as_draft
ready_as_version
rejected
```

## Export result statuses

```text
queued
building
ready
failed
expired
```

## Download security

- Use signed URLs or authenticated streaming.
- Expire temporary download URLs.
- Log download events for private and verified public skills.
- Do not expose object storage internals in API responses.
