# AI Skill Hub

A local-first web app for discovering, creating, importing, validating, reviewing, and exporting AI agent skill packages. The production target is a static Vite build on Cloudflare Pages.

## Agent Notes

Before making changes, read [docs/agent.md](docs/agent.md). It summarizes the Cloudflare Pages deployment constraints, application structure, data flow, and key files for coding agents.

## Features

- Static catalog loaded from `public/data/catalog.json`.
- Browser-only skill package editor with file tree, markdown editing, preview, validation, and ZIP export.
- ZIP import with local path normalization and validation.
- IndexedDB workspace for local drafts, statuses, and backup import/export.
- Local review statuses for draft, validated, submitted, approved, rejected, and blocked packages.
- Knowledge base loaded from `public/data/kb/articles.json`.
- React Flow composer mode for visual skill pack composition.

## Tech Stack

- React 19
- TypeScript
- Vite
- Express
- Tailwind CSS
- React Flow
- Zustand
- JSZip

## Requirements

- Node.js 20 or newer
- npm

## Quick Start

```bash
npm install
npm run dev
```

The app will be available at:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the static frontend into `dist`.

```bash
npm run start
```

Runs a local Vite preview for the static production build.

```bash
npm run lint
```

Runs TypeScript validation without emitting files.

```bash
npm test
```

Runs validation smoke tests.

## Contribution Workflow

Use short-lived branches and pull requests into `main`. Before pushing a branch, run:

```bash
npm test
npm run lint
npm run build
```

GitHub Actions runs the same checks for pull requests and pushes to `main`. See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit style, PR expectations, and recommended branch protection settings.

## Environment Variables

The project does not require AI provider keys or backend secrets.

Optional variable:

```env
APP_URL="http://localhost:3000"
```

## Project Structure

```text
src/
  components/        UI components and screen views
  lib/               Local storage, validation, ZIP, templates, and catalog loaders
  App.tsx            Main application composition
  main.tsx           React entrypoint
  store.ts           Zustand store
  types.ts           Shared TypeScript types
public/data/catalog.json
                     Static catalog used by Cloudflare Pages
public/data/kb/articles.json
                     Static knowledge base articles
public/data/skills.json
                     Static library used by the visual composer
docs/agent.md        Notes for coding agents
server.ts            Legacy local/server entrypoint; not used by Cloudflare Pages production
vite.config.ts       Vite configuration
```

## Cloudflare Pages

```bash
npm run build
```

Use `dist` as the Pages output directory. The app is static-only in v1; no Express routes, Pages Functions, D1, KV, R2, auth provider, or server-side review workflow are required.
