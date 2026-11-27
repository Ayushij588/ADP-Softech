"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#0C4154] bg-[#07394B] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Purpose Column */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {/* White Logo Container */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#14B8C4] to-[oklch(39.8%_0.07_227.392)] p-1.5 shadow-sm">
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full"
                    aria-hidden="true"
                  >
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
                <div>
                  <span className="text-xl font-extrabold tracking-tight text-white block">
                    ADP <span className="text-[#14B8C4]">Softech</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-[#DCEFF5]/80 block">
                    Innovate • Hire • Grow
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-[#DCEFF5]/80 leading-relaxed max-w-xs">
                Connecting Talent. Building Tomorrow. An independent recruitment and offshore
                staffing company specializing in IT and BPO operations.
              </p>
            </div>

            {/* Social Links (LinkedIn, X, YouTube) */}
            <div className="mt-6 flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="ADP Softech LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-[oklch(39.8%_0.07_227.392)]"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="ADP Softech X (Twitter)"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-[oklch(39.8%_0.07_227.392)]"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="ADP Softech YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-[oklch(39.8%_0.07_227.392)]"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-[#DCEFF5]/90 transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#DCEFF5]/90 transition hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#DCEFF5]/90 transition hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-[#DCEFF5]/90 transition hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#DCEFF5]/90 transition hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
              Our Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/services#it-recruitment" className="text-[#DCEFF5]/90 transition hover:text-white">
                  IT Recruitment
                </Link>
              </li>
              <li>
                <Link href="/services#bpo-customer-support" className="text-[#DCEFF5]/90 transition hover:text-white">
                  BPO Recruitment
                </Link>
              </li>
              <li>
                <Link href="/services#contract-staffing" className="text-[#DCEFF5]/90 transition hover:text-white">
                  Contract Staffing
                </Link>
              </li>
              <li>
                <Link href="/services#offshore-staffing" className="text-[#DCEFF5]/90 transition hover:text-white">
                  Offshore Staffing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="text-[#DCEFF5]/90 transition hover:text-white">
                  Blogs &amp; News
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-[#DCEFF5]/90 transition hover:text-white">
                  Hiring Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#DCEFF5]/90 transition hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Get in Touch */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2 text-[#DCEFF5]/90">
                <svg className="h-4 w-4 text-[#14B8C4] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:hr@adpsoftech.com" className="hover:text-white transition break-all">
                  hr@adpsoftech.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-[#DCEFF5]/90">
                <svg className="h-4 w-4 text-[#14B8C4] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+919876543210" className="hover:text-white transition">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-2 text-[#DCEFF5]/90">
                <svg className="h-4 w-4 text-[#14B8C4] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>India | Global</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-6 border-t border-[#0E495E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DCEFF5]/70">
          <p>© 2025 ADP Softech. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <span className="text-[#0E495E]">|</span>
            <Link href="/terms" className="hover:text-white transition">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
