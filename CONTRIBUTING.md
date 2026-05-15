# Contributing

This repository uses a pull-request workflow for all non-trivial changes. Keep commits focused, make the CI signal meaningful, and avoid pushing directly to `main` except for urgent repository maintenance.

## Branch workflow

1. Update local main:

   ```bash
   git switch main
   git pull --ff-only origin main
   ```

2. Create a scoped branch:

   ```bash
   git switch -c feat/short-description
   ```

3. Make focused changes and commit intentionally.
4. Run the local quality gate before pushing:

   ```bash
   npm test
   npm run lint
   npm run build
   ```

5. Push the branch and open a pull request into `main`.
6. Merge only after CI passes and the PR description explains the change and validation.

## Branch naming

- `feat/...` for user-facing functionality.
- `fix/...` for bug fixes.
- `docs/...` for documentation-only changes.
- `chore/...` for tooling, CI, dependencies, and maintenance.
- `codex/...` for Codex-generated implementation branches.

## Commit style

Use Conventional Commit prefixes:

- `feat: add local skill package import`
- `fix: reject unsafe zip paths`
- `docs: document Cloudflare Pages deployment`
- `chore: add GitHub Actions CI`
- `test: cover validation smoke cases`

Prefer small commits that explain one logical change. Do not mix unrelated refactors, generated output, and feature work in the same commit.

## Pull request quality bar

Every PR should include:

- A concise summary of what changed.
- A short list of implementation changes.
- Validation results for `npm test`, `npm run lint`, and `npm run build`.
- Risk or rollout notes when behavior, deployment, or data handling changes.

## CI

GitHub Actions runs on pushes to `main` and scoped branches, and on pull requests targeting `main`. The CI job installs dependencies with `npm ci`, runs validation smoke tests, typechecks, builds the static Vite app, and uploads the `dist` artifact for inspection.

## Recommended repository settings

Configure branch protection for `main` in GitHub:

- Require a pull request before merging.
- Require the `Test, typecheck, and build` status check.
- Require branches to be up to date before merging.
- Block force pushes.
- Allow squash merge or rebase merge; avoid merge commits unless preserving a multi-commit history is important.
