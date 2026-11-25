import { DashboardCard } from "@/components/ui/dashboard-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AtsMatchDistribution } from "@/components/admin/ats-match-distribution";

const dashboardMetrics = [
  {
    title: "Active Jobs",
    value: "24",
    description: "Open roles currently being recruited",
  },
  {
    title: "New Applications",
    value: "138",
    description: "Received in the last 7 days",
  },
  {
    title: "Total Candidates",
    value: "1,284",
    description: "Candidate records in this sample",
  },
  {
    title: "Shortlisted Candidates",
    value: "42",
    description: "Ready for the next review stage",
  },
  {
    title: "Interview Scheduled",
    value: "16",
    description: "Interviews planned for the next 7 days",
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Recruitment overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-3 text-slate-600">
            A snapshot of hiring activity across your recruitment pipeline.
          </p>
        </div>
        <StatusBadge label="Sample data · not live" tone="info" />
      </div>

      <section
        aria-label="Recruitment metrics"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {dashboardMetrics.map((metric) => (
          <DashboardCard
            description={metric.description}
            key={metric.title}
            title={metric.title}
            value={metric.value}
          />
        ))}
      </section>

      <div className="mt-8">
        <AtsMatchDistribution />
      </div>
    </main>
  );
}
