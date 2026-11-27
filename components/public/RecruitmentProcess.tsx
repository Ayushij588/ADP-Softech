"use client";

interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: StepItem[] = [
  {
    number: "01",
    title: "Understand Your Needs",
    description: "Aligning on technical requirements, team culture, and delivery roadmaps.",
    icon: (
      <svg
        className="h-6 w-6 text-[oklch(39.8%_0.07_227.392)]"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Source & Screen Talent",
    description: "Rigorous technical vetting, portfolio audits, and cultural screening.",
    icon: (
      <svg
        className="h-6 w-6 text-[oklch(39.8%_0.07_227.392)]"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Evaluate & Present Profiles",
    description: "Curated shortlists of high-fit candidates ready for structured interviews.",
    icon: (
      <svg
        className="h-6 w-6 text-[oklch(39.8%_0.07_227.392)]"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Onboard & Scale Quickly",
    description: "Seamless contractual support, documentation, and team onboarding.",
    icon: (
      <svg
        className="h-6 w-6 text-[oklch(39.8%_0.07_227.392)]"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 7.39a17.915 17.915 0 0 1-3.69-3.69m3.69 3.69v-3.69m0 3.69h-3.69"
        />
      </svg>
    ),
  },
];

export function RecruitmentProcess() {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-[#F1F8FB] blur-3xl opacity-70 -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Column: Heading */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[oklch(39.8%_0.07_227.392)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[oklch(39.8%_0.07_227.392)]">
                Our Process
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#152B38] sm:text-4xl lg:text-5xl leading-tight">
              A Simple &amp; <br />
              <span className="text-[oklch(39.8%_0.07_227.392)]">
                Transparent Hiring
              </span> <br />
              Journey
            </h2>

            <p className="mt-5 text-base text-[#3E5866] leading-relaxed">
              We streamline recruitment into an agile, four-stage workflow designed
              to minimize hiring friction and deliver qualified technology and operations talent.
            </p>
          </div>

          {/* Right Column: Creative Sinusoidal Connected Journey with Static 3D Depth */}
          <div className="lg:col-span-8 relative">
            {/* Desktop SVG Connecting Sinusoidal Wave */}
            <div className="hidden md:block absolute top-[44px] left-[5%] right-[5%] h-24 -z-0 pointer-events-none">
              <svg
                viewBox="0 0 800 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Flowing curve connecting all 4 node circles */}
                <path
                  d="M 50 60 C 160 0, 240 120, 350 60 C 460 0, 540 120, 650 60 C 700 30, 750 60, 780 60"
                  stroke="#DCE8ED"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                <path
                  d="M 50 60 C 160 0, 240 120, 350 60 C 460 0, 540 120, 650 60 C 700 30, 750 60, 780 60"
                  stroke="#14B8C4"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* 4 Nodes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 relative z-10">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center text-center group ${
                    index % 2 === 1 ? "md:translate-y-4" : ""
                  }`}
                >
                  {/* Circular Node with static 3D depth */}
                  <div className="relative flex h-20 w-20 sm:h-22 sm:w-22 items-center justify-center rounded-full border-2 border-[#DCE8ED] bg-white p-2 shadow-sm transition-all duration-150 group-hover:border-[oklch(39.8%_0.07_227.392)] group-hover:shadow-md">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#F1F8FB] transition-colors group-hover:bg-[#DCEFF5]">
                      {step.icon}
                    </div>

                    {/* Step badge pill */}
                    <span className="absolute -bottom-2 rounded-full bg-[oklch(39.8%_0.07_227.392)] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      {step.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-6 text-sm sm:text-base font-bold text-[#152B38] group-hover:text-[oklch(39.8%_0.07_227.392)] transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#4F6A78] leading-relaxed max-w-[170px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
