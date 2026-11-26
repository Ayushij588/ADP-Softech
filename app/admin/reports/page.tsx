import { DashboardCard } from "@/components/ui/dashboard-card";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { departmentReportRows } from "@/constants/admin-content";

type DepartmentReport = (typeof departmentReportRows)[number];

const departmentColumns: DataTableColumn<DepartmentReport>[] = [
  {
    key: "department",
    header: "Department",
    render: (row) => row.department,
  },
  {
    key: "openRoles",
    header: "Open roles",
    render: (row) => row.openRoles,
  },
  {
    key: "applicationsReviewed",
    header: "Applications reviewed",
    render: (row) => row.applicationsReviewed,
  },
  {
    key: "shortlisted",
    header: "Shortlisted",
    render: (row) => row.shortlisted,
  },
  {
    key: "hires",
    header: "Hires",
    render: (row) => row.hires,
  },
];

const reportMetrics = [
  {
    title: "Applications reviewed",
    value: "197",
    description: "Across the sample departments",
  },
  {
    title: "Candidates shortlisted",
    value: "60",
    description: "Moved to a further review stage",
  },
  {
    title: "Sample hires",
    value: "20",
    description: "Illustrative reporting period",
  },
] as const;

const monthlyActivity = [
  { month: "Jun", applications: 42, height: "38%" },
  { month: "Jul", applications: 58, height: "52%" },
  { month: "Aug", applications: 51, height: "46%" },
  { month: "Sep", applications: 74, height: "67%" },
  { month: "Oct", applications: 63, height: "57%" },
  { month: "Nov", applications: 110, height: "100%" },
] as const;

export default function AdminReportsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Recruitment analytics
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Reports
          </h1>
          <p className="mt-3 text-slate-600">
            A sample overview of recruitment activity and outcomes.
          </p>
        </div>
        <StatusBadge label="Sample data · not live" tone="info" />
      </div>

      <section
        aria-label="Recruitment report metrics"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {reportMetrics.map((metric) => (
          <DashboardCard
            description={metric.description}
            key={metric.title}
            title={metric.title}
            value={metric.value}
          />
        ))}
      </section>

      <section
        aria-labelledby="monthly-activity-heading"
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <h2
              className="text-lg font-semibold text-slate-950"
              id="monthly-activity-heading"
            >
              Monthly application activity
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Sample applications received by month
            </p>
          </div>
          <StatusBadge label="Jun–Nov 2026" tone="neutral" />
        </div>
        <div
          aria-label="Applications per month"
          className="mt-8 grid h-48 grid-cols-6 items-end gap-3 sm:h-56 sm:gap-6"
          role="img"
        >
          {monthlyActivity.map((item) => (
            <div
              className="flex h-full flex-col items-center justify-end gap-2"
              key={item.month}
            >
              <span className="text-xs font-medium tabular-nums text-slate-600">
                {item.applications}
              </span>
              <div className="flex h-full w-full items-end rounded-t-md bg-blue-50">
                <div
                  className="w-full rounded-t-md bg-blue-600"
                  style={{ height: item.height }}
                />
              </div>
              <span className="text-xs text-slate-500">{item.month}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="department-report-heading"
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="mb-5">
          <h2
            className="text-lg font-semibold text-slate-950"
            id="department-report-heading"
          >
            Hiring activity by department
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sample recruitment outcomes for the reporting period
          </p>
        </div>
        <DataTable
          caption="Hiring activity by department"
          columns={departmentColumns}
          getRowKey={(row) => row.department}
          rows={departmentReportRows}
        />
      </section>
    </main>
  );
}
