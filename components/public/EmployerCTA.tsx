"use client";

import Link from "next/link";
import Image from "next/image";

export function EmployerCTA() {
  return (
    <section className="py-12 sm:py-16 bg-[#F1F8FB]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Horizontal Rounded Banner with Subtle Depth */}
        <div
          className="relative overflow-hidden rounded-3xl sm:rounded-[36px] bg-white shadow-xl"
          style={{
            boxShadow: "0 20px 40px -10px rgba(7, 57, 75, 0.25)",
          }}
        >
          <div className="grid lg:grid-cols-12 items-stretch">
            {/* Left: Professional Team Photograph (3 Professionals Collaborating) */}
            <div className="lg:col-span-4 relative h-60 sm:h-72 lg:h-auto lg:min-h-[260px] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="ADP Softech Team Collaboration"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center"
              />
            </div>

            {/* Right: Heading, Description, and Action Button */}
            <div className="lg:col-span-8 bg-gradient-to-r from-[#07394B] via-[#0D4457] to-[oklch(39.8%_0.07_227.392)] p-6 sm:p-8 lg:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-white leading-tight">
                  Ready to Build a Stronger Team?
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#DCEFF5] leading-relaxed">
                  Hire IT experts or BPO professionals and create a talent solution
                  that drives real business growth.
                </p>
              </div>

              {/* Vertical divider on desktop + Button */}
              <div className="flex items-center gap-6 shrink-0 w-full md:w-auto">
                <div className="hidden lg:block h-12 w-px bg-white/20" aria-hidden="true" />

                <Link
                  href="/employers"
                  className="group inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm sm:text-base font-bold text-[#07394B] shadow-md transition-all duration-250 ease-out hover:-translate-y-0.5 hover:bg-[#14B8C4] hover:text-white hover:shadow-lg hover:shadow-[#14B8C4]/25 active:translate-y-0 active:scale-[0.97] active:bg-[#0E9AA5] active:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Get in Touch</span>
                  <span
                    aria-hidden="true"
                    className="inline-block text-[oklch(39.8%_0.07_227.392)] transition-all duration-250 group-hover:translate-x-1 group-hover:text-white group-active:text-white"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
