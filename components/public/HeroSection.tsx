"use client";

import Image from "next/image";
import Link from "next/link";

type StaffingIconName = "headset" | "code" | "team" | "globe";

interface StaffingCardItem {
  titleLine1: string;
  titleLine2: string;
  image: string;
  alt: string;
  icon: StaffingIconName;
  heightClass: string;
  offsetClass: string;
  featured?: boolean;
}

const staffingCards: StaffingCardItem[] = [
  {
    titleLine1: "BPO",
    titleLine2: "Staffing",
    image: "/images/hero/bpo-staffing.jpg",
    alt: "Professional female customer support executive wearing a headset in a modern office",
    icon: "headset",
    heightClass: "h-[235px] sm:h-[225px] lg:h-[255px]",
    offsetClass: "sm:mt-6 lg:mt-8",
  },
  {
    titleLine1: "IT",
    titleLine2: "Recruitment",
    image: "/images/hero/it-recruitment.jpg",
    alt: "Young male software developer with glasses working on a laptop in an IT office",
    icon: "code",
    heightClass: "h-[235px] sm:h-[275px] lg:h-[310px]",
    offsetClass: "sm:mt-0 lg:mt-0",
    featured: true,
  },
  {
    titleLine1: "Talent",
    titleLine2: "Acquisition",
    image: "/images/hero/talent-acquisition.jpg",
    alt: "Professional female talent acquisition recruiter in a dark formal blazer in a bright office",
    icon: "team",
    heightClass: "h-[235px] sm:h-[245px] lg:h-[275px]",
    offsetClass: "sm:mt-4 lg:mt-5",
  },
  {
    titleLine1: "Offshore",
    titleLine2: "Staffing",
    image: "/images/hero/offshore-staffing.jpg",
    alt: "Professional male IT engineer working at a laptop workstation in a modern office",
    icon: "globe",
    heightClass: "h-[235px] sm:h-[215px] lg:h-[240px]",
    offsetClass: "sm:mt-8 lg:mt-11",
  },
];

function StaffingIcon({ name }: { name: StaffingIconName }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-[oklch(39.8%_0.07_227.392)]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === "headset" && (
        <>
          <path d="M3 13v-1a9 9 0 0 1 18 0v1" />
          <path d="M5 13h2a2 2 0 0 1 2 2v3H7a4 4 0 0 1-4-4v-1Zm14 0h-2a2 2 0 0 0-2 2v3h2a4 4 0 0 0 4-4v-1ZM17 18a5 5 0 0 1-5 3" />
        </>
      )}
      {name === "code" && (
        <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-9-2 10" />
      )}
      {name === "team" && (
        <>
          <circle cx="9" cy="8" r="2.75" />
          <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
          <circle cx="16.5" cy="9.5" r="2.25" />
          <path d="M16 19.5h4.5a4 4 0 0 0-4-4" />
        </>
      )}
      {name === "globe" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8M3.6 15h16.8M12 3a13.5 13.5 0 0 0 0 18M12 3a13.5 13.5 0 0 1 0 18" />
        </>
      )}
    </svg>
  );
}

function StaffingImageCard({
  titleLine1,
  titleLine2,
  image,
  alt,
  icon,
  heightClass,
  offsetClass,
  featured,
  priority,
}: StaffingCardItem & { priority: boolean }) {
  return (
    <div className={`relative ${offsetClass}`}>
      {featured && (
        <svg
          aria-hidden="true"
          viewBox="0 0 36 28"
          fill="none"
          className="pointer-events-none absolute -right-4 -top-6 hidden h-6 w-7 text-[#17647B] sm:block"
        >
          <path d="M4 22L10 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M14 23L24 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M21 26L33 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )}
      <article
        className={`group relative w-full ${heightClass} min-w-0 overflow-hidden rounded-2xl border-4 border-white bg-[#DCEFF5] shadow-[0_12px_28px_rgba(7,57,75,0.12)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-[#6ECFD6] hover:shadow-[0_20px_38px_rgba(7,57,75,0.18)] motion-reduce:transform-none motion-reduce:transition-none`}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1280px) 165px, (min-width: 640px) 22vw, 44vw"
          priority={priority}
          className="object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07394B]/35 via-transparent to-transparent"
        />
        <div className="absolute inset-x-2 bottom-2 flex min-h-10 items-center gap-2 rounded-xl bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur-[2px]">
          <StaffingIcon name={icon} />
          <span className="text-[11px] font-bold leading-[1.15] text-[#07394B]">
            {titleLine1}
            <br />
            {titleLine2}
          </span>
        </div>
      </article>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF5F8] via-[#F1F8FB] to-white py-10 lg:py-16">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block" aria-hidden="true">
        <div className="absolute inset-8 rounded-[48%] bg-[#DCEFF5]/70 blur-3xl" />
        <svg
          className="absolute right-0 top-1/2 h-[85%] w-[85%] -translate-y-1/2 opacity-40"
          viewBox="0 0 600 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M85 210C155 90 345 45 510 130" stroke="#9AD7DC" strokeWidth="2" />
          <path d="M100 275C205 385 410 390 535 275" stroke="#C1E5EA" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[46fr_54fr] lg:gap-8">
          <div className="z-10">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[oklch(39.8%_0.07_227.392)]" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#17647B] sm:text-sm">
                IT &amp; BPO RECRUITMENT | OFFSHORE STAFFING
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold leading-[1.12] tracking-tight text-[#152B38] sm:text-5xl lg:text-[56px]">
              People. Talent. <br />
              <span className="text-[oklch(39.8%_0.07_227.392)]">Business Growth.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#2E4857] sm:text-lg">
              End-to-end IT and BPO recruitment and staffing solutions that help you
              hire skilled talent, build high-performing teams, and scale faster.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/employers"
                className="group inline-flex items-center gap-2 rounded-full bg-[oklch(39.8%_0.07_227.392)] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#07394B]/15 transition-all duration-150 hover:bg-[#07394B] sm:text-base"
              >
                <span>Hire Talent</span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-150 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center rounded-full border border-[#152B38] bg-white px-7 py-3.5 text-sm font-semibold text-[#152B38] shadow-xs transition hover:border-[oklch(39.8%_0.07_227.392)] hover:bg-[#F1F8FB] sm:text-base"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* Right Column: Staggered 4-Card Portrait Composition */}
          <div className="relative mx-auto w-full max-w-[660px] pt-4 sm:pt-6">
            {/* Subtle circular decorative backdrop behind the cards */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DCEFF5]/75 sm:h-[370px] sm:w-[370px]"
              aria-hidden="true"
            />
            <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-4 sm:gap-3 lg:gap-3.5">
              {staffingCards.map((card, index) => (
                <StaffingImageCard
                  key={`${card.titleLine1}-${card.titleLine2}`}
                  {...card}
                  priority={index < 2}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
