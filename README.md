# DropPap

Corporate cloud file management: organization workspaces, departments, versioned private file storage, sharing and audit logging.

Status: Milestone 1 (foundation) is complete. See "What works today" and "Not built yet".

## Stack

- Next.js 15 (App Router), React 19, strict TypeScript
- Tailwind CSS 4, Lucide React
- Drizzle ORM with Turso (libSQL)
- Zod for validation
- S3-compatible private object storage (Cloudflare R2)
- Vitest and Playwright for testing

## Prerequisites

- Node.js 22 or newer (see `.nvmrc`)
- npm 10 or newer
- Git

Optional for later milestones and production:

- A Turso account and the Turso CLI
- A Cloudflare R2 bucket (or another S3-compatible private bucket)

## Local setup

1. Get the code and enter the folder.

```bash
   cd droppap
```

2. Use the right Node version (optional, if you use nvm).

```bash
   nvm use
```

3. Install dependencies.

```bash
   npm install
```

4. Create your local environment file.

```bash
   cp .env.example .env.local
```

5. Edit `.env.local` and set at least these values:

```bash
   NODE_ENV=development
   APP_URL=http://localhost:3000
   AUTH_SECRET=<at least 32 random characters>
   DATABASE_URL=file:./local.db
   ALLOW_DEV_WORKSPACE=true
```

   Generate a secret with:

```bash
   openssl rand -base64 48
```

   `ALLOW_DEV_WORKSPACE=true` is a temporary Milestone 1 bridge that lets the dashboard read a seeded development organization before sign-in exists. It is rejected in production.

6. Apply the database migrations.

```bash
   npm run db:migrate
```

7. Seed the empty development organization (3 departments, no users, no files).

```bash
   npm run db:seed
```

8. Start the development server.

```bash
   npm run dev
```

9. Open http://localhost:3000. Public pages are at `/`, `/about` and `/contact`; the login and registration previews are at `/login` and `/register`. The dashboard is at `/dashboard`. A new organization correctly shows zero files and empty states.

Migrations are never run automatically on application startup. Always run `npm run db:migrate` yourself.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | yes | `development`, `test` or `production` |
| `APP_URL` | yes | Public application origin. Must be https in production |
| `AUTH_SECRET` | yes | Secret of at least 32 characters |
| `DATABASE_URL` | yes | `file:./local.db` for development, `libsql://...` for Turso |
| `DATABASE_AUTH_TOKEN` | remote DB | Turso database token |
| `STORAGE_ENDPOINT` | production | S3-compatible endpoint (R2: `https://<account-id>.r2.cloudflarestorage.com`) |
| `STORAGE_REGION` | no | Use `auto` for R2 |
| `STORAGE_BUCKET` | production | Private bucket name |
| `STORAGE_ACCESS_KEY_ID` | production | Storage access key |
| `STORAGE_SECRET_ACCESS_KEY` | production | Storage secret key |
| `STORAGE_PUBLIC_BASE_URL` | no | Only for a dedicated isolated preview origin. Never a public bucket |
| `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM` | later | Email delivery |
| `RATE_LIMIT_PROVIDER_URL`, `RATE_LIMIT_PROVIDER_TOKEN` | later | Rate limiting |
| `MALWARE_SCAN_PROVIDER_URL`, `MALWARE_SCAN_PROVIDER_TOKEN` | later | Malware scanning |
| `ALLOW_DEV_WORKSPACE` | no | Development bridge. Must be `false` in production |

The application validates these at startup and fails safely in production if anything mandatory is missing or insecure. Never put server credentials in `NEXT_PUBLIC_` variables and never commit `.env.local`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the strict TypeScript check |
| `npm test` | Run unit tests |
| `npm run test:integration` | Run database-backed tests on a temporary libSQL file |
| `npm run test:e2e` | Run Playwright browser tests |
| `npm run verify` | Lint, typecheck, unit and integration tests |
| `npm run db:generate` | Generate a migration from schema changes |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:seed` | Seed the development organization (refuses to run in production) |

## Running the tests

```bash
npm run verify
```

For browser tests, install the browsers once, then run:

```bash
npx playwright install chromium
npm run test:e2e
```

Integration tests create and delete a temporary database. They never touch your `local.db`.

## Production setup

1. Create the Turso database and a token.

```bash
   turso db create droppap
   turso db show droppap --url
   turso db tokens create droppap
```

2. Create a private R2 bucket. Do not enable public access. Add a CORS rule for your exact production origin allowing `PUT` and `GET` and the `Content-Type` header.

3. Copy the values from `.env.production.example` into your host's secret manager and fill them in. Use an https `APP_URL`, the `libsql://` database URL and token, and the storage credentials. Set `ALLOW_DEV_WORKSPACE=false`.

4. Run the checks.

```bash
   npm ci
   npm run verify
   npm run build
```

5. Apply migrations explicitly against the production database.

```bash
   DATABASE_URL=libsql://... DATABASE_AUTH_TOKEN=... npm run db:migrate
```

6. Deploy to a Next.js-compatible Node host over HTTPS, then smoke check: load `/`, confirm the security headers, and confirm `/dashboard` responds.

Do not expose a production instance to real users until authentication ships (Milestone 2). See `docs/deployment.md` for rotation and recovery.

## Project structure

```text
src/
  app/            Routes and layouts (marketing, workspace, api/v1 later)
  components/     ui, brand, layout, dashboard
  lib/            errors, constants, utilities (client and server safe)
  server/
    db/           schema, migrations, repositories, client
    storage/      storage adapter interface, S3/R2 adapter, object keys
    auth/         tenant and session resolution (Milestone 2)
    services/     business rules
  styles/         design tokens
public/           favicon, icons, manifest
tests/            unit, integration, e2e
docs/             architecture, database, security, API, deployment, trade-offs
```

## What works today

- Public home, about and contact pages with shared navigation/footer; login and registration preview screens.
- Branded loading, not-found and error pages.
- Workspace shell with responsive navigation and a mobile drawer.
- Dashboard backed by real queries: active files, storage used and available, pending invitations, storage by department and recent audit activity.
- Initial schema and migration (19 tables including auth tables), validated environment, typed error model, storage adapter interface with an S3/R2 implementation and server-generated object keys.
- SVG logo, favicon, PNG icons and web app manifest.

## Not built yet

- Authentication and tenant resolution (Milestone 2). The login and registration pages are UI previews only and do not submit or store credentials.
- Folders, files, uploads and downloads (Milestone 3)
- Sharing and permissions (Milestone 4)
- Search, activity pages, service worker and offline page (Milestone 5)
- Playwright workflows and deployment verification (Milestone 6)

Until Milestone 2, `/dashboard` resolves the seeded dev organization only when `ALLOW_DEV_WORKSPACE=true`. Otherwise it shows a "No workspace is available" state. The S3 adapter has not been tested against a real bucket, so test it independently before relying on it.

## Troubleshooting

- "Invalid environment configuration": a value in `.env.local` is missing or invalid. The message names the variable.
- "No workspace is available" on `/dashboard`: run `npm run db:seed` and set `ALLOW_DEV_WORKSPACE=true`, then restart the dev server.
- Migration errors on an old `local.db`: delete `local.db` and run `npm run db:migrate` and `npm run db:seed` again (development only).
- `npm run start` fails locally: production mode rejects http URLs and file databases by design. Use `npm run dev` locally.

## Docs

`docs/architecture.md`, `docs/database-design.md`, `docs/security.md`, `docs/api-reference.md`, `docs/deployment.md`, `docs/tradeoffs.md`.
