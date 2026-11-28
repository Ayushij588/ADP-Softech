"use client";

import Link from "next/link";
import Image from "next/image";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-white">
      {/* Background ambient shape */}
      <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#F1F8FB] blur-3xl opacity-80 -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Asymmetrical Organic Image Frame with Static 3D Depth */}
          <div className="lg:col-span-6 relative">
            {/* Background blue-teal decorative accents */}
            <div className="absolute -top-4 -left-4 w-32 h-32 rounded-3xl bg-[#DCEFF5] -z-10" />
            <div className="absolute -bottom-6 -right-6 w-44 h-44 rounded-full bg-[#14B8C4]/15 -z-10 blur-xl" />

            {/* Asymmetrical organic curved image container */}
            <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[450px] overflow-hidden rounded-tl-[64px] rounded-br-[64px] rounded-tr-[28px] rounded-bl-[28px] border-4 border-white shadow-xl shadow-[#07394B]/10">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                alt="Modern corporate workplace and welcoming reception"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />

              {/* Reception Brand Overlay */}
              <div className="absolute top-6 left-6 rounded-2xl bg-white/95 px-4 py-2.5 shadow-md border border-[#DCE8ED] backdrop-blur-xs">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-[oklch(39.8%_0.07_227.392)] text-white">
                    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                      <path d="M4 18L12 6L20 18H4Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm font-extrabold text-[#152B38]">
                    ADP <span className="font-semibold text-[oklch(39.8%_0.07_227.392)]">Softech</span>
                  </span>
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07394B]/20 via-transparent to-transparent" />
            </div>
          </div>

          {/* Right Column: Content & Highlights */}
          <div className="lg:col-span-6">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[oklch(39.8%_0.07_227.392)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[oklch(39.8%_0.07_227.392)]">
                About ADP Softech
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#152B38] sm:text-4xl lg:text-5xl leading-tight">
              A Trusted Partner in <br />
              <span className="text-[oklch(39.8%_0.07_227.392)]">
                Talent Acquisition
              </span>
            </h2>

            {/* Introduction paragraph per DOCX requirements */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#2E4857]">
              ADP Softech is an independent technology recruitment, IT staffing,
              and offshore talent solutions company. We connect global businesses
              with qualified engineering and BPO professionals, helping
              organizations scale agile teams while opening meaningful career
              paths for top talent.
            </p>

            {/* Learn More Button */}
            <div className="mt-8">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full bg-[oklch(39.8%_0.07_227.392)] px-7 py-3 text-sm font-semibold text-white shadow-md shadow-[#07394B]/15 transition-all hover:bg-[#07394B]"
              >
                Learn More
                <span
                  aria-hidden="true"
                  className="transition-transform duration-150 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>

            {/* Three Compact Highlight Items with Static 3D Depth */}
            <div className="mt-12 space-y-4 border-t border-[#DCE8ED] pt-8">
              {/* Highlight 1 */}
              <div className="flex items-center gap-4 rounded-2xl border border-[#DCE8ED] bg-[#F1F8FB] p-3.5 transition hover:border-[oklch(39.8%_0.07_227.392)]/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DCEFF5] text-[oklch(39.8%_0.07_227.392)]">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.004 0H9.496m5.004 0a3 3 0 0 0 2.25-2.25L17.25 9a3 3 0 0 0-3-3h-4.5a3 3 0 0 0-3 3l.5 3a3 3 0 0 0 2.25 2.25m5.004 0h-5.004"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-[#152B38]">10+</p>
                  <p className="text-xs font-semibold text-[#4F6A78]">
                    Years of Industry Experience in Technology Hiring
                  </p>
                </div>
              </div>

              {/* Highlight 2 */}
              <div className="flex items-center gap-4 rounded-2xl border border-[#DCE8ED] bg-[#F1F8FB] p-3.5 transition hover:border-[oklch(39.8%_0.07_227.392)]/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DCEFF5] text-[oklch(39.8%_0.07_227.392)]">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-[#152B38]">98%</p>
                  <p className="text-xs font-semibold text-[#4F6A78]">
                    Client Satisfaction &amp; Retained Hiring Partnerships
                  </p>
                </div>
              </div>

              {/* Highlight 3 */}
              <div className="flex items-center gap-4 rounded-2xl border border-[#DCE8ED] bg-[#F1F8FB] p-3.5 transition hover:border-[oklch(39.8%_0.07_227.392)]/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DCEFF5] text-[oklch(39.8%_0.07_227.392)]">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-[#152B38]">500+</p>
                  <p className="text-xs font-semibold text-[#4F6A78]">
                    Successful IT &amp; BPO Professional Placements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
