# API Specification

## API style

The initial API should be RESTful JSON over HTTPS. Public endpoints should be documented with OpenAPI.

## Authentication

Authenticated requests use bearer tokens or secure session cookies depending on chosen auth architecture.

## Common response format

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

## Common error format

```json
{
  "data": null,
  "meta": {},
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The uploaded package is invalid.",
    "details": []
  }
}
```

## Catalog endpoints

```http
GET /api/v1/skills
GET /api/v1/skills/:slug
GET /api/v1/skills/:slug/versions
GET /api/v1/skills/:slug/versions/:version
POST /api/v1/skills
PATCH /api/v1/skills/:slug
DELETE /api/v1/skills/:slug
```

### GET /api/v1/skills

Query parameters:

```text
q
category
tags
compatibility
trust_level
risk_level
license
page
limit
sort
```

Response:

```json
{
  "data": [
    {
      "slug": "csv-analysis-reporter",
      "title": "CSV Analysis Reporter",
      "short_description": "Analyze CSV files and generate markdown reports.",
      "category": "Data Analysis",
      "tags": ["csv", "reports"],
      "trust_level": "verified",
      "risk_level": "low",
      "latest_version": "1.0.0"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 1 },
  "error": null
}
```

## Search endpoints

```http
GET /api/v1/search
POST /api/v1/search/semantic
POST /api/v1/recommend
```

### POST /api/v1/recommend

Request:

```json
{
  "task": "I need a skill to analyze CSV files and produce an executive summary.",
  "agent_client": "openai-agents",
  "risk_tolerance": "low",
  "requires_scripts": false
}
```

## Builder endpoints

```http
POST /api/v1/drafts
GET /api/v1/drafts/:id
PATCH /api/v1/drafts/:id
DELETE /api/v1/drafts/:id
POST /api/v1/drafts/:id/files
PATCH /api/v1/drafts/:id/files/*path
DELETE /api/v1/drafts/:id/files/*path
POST /api/v1/drafts/:id/export/zip
POST /api/v1/drafts/:id/validate
POST /api/v1/drafts/:id/security-scan
```

## Upload and import endpoints

```http
POST /api/v1/uploads/skill-zip
POST /api/v1/import/github
GET /api/v1/import/jobs/:id
```

### POST /api/v1/uploads/skill-zip

Content type: `multipart/form-data`

Fields:

```text
file: .zip
visibility: private | public_draft
```

Response:

```json
{
  "data": {
    "upload_id": "uuid",
    "draft_id": "uuid",
    "validation_job_id": "uuid"
  },
  "error": null
}
```

## Validation endpoints

```http
POST /api/v1/skills/:slug/versions/:version/validate
GET /api/v1/validation-reports/:id
```

## Security endpoints

```http
POST /api/v1/skills/:slug/versions/:version/security-scan
GET /api/v1/security-reports/:id
```

## Review endpoints

```http
POST /api/v1/skills/:slug/versions/:version/submit-review
GET /api/v1/reviews
GET /api/v1/reviews/:id
POST /api/v1/reviews/:id/approve
POST /api/v1/reviews/:id/reject
POST /api/v1/reviews/:id/request-changes
POST /api/v1/reviews/:id/block
```

## Knowledge base endpoints

```http
GET /api/v1/kb/articles
GET /api/v1/kb/articles/:slug
POST /api/v1/kb/search
```

## Admin endpoints

```http
GET /api/v1/admin/submissions
GET /api/v1/admin/audit-logs
POST /api/v1/admin/categories
PATCH /api/v1/admin/categories/:id
```

## API versioning

- All public API endpoints must be prefixed with `/api/v1`.
- Breaking changes require a new version prefix.
- Internal endpoints should be separated or access-controlled.
