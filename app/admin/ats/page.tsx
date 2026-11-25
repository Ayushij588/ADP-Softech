import { AtsMatchDistribution } from "@/components/admin/ats-match-distribution";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { StatusBadge } from "@/components/ui/status-badge";

const atsMetrics = [
  {
    title: "Profiles evaluated",
    value: "1,284",
    description: "Sample candidate profiles",
  },
  {
    title: "Strong matches",
    value: "283",
    description: "Match scores of 85% or higher",
  },
  {
    title: "Average match score",
    value: "72%",
    description: "Across the illustrative sample",
  },
] as const;

export default function AdminAtsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Recruitment analytics
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            ATS Reports
          </h1>
          <p className="mt-3 text-slate-600">
            Explore sample applicant tracking and candidate match insights.
          </p>
        </div>
        <StatusBadge label="Sample data · not live" tone="info" />
      </div>

      <section
        aria-label="ATS report metrics"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {atsMetrics.map((metric) => (
          <DashboardCard
            description={metric.description}
            key={metric.title}
            title={metric.title}
            value={metric.value}
          />
        ))}
      </section>

      <div className="mt-8">
        <AtsMatchDistribution
          description="Illustrative distribution of candidate match scores across all sample profiles"
          title="Candidate Match Distribution"
        />
      </div>
    </main>
  );
}
