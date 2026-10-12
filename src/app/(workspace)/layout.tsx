import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { resolveWorkspaceOrganizationId } from "@/server/auth/workspace";
import { getDashboardSummary } from "@/server/services/dashboard";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const organizationId = await resolveWorkspaceOrganizationId();
  const snapshot = organizationId ? await getDashboardSummary(organizationId) : null;
  return <WorkspaceShell organizationName={snapshot?.organization.name ?? "DropPap"}>{children}</WorkspaceShell>;
}
