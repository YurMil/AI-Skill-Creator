# Validation Test Cases

## Valid package cases

### TC-V-001: Minimal valid skill

Package:

```text
minimal-skill/
└── SKILL.md
```

Expected result: passed.

### TC-V-002: Skill with references

Package:

```text
report-writer/
├── SKILL.md
└── references/
    └── style-guide.md
```

Expected result: passed.

### TC-V-003: Skill with scripts

Package:

```text
csv-transformer/
├── SKILL.md
└── scripts/
    └── transform.py
```

Expected result: passed with security warning if script scanner flags review requirement.

## Invalid package cases

### TC-V-101: Missing SKILL.md

Expected error: `MISSING_SKILL_MD`.

### TC-V-102: Multiple SKILL.md files

Expected error: `MULTIPLE_SKILL_MD`.

### TC-V-103: Invalid YAML frontmatter

Expected error: `INVALID_YAML_FRONTMATTER`.

### TC-V-104: Missing name

Expected error: `MISSING_NAME`.

### TC-V-105: Missing description

Expected error: `MISSING_DESCRIPTION`.

### TC-V-106: Invalid name with uppercase letters

Input name: `CSV Analyzer`.

Expected error: `INVALID_SKILL_NAME`.

### TC-V-107: Invalid name with spaces

Input name: `csv analyzer`.

Expected error: `INVALID_SKILL_NAME`.

### TC-V-108: Description too vague

Input description: `helps with tasks`.

Expected warning or error: `DESCRIPTION_TOO_VAGUE`.

### TC-V-109: Broken local reference

`SKILL.md` references `references/schema.md`, but file does not exist.

Expected warning: `BROKEN_LOCAL_REFERENCE`.

### TC-V-110: Archive too large

Expected error: `ARCHIVE_TOO_LARGE`.

### TC-V-111: Too many files

Expected error: `TOO_MANY_FILES`.

### TC-V-112: Unsupported file type

Package contains blocked binary file.

Expected error or warning depending on policy: `UNSUPPORTED_FILE_TYPE`.

### TC-V-113: Path traversal ZIP

Archive contains `../../evil.txt`.

Expected error: `PATH_TRAVERSAL_DETECTED`.

### TC-V-114: Multiple top-level folders

Archive contains:

```text
skill-a/
skill-b/
```

Expected error: `MULTIPLE_TOP_LEVEL_FOLDERS`.

## Edge cases

### TC-V-201: Empty SKILL.md body

Expected warning: body should provide usage instructions.

### TC-V-202: Very large SKILL.md

Expected warning or error depending on size threshold.

### TC-V-203: Non-UTF text file

Expected warning or rejection if file cannot be decoded.

### TC-V-204: Hidden file

Package contains `.env`.

Expected error if secrets detected, otherwise warning or blocked file type.

## Test fixture policy

Every validation rule must have at least one passing and one failing fixture.
