"use client";

interface IndustryItem {
  name: string;
  icon: React.ReactNode;
}

const industries: IndustryItem[] = [
  {
    name: "IT & Technology",
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
          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
        />
      </svg>
    ),
  },
  {
    name: "BFSI & Fintech",
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
          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5M3 21h18M12 6.75h.008v.008H12V6.75Z"
        />
      </svg>
    ),
  },
  {
    name: "Healthcare Tech",
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
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    ),
  },
  {
    name: "E-commerce & Retail",
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
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
    ),
  },
  {
    name: "BPO & Customer Ops",
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
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
        />
      </svg>
    ),
  },
  {
    name: "Manufacturing & Auto",
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
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    ),
  },
];

export function IndustriesSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#F1F8FB]/50 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-[oklch(39.8%_0.07_227.392)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[oklch(39.8%_0.07_227.392)]">
              Industries We Serve
            </span>
            <span className="h-0.5 w-6 bg-[oklch(39.8%_0.07_227.392)]" />
          </div>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#152B38] sm:text-4xl">
            Talent Solutions Across Industries
          </h2>
        </div>

        {/* 6 Compact Cards in a Row with Static 3D Depth */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {industries.map((ind) => (
            <div
              key={ind.name}
              className="flex flex-col items-center justify-center rounded-2xl border border-[#DCE8ED] bg-white p-6 text-center shadow-xs transition hover:border-[oklch(39.8%_0.07_227.392)]/50 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCEFF5] text-[oklch(39.8%_0.07_227.392)]">
                {ind.icon}
              </div>
              <h3 className="mt-4 text-sm font-bold text-[#152B38]">
                {ind.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
