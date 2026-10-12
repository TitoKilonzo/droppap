import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { AUDIT_OUTCOMES } from "@/lib/constants";
import { createdAt, id, timestamp } from "./_shared";
import { memberships, organizations, users } from "./organizations";

export const notifications = sqliteTable(
  "notifications",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    recipientMembershipId: text("recipient_membership_id")
      .notNull()
      .references(() => memberships.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    resourceType: text("resource_type"),
    resourceId: text("resource_id"),
    readAt: timestamp("read_at"),
    createdAt: createdAt(),
  },
  (t) => [index("notifications_recipient_idx").on(t.recipientMembershipId, t.readAt, t.createdAt)],
);

/**
 * Audit records must never contain file contents, passwords, raw share tokens,
 * presigned URLs or other secrets. Actor and organization references are nullable
 * and use set-null so records survive removal of the referenced rows.
 */
export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: id(),
    organizationId: text("organization_id").references(() => organizations.id, { onDelete: "set null" }),
    actorUserId: text("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    actorMembershipId: text("actor_membership_id").references(() => memberships.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id").notNull(),
    outcome: text("outcome", { enum: AUDIT_OUTCOMES }).notNull(),
    requestId: text("request_id").notNull(),
    metadataJson: text("metadata_json"),
    createdAt: createdAt(),
  },
  (t) => [
    index("audit_logs_org_created_idx").on(t.organizationId, t.createdAt),
    index("audit_logs_actor_idx").on(t.actorUserId, t.createdAt),
    index("audit_logs_resource_idx").on(t.resourceType, t.resourceId),
  ],
);
