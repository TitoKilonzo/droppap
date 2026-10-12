# Architecture

DropPap is a modular monolith. Boundaries, from the outside in:

1. UI: `src/app` (routes, layouts) and `src/components`. No database access.
2. HTTP: Route Handlers under `src/app/api/v1` (Milestone 2+). Validate with Zod, call services.
3. Services: `src/server/services`. Own business rules and authorization.
4. Repositories: `src/server/db/repositories`. The only place Drizzle queries live. Every query takes an organization id.
5. Adapters: `src/server/storage` (object storage), later email, rate limiting and malware scanning.
6. Shared: `src/lib` (errors, constants, utilities) usable on client and server.

Rules: UI never touches the database; services re-check permissions regardless of the UI; external systems are reached only through adapters; server-only modules import `server-only`.

## Current modules

- `server/env-schema.ts` pure Zod schema (testable); `server/env.ts` server-only accessor. Production requires https, a remote database and storage credentials.
- `server/db/create.ts` builds the Drizzle client and enables foreign keys. `client.ts` is the lazy per-process instance.
- `server/storage/types.ts` provider-neutral contract; `s3-adapter.ts` R2/S3 implementation; `keys.ts` server-generated, organization-prefixed object keys.
- `lib/errors` stable error codes with safe messages. Unknown errors never leak details.
