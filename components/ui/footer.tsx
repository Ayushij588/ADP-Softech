import Link from "next/link";
import type { NavigationLink } from "@/components/ui/navigation-link";

type FooterProps = {
  links: readonly NavigationLink[];
  brand?: string;
};

export function Footer({ links, brand = "ADP Softech" }: FooterProps) {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-10 sm:flex-row sm:items-end">
        <div>
          <p className="text-lg font-semibold tracking-tight">{brand}</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
            Connecting people and opportunities through thoughtful recruitment.
          </p>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300"
        >
          {links.map((item) => (
            <Link
              className="transition-colors hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-7xl px-6 py-4 text-xs text-slate-500">
          © ADP Softech
        </p>
      </div>
    </footer>
  );
}
