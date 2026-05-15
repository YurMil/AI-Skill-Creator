# MVP Definition

## MVP goal

Deliver a usable web application that lets users create, upload, validate, browse, and download skill packages, while giving reviewers basic control over public publication.

## MVP included scope

### Account and workspace

- User registration and login.
- Personal workspace.
- Basic user profile.

### Catalog

- Public skill list.
- Skill detail page.
- Category and tag filters.
- Download latest verified ZIP.

### Builder

- Create a new skill from template.
- Edit `SKILL.md` in browser.
- Add and remove files in `references/`, `scripts/`, and `assets/`.
- Preview package tree.
- Export ZIP.

### Upload

- Upload `.zip` skill package.
- Normalize and inspect package structure.
- Save original upload and normalized package.

### Validation

- Check that exactly one entrypoint exists.
- Check `SKILL.md` YAML frontmatter.
- Check naming convention.
- Check required fields.
- Check package size and file count.
- Show errors and warnings.

### Review

- Submit skill for review.
- Reviewer can approve, reject, request changes, or block.
- Public catalog shows only approved public skills.

### Knowledge base

- Minimum 10 articles covering skill structure, `SKILL.md`, description writing, examples, validation, safety, publishing, and troubleshooting.

## MVP excluded scope

- Paid marketplace and revenue sharing.
- Full enterprise SSO.
- Advanced sandbox execution.
- Arbitrary runtime execution for public users.
- Real-time collaborative editing.
- Automatic pull request creation.
- Complex vector-based recommendation.
- Dependency vulnerability database integration.
- Cryptographic package signing.

## MVP acceptance criteria

1. A user can create a skill from a template and download it as ZIP.
2. A user can upload a ZIP and receive validation results.
3. A user can fix validation errors inside the editor.
4. A reviewer can approve a skill and make it visible in the public catalog.
5. A public user can find and download an approved skill.
6. A basic admin panel exists for review management.
7. Documentation explains how to author a valid skill.

## MVP data requirements

- At least 20 seed skills in the catalog.
- At least 5 categories.
- At least 10 knowledge base articles.
- At least 20 validation test fixtures.

## MVP release risks

- Validation may be too weak and allow low-quality packages.
- Users may expect runtime execution, not just package management.
- Review workload may be underestimated.
- Generated packages may vary in quality unless templates are strong.

## MVP mitigation plan

- Clearly label the product as registry and builder, not runtime executor.
- Use strict validation defaults.
- Require review before public listing.
- Provide strong templates and examples.
- Keep public downloads limited to approved packages.
