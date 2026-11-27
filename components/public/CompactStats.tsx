"use client";

export function CompactStats() {
  const stats = [
    {
      id: "placed",
      value: "500+",
      label: "Professionals Placed",
      icon: (
        <svg
          className="h-7 w-7 text-[oklch(39.8%_0.07_227.392)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: "partners",
      value: "120+",
      label: "Hiring Partners",
      icon: (
        <svg
          className="h-7 w-7 text-[#17647B]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
          />
        </svg>
      ),
    },
    {
      id: "countries",
      value: "15+",
      label: "Countries Served",
      icon: (
        <svg
          className="h-7 w-7 text-[#14B8C4]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
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
    {
      id: "verticals",
      value: "IT | BPO",
      label: "Talent Verticals",
      icon: (
        <svg
          className="h-7 w-7 text-[oklch(39.8%_0.07_227.392)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.999-3.199a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          className="rounded-2xl sm:rounded-3xl border border-[#DCE8ED] bg-white p-5 sm:p-6 lg:p-7 shadow-lg"
          style={{
            boxShadow: "0 10px 30px -5px rgba(7, 57, 75, 0.08), 0 2px 6px -1px rgba(7, 57, 75, 0.04)",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 items-center">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className={`flex items-center gap-3.5 sm:gap-4 px-2 sm:px-4 ${
                  index !== 0 ? "md:border-l md:border-[#E8F0F3]" : ""
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DCEFF5]/60 border border-[#BCE0EC]/60">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-tight text-[#152B38] leading-none">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-[#4F6A78]">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3.5 pt-3 border-t border-[#F1F8FB] text-center">
            <p className="text-[11px] text-[#78909C] italic">
              *Illustrative operational benchmarks and global talent coverage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
