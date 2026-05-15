# Agent Skill Crafter

A visual editor for building AI agent skill packs. The app lets you choose reusable skills from a library, arrange and configure them on a canvas, then download the result as a ready-to-use zip archive.

## Features

- Built-in library of base agent skills.
- React Flow canvas for composing skills visually.
- Configuration panel for selected skill nodes.
- Skill pack sidebar with zip export.
- Local Express API that serves demo skill data.

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
cp .env.example .env.local
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

Starts the local Express + Vite development server.

```bash
npm run build
```

Builds the frontend and bundles the server entrypoint into `dist`.

```bash
npm run start
```

Runs the production build from `dist`.

```bash
npm run lint
```

Runs TypeScript validation without emitting files.

## Environment Variables

The project does not require AI provider keys for local development.

Optional variable:

```env
APP_URL="http://localhost:3000"
```

## Project Structure

```text
src/
  components/        Editor UI components
  App.tsx            Main application composition
  main.tsx           React entrypoint
  store.ts           Zustand store
  types.ts           Shared TypeScript types
server.ts            Express API and Vite middleware
vite.config.ts       Vite configuration
```

## Production

```bash
npm run build
npm run start
```

The server will run at `http://localhost:3000`.
