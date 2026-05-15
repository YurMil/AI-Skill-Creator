# Information Architecture

## Top-level navigation

```text
Home
Catalog
Builder
Knowledge Base
Collections
Dashboard
Admin
```

## Home

Purpose: explain value proposition and direct users to search, build, or learn.

Sections:

- Hero.
- Search bar.
- Featured verified skills.
- Popular categories.
- How it works.
- Safety and validation.
- Call to action.

## Catalog

Purpose: browse and find skills.

Pages:

```text
/catalog
/catalog/:category
/skills/:slug
/skills/:slug/versions/:version
/collections/:slug
```

## Builder

Purpose: create and configure skills.

Pages:

```text
/builder
/builder/new
/builder/drafts/:id
/builder/canvas/:id
/builder/import
/builder/generate
```

## Dashboard

Purpose: manage user's own work.

Pages:

```text
/dashboard
/dashboard/drafts
/dashboard/skills
/dashboard/submissions
/dashboard/downloads
/dashboard/settings
```

## Knowledge Base

Purpose: teach best practices.

Pages:

```text
/learn
/learn/what-are-skills
/learn/skill-structure
/learn/writing-descriptions
/learn/validation
/learn/security
/learn/evaluations
```

## Admin

Purpose: review and governance.

Pages:

```text
/admin
/admin/submissions
/admin/reviews/:id
/admin/skills
/admin/categories
/admin/audit-logs
/admin/settings
```

## Organization workspace

Post-MVP:

```text
/org/:slug
/org/:slug/registry
/org/:slug/members
/org/:slug/policies
/org/:slug/audit-logs
/org/:slug/reviews
```

## Navigation principles

- Catalog and Builder must be primary entry points.
- Validation results must link directly to relevant docs.
- Skill cards must clearly show risk and trust levels.
- Private and public contexts must be visually distinct.
- Admin actions must be separated from normal user actions.
