import Link from "next/link";
import type { NavigationLink } from "@/components/ui/navigation-link";
import { MobileMenu } from "@/components/ui/mobile-menu";

type NavbarProps = {
  links: readonly NavigationLink[];
  brand?: string;
  brandHref?: string;
  ariaLabel?: string;
};

export function Navbar({
  links,
  brand = "ADP Softech",
  brandHref = "/",
  ariaLabel = "Main navigation",
}: NavbarProps) {
  return (
    <header className="relative z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link
          className="flex shrink-0 flex-col text-lg font-bold tracking-tight text-slate-950"
          href={brandHref}
        >
          {brand}
          <span className="text-[11px] font-medium tracking-wide text-slate-500">
            Recruitment &amp; talent solutions
          </span>
        </Link>
        <nav
          aria-label={ariaLabel}
          className="hidden items-center gap-x-7 text-sm font-medium text-slate-600 md:flex"
        >
          {links.map((item) => (
            <Link
              className="transition-colors hover:text-blue-700"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileMenu ariaLabel={ariaLabel} links={links} />
      </div>
    </header>
  );
}
