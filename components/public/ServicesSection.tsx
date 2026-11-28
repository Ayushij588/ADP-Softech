"use client";

import Link from "next/link";
import { useState } from "react";
import { recruitmentServices } from "@/constants/public-content";

export function ServicesSection() {
  const [activeTab, setActiveTab] = useState<"ALL" | "IT" | "BPO">("ALL");

  const displayedServices = recruitmentServices.filter((service) => {
    if (activeTab === "IT") return service.category === "IT & Technology";
    if (activeTab === "BPO") return service.category === "BPO & Operations";
    return true;
  });

  return (
    <section
      id="services-section"
      className="py-20 lg:py-28 bg-[#F1F8FB]/60 relative"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[oklch(39.8%_0.07_227.392)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[oklch(39.8%_0.07_227.392)]">
                Comprehensive Recruitment Solutions
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#152B38] sm:text-4xl lg:text-5xl">
              Specialized IT &amp; BPO Staffing
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 rounded-full border border-[#DCE8ED] bg-white p-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeTab === "ALL"
                  ? "bg-[oklch(39.8%_0.07_227.392)] text-white shadow-xs"
                  : "text-[#152B38] hover:bg-[#F1F8FB]"
              }`}
            >
              All Solutions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("IT")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeTab === "IT"
                  ? "bg-[oklch(39.8%_0.07_227.392)] text-white shadow-xs"
                  : "text-[#152B38] hover:bg-[#F1F8FB]"
              }`}
            >
              IT &amp; Tech Staffing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("BPO")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeTab === "BPO"
                  ? "bg-[oklch(39.8%_0.07_227.392)] text-white shadow-xs"
                  : "text-[#152B38] hover:bg-[#F1F8FB]"
              }`}
            >
              BPO &amp; Operations
            </button>
          </div>
        </div>

        {/* Services Cards Grid with Static 3D Depth */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedServices.slice(0, 6).map((service, index) => {
            const isHighlighted = service.highlighted && index === 0;

            return (
              <div
                key={service.id}
                className={`relative flex flex-col justify-between rounded-3xl p-7 transition-all duration-150 ${
                  isHighlighted
                    ? "bg-gradient-to-br from-[#07394B] via-[oklch(39.8%_0.07_227.392)] to-[#102D42] text-white shadow-lg border border-[#07394B]"
                    : "bg-white border border-[#DCE8ED] text-[#152B38] shadow-sm hover:border-[oklch(39.8%_0.07_227.392)]/40 hover:shadow-md"
                }`}
              >
                <div>
                  {/* Category Pill & Icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        isHighlighted
                          ? "bg-white/15 text-[#DCEFF5]"
                          : "bg-[#DCEFF5] text-[#07394B]"
                      }`}
                    >
                      {service.category}
                    </span>

                    <span
                      className={`text-xs font-bold ${
                        isHighlighted ? "text-[#14B8C4]" : "text-[#17647B]"
                      }`}
                    >
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`mt-5 text-xl font-bold tracking-tight ${
                      isHighlighted ? "text-white" : "text-[#152B38]"
                    }`}
                  >
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      isHighlighted ? "text-[#DCEFF5]" : "text-[#4F6A78]"
                    }`}
                  >
                    {service.description}
                  </p>

                  {/* Feature Bullets */}
                  <ul className="mt-5 space-y-2 border-t border-black/5 dark:border-white/10 pt-4">
                    {service.features.slice(0, 3).map((feat) => (
                      <li
                        key={feat}
                        className={`flex items-start gap-2 text-xs ${
                          isHighlighted ? "text-[#DCEFF5]/90" : "text-[#3D5664]"
                        }`}
                      >
                        <span
                          className={`mt-0.5 font-bold ${
                            isHighlighted ? "text-[#14B8C4]" : "text-[oklch(39.8%_0.07_227.392)]"
                          }`}
                        >
                          ✓
                        </span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow Action Button */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/10">
                  <span
                    className={`text-xs font-semibold ${
                      isHighlighted ? "text-[#DCEFF5]" : "text-[#17647B]"
                    }`}
                  >
                    {service.detail}
                  </span>

                  <Link
                    href={`/services#${service.id}`}
                    aria-label={`View details for ${service.name}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                      isHighlighted
                        ? "bg-white text-[oklch(39.8%_0.07_227.392)] hover:bg-[#DCEFF5]"
                        : "bg-[#F1F8FB] text-[#07394B] hover:bg-[#DCEFF5]"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Services Footer Link */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-[#DCE8ED] bg-white px-6 py-3 text-sm font-semibold text-[#152B38] shadow-xs transition hover:border-[oklch(39.8%_0.07_227.392)] hover:bg-[#F1F8FB]"
          >
            Explore all IT &amp; BPO services
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
