# Prototype Migration Plan

## Purpose

This document explains how to evolve the existing visual skill builder prototype into a production-ready web application.

## Current prototype assumptions

The current prototype includes these useful building blocks:

- Visual canvas for combining skill nodes.
- Reusable skill library concept.
- Node configuration panel.
- ZIP generation/export flow.
- Frontend implemented with React and TypeScript.
- Modern UI stack with Tailwind-like styling.
- Canvas based on a graph library such as React Flow.
- Client-side ZIP generation using a ZIP library.

## Migration goal

Keep the working visual builder experience, but move persistence, validation, indexing, review, and package management into a backend system.

## Phase 1: Stabilize frontend domains

Refactor the frontend into clear modules:

```text
src/features/catalog
src/features/builder
src/features/canvas
src/features/editor
src/features/validation
src/features/review
src/features/kb
src/shared/ui
src/shared/api
src/shared/types
```

## Phase 2: Introduce backend API

Replace local demo data with API calls:

- `GET /api/v1/skills`
- `GET /api/v1/skills/:slug`
- `POST /api/v1/drafts`
- `PATCH /api/v1/drafts/:id`
- `POST /api/v1/drafts/:id/export/zip`
- `POST /api/v1/drafts/:id/validate`

## Phase 3: Move ZIP building to backend

Client-side ZIP export is useful for demo, but production export should be server-side so validation, logging, normalization, and consistent package construction are enforced.

Client-side preview can remain.

## Phase 4: Add database persistence

Persist:

- Users.
- Drafts.
- Skills.
- Versions.
- Reviews.
- Validation reports.
- Knowledge base articles.

## Phase 5: Add validation engine

Implement deterministic validation rules in a shared package:

```text
packages/skill-validator
```

Use it in:

- API service.
- Worker.
- Unit tests.
- CLI tools.

## Phase 6: Add public catalog and review

Public catalog should only show approved skills.

Reviewers should have a separate queue and package inspection screen.

## Phase 7: Add search and indexing

Start with database full-text search or Meilisearch. Add semantic search later.

## Phase 8: Add security scanning

Add static checks first, then sandbox execution.

## Migration risks

- Existing state shape may be too UI-specific.
- Client-only ZIP export may conflict with validation rules.
- Canvas composition model may not map cleanly to single skill package format.
- Demo skill metadata may be incomplete for real catalog needs.

## Mitigations

- Define shared TypeScript domain types.
- Keep visual canvas as a composition layer, not the source of truth for package structure.
- Add backend validation early.
- Use seed data that follows real package rules.
- Keep MVP package model simple.
