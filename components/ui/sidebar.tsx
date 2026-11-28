"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const isMobileMenuOpen = openPath === pathname;

  // Lock body scroll when overlay is open on small screens
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* ── Sidebar panel ───────────────────────────────────────────────── */}
      <aside className="relative z-40 border-b border-white/10 bg-[var(--brand-primary)] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        {/* Brand + hamburger row */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:border-b lg:border-white/10 lg:py-5">
          <div className="min-w-0">
            <Link className="text-lg font-bold tracking-tight text-white" href={brandHref}>
              {brand}
            </Link>
            <p className="mt-0.5 text-sm text-blue-100/80 lg:mt-1">{panelName}</p>
          </div>
          <button
            aria-controls="panel-navigation"
            aria-expanded={isMobileMenuOpen}
            aria-label={`${isMobileMenuOpen ? "Close" : "Open"} ${panelName} navigation`}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
            onClick={() => setOpenPath((current) => (current === pathname ? null : pathname))}
            type="button"
          >
            <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation — collapses on <lg, full-height on lg+ */}
        <nav
          aria-label={`${panelName} navigation`}
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } max-h-[70vh] flex-col gap-1 overflow-y-auto px-3 pb-4 lg:flex lg:max-h-none lg:flex-1 lg:overflow-y-auto lg:px-3 lg:py-5`}
          id="panel-navigation"
        >
          {links.map((item) => (
            <Link
              aria-current={
                pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined
              }
              className={`flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors lg:py-2 ${
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-white/15 font-semibold text-white shadow-sm ring-1 ring-white/15"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Backdrop overlay (mobile only) ──────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpenPath(null)}
        />
      )}
    </>
  );
}
