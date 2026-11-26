import { AtsSettingsForm } from "@/components/super-admin/ats-settings-form";
import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  atsMatchBands,
} from "@/constants/super-admin-content";

const atsSettingsMetrics = [
  {
    title: "Scoring model",
    value: "Weighted match",
    description: "Illustrative configuration",
  },
  {
    title: "Match bands",
    value: "4 levels",
    description: "Example candidate match ranges",
  },
  {
    title: "Model status",
    value: "Enabled",
    description: "Demo status only",
  },
] as const;

export default function AtsSettingsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Review the sample match scoring weights and ATS score bands."
        title="ATS Settings"
      />

      <section
        aria-label="ATS overview"
        className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {atsSettingsMetrics.map((metric) => (
          <DashboardCard
            description={metric.description}
            key={metric.title}
            title={metric.title}
            value={metric.value}
          />
        ))}
      </section>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <AtsSettingsForm />
        <section
          aria-labelledby="match-bands-heading"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <h2
            className="text-lg font-semibold text-slate-950"
            id="match-bands-heading"
          >
            Match score bands
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Example score ranges used to group candidate matches
          </p>
          <ul className="mt-5 divide-y divide-slate-100">
            {atsMatchBands.map((band) => (
              <li
                className="flex flex-col justify-between gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                key={band.label}
              >
                <div>
                  <p className="font-medium text-slate-900">{band.label}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {band.description}
                  </p>
                </div>
                <StatusBadge label={band.range} tone="neutral" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
