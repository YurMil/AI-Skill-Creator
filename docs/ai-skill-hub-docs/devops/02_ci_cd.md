# CI/CD Specification

## Goals

- Prevent broken builds.
- Enforce code quality.
- Run tests automatically.
- Validate migrations.
- Scan dependencies.
- Produce reproducible deployments.

## CI pipeline

### On pull request

1. Install dependencies.
2. Run format check.
3. Run lint.
4. Run typecheck.
5. Run unit tests.
6. Run validator fixture tests.
7. Run API contract tests where available.
8. Build web app.
9. Build API.
10. Run dependency security scan.

### On merge to main

1. Run full CI.
2. Build container images.
3. Push images to registry.
4. Deploy to staging.
5. Run smoke tests.

### On release tag

1. Build production images.
2. Run migrations in controlled step.
3. Deploy production.
4. Run smoke tests.
5. Create release notes.

## Required checks

- No TypeScript errors.
- No failing unit tests.
- No invalid migration.
- No high-severity dependency issue without override.
- No broken OpenAPI generation.

## Test categories in CI

```text
unit
integration
validator-fixtures
api-contract
frontend-component
e2e-smoke
security-static
```

## Artifacts

CI should store:

- Test reports.
- Coverage reports.
- Built packages.
- OpenAPI spec.
- Container image digests.

## Database migrations

- Use migration tool.
- Migrations must be reviewed.
- Avoid destructive changes without explicit approval.
- Support rollback or forward-fix plan.

## Environment promotion

```text
feature branch -> pull request -> main -> staging -> production
```

## Secrets in CI

- Do not expose production secrets to pull requests.
- Use separate staging credentials.
- Mask secrets in logs.
- Rotate CI credentials regularly.

## Release notes

Every release should include:

- Features.
- Fixes.
- Migration notes.
- Security notes.
- Known issues.
