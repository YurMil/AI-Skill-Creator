# Knowledge Base Editorial Plan

## Purpose

The knowledge base teaches users how to create, validate, review, and safely use LLM/agent skills.

## Target audiences

- Beginners learning what skills are.
- Authors creating packages.
- Developers integrating skills.
- Reviewers evaluating risk.
- Organization admins managing private registries.

## Article categories

```text
Getting Started
Skill Authoring
Validation
Security
Examples
Enterprise Governance
API and Integrations
Troubleshooting
```

## Initial article list

### Getting started

1. What are agent skills?
2. How AI Skill Hub works.
3. Your first skill package.
4. Understanding trust and risk badges.

### Skill authoring

5. How to write `SKILL.md`.
6. How to write a good skill description.
7. When to use `references/`.
8. When to use `scripts/`.
9. When to use `assets/`.
10. How to add examples.
11. How to add evals.

### Validation

12. Common validation errors.
13. Fixing invalid YAML frontmatter.
14. Package size and file limits.
15. Broken references and how to fix them.

### Security

16. Prompt injection risks in skill packages.
17. Safe script guidelines.
18. Avoiding secret leaks.
19. Understanding security scan results.
20. Why unverified skills are risky.

### Enterprise governance

21. How to create a private registry.
22. How organization approvals work.
23. Version pinning for production use.
24. Audit logs and incident response.

### API and integrations

25. Using the API to search skills.
26. Uploading skill packages through API.
27. Importing from GitHub.
28. Exporting to agent clients.

### Troubleshooting

29. My ZIP upload failed.
30. My skill is not appearing in search.
31. My skill was rejected.
32. How to deprecate a skill.

## Editorial guidelines

- Use practical examples.
- Keep articles focused.
- Link to relevant UI actions.
- Link validation errors to articles.
- Avoid unsupported claims.
- Update articles when validation rules change.

## Article template

```markdown
# Article title

## Summary

One short paragraph.

## When this matters

Explain context.

## Steps

1. Step one.
2. Step two.
3. Step three.

## Example

Show real package or code example.

## Common mistakes

List mistakes and fixes.

## Related articles

- Link 1
- Link 2
```

## Maintenance process

- Review KB articles before each major release.
- Add articles for top validation errors.
- Add troubleshooting articles for common support tickets.
- Mark outdated content clearly.
