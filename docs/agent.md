# Agent Notes

This project is deployed on Cloudflare Pages. Treat the production app as a static Vite build unless the repository explicitly adds Cloudflare Pages Functions under a supported functions directory.

## Deployment Constraints

- Cloudflare Pages serves static files from the build output. Do not assume that `server.ts` or any Express route exists in production.
- Frontend code must not call local Express-only endpoints such as `/api/skills` unless the same route is implemented as a Cloudflare Pages Function.
- Static runtime data should live under `public/` and be fetched by public URL. Catalog data loads from `/data/catalog.json`, knowledge base articles load from `/data/kb/articles.json`, and composer base skills load from `/data/skills.json`.
- Keep browser code compatible with a static hosting environment: no Node-only APIs in React components, Zustand store actions, or code that runs in the browser.
- Run `npm run build` before shipping changes. Cloudflare Pages should use the Vite output in `dist/`.

## Application Summary

AI Skill Hub is a local-first browser app for working with AI agent skill packages. Users can browse a static catalog, create packages from templates, edit package files, validate package structure, import/export ZIP files, keep local drafts in IndexedDB, run a local review workflow, read static knowledge base articles, and use the legacy React Flow composer for visual skill pack composition.

## Main Data Model

`src/types.ts` defines both legacy composer data and the package model:

- `Skill`: `id`, `name`, `description`, `category`, and markdown `content`.
- `ConfiguredSkill`: extends `Skill` with `cartId` for unique packed instances.
- `SkillPackage`: package metadata, files, validation report, local status, timestamps, and source.
- `SkillFile`: relative path, kind, mime, text or base64 binary content, and size.
- `ValidationReport` and `ValidationIssue`: deterministic validation output with error codes linked to knowledge base articles.

Base skills are loaded by `loadSkills()` in `src/store.ts` from `/data/skills.json`. The JSON shape is:

```json
{
  "skills": [
    {
      "id": "example",
      "name": "Example Skill",
      "description": "Short user-facing description.",
      "category": "Category",
      "content": "---\nname: Example Skill\n---\n# Instructions\n..."
    }
  ]
}
```

## State and Workflows

`src/store.ts` owns the React Flow composer state:

- `baseSkills`: the static skill library shown in the left sidebar.
- `nodes` and `edges`: React Flow canvas state.
- `addSkillToCanvas()`: creates a `skillNode` with copied skill data.
- `updateNodeContent()` and `updateNodeDetails()`: persist edits from the configuration panel.
- `removeNode()` and `clearCanvas()`: modify canvas state.
- `cart`: skills selected for export.
- `addToCart()`, `removeFromCart()`, and `clearCart()`: manage the skill pack sidebar.
- `combineSelectedNodes()`: creates a new custom skill by concatenating selected node contents.

Package workspace state is handled in `src/App.tsx` and persisted through `src/lib/storage.ts` using IndexedDB. Package import/export is in `src/lib/zip.ts`, validation is in `src/lib/validation.ts`, and package templates are in `src/lib/templates.ts`.

## UI Map

- `src/App.tsx`: top-level local-first app shell with Catalog, Builder, Import, Workspace, Review, Learn, and Composer screens.
- `src/components/LibrarySidebar.tsx`: loads base skills, filters them by search text, adds library or blank custom skills to the canvas.
- `src/components/Canvas.tsx`: renders React Flow, tracks selection, opens node editing on double-click, and combines selected nodes.
- `src/components/SkillNode.tsx`: custom React Flow node with edit, delete, and pack actions.
- `src/components/ConfigPanel.tsx`: edits selected node name, description, and markdown content.
- `src/components/CartSidebar.tsx`: exports packed skills using JSZip and file-saver. Each packed skill becomes `skills/<slug>/SKILL.md` inside `agent_skills.zip`.

## Local Development

- `npm run dev` starts Vite on port 3000.
- `npm run build` builds the static Vite frontend into `dist`.
- `npm run start` runs Vite preview on port 3000.
- `npm run lint` runs TypeScript validation with `tsc --noEmit`.

For Cloudflare Pages behavior, validate the static frontend path. Express routes are legacy/local-only and are not available on Cloudflare Pages by default.
