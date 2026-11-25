import Link from "next/link";
import type { NavigationLink } from "@/components/ui/navigation-link";

type SidebarProps = {
  links: readonly NavigationLink[];
  panelName: string;
  brand?: string;
  brandHref?: string;
};

export function Sidebar({
  links,
  panelName,
  brand = "ADP Softech",
  brandHref = "/",
}: SidebarProps) {
  return (
    <aside className="border-b border-slate-800 bg-slate-950 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="px-5 py-5 lg:border-b lg:border-slate-800">
        <Link className="text-lg font-bold tracking-tight" href={brandHref}>
          {brand}
        </Link>
        <p className="mt-1 text-sm text-slate-400">{panelName}</p>
      </div>
      <nav
        aria-label={`${panelName} navigation`}
        className="flex gap-2 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:gap-1 lg:overflow-x-visible lg:overflow-y-auto lg:px-3 lg:py-5"
      >
        {links.map((item) => (
          <Link
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
