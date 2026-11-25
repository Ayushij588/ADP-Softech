import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import { DashboardCard } from "@/components/ui/dashboard-card";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  recentPlatformActivity,
  superAdminMetrics,
} from "@/constants/super-admin-content";

type ActivityRow = (typeof recentPlatformActivity)[number];

const activityColumns: DataTableColumn<ActivityRow>[] = [
  {
    key: "actor",
    header: "User",
    render: (activity) => (
      <span className="font-medium text-slate-900">{activity.actor}</span>
    ),
  },
  {
    key: "action",
    header: "Activity",
    render: (activity) => activity.action,
  },
  {
    key: "target",
    header: "Item",
    render: (activity) => activity.target,
  },
  {
    key: "time",
    header: "Time",
    render: (activity) => (
      <span className="whitespace-nowrap">{activity.time}</span>
    ),
  },
  {
    key: "status",
    header: "Result",
    render: (activity) => (
      <StatusBadge
        label={activity.status}
        tone={activity.status === "Automated" ? "neutral" : "success"}
      />
    ),
  },
];

export default function SuperAdminDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Monitor recruitment operations, platform access, and system activity."
        title="Super Admin Dashboard"
      />

      <section
        aria-label="Platform metrics"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {superAdminMetrics.map((metric) => (
          <DashboardCard
            description={metric.description}
            key={metric.title}
            title={metric.title}
            value={metric.value}
          />
        ))}
      </section>

      <section
        aria-labelledby="recent-activity-heading"
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="mb-5">
          <h2
            className="text-lg font-semibold text-slate-950"
            id="recent-activity-heading"
          >
            Recent system activity
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Illustrative activity across the recruitment platform
          </p>
        </div>
        <DataTable
          caption="Recent platform activity"
          columns={activityColumns}
          getRowKey={(activity) => activity.id}
          rows={recentPlatformActivity}
        />
      </section>
    </main>
  );
}
