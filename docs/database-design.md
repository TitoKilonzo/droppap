# Database design

Turso (libSQL) with Drizzle. IDs are server-generated UUID strings. Timestamps are UTC integer milliseconds. Migrations live in `src/server/db/migrations`.

Tables: organizations, users, memberships, departments, department_memberships, folders, files, file_versions, tags, file_tags, permissions, share_links, upload_sessions, notifications, audit_logs, plus auth tables password_credentials, sessions, invitations, password_reset_tokens.

Additions beyond the specification:
- `organizations.storage_used_bytes`, `storage_reserved_bytes`: quota accounting maintained in transactions.
- `organizations.trash_retention_days`: retention policy.
- `users.platform_role`: platform administration, which grants no file-content access.

## Invariants the database cannot enforce (services must, with tests)

- `files.current_version_id` has no foreign key because files and file_versions reference each other. Set in the same transaction that makes a version available.
- `permissions.resource_id` and `principal_id` are polymorphic. Verify organization ownership before insert.
- Folder parent must share the organization and respect department boundaries; cycles are rejected before moves.
- `memberships.invited_by` and similar actor references use set-null so history survives removals.

## Tenant isolation

Every table that holds tenant data carries `organization_id` and repositories filter on it. Cross-tenant rejection tests are added with the first tenant-scoped service (Milestone 2).
