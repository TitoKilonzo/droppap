import { Activity, FileText, FolderTree, HardDrive, MailPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import type { DashboardSnapshot } from "@/server/db/repositories/dashboard";
import { formatBytes, percentOf } from "@/lib/utils/format";

function Stat({ label, value, icon: Icon, children }: { label: string; value: string; icon: typeof FileText; children?: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between text-sm text-ink-soft">
        <span>{label}</span>
        <Icon className="size-4.5 text-forest" aria-hidden="true" />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {children ? <div className="mt-3">{children}</div> : null}
    </Card>
  );
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });

export function DashboardSummary({ snapshot }: { snapshot: DashboardSnapshot }) {
  const { organization, activeFileCount, pendingInvitationCount, departmentUsage, recentActivity } = snapshot;
  const committed = organization.storageUsedBytes + organization.storageReservedBytes;
  const usedPercent = percentOf(committed, organization.storageQuotaBytes);
  const available = Math.max(0, organization.storageQuotaBytes - committed);
  const maxDepartmentBytes = Math.max(1, ...departmentUsage.map((d) => d.bytes));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-soft">Storage, files and activity for {organization.name}.</p>
      </div>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Active files" value={activeFileCount.toLocaleString("en-US")} icon={FileText} />
        <Stat label="Storage used" value={formatBytes(committed)} icon={HardDrive}>
          <Progress value={usedPercent} label="Storage used" tone={usedPercent >= 90 ? "warning" : "default"} />
          <p className="mt-2 text-xs text-ink-soft">
            {formatBytes(available)} available of {formatBytes(organization.storageQuotaBytes)}
          </p>
        </Stat>
        <Stat label="Pending invitations" value={pendingInvitationCount.toLocaleString("en-US")} icon={MailPlus} />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Storage by department" description="Current versions of active files." />
          {departmentUsage.length === 0 ? (
            <EmptyState icon={FolderTree} title="No stored files yet">
              Department storage appears here once files are uploaded.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-line">
              {departmentUsage.map((row) => (
                <li key={row.departmentId ?? "unassigned"} className="px-5 py-3">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium text-ink">{row.departmentName}</span>
                    <span className="text-ink-soft">
                      {row.fileCount} {row.fileCount === 1 ? "file" : "files"}, {formatBytes(row.bytes)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Progress value={percentOf(row.bytes, maxDepartmentBytes)} label={`${row.departmentName} storage relative to the largest department`} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Recent activity" description="The latest recorded events in this organization." />
          {recentActivity.length === 0 ? (
            <EmptyState icon={Activity} title="No activity yet">
              Uploads, sharing and permission changes are recorded here.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-line">
              {recentActivity.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{row.action}</p>
                    <p className="text-xs text-ink-soft">
                      {row.resourceType} - {dateFormat.format(row.createdAt)} UTC
                    </p>
                  </div>
                  <Badge tone={row.outcome === "success" ? "positive" : row.outcome === "denied" ? "warning" : "danger"}>{row.outcome}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
