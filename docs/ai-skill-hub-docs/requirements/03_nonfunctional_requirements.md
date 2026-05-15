# Nonfunctional Requirements

## Performance

### NFR-PERF-001

The public catalog page should load in less than 1 second under normal load.

### NFR-PERF-002

Full-text search should respond in less than 300 ms for common queries under normal load.

### NFR-PERF-003

Semantic search should respond in less than 1.5 seconds for common queries under normal load.

### NFR-PERF-004

Small skill ZIP export should complete in less than 3 seconds.

### NFR-PERF-005

Validation jobs should provide immediate queued status and update asynchronously.

## Scalability

### NFR-SCALE-001

The architecture should support at least 100,000 catalog skills without redesigning the data model.

### NFR-SCALE-002

Validation workers should scale horizontally.

### NFR-SCALE-003

Search indexing should run asynchronously and recover from failures.

## Availability

### NFR-AVAIL-001

Production target availability should be defined before public launch.

### NFR-AVAIL-002

Public catalog should degrade gracefully if recommendation service is unavailable.

### NFR-AVAIL-003

Archive downloads should remain available even if search indexing is delayed.

## Reliability

### NFR-REL-001

Version archives must be immutable after creation.

### NFR-REL-002

All state-changing operations must be transactional where possible.

### NFR-REL-003

Failed validation jobs must be retryable and visible to users.

## Security

### NFR-SEC-001

All uploaded archives must be scanned before publication.

### NFR-SEC-002

Sensitive actions must require authentication and authorization.

### NFR-SEC-003

Private organization skills must not be visible outside the organization.

### NFR-SEC-004

Secrets must never be logged or exposed in validation reports.

## Privacy

### NFR-PRIV-001

Private packages must be encrypted at rest where storage provider supports it.

### NFR-PRIV-002

Users must be able to delete drafts and private packages subject to retention policy.

## Accessibility

### NFR-A11Y-001

Core user flows should comply with WCAG 2.1 AA principles where feasible.

### NFR-A11Y-002

Keyboard navigation must work for catalog, forms, and editor basics.

### NFR-A11Y-003

Status badges must not rely on color alone.

## Maintainability

### NFR-MAINT-001

Validation rules must be modular and testable.

### NFR-MAINT-002

API contracts must be documented with OpenAPI.

### NFR-MAINT-003

The frontend must separate domain logic from presentation components.

## Observability

### NFR-OBS-001

The system must collect structured logs for uploads, validations, reviews, and downloads.

### NFR-OBS-002

The system must expose metrics for latency, error rate, queue depth, scan duration, and download volume.

## Portability

### NFR-PORT-001

The system should run locally with Docker Compose for development.

### NFR-PORT-002

Object storage should use an S3-compatible interface.
