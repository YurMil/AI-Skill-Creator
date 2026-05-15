# Open Questions

## Product questions

1. Should public downloads be allowed for unverified skills, or only for verified skills?
2. Should users be able to publish community skills without human review?
3. What is the minimum quality bar for public catalog listing?
4. Should ratings be enabled in MVP or delayed until beta?
5. Should skill generator be available before validation is mature?

## Technical questions

1. Should the frontend remain Vite-based or move to Next.js for SSR and docs?
2. Should the backend use Express, Fastify, NestJS, or another framework?
3. Should search use Meilisearch, OpenSearch, PostgreSQL full-text, or a hybrid?
4. Should semantic search use pgvector or external vector database?
5. Should ZIP export remain partly client-side for drafts or be fully server-side?

## Security questions

1. What file types are allowed in public skills?
2. Should scripts be allowed in public verified skills during MVP?
3. What sandbox isolation technology should be used for production?
4. What findings should automatically block publication?
5. How long should original uploaded archives be retained?

## Enterprise questions

1. Which SSO providers are required first?
2. Are organization policies global or project-specific?
3. Should organization admins be able to fork public skills into private registry?
4. Should private registry support external sharing?
5. What audit log retention period is required?

## Legal and compliance questions

1. What license options should be supported?
2. Should public skill authors be required to accept publishing terms?
3. How should takedown requests be handled?
4. Are there regulated industries that require special controls?
5. What data processing terms are required for enterprise customers?

## UX questions

1. How much of the package should be previewed before download?
2. How should validation errors be grouped in the editor?
3. Should beginner users see simplified builder mode?
4. Should canvas builder be part of MVP or beta?
5. How should high-risk warnings be presented without overwhelming users?
