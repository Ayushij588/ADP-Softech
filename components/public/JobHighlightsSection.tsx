"use client";

import Link from "next/link";
import { openPositions } from "@/constants/public-content";

export function JobHighlightsSection() {
  // Display published active jobs
  const featuredJobs = openPositions.slice(0, 3);

  return (
    <section className="py-20 lg:py-24 bg-[#F1F8FB]/70 relative border-t border-[#DCE8ED]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[oklch(39.8%_0.07_227.392)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[oklch(39.8%_0.07_227.392)]">
                Job Highlights
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#152B38] sm:text-4xl">
              Featured Published Opportunities
            </h2>
            <p className="mt-3 text-sm text-[#4F6A78] max-w-xl">
              Browse approved public job openings. Apply directly without creating an account or logging in.
            </p>
          </div>

          <Link
            href="/careers"
            className="inline-flex items-center gap-2 rounded-full border border-[#DCE8ED] bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#152B38] shadow-xs transition hover:border-[oklch(39.8%_0.07_227.392)] hover:bg-white"
          >
            View all openings
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* 3 Featured Jobs Grid with Static 3D Depth */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featuredJobs.map((job) => (
            <article
              key={job.id}
              className="flex flex-col justify-between rounded-3xl border border-[#DCE8ED] bg-white p-6 shadow-sm transition hover:border-[oklch(39.8%_0.07_227.392)]/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#DCEFF5] px-3 py-1 text-[11px] font-bold text-[#07394B]">
                    {job.id}
                  </span>
                  <span className="text-xs font-semibold text-[#17647B]">
                    {job.employmentType} • {job.workMode}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#152B38] line-clamp-1">
                  {job.title}
                </h3>

                <p className="mt-1.5 text-xs text-[#607D8B]">
                  {job.location} • {job.experienceRange}
                </p>

                <p className="mt-3 text-sm text-[#3E5866] line-clamp-2 leading-relaxed">
                  {job.summary}
                </p>

                {/* Skills tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-[#F1F8FB] px-2 py-0.5 text-[11px] font-medium text-[#152B38] border border-[#DCE8ED]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DCE8ED] flex items-center justify-between gap-3">
                <Link
                  href={`/careers/${job.id}`}
                  className="text-xs font-semibold text-[#07394B] hover:text-[oklch(39.8%_0.07_227.392)] transition"
                >
                  View Details
                </Link>

                <Link
                  href={`/submit-resume?jobId=${job.id}`}
                  className="inline-flex items-center justify-center rounded-full bg-[oklch(39.8%_0.07_227.392)] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#07394B]"
                >
                  Apply Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
