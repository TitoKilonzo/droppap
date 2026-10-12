import { and, count, desc, eq, isNull, isNotNull, sql, sum } from "drizzle-orm";
import type { Database } from "../create";
import { auditLogs, departments, fileVersions, files, invitations, organizations } from "../schema";

export interface DepartmentUsage {
  departmentId: string | null;
  departmentName: string;
  fileCount: number;
  bytes: number;
}

export interface RecentActivityRow {
  id: string;
  action: string;
  resourceType: string;
  outcome: string;
  createdAt: Date;
}

export interface DashboardSnapshot {
  organization: { id: string; name: string; storageQuotaBytes: number; storageUsedBytes: number; storageReservedBytes: number };
  activeFileCount: number;
  pendingInvitationCount: number;
  departmentUsage: DepartmentUsage[];
  recentActivity: RecentActivityRow[];
}

/** Every query is scoped by organizationId. */
export async function loadDashboardSnapshot(db: Database, organizationId: string, now: Date = new Date()): Promise<DashboardSnapshot | null> {
  const [organization] = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      storageQuotaBytes: organizations.storageQuotaBytes,
      storageUsedBytes: organizations.storageUsedBytes,
      storageReservedBytes: organizations.storageReservedBytes,
    })
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);
  if (!organization) return null;

  const activeFiles = and(eq(files.organizationId, organizationId), eq(files.lifecycleStatus, "active"), isNull(files.deletedAt));

  const [fileTotals] = await db.select({ total: count() }).from(files).where(activeFiles);

  const [pending] = await db
    .select({ total: count() })
    .from(invitations)
    .where(
      and(
        eq(invitations.organizationId, organizationId),
        isNull(invitations.acceptedAt),
        isNull(invitations.revokedAt),
        sql`${invitations.expiresAt} > ${now.getTime()}`,
      ),
    );

  const usageRows = await db
    .select({
      departmentId: files.departmentId,
      departmentName: departments.name,
      fileCount: count(files.id),
      bytes: sum(fileVersions.sizeBytes),
    })
    .from(files)
    .innerJoin(fileVersions, eq(fileVersions.id, files.currentVersionId))
    .leftJoin(departments, eq(departments.id, files.departmentId))
    .where(and(activeFiles, isNotNull(files.currentVersionId)))
    .groupBy(files.departmentId, departments.name)
    .orderBy(desc(sum(fileVersions.sizeBytes)));

  const recentActivity = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      resourceType: auditLogs.resourceType,
      outcome: auditLogs.outcome,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .where(eq(auditLogs.organizationId, organizationId))
    .orderBy(desc(auditLogs.createdAt), desc(auditLogs.id))
    .limit(8);

  return {
    organization,
    activeFileCount: fileTotals?.total ?? 0,
    pendingInvitationCount: pending?.total ?? 0,
    departmentUsage: usageRows.map((row) => ({
      departmentId: row.departmentId,
      departmentName: row.departmentName ?? "Unassigned",
      fileCount: row.fileCount,
      bytes: Number(row.bytes ?? 0),
    })),
    recentActivity,
  };
}
