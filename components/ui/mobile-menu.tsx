"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavigationLink } from "@/components/ui/navigation-link";

type MobileMenuProps = {
  links: readonly NavigationLink[];
  ariaLabel?: string;
};

export function MobileMenu({
  links,
  ariaLabel = "Main navigation",
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-controls="mobile-site-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? (
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
        )}
      </button>
      {isOpen && (
        <nav
          aria-label={ariaLabel}
          className="absolute inset-x-0 top-full z-50 border-t border-slate-200 bg-white px-6 py-3 shadow-lg"
          id="mobile-site-navigation"
        >
          <ul className="mx-auto flex max-w-7xl flex-col">
            {links.map((item) => (
              <li className="border-b border-slate-100 last:border-b-0" key={item.href}>
                <Link
                  className="block py-3 text-sm font-medium text-slate-700 transition-colors hover:text-blue-700"
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
