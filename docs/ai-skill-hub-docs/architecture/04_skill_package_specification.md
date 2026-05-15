# Skill Package Specification

## Purpose

This document defines the internal package format supported by AI Skill Hub. The format is designed to be compatible with common agent skill patterns while allowing the platform to validate, index, and govern packages.

## Package layout

A skill package must contain one top-level folder.

```text
skill-name/
├── SKILL.md
├── README.md              # optional but recommended
├── LICENSE                # recommended for public skills
├── references/            # optional
├── scripts/               # optional
├── assets/                # optional
├── examples/              # optional
├── evals/                 # optional
└── metadata.json          # optional platform metadata
```

## Required file: SKILL.md

`SKILL.md` is the entrypoint and must contain YAML frontmatter followed by Markdown instructions.

Minimum frontmatter:

```yaml
---
name: csv-analysis-reporter
description: analyze csv files and generate structured markdown reports. use when the user asks to inspect tabular data, summarize metrics, identify trends, or produce a report from csv input files.
---
```

## Naming rules

- Folder name and frontmatter `name` should match.
- Name must be lowercase.
- Use hyphen-separated words.
- Avoid spaces and underscores.
- Avoid the word `skill` unless necessary.
- Use a descriptive but short name.

## Description rules

The description is the main discovery and activation hint. It must:

- Explain what the skill does.
- Explain when it should be used.
- Include concrete task contexts.
- Avoid vague phrases such as "does everything".
- Avoid hidden instructions.
- Avoid policy-bypass claims.

## SKILL.md body guidance

The body should include:

- Execution workflow.
- Required assumptions.
- How to use references, scripts, and assets.
- Output expectations.
- Validation or quality checks.
- Examples if concise.

The body should not become a large knowledge dump. Long domain information should be moved to `references/` and linked from `SKILL.md`.

## references/

Use `references/` for documents that the agent may read when needed:

```text
references/
├── schema.md
├── api.md
├── style-guide.md
└── examples.md
```

Recommended for:

- API schemas.
- Domain rules.
- Detailed instructions.
- Templates.
- Best practices.

## scripts/

Use `scripts/` for deterministic operations:

```text
scripts/
├── validate_input.py
├── transform_csv.py
└── package_report.py
```

Scripts must be reviewed more strictly because they may affect files, network, or execution environment.

## assets/

Use `assets/` for output assets and templates:

```text
assets/
├── report-template.md
├── slide-template.pptx
└── logo.png
```

Assets should not contain hidden executable behavior.

## examples/

Use `examples/` to show concrete usage:

```text
examples/
├── example-prompts.md
└── expected-outputs.md
```

## evals/

Use `evals/` for test cases:

```text
evals/
├── evals.json
└── fixtures/
```

Example eval:

```json
{
  "id": "eval-001",
  "prompt": "Analyze sales.csv and produce a markdown report.",
  "input_files": ["fixtures/sales.csv"],
  "expected_checks": [
    "output contains total revenue",
    "output contains at least three insights"
  ]
}
```

## metadata.json

Optional platform metadata:

```json
{
  "category": "Data Analysis",
  "tags": ["csv", "reporting"],
  "compatibility": ["openai-agents", "agent-skills"],
  "license": "MIT",
  "min_platform_version": "1.0.0"
}
```

## Package limits

Recommended MVP limits:

- Maximum archive size: 25 MB.
- Maximum file count: 500.
- Maximum `SKILL.md` size: 500 KB.
- Maximum individual text file size: 2 MB.
- Block nested archives by default until reviewed.

## Blocked file patterns

The MVP should block or require review for:

- Executable binaries.
- Hidden dotfiles except allowlisted files.
- Nested archives.
- Large unknown binary files.
- Files with suspected secrets.
- Files with path traversal patterns.

## Compatibility metadata

Supported compatibility values should include:

```text
openai-agents
codex
anthropic-agent-skills
mcp-compatible
local-cli-agent
custom
```

## Trust metadata

Trust level is assigned by platform workflow, not by author self-declaration.
