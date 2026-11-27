"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function BrandLogo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 transition-opacity hover:opacity-95"
      aria-label="ADP Softech - Home"
    >
      {/* Brand Icon Mark in Exact Blue-Teal Palette */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#14B8C4] via-[oklch(39.8%_0.07_227.392)] to-[#07394B] p-1.5 shadow-md">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          {/* Stylized Modern 'A' Mark */}
          <path
            d="M6 24L16 6L26 24"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 18H22"
            stroke="#14B8C4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M16 6L20 18H12L16 6Z"
            fill="#DCEFF5"
            fillOpacity="0.4"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="text-xl font-extrabold tracking-tight text-[#152B38] leading-tight">
          ADP <span className="font-bold text-[oklch(39.8%_0.07_227.392)]">Softech</span>
        </span>
        <span className="text-[10px] font-semibold tracking-wider text-[#17647B]">
          Innovate • Hire • Grow
        </span>
      </div>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
    setResourcesOpen(false);
  };

  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main Header Bar */}
      <div
        className={`w-full transition-all duration-200 ${
          scrolled
            ? "border-b border-[#DCE8ED] bg-white/95 shadow-sm backdrop-blur-md"
            : "border-b border-[#DCE8ED]/70 bg-white/90 backdrop-blur-xs"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <BrandLogo />

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex text-sm font-medium text-[#152B38]"
          >
            {/* Home Link with rounded active state */}
            <Link
              href="/"
              onClick={closeAllMenus}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                isHome
                  ? "bg-[oklch(39.8%_0.07_227.392)] text-white shadow-xs font-semibold"
                  : "text-[#152B38] hover:bg-[#DCEFF5] hover:text-[#07394B]"
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              onClick={closeAllMenus}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                pathname === "/about"
                  ? "bg-[oklch(39.8%_0.07_227.392)] text-white font-semibold"
                  : "hover:bg-[#DCEFF5] hover:text-[#07394B]"
              }`}
            >
              About Us
            </Link>

            {/* Services with dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                href="/services"
                onClick={closeAllMenus}
                className={`flex items-center gap-1 rounded-full px-4 py-1.5 transition-colors ${
                  pathname.startsWith("/services")
                    ? "bg-[oklch(39.8%_0.07_227.392)] text-white font-semibold"
                    : "hover:bg-[#DCEFF5] hover:text-[#07394B]"
                }`}
              >
                Services
                <svg
                  className={`h-4 w-4 transition-transform duration-150 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>

              {servicesOpen && (
                <div className="absolute left-0 top-full pt-2 w-64 z-50">
                  <div className="rounded-2xl border border-[#DCE8ED] bg-white p-2.5 shadow-xl">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#17647B]">
                      IT &amp; Tech Staffing
                    </div>
                    <Link
                      href="/services#it-recruitment"
                      onClick={closeAllMenus}
                      className="block rounded-lg px-3 py-1.5 text-xs font-semibold text-[#152B38] hover:bg-[#F1F8FB] hover:text-[oklch(39.8%_0.07_227.392)]"
                    >
                      IT Recruitment
                    </Link>
                    <Link
                      href="/services#permanent-recruitment"
                      onClick={closeAllMenus}
                      className="block rounded-lg px-3 py-1.5 text-xs font-semibold text-[#152B38] hover:bg-[#F1F8FB] hover:text-[oklch(39.8%_0.07_227.392)]"
                    >
                      Permanent Recruitment
                    </Link>
                    <Link
                      href="/services#contract-staffing"
                      onClick={closeAllMenus}
                      className="block rounded-lg px-3 py-1.5 text-xs font-semibold text-[#152B38] hover:bg-[#F1F8FB] hover:text-[oklch(39.8%_0.07_227.392)]"
                    >
                      Contract Staffing
                    </Link>
                    <div className="mt-2 border-t border-[#DCE8ED] pt-2 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#17647B]">
                      BPO &amp; Operations
                    </div>
                    <Link
                      href="/services#bpo-customer-support"
                      onClick={closeAllMenus}
                      className="block rounded-lg px-3 py-1.5 text-xs font-semibold text-[#152B38] hover:bg-[#F1F8FB] hover:text-[oklch(39.8%_0.07_227.392)]"
                    >
                      Customer Support
                    </Link>
                    <Link
                      href="/services#bpo-operations-international"
                      onClick={closeAllMenus}
                      className="block rounded-lg px-3 py-1.5 text-xs font-semibold text-[#152B38] hover:bg-[#F1F8FB] hover:text-[oklch(39.8%_0.07_227.392)]"
                    >
                      BPO &amp; International Processes
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/careers"
              onClick={closeAllMenus}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                pathname.startsWith("/careers")
                  ? "bg-[oklch(39.8%_0.07_227.392)] text-white font-semibold"
                  : "hover:bg-[#DCEFF5] hover:text-[#07394B]"
              }`}
            >
              Careers
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 rounded-full px-4 py-1.5 transition-colors hover:bg-[#DCEFF5] hover:text-[#07394B]"
              >
                Resources
                <svg
                  className={`h-4 w-4 transition-transform duration-150 ${
                    resourcesOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {resourcesOpen && (
                <div className="absolute left-0 top-full pt-2 w-56 z-50">
                  <div className="rounded-2xl border border-[#DCE8ED] bg-white p-2.5 shadow-xl">
                    <Link
                      href="/about"
                      onClick={closeAllMenus}
                      className="block rounded-lg px-3 py-1.5 text-xs font-semibold text-[#152B38] hover:bg-[#F1F8FB] hover:text-[oklch(39.8%_0.07_227.392)]"
                    >
                      Hiring Guides &amp; Insights
                    </Link>
                    <Link
                      href="/careers"
                      onClick={closeAllMenus}
                      className="block rounded-lg px-3 py-1.5 text-xs font-semibold text-[#152B38] hover:bg-[#F1F8FB] hover:text-[oklch(39.8%_0.07_227.392)]"
                    >
                      Salary Trends &amp; Roles
                    </Link>
                    <Link
                      href="/contact"
                      onClick={closeAllMenus}
                      className="block rounded-lg px-3 py-1.5 text-xs font-semibold text-[#152B38] hover:bg-[#F1F8FB] hover:text-[oklch(39.8%_0.07_227.392)]"
                    >
                      Frequently Asked Questions
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              onClick={closeAllMenus}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                pathname === "/contact"
                  ? "bg-[oklch(39.8%_0.07_227.392)] text-white font-semibold"
                  : "hover:bg-[#DCEFF5] hover:text-[#07394B]"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Action CTAs on Header */}
          <div className="hidden items-center gap-3 sm:flex">
            {/* For Employers CTA with User Icon */}
            <Link
              href="/employers"
              className="inline-flex items-center gap-2 rounded-full border border-[#DCE8ED] bg-white px-4 py-2 text-xs md:text-sm font-semibold text-[#152B38] shadow-xs transition hover:border-[oklch(39.8%_0.07_227.392)] hover:bg-[#F1F8FB]"
            >
              <svg
                className="h-4 w-4 text-[oklch(39.8%_0.07_227.392)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>For Employers</span>
            </Link>

            {/* Hire Talent CTA in Primary Brand Color */}
            <Link
              href="/careers"
              className="group inline-flex items-center gap-1.5 rounded-full bg-[oklch(39.8%_0.07_227.392)] px-5 py-2 text-xs md:text-sm font-semibold text-white shadow-xs transition hover:bg-[#07394B]"
            >
              <span>Hire Talent</span>
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-150 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/careers"
              className="inline-flex sm:hidden items-center rounded-full bg-[oklch(39.8%_0.07_227.392)] px-3 py-1.5 text-xs font-semibold text-white"
            >
              Hire Talent
            </Link>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-[#DCE8ED] bg-white p-2 text-[#152B38] shadow-xs transition hover:bg-[#F1F8FB] focus:outline-hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-[#DCE8ED] bg-white px-4 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-2 text-sm font-medium text-[#152B38]">
            <Link
              href="/"
              onClick={closeAllMenus}
              className={`rounded-lg px-3 py-2 ${
                isHome ? "bg-[oklch(39.8%_0.07_227.392)] text-white" : "hover:bg-[#F1F8FB]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={closeAllMenus}
              className="rounded-lg px-3 py-2 hover:bg-[#F1F8FB]"
            >
              About Us
            </Link>
            <Link
              href="/services"
              onClick={closeAllMenus}
              className="rounded-lg px-3 py-2 hover:bg-[#F1F8FB]"
            >
              Services (IT &amp; BPO)
            </Link>
            <Link
              href="/careers"
              onClick={closeAllMenus}
              className="rounded-lg px-3 py-2 hover:bg-[#F1F8FB]"
            >
              Careers
            </Link>
            <Link
              href="/contact"
              onClick={closeAllMenus}
              className="rounded-lg px-3 py-2 hover:bg-[#F1F8FB]"
            >
              Contact
            </Link>
            <Link
              href="/employers"
              onClick={closeAllMenus}
              className="rounded-lg px-3 py-2 hover:bg-[#F1F8FB]"
            >
              For Employers
            </Link>
            <Link
              href="/submit-resume"
              onClick={closeAllMenus}
              className="rounded-lg px-3 py-2 text-[oklch(39.8%_0.07_227.392)] font-semibold hover:bg-[#F1F8FB]"
            >
              Submit Resume
            </Link>

            <div className="mt-3 pt-3 border-t border-[#DCE8ED] flex flex-col gap-2">
              <Link
                href="/careers"
                onClick={closeAllMenus}
                className="w-full text-center rounded-full bg-[oklch(39.8%_0.07_227.392)] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#07394B]"
              >
                Hire Talent
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
