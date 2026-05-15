# Agent Notes

This project is deployed on Cloudflare Pages. Treat the production app as a static Vite build unless the repository explicitly adds Cloudflare Pages Functions under a supported functions directory.

## Deployment Constraints

- Cloudflare Pages serves static files from the build output. Do not assume that `server.ts` or any Express route exists in production.
- Frontend code must not call local Express-only endpoints such as `/api/skills` unless the same route is implemented as a Cloudflare Pages Function.
- Static runtime data should live under `public/` and be fetched by public URL. The base skill library currently loads from `/data/skills.json`, backed by `public/data/skills.json`.
- Keep browser code compatible with a static hosting environment: no Node-only APIs in React components, Zustand store actions, or code that runs in the browser.
- Run `npm run build` before shipping changes. Cloudflare Pages should use the Vite output in `dist/`.

## Application Summary

Agent Skill Crafter is a visual editor for composing AI agent skill packs. Users select skills from a built-in library, add them to a React Flow canvas, edit their markdown instructions, combine selected nodes into a new skill, pack chosen skills into a sidebar, and download a zip archive containing `SKILL.md` files.

## Main Data Model

`src/types.ts` defines the shared skill data:

- `Skill`: `id`, `name`, `description`, `category`, and markdown `content`.
- `ConfiguredSkill`: extends `Skill` with `cartId` for unique packed instances.

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

`src/store.ts` owns the Zustand app state:

- `baseSkills`: the static skill library shown in the left sidebar.
- `nodes` and `edges`: React Flow canvas state.
- `addSkillToCanvas()`: creates a `skillNode` with copied skill data.
- `updateNodeContent()` and `updateNodeDetails()`: persist edits from the configuration panel.
- `removeNode()` and `clearCanvas()`: modify canvas state.
- `cart`: skills selected for export.
- `addToCart()`, `removeFromCart()`, and `clearCart()`: manage the skill pack sidebar.
- `combineSelectedNodes()`: creates a new custom skill by concatenating selected node contents.

## UI Map

- `src/App.tsx`: top-level layout with left library, center canvas, right cart, and floating config panel.
- `src/components/LibrarySidebar.tsx`: loads base skills, filters them by search text, adds library or blank custom skills to the canvas.
- `src/components/Canvas.tsx`: renders React Flow, tracks selection, opens node editing on double-click, and combines selected nodes.
- `src/components/SkillNode.tsx`: custom React Flow node with edit, delete, and pack actions.
- `src/components/ConfigPanel.tsx`: edits selected node name, description, and markdown content.
- `src/components/CartSidebar.tsx`: exports packed skills using JSZip and file-saver. Each packed skill becomes `skills/<slug>/SKILL.md` inside `agent_skills.zip`.

## Local Development

- `npm run dev` starts the local Express + Vite development server from `server.ts`.
- `npm run build` builds the static Vite frontend and also bundles `server.ts` into `dist/server.cjs`.
- `npm run start` runs the bundled Express server locally.
- `npm run lint` runs TypeScript validation with `tsc --noEmit`.

For Cloudflare Pages behavior, validate the static frontend path. Express routes are useful for local/server deployments only and are not available on Cloudflare Pages by default.
