import Link from "next/link";
import { recruitmentServices } from "@/constants/public-content";

export default function ServicesPage() {
  const itServices = recruitmentServices.filter((s) => s.category === "IT & Technology");
  const bpoServices = recruitmentServices.filter((s) => s.category === "BPO & Operations");

  return (
    <main className="bg-[#F1F8FB] min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#07394B] to-[#102D42] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-22">
          <p className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
            ADP Softech Talent Solutions
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Specialized IT &amp; BPO Staffing Services
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#DCEFF5] leading-relaxed">
            From single expert hires to cross-border offshore squads and high-volume customer experience centers. Tailored talent acquisition for modern business scale.
          </p>
        </div>
      </section>

      {/* IT & Technology Staffing Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[oklch(39.8%_0.07_227.392)]">
            Technology Practice
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#152B38]">
            IT Recruitment &amp; Offshore Engineering
          </h2>
          <p className="mt-2 text-sm text-[#4F6A78] max-w-xl">
            Sourcing, technical vetting, and onboarding for software development, cloud, data, and architecture teams.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {itServices.map((service, idx) => (
            <article
              id={service.id}
              key={service.id}
              className="flex flex-col justify-between rounded-3xl border border-[#DCE8ED] bg-white p-6 sm:p-7 shadow-sm transition hover:border-[oklch(39.8%_0.07_227.392)]/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#DCEFF5] px-2.5 py-0.5 text-[11px] font-bold text-[#07394B]">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-[#17647B]">
                    IT &amp; Tech
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#152B38]">
                  {service.name}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#3E5866] leading-relaxed">
                  {service.description}
                </p>

                <ul className="mt-5 space-y-2 border-t border-[#DCE8ED] pt-4">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-xs text-[#4F6A78]">
                      <span className="font-bold text-[oklch(39.8%_0.07_227.392)]">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DCE8ED]">
                <Link
                  href="/employers"
                  className="inline-flex items-center text-xs font-semibold text-[oklch(39.8%_0.07_227.392)] hover:text-[#07394B] transition"
                >
                  Hire for this role →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BPO & Customer Operations Section */}
      <section className="bg-white border-y border-[#DCE8ED] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
              Operations Practice
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#152B38]">
              BPO &amp; Customer Experience Staffing
            </h2>
            <p className="mt-2 text-sm text-[#4F6A78] max-w-xl">
              High-volume voice, non-voice, technical support, and back-office operations talent for 24/7 global coverage.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bpoServices.map((service, idx) => (
              <article
                id={service.id}
                key={service.id}
                className="flex flex-col justify-between rounded-3xl border border-[#DCE8ED] bg-[#F1F8FB] p-6 sm:p-7 shadow-xs transition hover:border-[oklch(39.8%_0.07_227.392)]/40 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#DCEFF5] px-2.5 py-0.5 text-[11px] font-bold text-[#07394B]">
                      BPO 0{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#14B8C4]">
                      BPO &amp; Ops
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#152B38]">
                    {service.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-[#3E5866] leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-[#DCE8ED] pt-4">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-[#4F6A78]">
                        <span className="font-bold text-[#14B8C4]">✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DCE8ED]">
                  <Link
                    href="/employers"
                    className="inline-flex items-center text-xs font-semibold text-[#07394B] hover:text-[oklch(39.8%_0.07_227.392)] transition"
                  >
                    Discuss BPO Mandate →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="rounded-3xl bg-[#07394B] p-8 sm:p-12 text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Ready to Build Your Engineering or BPO Squad?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#DCEFF5] max-w-xl mx-auto">
            Contact ADP Softech for an initial scoping consultation and talent availability estimate.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/employers"
              className="rounded-full bg-[oklch(39.8%_0.07_227.392)] px-8 py-3 text-sm font-semibold text-white shadow-xs hover:bg-white hover:text-[#07394B] transition"
            >
              Hire Talent Now
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Contact Our Advisors
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
