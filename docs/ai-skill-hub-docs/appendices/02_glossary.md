# Glossary

## Agent

An AI system that can plan, use tools, access context, and perform multi-step tasks.

## Skill

A reusable package of instructions and optional files that helps an agent perform a specific task or follow a workflow.

## SKILL.md

The main entrypoint file of a skill package. It contains YAML frontmatter and Markdown instructions.

## Frontmatter

A YAML block at the top of `SKILL.md` containing metadata such as `name` and `description`.

## Description

The metadata field that explains what the skill does and when it should be used.

## References

Supporting documents used by a skill when detailed knowledge is needed.

## Scripts

Executable code files included in a skill package for deterministic operations.

## Assets

Templates, images, or other files used as output resources or supporting artifacts.

## Evals

Test cases that measure whether a skill works as intended.

## Skill pack

A collection or composition of multiple skills.

## Catalog

The searchable registry of skills.

## Trust level

A label indicating the review and approval status of a skill.

## Risk level

A label indicating potential safety or security risk.

## Validation

Deterministic checks that determine whether a package follows structural and metadata rules.

## Security scan

Checks for malicious instructions, dangerous scripts, secrets, and risky behavior.

## Sandbox

An isolated environment for safely running scripts or evals.

## Private registry

An organization-scoped catalog of approved internal skills.

## Version pinning

Using a specific immutable skill version rather than automatically using the latest version.

## Review workflow

Process where a reviewer approves, rejects, requests changes, or blocks a submitted skill.

## Prompt injection

Instructions that attempt to manipulate an agent into ignoring higher-priority instructions, leaking data, or performing unsafe actions.

## Path traversal

An archive or file path attack that attempts to write files outside the intended extraction directory.
