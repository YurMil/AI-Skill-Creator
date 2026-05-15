# Skill Author Guide

## Goal

This guide helps authors create useful, safe, and reviewable skill packages.

## Basic structure

A simple skill package looks like this:

```text
my-skill/
└── SKILL.md
```

A more complete package may look like this:

```text
my-skill/
├── SKILL.md
├── README.md
├── LICENSE
├── references/
├── scripts/
├── assets/
├── examples/
└── evals/
```

## Write a good name

Good names are:

- Short.
- Lowercase.
- Hyphen-separated.
- Specific.

Good examples:

```text
csv-analysis-reporter
pdf-form-extractor
weekly-status-writer
```

Bad examples:

```text
Skill Helper
agent_skill_123
super-ai-everything
```

## Write a good description

The description should explain what the skill does and when it should be used.

Good example:

```yaml
description: analyze csv files and generate structured markdown reports. use when the user asks to inspect tabular data, summarize metrics, identify trends, or produce a report from csv input files.
```

Bad example:

```yaml
description: helps with files
```

## Use references for detailed knowledge

Do not put large manuals directly in `SKILL.md`. Put detailed information in `references/` and tell the agent when to read them.

Example:

```markdown
For detailed API field descriptions, read `references/api-schema.md`.
```

## Use scripts only when needed

Scripts are useful for deterministic operations such as parsing files, validating inputs, or transforming data. However, scripts increase risk and review effort.

Use scripts when:

- The task is repetitive and deterministic.
- Accuracy matters.
- Code is simpler than long instructions.

Avoid scripts when:

- The task is pure writing or summarization.
- The script performs broad file operations.
- The script requires unnecessary network access.

## Add examples

Examples help users and reviewers understand the skill.

Recommended file:

```text
examples/example-prompts.md
```

Include:

- Example user prompts.
- Expected behavior.
- Expected output style.

## Add evals

Evals help measure whether the skill works.

Recommended file:

```text
evals/evals.json
```

## Before publishing

Checklist:

- Name is valid.
- Description is specific.
- `SKILL.md` has clear workflow.
- References are linked correctly.
- Scripts are necessary and safe.
- No secrets are included.
- README explains usage.
- LICENSE is included for public skills.
- Validation passes.
- Security warnings are resolved or explained.

## Versioning

Use semantic versioning where possible:

```text
1.0.0 initial public release
1.1.0 backwards-compatible improvements
2.0.0 breaking changes
```

## Changelog

Every published version should include:

- What changed.
- Why it changed.
- Any compatibility notes.
- Any security notes.
