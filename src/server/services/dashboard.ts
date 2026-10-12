import "server-only";
import { getDb } from "../db/client";
import { loadDashboardSnapshot, type DashboardSnapshot } from "../db/repositories/dashboard";

export async function getDashboardSummary(organizationId: string): Promise<DashboardSnapshot | null> {
  const db = await getDb();
  return loadDashboardSnapshot(db, organizationId);
}
