# System Architecture

## Architecture style

The recommended initial architecture is a modular monolith with background workers. This keeps MVP delivery manageable while preserving clear boundaries for later service extraction.

## High-level components

```text
Browser Web App
      |
      v
API Service -------------------- Auth Provider
      |
      +---- PostgreSQL
      +---- Object Storage
      +---- Search Index
      +---- Vector Index
      +---- Queue
               |
               +---- Validation Worker
               +---- Security Scanner Worker
               +---- Import Worker
               +---- Indexing Worker
               +---- LLM Generation Worker
```

## Frontend

Recommended stack:

- React.
- TypeScript.
- Vite or Next.js depending on routing and SSR needs.
- Tailwind CSS.
- React Flow for visual canvas.
- Zustand or Redux Toolkit for client state.
- TanStack Query for server state.
- Monaco Editor or CodeMirror for editing `SKILL.md` and code files.

## Backend

Recommended stack:

- Node.js with NestJS, Fastify, or Express.
- PostgreSQL for relational data.
- S3-compatible object storage for archives and uploads.
- Meilisearch or OpenSearch for full-text search.
- pgvector or Qdrant for semantic search.
- BullMQ, Temporal, or similar queue system for async jobs.
- Docker-based sandbox for controlled validation in later phases.

## Core services

### API service

Handles authentication, authorization, CRUD operations, catalog, search gateway, uploads, builder state, review workflow, and user-facing APIs.

### Catalog service

Owns skill metadata, listing, filtering, public/private visibility, and category management.

### Builder service

Owns drafts, file tree manipulation, template generation, and package export.

### Validation service

Runs deterministic package checks and returns structured validation reports.

### Security scanner service

Analyzes instructions, scripts, dependencies, secrets, hidden files, and unsafe operations.

### Search indexer

Updates full-text and semantic indexes when skills, versions, or knowledge base articles change.

### Import service

Imports packages from ZIP uploads and external repositories.

### Knowledge base service

Manages documentation articles, search, and validation-error links.

## Data flow: create skill

1. User creates a skill from template.
2. API creates draft record.
3. Builder service initializes file tree.
4. User edits files.
5. User runs validation.
6. Validation job produces report.
7. User exports ZIP or submits for review.

## Data flow: upload skill

1. User uploads ZIP.
2. API stores original upload.
3. Import worker extracts safely into temporary storage.
4. Package structure is normalized.
5. Validation worker runs checks.
6. Draft or version is created.
7. User sees validation report.

## Data flow: publish skill

1. Author submits validated skill.
2. Review record is created.
3. Reviewer inspects package and reports.
4. Reviewer approves or rejects.
5. Approved skill becomes visible in catalog.
6. Search indexes are updated.

## Deployment units

MVP can deploy as:

- `web` container.
- `api` container.
- `worker` container.
- `postgres` managed database.
- `redis` queue.
- `object storage` bucket.
- `search` service.

## Future service extraction

Extract services only when needed:

- Validation workers.
- Security scanning workers.
- Search service.
- Organization governance service.
- Public API gateway.
