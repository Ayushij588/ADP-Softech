import Link from "next/link";

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
  const isSuperAdmin = panelName === "Super Admin";
  const loginHref = isSuperAdmin ? "/super-admin/login" : "/admin/login";
  const roleLabel = isSuperAdmin ? "Leah Morgan · Super Admin" : "Aisha Patel · Recruiter";

  return (
    <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-7">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">{panelName}</p>
        <p className="truncate text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-800 sm:inline-flex">
          {brand}
        </span>
        <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700">
          {roleLabel}
        </span>
        <Link
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          href={loginHref}
        >
          Sign out
        </Link>
      </div>
    </header>
  );
}
