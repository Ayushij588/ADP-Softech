import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  value: ReactNode;
  description?: string;
  className?: string;
};

export function DashboardCard({
  title,
  value,
  description,
  className = "",
}: DashboardCardProps) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <h2 className="text-sm font-medium text-slate-600">{title}</h2>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </div>
      {description && (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      )}
    </section>
  );
}
