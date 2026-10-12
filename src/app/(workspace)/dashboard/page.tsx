import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { DashboardSummary } from "@/components/dashboard/summary";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { resolveWorkspaceOrganizationId } from "@/server/auth/workspace";
import { getDashboardSummary } from "@/server/services/dashboard";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const organizationId = await resolveWorkspaceOrganizationId();
  const snapshot = organizationId ? await getDashboardSummary(organizationId) : null;

  if (!snapshot) {
    return (
      <Card className="mx-auto mt-10 max-w-xl">
        <EmptyState icon={LockKeyhole} title="No workspace is available">
          Sign-in is not available yet, so no organization can be opened. In development, run the seed script and set ALLOW_DEV_WORKSPACE=true.
        </EmptyState>
      </Card>
    );
  }
  return <DashboardSummary snapshot={snapshot} />;
}
