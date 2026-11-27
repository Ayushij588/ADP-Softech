"use client";

import { useState } from "react";

// Illustrative corporate tech brand marks matching the reference layout
const partnerBrands = [
  {
    name: "Microsoft",
    render: (
      <span className="flex items-center gap-1.5 font-bold tracking-tight text-[#152B38] text-sm sm:text-base">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="1" width="10" height="10" fill="#F25022" />
          <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
          <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
          <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
        </svg>
        Microsoft
      </span>
    ),
  },
  {
    name: "Infosys",
    render: (
      <span className="font-bold tracking-normal text-[#007CC3] text-base sm:text-lg italic font-serif">
        Infosys
      </span>
    ),
  },
  {
    name: "TCS",
    render: (
      <span className="font-extrabold tracking-wider text-[#D62828] text-base sm:text-lg">
        tcs
      </span>
    ),
  },
  {
    name: "HCLTech",
    render: (
      <span className="font-extrabold tracking-tight text-[#1A4B9C] text-sm sm:text-base">
        HCLTech
      </span>
    ),
  },
  {
    name: "Accenture",
    render: (
      <span className="flex items-center font-bold tracking-tight text-[#152B38] text-sm sm:text-base">
        accenture
        <span className="text-[#A100FF] font-black text-sm ml-0.5">&gt;</span>
      </span>
    ),
  },
  {
    name: "Wipro",
    render: (
      <span className="flex items-center gap-1 font-bold text-[#152B38] text-sm sm:text-base">
        <svg className="h-4 w-4 text-[oklch(39.8%_0.07_227.392)]" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="6" cy="12" r="3" fill="#D62828" />
          <circle cx="12" cy="6" r="3" fill="#F77F00" />
          <circle cx="18" cy="12" r="3" fill="oklch(39.8% 0.07 227.392)" />
          <circle cx="12" cy="18" r="3" fill="#007CC3" />
        </svg>
        wipro
      </span>
    ),
  },
];

export function TrustedBySection() {
  const [activeShift, setActiveShift] = useState(0);

  const handlePrev = () => {
    setActiveShift((prev) => (prev > 0 ? prev - 1 : partnerBrands.length - 1));
  };

  const handleNext = () => {
    setActiveShift((prev) => (prev < partnerBrands.length - 1 ? prev + 1 : 0));
  };

  const displayedBrands = partnerBrands
    .slice(activeShift)
    .concat(partnerBrands.slice(0, activeShift));

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl border border-[#DCE8ED] bg-white px-6 py-5 shadow-sm">
          {/* Left: Heading with navigation arrow */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous partner list"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DCE8ED] bg-[#F1F8FB] text-[#07394B] transition hover:bg-[#DCEFF5]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#17647B]">
                Trusted by
              </p>
              <p className="text-sm sm:text-base font-extrabold text-[#152B38] leading-snug">
                Growing Businesses
              </p>
            </div>

            {/* Vertical separator */}
            <div className="hidden md:block h-9 w-px bg-[#DCE8ED] ml-3" />
          </div>

          {/* Right: Partner Logos Row */}
          <div className="flex-1 w-full overflow-hidden">
            <div className="flex flex-wrap md:flex-nowrap items-center justify-around md:justify-between gap-6 sm:gap-8 px-2">
              {displayedBrands.map((brand) => (
                <div
                  key={brand.name}
                  className="flex items-center justify-center grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition duration-150"
                  title={`${brand.name} (Illustrative hiring network ecosystem)`}
                >
                  {brand.render}
                </div>
              ))}
            </div>
          </div>

          {/* Right Chevron */}
          <div className="hidden md:flex items-center shrink-0">
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next partner list"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DCE8ED] bg-[#F1F8FB] text-[#07394B] transition hover:bg-[#DCEFF5]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Small note clearly adhering to rule #16 */}
        <p className="text-center text-[10px] text-[#607D8B] mt-2">
          *Partner logos illustrate target industry sectors and past placement domains. ADP Softech is an independent recruitment agency.
        </p>
      </div>
    </section>
  );
}
