# EntertainHub

EntertainHub is a `pnpm` + `Turborepo` monorepo that currently contains:

- `apps/api`: a NestJS API for anime and quotes data, backed by MongoDB and seeded data
- `apps/web`: an Angular frontend app that is still mostly scaffolded

The repository already has a solid monorepo foundation, and the API has meaningful custom work in it. The frontend and some project-level polish are still incomplete.

## Tech Stack

- Monorepo: `pnpm workspace` + `turbo`
- Language: `TypeScript`
- Backend: `NestJS`, `Mongoose`, `MongoDB`
- Frontend: `Angular 20`
- Tooling: `Prettier`, `ESLint`, `Jest`, `Karma`

## Workspace Structure

```text
.
├─ apps/
│  ├─ api/    # NestJS backend
│  └─ web/    # Angular frontend
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
└─ tsconfig.json
```

## What Is Already Built

### `apps/api`

The API is the most developed part of the repo. It already includes:

- MongoDB integration through `@nestjs/mongoose`
- global validation via `ValidationPipe`
- a global exception filter in `src/core`
- custom middleware and reusable utilities
- anime and quote CRUD endpoints
- search endpoints
- sorting endpoints
- random item endpoints
- a seeded data flow
- some DSA-inspired utilities like filtering, insertion sort, shuffle logic, tree building, and caching/interceptor-related structure

Current API prefix:

```text
/entertainhub/api
```

Examples of implemented routes inside the anime feature:

- `GET /entertainhub/api/anime`
- `GET /entertainhub/api/anime/search`
- `GET /entertainhub/api/anime/random`
- `GET /entertainhub/api/anime/sort`
- `GET /entertainhub/api/anime/top-10`
- `GET /entertainhub/api/anime/:id`
- `GET /entertainhub/api/anime/quote/search`
- `GET /entertainhub/api/anime/quote/sort`
- `GET /entertainhub/api/anime/quote/random`
- `GET /entertainhub/api/anime/quote/:id`
- `POST /entertainhub/api/anime`
- `POST /entertainhub/api/anime/:id/quote`
- `PATCH /entertainhub/api/anime/:id`
- `PATCH /entertainhub/api/anime/quote/:id`
- `DELETE /entertainhub/api/anime/:id`
- `DELETE /entertainhub/api/anime/quote/:id`

There is also a basic root API handler at:

- `GET /entertainhub/api`

### `apps/web`

The Angular app is created and bootstrapped, but it is still mostly starter code:

- app bootstrap is wired
- router is configured
- routes array is empty
- template only renders `<router-outlet />`
- app styles are effectively empty

In short: the frontend structure exists, but the actual product UI has not been built yet.

## Monorepo Commands

From the repository root:

```bash
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm format
```

App-specific commands:

```bash
pnpm --filter api dev
pnpm --filter api seed
pnpm --filter api seed:refresh
pnpm --filter web dev
```

## Environment Setup

The API expects a MongoDB connection string in `.env`.

Example:

```env
MongoDB_URL=mongodb://localhost:27017/entertainhub
PORT=3000
```

Without a valid `MongoDB_URL`, the API and seeding flow will not work.

## Project Status

### Strong parts

- good monorepo base with workspace + turbo
- clear split between frontend and backend
- API has real domain logic beyond scaffold code
- seed flow exists
- TypeScript path aliases are already being used in the API

### Still missing or incomplete

These are the main gaps I found while reviewing the repo:

1. The root `README.md` was empty.
2. The Angular frontend is still just a shell with no pages, no features, and no API integration.
3. There is no documented setup flow for local development, database bootstrapping, or expected environment variables.
4. There is no Swagger/OpenAPI or other API documentation yet.
5. There is no CI pipeline documented or included for lint, test, and build verification.
6. There are no shared packages yet, even though the monorepo structure could support them later.
7. There is no deployment documentation for either the API or the frontend.
8. There is no `.env.example`, which makes onboarding harder.
9. The root TypeScript aliases only cover `@api/*` and `@web/*`, while the API maintains its own feature aliases like `@core`, `@anime`, and `@seed`.
10. The API root response is still a simple greeting string, so health/info endpoints are not finalized yet.

## Issues Found During Verification

I checked the current scripts from the workspace root.

### `pnpm lint`

This currently fails in `apps/api` because ESLint tries to lint `test/app.e2e-spec.ts`, but that file is not included by the TypeScript project configuration used by ESLint.

### `pnpm build`

This could not be fully verified in this environment because the Angular build hit:

```text
spawn EPERM
```

That looks environment-related here, so it should be rechecked on a normal local shell.

### `pnpm test`

This also could not be fully verified in this environment because Jest hit:

```text
spawn EPERM
```

Again, that appears related to process spawning restrictions in this session rather than a confirmed application bug.

## Suggested Next Steps

If you want to turn this into a more complete project, the highest-value next steps are:

1. Build the Angular frontend pages and connect them to the API.
2. Add `.env.example`.
3. Fix the API lint configuration so test files are included correctly.
4. Add Swagger docs for the NestJS API.
5. Add a real health endpoint and project metadata endpoint.
6. Add CI for `lint`, `build`, and `test`.
7. Document seeding and first-run setup more explicitly.

## Notes About Key Root Files

- [`package.json`](/G:/entertain-hub/package.json): root scripts, tooling, package manager, and workspace-level commands
- [`pnpm-workspace.yaml`](/G:/entertain-hub/pnpm-workspace.yaml): includes `apps/*` in the workspace
- [`pnpm-lock.yaml`](/G:/entertain-hub/pnpm-lock.yaml): locked dependency graph for the monorepo
- [`tsconfig.json`](/G:/entertain-hub/tsconfig.json): shared root TypeScript defaults and root path aliases
- [`turbo.json`](/G:/entertain-hub/turbo.json): task pipeline for `dev`, `build`, `lint`, `test`, and `format`
- [`.gitignore`](/G:/entertain-hub/.gitignore): ignores Node, build, Angular, NestJS, logs, cache, and env artifacts

## Summary

EntertainHub already has a promising backend-focused foundation. The API contains real feature work and custom logic, but the frontend is still in the starter phase and the project still needs documentation, environment templates, API docs, CI, and some tooling cleanup to feel production-ready.
