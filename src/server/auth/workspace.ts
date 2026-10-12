import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "../db/client";
import { organizations } from "../db/schema";
import { getEnv } from "../env";

/**
 * MILESTONE 1 BRIDGE. Authentication and tenant resolution arrive in Milestone 2.
 * Until then, the workspace shell can read the seeded development organization when
 * ALLOW_DEV_WORKSPACE=true. The environment schema rejects that flag in production,
 * and this function must be replaced by session-based resolution.
 */
export async function resolveWorkspaceOrganizationId(): Promise<string | null> {
  const env = getEnv();
  if (!env.ALLOW_DEV_WORKSPACE || env.NODE_ENV === "production") return null;
  const db = await getDb();
  const [org] = await db.select({ id: organizations.id }).from(organizations).where(eq(organizations.slug, "dev-workspace")).limit(1);
  return org?.id ?? null;
}
