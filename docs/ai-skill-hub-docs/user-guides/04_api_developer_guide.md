# API Developer Guide

## Overview

The AI Skill Hub API allows developers to search skills, retrieve metadata, upload packages, run validation, and download approved versions.

## Authentication

Use bearer token authentication for API clients.

Example:

```http
Authorization: Bearer <token>
```

## Search skills

```http
GET /api/v1/skills?q=csv&trust_level=verified
```

Response:

```json
{
  "data": [
    {
      "slug": "csv-analysis-reporter",
      "title": "CSV Analysis Reporter",
      "trust_level": "verified",
      "latest_version": "1.0.0"
    }
  ],
  "meta": { "total": 1 },
  "error": null
}
```

## Get skill detail

```http
GET /api/v1/skills/csv-analysis-reporter
```

## Upload skill ZIP

```http
POST /api/v1/uploads/skill-zip
Content-Type: multipart/form-data
```

Fields:

```text
file=@skill.zip
visibility=private
```

## Run validation

```http
POST /api/v1/drafts/{draft_id}/validate
```

## Get validation report

```http
GET /api/v1/validation-reports/{report_id}
```

## Export draft ZIP

```http
POST /api/v1/drafts/{draft_id}/export/zip
```

## Download approved skill

```http
GET /api/v1/skills/{slug}/versions/{version}/download
```

The API may return a signed temporary URL or stream the archive directly.

## Error handling

All errors follow the common format:

```json
{
  "data": null,
  "meta": {},
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have access to this skill.",
    "details": []
  }
}
```

## Rate limits

API clients should expect rate limits on:

- Search.
- Upload.
- Validation.
- Download.
- Generation.

## Best practices

- Pin skill versions.
- Check trust level before download.
- Check validation and security status.
- Do not use unverified packages automatically.
- Store downloaded archive hash for reproducibility.
