"use client";

import Image from "next/image";
import Link from "next/link";

const serviceHighlights = [
  {
    id: "it-hiring",
    label: "IT Hiring",
    icon: (
      <svg
        className="h-5 w-5 text-[#14B8C4]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
        />
      </svg>
    ),
  },
  {
    id: "bpo-staffing",
    label: "BPO Staffing",
    icon: (
      <svg
        className="h-5 w-5 text-[#14B8C4]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.5V12a9 9 0 0118 0v1.5m-18 0a2.25 2.25 0 002.25 2.25h.75A1.5 1.5 0 007.5 14.25v-3A1.5 1.5 0 006 9.75H5.25A2.25 2.25 0 003 12v1.5zm18 0a2.25 2.25 0 01-2.25 2.25h-.75a1.5 1.5 0 01-1.5-1.5v-3a1.5 1.5 0 011.5-1.5h.75A2.25 2.25 0 0121 12v1.5zM16.5 17.25a4.5 4.5 0 01-4.5 3h-1.5"
        />
      </svg>
    ),
  },
  {
    id: "dedicated-teams",
    label: "Dedicated Teams",
    icon: (
      <svg
        className="h-5 w-5 text-[#14B8C4]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>
    ),
  },
];

function DotPattern({ className }: { className: string }) {
  return (
    <div
      className={`pointer-events-none grid grid-cols-4 gap-1.5 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: 16 }).map((_, idx) => (
        <span key={idx} className="h-1 w-1 rounded-full bg-[#14B8C4]/45" />
      ))}
    </div>
  );
}

export function EmployerCTA() {
  return (
    <section className="py-12 sm:py-16 bg-[#F1F8FB]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Wide Curved Spotlight Dark Teal Banner */}
        <div
          className="relative overflow-hidden rounded-3xl sm:rounded-[32px] bg-gradient-to-br from-[#052936] via-[#07394B] to-[#0B4659] shadow-xl"
          style={{
            boxShadow: "0 20px 40px -10px rgba(7, 57, 75, 0.28)",
          }}
        >
          {/* Subtle Radial Glow & Cyan Dot Accents */}
          <div
            className="pointer-events-none absolute -top-20 left-[48%] h-72 w-72 rounded-full bg-[#14B8C4]/10 blur-3xl"
            aria-hidden="true"
          />
          <DotPattern className="hidden lg:grid absolute top-7 left-[54%] z-10" />
          <DotPattern className="hidden lg:grid absolute bottom-5 right-6 z-20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[58fr_42fr] items-stretch">
            {/* Left Content Area (~58%) */}
            <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-11">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#DCEFF5]/90">
                <span className="h-0.5 w-8 bg-[#14B8C4]" aria-hidden="true" />
                <span>Partner with ADP Softech</span>
              </div>

              {/* Main Heading */}
              <h2 className="mt-3 text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-extrabold tracking-tight text-white leading-[1.15]">
                Build, Scale &amp; Strengthen
                <br className="hidden sm:inline" /> Your Team with{" "}
                <span className="relative inline-block text-[#14B8C4]">
                  ADP Softech
                  <svg
                    className="pointer-events-none absolute -bottom-1.5 left-0 w-full h-2 text-[#14B8C4]/80"
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 7C55 2 135 2 198 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>

              {/* Description */}
              <p className="mt-4 max-w-xl text-sm sm:text-base text-[#DCEFF5]/90 leading-relaxed">
                Hire skilled IT &amp; BPO talent to drive real business growth.
              </p>

              {/* Bottom Row: CTA Button & Three Service Highlights */}
              <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-6">
                <Link
                  href="/employers"
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm sm:text-base font-bold text-[#07394B] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#14B8C4] hover:text-white hover:shadow-lg hover:shadow-[#14B8C4]/25 active:translate-y-0 active:scale-[0.97] active:bg-[#0E9AA5] active:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white w-full sm:w-auto"
                >
                  <span>Get in Touch</span>
                  <span
                    aria-hidden="true"
                    className="inline-block text-[oklch(39.8%_0.07_227.392)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-white group-active:text-white"
                  >
                    →
                  </span>
                </Link>

                {/* Three Compact Service Highlights */}
                <div className="grid grid-cols-3 sm:flex sm:items-center gap-3 sm:gap-5">
                  {serviceHighlights.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex flex-col items-center sm:items-start text-center sm:text-left ${
                        index !== 0 ? "border-l border-white/20 pl-3 sm:pl-5" : ""
                      }`}
                    >
                      {item.icon}
                      <span className="mt-1.5 text-[11px] sm:text-xs font-semibold text-white whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Image Area (~42%) – Curved Spotlight */}
            <div className="px-6 pb-7 sm:px-10 sm:pb-8 lg:p-0">
              <div className="relative h-60 sm:h-72 lg:h-full lg:min-h-[310px] w-full overflow-hidden rounded-2xl border-2 border-[#14B8C4]/75 lg:rounded-none lg:rounded-l-[240px] lg:border-0 lg:border-l-[4px] lg:border-[#14B8C4] shadow-[-8px_0_30px_rgba(20,184,196,0.2)]">
                <Image
                  src="/images/cta/curved-spotlight-team.jpg"
                  alt="Two ADP Softech colleagues collaborating on a laptop in a modern office"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-top"
                />
                {/* Subtle left-edge blend into dark teal banner on desktop */}
                <div
                  className="pointer-events-none hidden lg:block absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#07394B]/30 to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
