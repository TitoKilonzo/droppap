import { index, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { ORGANIZATION_ROLES } from "@/lib/constants";
import { createdAt, id, timestamp } from "./_shared";
import { departments, memberships, organizations, users } from "./organizations";

/** Local password credentials. Only a password hash (Argon2id, Milestone 2) is stored. */
export const passwordCredentials = sqliteTable("password_credentials", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  passwordHash: text("password_hash").notNull(),
  updatedAt: timestamp("updated_at").notNull().$defaultFn(() => new Date()),
});

/** Server-side sessions. The cookie carries a random token; only its hash is stored here. */
export const sessions = sqliteTable(
  "sessions",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at"),
    lastSeenAt: timestamp("last_seen_at"),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("sessions_token_hash_unique").on(t.tokenHash), index("sessions_user_idx").on(t.userId)],
);

export const invitations = sqliteTable(
  "invitations",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    organizationRole: text("organization_role", { enum: ORGANIZATION_ROLES }).notNull().default("employee"),
    departmentId: text("department_id").references(() => departments.id, { onDelete: "set null" }),
    tokenHash: text("token_hash").notNull(),
    invitedByMembershipId: text("invited_by_membership_id").references(() => memberships.id, { onDelete: "set null" }),
    expiresAt: timestamp("expires_at").notNull(),
    acceptedAt: timestamp("accepted_at"),
    revokedAt: timestamp("revoked_at"),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("invitations_token_hash_unique").on(t.tokenHash),
    index("invitations_org_email_idx").on(t.organizationId, t.email),
  ],
);

export const passwordResetTokens = sqliteTable(
  "password_reset_tokens",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    usedAt: timestamp("used_at"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("password_reset_tokens_hash_unique").on(t.tokenHash), index("password_reset_tokens_user_idx").on(t.userId)],
);
