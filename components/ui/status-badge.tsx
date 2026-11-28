type StatusBadgeProps = {
  label: string;
  tone?: "neutral" | "success" | "warning" | "hold" | "danger" | "closed" | "info";
};

const toneClasses = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  hold: "bg-orange-100 text-orange-800",
  danger: "bg-rose-100 text-rose-800",
  closed: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
} as const;

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
