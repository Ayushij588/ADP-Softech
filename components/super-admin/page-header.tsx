import { StatusBadge } from "@/components/ui/status-badge";

type SuperAdminPageHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function SuperAdminPageHeader({
  title,
  description,
  eyebrow = "Platform administration",
}: SuperAdminPageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
      </div>
      <StatusBadge label="Sample data · not live" tone="info" />
    </header>
  );
}
