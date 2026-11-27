"use client";

import Link from "next/link";

export function AboutAndServicesSection() {
  const features = [
    { id: "f1", title: "People-First Approach" },
    { id: "f2", title: "Technology & Operations Hiring" },
    { id: "f3", title: "IT & BPO Talent Experts" },
    { id: "f4", title: "Global Talent Reach" },
  ];

  const services = [
    {
      id: "it-recruitment",
      title: "IT Recruitment",
      description:
        "Find skilled software developers, cloud architects, and tech specialists across modern stacks.",
      href: "/services#it-recruitment",
      isHighlighted: false,
      icon: (
        <svg
          className="h-6 w-6 text-[oklch(39.8%_0.07_227.392)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
          />
        </svg>
      ),
    },
    {
      id: "bpo-recruitment",
      title: "BPO Recruitment",
      description:
        "Scale voice, non-voice, tech support, and international customer operations teams.",
      href: "/services#bpo-customer-support",
      isHighlighted: true,
      icon: (
        <svg
          className="h-6 w-6 text-[#07394B]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"
          />
        </svg>
      ),
    },
    {
      id: "contract-staffing",
      title: "Contract Staffing",
      description:
        "Agile, project-based IT and operational contractors to meet surges and tight timelines.",
      href: "/services#contract-staffing",
      isHighlighted: false,
      icon: (
        <svg
          className="h-6 w-6 text-[oklch(39.8%_0.07_227.392)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Left Column: About ADP Softech */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-5 bg-[oklch(39.8%_0.07_227.392)]" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#17647B]">
                  About ADP Softech
                </span>
              </div>

              {/* Heading */}
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#152B38] leading-tight">
                People. Technology.{" "}
                <span className="italic text-[#17647B] font-semibold">Operations.</span>
              </h2>

              {/* Description */}
              <p className="mt-4 text-sm sm:text-base text-[#3E5A6B] leading-relaxed">
                An independent IT and BPO recruitment and staffing company connecting businesses
                with skilled talent and customer operations professionals across the globe.
              </p>

              {/* Four Feature Badges / Highlights */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center gap-2 rounded-xl bg-[#F1F8FB] border border-[#DCE8ED] px-3 py-2 text-xs font-semibold text-[#152B38]"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[oklch(39.8%_0.07_227.392)] text-white">
                      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learn More Button */}
            <div className="mt-7">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full bg-[oklch(39.8%_0.07_227.392)] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-[#07394B]"
              >
                <span>Learn More</span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-150 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Vertical Divider on Desktop */}
          <div className="hidden lg:block lg:col-span-1 self-stretch flex justify-center">
            <div className="w-px h-full bg-[#E5EEF2]" />
          </div>

          {/* Right Column: Our Services (Exactly Three Main Cards) */}
          <div className="lg:col-span-6">
            {/* Eyebrow / Heading */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-5 bg-[oklch(39.8%_0.07_227.392)]" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#17647B]">
                  Our Services
                </span>
              </div>

              <Link
                href="/services"
                className="text-xs font-semibold text-[oklch(39.8%_0.07_227.392)] hover:text-[#07394B] underline"
              >
                View All Services →
              </Link>
            </div>

            <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#152B38]">
              Comprehensive Recruitment Solutions
            </h3>

            {/* Three Cards Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`group flex flex-col justify-between rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 ${
                    service.isHighlighted
                      ? "bg-gradient-to-b from-[#DCEFF5] to-[#E9F5F9] border-2 border-[#14B8C4]/40 shadow-md"
                      : "bg-white border border-[#DCE8ED] shadow-sm hover:shadow-md"
                  }`}
                  style={{
                    boxShadow: service.isHighlighted
                      ? "0 10px 24px -4px rgba(20, 184, 196, 0.16)"
                      : "0 4px 12px -2px rgba(7, 57, 75, 0.05)",
                  }}
                >
                  <div>
                    {/* Icon container */}
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl mb-4 ${
                        service.isHighlighted
                          ? "bg-white shadow-xs border border-[#14B8C4]/30"
                          : "bg-[#DCEFF5]/60 border border-[#BCE0EC]/60"
                      }`}
                    >
                      {service.icon}
                    </div>

                    <h4 className="text-base font-bold text-[#152B38] leading-snug">
                      {service.title}
                    </h4>

                    <p className="mt-2 text-xs text-[#4F6A78] leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#DCE8ED]/60">
                    <Link
                      href={service.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[oklch(39.8%_0.07_227.392)] group-hover:text-[#07394B] transition-colors"
                    >
                      <span>Explore</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
