import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import { DashboardCard } from "@/components/ui/dashboard-card";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  clientAccounts,
  employerInquiries,
  recentPlatformActivity,
  superAdminMetrics,
} from "@/constants/super-admin-content";

type ActivityRow = (typeof recentPlatformActivity)[number];
type ClientRow = (typeof clientAccounts)[number];
type InquiryRow = (typeof employerInquiries)[number];

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

const clientColumns: DataTableColumn<ClientRow>[] = [
  {
    key: "id",
    header: "Client ID",
    render: (client) => <span className="font-mono text-xs text-slate-500">{client.id}</span>,
  },
  {
    key: "name",
    header: "Organization",
    render: (client) => (
      <div>
        <span className="font-semibold text-slate-900">{client.name}</span>
        <p className="text-[11px] text-slate-500">{client.primaryContact}</p>
      </div>
    ),
  },
  { key: "region", header: "Region", render: (client) => client.region },
  {
    key: "activeJds",
    header: "Active JDs",
    render: (client) => <span className="tabular-nums font-medium">{client.activeJds}</span>,
  },
  {
    key: "submittedCandidates",
    header: "Submitted",
    render: (client) => <span className="tabular-nums font-medium">{client.submittedCandidates}</span>,
  },
  {
    key: "confidentiality",
    header: "Confidentiality",
    render: (client) => <span className="text-xs text-slate-600">{client.confidentiality}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (client) => (
      <StatusBadge
        label={client.status}
        tone={client.status === "Active" ? "success" : "warning"}
      />
    ),
  },
];

const inquiryColumns: DataTableColumn<InquiryRow>[] = [
  {
    key: "id",
    header: "Inquiry",
    render: (inq) => <span className="font-mono text-xs text-blue-700">{inq.id}</span>,
  },
  {
    key: "companyName",
    header: "Client & Contact",
    render: (inq) => (
      <div>
        <span className="font-semibold text-slate-900">{inq.companyName}</span>
        <p className="text-[11px] text-slate-500">{inq.contactPerson} · {inq.email}</p>
      </div>
    ),
  },
  {
    key: "roleNeeded",
    header: "Requirement",
    render: (inq) => (
      <div>
        <span className="font-medium text-slate-800">{inq.roleNeeded}</span>
        <p className="text-[11px] text-slate-500">
          {inq.positions} positions · {inq.engagementType} · {inq.workMode}
        </p>
      </div>
    ),
  },
  { key: "receivedDate", header: "Received", render: (inq) => <span className="whitespace-nowrap">{inq.receivedDate}</span> },
  {
    key: "status",
    header: "Status",
    render: (inq) => (
      <StatusBadge
        label={inq.status}
        tone={inq.status === "Converted to JD" ? "success" : inq.status === "New" ? "info" : "warning"}
      />
    ),
  },
];

export default function SuperAdminDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Monitor recruitment operations, client accounts, employer inquiries, platform access, and system activity."
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

      <section
        aria-labelledby="client-accounts-heading"
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="mb-5">
          <h2
            className="text-lg font-semibold text-slate-950"
            id="client-accounts-heading"
          >
            Client accounts &amp; confidentiality oversight
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Internal client directory and public website confidentiality rules (BRD §10.1 &amp; §11)
          </p>
        </div>
        <DataTable
          caption="Client accounts"
          columns={clientColumns}
          getRowKey={(client) => client.id}
          rows={clientAccounts}
        />
      </section>

      <section
        aria-labelledby="employer-inquiries-heading"
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="mb-5">
          <h2
            className="text-lg font-semibold text-slate-950"
            id="employer-inquiries-heading"
          >
            Employer hiring inquiries
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Client hiring inquiries captured from the public website (BRD §5.4)
          </p>
        </div>
        <DataTable
          caption="Employer inquiries"
          columns={inquiryColumns}
          getRowKey={(inq) => inq.id}
          rows={employerInquiries}
        />
      </section>
    </main>
  );
}
