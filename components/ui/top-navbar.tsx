type TopNavbarProps = {
  panelName: string;
  subtitle?: string;
  brand?: string;
};

export function TopNavbar({
  panelName,
  subtitle = "Administration workspace",
  brand = "ADP Softech",
}: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur sm:px-7">
      <div>
        <p className="text-sm font-semibold text-slate-900">{panelName}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-800">
        {brand}
      </span>
    </header>
  );
}
