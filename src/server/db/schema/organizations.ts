import { type AnySQLiteColumn, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import {
  ACCOUNT_STATUSES,
  DEFAULT_STORAGE_QUOTA_BYTES,
  DEPARTMENT_ROLES,
  MEMBERSHIP_STATUSES,
  ORGANIZATION_ROLES,
  ORGANIZATION_STATUSES,
  PLATFORM_ROLES,
} from "@/lib/constants";
import { createdAt, id, timestamp, updatedAt } from "./_shared";

export const organizations = sqliteTable(
  "organizations",
  {
    id: id(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    status: text("status", { enum: ORGANIZATION_STATUSES }).notNull().default("active"),
    storageQuotaBytes: integer("storage_quota_bytes").notNull().default(DEFAULT_STORAGE_QUOTA_BYTES),
    /** Bytes held by available file versions. Maintained transactionally. */
    storageUsedBytes: integer("storage_used_bytes").notNull().default(0),
    /** Bytes reserved by pending upload sessions. Released on completion, expiry or abort. */
    storageReservedBytes: integer("storage_reserved_bytes").notNull().default(0),
    /** Days a trashed file is retained before purge. Null means the platform default applies. */
    trashRetentionDays: integer("trash_retention_days"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("organizations_slug_unique").on(t.slug), index("organizations_status_idx").on(t.status)],
);

export const users = sqliteTable(
  "users",
  {
    id: id(),
    name: text("name").notNull(),
    /** Stored lowercase. Uniqueness is enforced on this normalized value. */
    email: text("email").notNull(),
    emailVerifiedAt: timestamp("email_verified_at"),
    avatarKey: text("avatar_key"),
    accountStatus: text("account_status", { enum: ACCOUNT_STATUSES }).notNull().default("active"),
    /** Platform-level role. Grants no access to organization file contents. */
    platformRole: text("platform_role", { enum: PLATFORM_ROLES }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)],
);

export const memberships = sqliteTable(
  "memberships",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationRole: text("organization_role", { enum: ORGANIZATION_ROLES }).notNull().default("employee"),
    status: text("status", { enum: MEMBERSHIP_STATUSES }).notNull().default("active"),
    invitedBy: text("invited_by").references((): AnySQLiteColumn => memberships.id, { onDelete: "set null" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("memberships_org_user_unique").on(t.organizationId, t.userId),
    index("memberships_user_idx").on(t.userId),
    index("memberships_org_role_idx").on(t.organizationId, t.organizationRole),
  ],
);

export const departments = sqliteTable(
  "departments",
  {
    id: id(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("departments_org_slug_unique").on(t.organizationId, t.slug)],
);

export const departmentMemberships = sqliteTable(
  "department_memberships",
  {
    id: id(),
    departmentId: text("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "cascade" }),
    membershipId: text("membership_id")
      .notNull()
      .references(() => memberships.id, { onDelete: "cascade" }),
    departmentRole: text("department_role", { enum: DEPARTMENT_ROLES }).notNull().default("member"),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("department_memberships_unique").on(t.departmentId, t.membershipId),
    index("department_memberships_membership_idx").on(t.membershipId),
  ],
);
