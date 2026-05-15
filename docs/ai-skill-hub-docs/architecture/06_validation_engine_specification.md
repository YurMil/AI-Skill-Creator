# Validation Engine Specification

## Purpose

The validation engine checks whether a skill package is structurally correct, readable, safe enough for review, and compatible with platform rules.

Validation is deterministic and rule-based. LLM-based suggestions may improve messages but must not replace deterministic checks.

## Validation lifecycle

```text
queued -> running -> passed | passed_with_warnings | failed | error
```

## Input

- Draft file tree.
- Uploaded ZIP.
- Skill version archive.

## Output

Validation report:

```json
{
  "status": "failed",
  "errors": [
    {
      "code": "MISSING_SKILL_MD",
      "path": null,
      "message": "The package must contain exactly one SKILL.md file.",
      "severity": "error"
    }
  ],
  "warnings": [],
  "checks": []
}
```

## Rule groups

### Package structure

- Archive can be extracted safely.
- No path traversal entries.
- Exactly one top-level folder.
- Exactly one `SKILL.md`.
- No duplicate paths after normalization.
- Folder name is valid.

### File limits

- Archive size within limit.
- File count within limit.
- Individual file sizes within limits.
- Text files are decodable.
- Unsupported binary files are blocked or warned.

### SKILL.md frontmatter

- YAML frontmatter exists.
- Frontmatter contains only allowed required fields for MVP.
- `name` exists.
- `description` exists.
- `name` follows naming rules.
- `description` is not empty.
- `description` meets minimum specificity rules.

### SKILL.md body

- Body exists.
- Body is not suspiciously short.
- Body does not contain obvious hidden behavior markers.
- Body references existing files where applicable.

### Resource references

- Links to local references resolve.
- Scripts referenced from `SKILL.md` exist.
- Assets referenced from `SKILL.md` exist.
- Broken relative references are warnings or errors depending on severity.

### Metadata

- Optional `metadata.json` is valid JSON.
- Compatibility values are from allowlist.
- License value is valid if provided.
- Category is valid if provided.

## Severity levels

### Error

Blocks publication and export as verified package.

### Warning

Allows export but requires attention before publication.

### Info

Provides improvement suggestion.

## Example error codes

```text
ZIP_EXTRACTION_FAILED
PATH_TRAVERSAL_DETECTED
MULTIPLE_TOP_LEVEL_FOLDERS
MISSING_SKILL_MD
MULTIPLE_SKILL_MD
INVALID_YAML_FRONTMATTER
MISSING_NAME
MISSING_DESCRIPTION
INVALID_SKILL_NAME
DESCRIPTION_TOO_VAGUE
ARCHIVE_TOO_LARGE
TOO_MANY_FILES
UNSUPPORTED_FILE_TYPE
BROKEN_LOCAL_REFERENCE
INVALID_METADATA_JSON
```

## MVP checks

The MVP must implement:

- ZIP safety extraction.
- Required file checks.
- YAML parsing.
- Name validation.
- Description validation.
- Size and file count limits.
- Basic broken reference detection.

## Post-MVP checks

- Deep script analysis.
- Dependency parsing.
- Eval coverage checks.
- Compatibility tests.
- Lint suggestions for `SKILL.md` quality.

## User-facing messages

Validation messages must be actionable.

Bad:

```text
Invalid package.
```

Good:

```text
The package does not contain SKILL.md. Add SKILL.md to the top-level skill folder and include YAML frontmatter with name and description.
```
