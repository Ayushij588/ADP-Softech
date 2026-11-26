import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { platformAuditLogs } from "@/constants/super-admin-content";

type AuditLogRow = (typeof platformAuditLogs)[number];

const columns: DataTableColumn<AuditLogRow>[] = [
  {
    key: "timestamp",
    header: "Date & time",
    render: (log) => (
      <span className="whitespace-nowrap">{log.timestamp}</span>
    ),
  },
  {
    key: "actor",
    header: "User",
    render: (log) => (
      <span className="whitespace-nowrap font-medium text-slate-900">
        {log.actor}
      </span>
    ),
  },
  {
    key: "action",
    header: "Action",
    render: (log) => log.action,
  },
  {
    key: "resource",
    header: "Resource",
    render: (log) => log.resource,
  },
  {
    key: "source",
    header: "Source",
    render: (log) =>
      log.source === "Automated" ? (
        <StatusBadge label={log.source} tone="neutral" />
      ) : (
        <span className="font-mono text-xs text-slate-600">{log.source}</span>
      ),
  },
];

export default function AuditLogsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Review example events recorded across platform administration."
        title="Audit Logs"
      />
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Recent platform events
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Audit entries and source addresses shown are illustrative.
          </p>
        </div>
        <DataTable
          caption="Platform audit log"
          columns={columns}
          getRowKey={(log) => log.id}
          rows={platformAuditLogs}
        />
      </section>
    </main>
  );
}
