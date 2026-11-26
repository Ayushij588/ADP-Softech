import { atsMatchDistribution } from "@/constants/admin-content";

type AtsMatchDistributionProps = {
  title?: string;
  description?: string;
};

export function AtsMatchDistribution({
  title = "ATS Match Distribution",
  description = "Sample candidate profile match scores",
}: AtsMatchDistributionProps) {
  return (
    <section
      aria-labelledby="ats-distribution-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2
            className="text-lg font-semibold text-slate-950"
            id="ats-distribution-heading"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          Illustrative breakdown
        </span>
      </div>

      <ul className="mt-7 grid gap-x-10 gap-y-6 md:grid-cols-2">
        {atsMatchDistribution.map((item) => (
          <li key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="tabular-nums text-slate-500">
                {item.percentage}%
              </span>
            </div>
            <div
              aria-label={`${item.label}: ${item.percentage}%`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={item.percentage}
              className="h-2.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
            >
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
        Match percentages are dummy values for preview and do not represent
        live ATS results.
      </p>
    </section>
  );
}
