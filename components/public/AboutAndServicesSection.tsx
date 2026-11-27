"use client";

import Image from "next/image";
import Link from "next/link";

const expertiseItems = [
  "IT & Software Recruitment",
  "BPO & Customer Support Staffing",
  "Contract & Project-Based Staffing",
  "Offshore Workforce Solutions",
];

const whyChooseItems = [
  "People-First Recruitment",
  "Technology & Operations Hiring",
  "Skilled Talent Network",
  "Flexible Staffing Solutions",
  "Global Talent Reach",
];

const services = [
  {
    id: "it-recruitment",
    title: "IT Recruitment",
    description:
      "Find skilled software developers, cloud architects, engineers and technical specialists across modern technology stacks.",
    href: "/services#it-recruitment",
    icon: (
      <svg
        className="h-6 w-6 text-[oklch(39.8%_0.07_227.392)] transition-colors group-hover:text-[#07394B]"
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
      "Build customer support, voice, non-voice, technical support and international operations teams.",
    href: "/services#bpo-customer-support",
    icon: (
      <svg
        className="h-6 w-6 text-[oklch(39.8%_0.07_227.392)] transition-colors group-hover:text-[#07394B]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
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
    id: "contract-staffing",
    title: "Contract Staffing",
    description:
      "Access flexible, project-based IT and operational professionals to meet changing business requirements.",
    href: "/services#contract-staffing",
    icon: (
      <svg
        className="h-6 w-6 text-[oklch(39.8%_0.07_227.392)] transition-colors group-hover:text-[#07394B]"
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
  {
    id: "offshore-staffing",
    title: "Offshore Staffing",
    description:
      "Build dedicated offshore teams and access skilled remote professionals for business operations and technology requirements.",
    href: "/services#offshore-staffing",
    icon: (
      <svg
        className="h-6 w-6 text-[oklch(39.8%_0.07_227.392)] transition-colors group-hover:text-[#07394B]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    ),
  },
];

function CheckListItem({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-[#152B38] leading-snug">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[oklch(39.8%_0.07_227.392)] text-white">
        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span>{label}</span>
    </li>
  );
}

export function AboutAndServicesSection() {
  return (
    <>
      {/* 3A. About ADP Softech Section */}
      <section className="bg-white pt-10 pb-12 sm:pt-12 sm:pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Area: Label, Heading & Company Introduction */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-5 bg-[oklch(39.8%_0.07_227.392)]" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#17647B]">
                About ADP Softech
              </span>
            </div>

            <h2 className="mt-2.5 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#152B38] leading-tight">
              People. Technology.{" "}
              <span className="italic text-[#17647B] font-semibold">Operations.</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#3E5A6B] leading-relaxed">
              An independent IT and BPO recruitment and staffing company connecting businesses with
              skilled talent and customer operations professionals across the globe.
            </p>
          </div>

          {/* Main Content Area: Balanced Two-Column Composition */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left: Large Professional Team Photograph */}
            <div className="lg:col-span-5">
              <div className="relative h-full min-h-[260px] sm:min-h-[320px] w-full overflow-hidden rounded-2xl border border-[#DCE8ED] shadow-md">
                <Image
                  src="/images/about/team-collaboration.jpg"
                  alt="ADP Softech recruitment and operations team collaborating around a laptop"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right: Our Approach + Two Balanced Columns */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Our Approach Panel */}
              <div className="rounded-2xl border border-[#D7ECF2] bg-[#EBF6FA] p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#DCEFF5] text-[#17647B]">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5L21 3m0 0h-3.5M21 3v3.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#152B38]">
                      Our Approach
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#3E5A6B] leading-relaxed">
                      We connect businesses with skilled professionals through people-first
                      recruitment, deep industry expertise, and efficient hiring processes—helping
                      organizations build reliable, scalable technology and operations teams.
                    </p>
                  </div>
                </div>
              </div>

              {/* Two Balanced Columns: Our Expertise & Why Choose ADP Softech */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
                {/* Our Expertise */}
                <div className="flex flex-col rounded-2xl border border-[#DCE8ED] bg-[#F8FCFD] p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EBF6FA] text-[#17647B]">
                      <svg
                        className="h-4 w-4"
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
                    </div>
                    <h3 className="text-base font-bold text-[#152B38]">Our Expertise</h3>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {expertiseItems.map((item) => (
                      <CheckListItem key={item} label={item} />
                    ))}
                  </ul>
                </div>

                {/* Why Choose ADP Softech */}
                <div className="flex flex-col rounded-2xl border border-[#DCE8ED] bg-[#F8FCFD] p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EBF6FA] text-[#17647B]">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-[#152B38]">Why Choose ADP Softech</h3>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {whyChooseItems.map((item) => (
                      <CheckListItem key={item} label={item} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Area: Commitment Statement & Learn More CTA */}
          <div className="mt-7 pt-6 border-t border-[#E5EEF2] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#4F6A78] font-medium">
              Committed to ethical hiring, transparent communication, and long-term talent
              partnerships.
            </p>

            <Link
              href="/about"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[oklch(39.8%_0.07_227.392)] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-[#07394B]"
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
      </section>

      {/* 3B. Our Services Section */}
      <section className="border-t border-[#E5EEF2] bg-gradient-to-b from-[#F4FAFC] to-[#EBF6FA] py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-5 bg-[oklch(39.8%_0.07_227.392)]" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#17647B]">
                Our Services
              </span>
            </div>

            <h2 className="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#152B38]">
              Comprehensive Recruitment Solutions
            </h2>

            <p className="mt-2.5 text-sm sm:text-base text-[#3E5A6B] leading-relaxed">
              Helping businesses find, hire and build high-performing teams through specialized
              recruitment and flexible staffing solutions.
            </p>
          </div>

          {/* Four Service Cards Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => (
              <div
                key={service.id}
                className="group flex h-full flex-col justify-between rounded-2xl border border-[#DCE8ED] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#7CCAD8] hover:bg-[#F0F9FB] hover:shadow-md"
              >
                <div>
                  {/* Icon Container */}
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#DCE8ED]/70 bg-[#F1F8FB] transition-colors group-hover:border-[#BCE0EC] group-hover:bg-white group-hover:shadow-xs">
                    {service.icon}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#152B38] leading-snug">
                    {service.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-[#4F6A78] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-2">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[oklch(39.8%_0.07_227.392)] transition-colors group-hover:text-[#07394B]"
                  >
                    <span>Explore Services</span>
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-150 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
