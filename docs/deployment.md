# Deployment

Status: covers what exists after Milestone 1. Authentication, uploads and sharing are not deployable features yet, so do not expose a production instance to real users.

## Steps

1. Install: `npm ci` (Node 22, see `.nvmrc`).
2. Configure: copy `.env.production.example` into your host's secret manager and fill every value. In production the app refuses to start with an http `APP_URL`, a local file database, `ALLOW_DEV_WORKSPACE=true`, or missing storage credentials.
3. Create the Turso database and token: `turso db create droppap`, `turso db tokens create droppap`.
4. Migrate explicitly from a trusted machine or CI job: `DATABASE_URL=... DATABASE_AUTH_TOKEN=... npm run db:migrate`. Never migrate on startup. Back up before destructive changes.
5. Create a private R2 bucket. Do not enable public access. Configure CORS for the exact production origin with `PUT` and `GET`, and allow the `Content-Type` header.
6. Verify: `npm run lint && npm run typecheck && npm test && npm run test:integration`, then `npm run build`.
7. Deploy to a Next.js-compatible host (Node runtime). Serve over HTTPS only.
8. Smoke check: load `/`, confirm security headers, confirm `/dashboard` shows the "No workspace is available" state (sign-in arrives in Milestone 2).

## Rotation and recovery

- Rotate `AUTH_SECRET`, storage keys and the Turso token by creating the new value, updating the host secret, redeploying, then revoking the old one.
- Restore from a Turso backup or point-in-time branch, then redeploy against the restored database.

## Not yet verified

Storage uploads and downloads, email delivery, rate limiting and malware scanning are untested against real providers.
