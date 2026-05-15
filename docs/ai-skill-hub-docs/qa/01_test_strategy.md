# Test Strategy

## Goals

- Verify core product flows.
- Prevent invalid skill packages from passing validation.
- Prevent unsafe packages from being published.
- Ensure stable API and UI behavior.
- Support confident releases.

## Test levels

### Unit tests

Targets:

- Validation rules.
- Package normalization.
- Search ranking helpers.
- Permission checks.
- API service functions.

### Integration tests

Targets:

- API + database.
- Upload + object storage.
- Queue + worker.
- Search indexing.
- Auth and authorization.

### End-to-end tests

Targets:

- Create skill and export ZIP.
- Upload invalid ZIP and see errors.
- Submit skill for review.
- Approve and download skill.
- Search catalog.

### Security tests

Targets:

- Path traversal.
- ZIP bomb limits.
- Secret detection.
- Prompt injection samples.
- Script dangerous command detection.
- Authorization bypass attempts.

### Performance tests

Targets:

- Catalog search.
- Upload throughput.
- Validation queue.
- ZIP export.
- Skill detail page.

## Test environments

- Local developer environment.
- CI ephemeral environment.
- Shared staging environment.
- Production smoke checks.

## Test data

Maintain fixtures:

```text
tests/fixtures/valid-skills
tests/fixtures/invalid-skills
tests/fixtures/malicious-skills
tests/fixtures/large-archives
tests/fixtures/edge-cases
```

## Regression suite

Every bug in validation or security must produce a new fixture and regression test.

## Manual QA focus

- Builder usability.
- Validation message clarity.
- Review workflow.
- File editor behavior.
- Canvas interactions.

## Release testing

Before release:

- Full automated test suite passes.
- Smoke tests pass on staging.
- MVP acceptance criteria reviewed.
- Security fixtures pass.
- Documentation reviewed.
