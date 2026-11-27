"use client";

import Link from "next/link";
import Image from "next/image";

export function EmployerCTA() {
  return (
    <section className="py-12 sm:py-16 bg-[#F1F8FB]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Horizontal Rounded Banner with Subtle Depth */}
        <div
          className="relative overflow-hidden rounded-3xl sm:rounded-[36px] bg-gradient-to-r from-[#07394B] via-[#0D4457] to-[oklch(39.8%_0.07_227.392)] shadow-xl"
          style={{
            boxShadow: "0 20px 40px -10px rgba(7, 57, 75, 0.25)",
          }}
        >
          <div className="grid lg:grid-cols-12 items-center">
            {/* Left: Professional Team Photograph (3 Professionals Collaborating) */}
            <div className="lg:col-span-4 relative h-60 sm:h-72 lg:h-[260px] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="ADP Softech Team Collaboration"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center"
              />
              {/* Soft gradient blend on right */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07394B] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#07394B]/40 lg:to-[#07394B]" />
            </div>

            {/* Right: Heading, Description, and Action Button */}
            <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm sm:text-base font-bold text-[#07394B] shadow-md transition hover:bg-[#DCEFF5] w-full md:w-auto"
                >
                  <span>Get in Touch</span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-150 group-hover:translate-x-1 text-[oklch(39.8%_0.07_227.392)]"
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
