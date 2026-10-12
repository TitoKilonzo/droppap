import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { PERMISSION_LEVELS, PRINCIPAL_TYPES, RESOURCE_TYPES, SHARE_LINK_PERMISSION_LEVELS } from "@/lib/constants";
import { createdAt, id, timestamp } from "./_shared";
import { files } from "./files";
import { memberships, organizations } from "./organizations";

/**
 * resource_id and principal_id are polymorphic, so no foreign keys exist on them.
 * Services must verify that both belong to organization_id before inserting.
 */
export const permissions = sqliteTable(
  "permissions",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    resourceType: text("resource_type", { enum: RESOURCE_TYPES }).notNull(),
    resourceId: text("resource_id").notNull(),
    principalType: text("principal_type", { enum: PRINCIPAL_TYPES }).notNull(),
    principalId: text("principal_id").notNull(),
    permissionLevel: text("permission_level", { enum: PERMISSION_LEVELS }).notNull(),
    grantedByMembershipId: text("granted_by_membership_id")
      .notNull()
      .references(() => memberships.id, { onDelete: "restrict" }),
    expiresAt: timestamp("expires_at"),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("permissions_grant_unique").on(t.resourceType, t.resourceId, t.principalType, t.principalId),
    index("permissions_resource_idx").on(t.organizationId, t.resourceType, t.resourceId),
    index("permissions_principal_idx").on(t.organizationId, t.principalType, t.principalId),
  ],
);

export const shareLinks = sqliteTable(
  "share_links",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    fileId: text("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    /** SHA-256 of the random token. The raw token is shown once and never stored. */
    tokenHash: text("token_hash").notNull(),
    permissionLevel: text("permission_level", { enum: SHARE_LINK_PERMISSION_LEVELS }).notNull().default("view"),
    expiresAt: timestamp("expires_at").notNull(),
    maxDownloads: integer("max_downloads"),
    downloadCount: integer("download_count").notNull().default(0),
    revokedAt: timestamp("revoked_at"),
    createdByMembershipId: text("created_by_membership_id")
      .notNull()
      .references(() => memberships.id, { onDelete: "restrict" }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("share_links_token_hash_unique").on(t.tokenHash), index("share_links_file_idx").on(t.fileId)],
);
