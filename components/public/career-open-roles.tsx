"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchBar } from "@/components/ui/search-bar";
import type { PublicJob } from "@/constants/public-content";

type CareerOpenRolesProps = {
  jobs: readonly PublicJob[];
};

const selectClasses =
  "mt-2 w-full rounded-xl border border-[#DCE8ED] bg-white px-3 py-2 text-xs sm:text-sm text-[#152B38] outline-none transition focus:border-[oklch(39.8%_0.07_227.392)] focus:ring-2 focus:ring-[#DCEFF5]";

export function CareerOpenRoles({ jobs }: CareerOpenRolesProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const locations = useMemo(
    () => [...new Set(jobs.map((job) => job.location))].sort(),
    [jobs],
  );
  const departments = useMemo(
    () => [...new Set(jobs.map((job) => job.department))].sort(),
    [jobs],
  );
  const employmentTypes = useMemo(
    () => [...new Set(jobs.map((job) => job.employmentType))].sort(),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        [job.title, job.id, job.department, job.location, job.summary, ...job.skills].some(
          (value) => value.toLowerCase().includes(searchTerm),
        );

      return (
        matchesSearch &&
        (!location || job.location === location) &&
        (!department || job.department === department) &&
        (!employmentType || job.employmentType === employmentType)
      );
    });
  }, [department, employmentType, jobs, location, query]);

  const hasActiveFilters =
    query.trim().length > 0 || location !== "" || department !== "" || employmentType !== "";

  function clearFilters() {
    setQuery("");
    setLocation("");
    setDepartment("");
    setEmploymentType("");
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
      {/* Filter Sidebar */}
      <aside
        aria-labelledby="career-filter-heading"
        className="h-fit rounded-3xl border border-[#DCE8ED] bg-white p-5 sm:p-6 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          <h3
            className="text-sm font-bold uppercase tracking-wider text-[#152B38]"
            id="career-filter-heading"
          >
            Refine Search
          </h3>
          {hasActiveFilters && (
            <button
              className="text-xs font-semibold text-[oklch(39.8%_0.07_227.392)] hover:underline"
              onClick={clearFilters}
              type="button"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <SearchBar
            label="Search roles or skills"
            onChange={setQuery}
            placeholder="e.g. React, DevOps, BPO"
            value={query}
          />

          <label
            className="block text-xs font-bold uppercase tracking-wider text-[#152B38]"
            htmlFor="career-location-filter"
          >
            Location
            <select
              className={selectClasses}
              id="career-location-filter"
              onChange={(event) => setLocation(event.currentTarget.value)}
              value={location}
            >
              <option value="">All Locations</option>
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label
            className="block text-xs font-bold uppercase tracking-wider text-[#152B38]"
            htmlFor="career-department-filter"
          >
            Department
            <select
              className={selectClasses}
              id="career-department-filter"
              onChange={(event) => setDepartment(event.currentTarget.value)}
              value={department}
            >
              <option value="">All Departments</option>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label
            className="block text-xs font-bold uppercase tracking-wider text-[#152B38]"
            htmlFor="career-employment-filter"
          >
            Employment Type
            <select
              className={selectClasses}
              id="career-employment-filter"
              onChange={(event) => setEmploymentType(event.currentTarget.value)}
              value={employmentType}
            >
              <option value="">All Types</option>
              {employmentTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </aside>

      {/* Roles List */}
      <div>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <h3 className="text-lg font-bold text-[#152B38]">
            Published Openings
          </h3>
          <p
            aria-live="polite"
            className="text-xs text-[#607D8B]"
            role="status"
          >
            Showing {filteredJobs.length} of {jobs.length} approved roles
          </p>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="mt-4 space-y-4">
            {filteredJobs.map((job) => (
              <article
                className="rounded-3xl border border-[#DCE8ED] bg-white p-5 sm:p-6 shadow-sm transition hover:border-[oklch(39.8%_0.07_227.392)]/40 hover:shadow-md"
                key={job.id}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[oklch(39.8%_0.07_227.392)] px-2.5 py-0.5 text-[11px] font-bold text-white">
                        {job.id}
                      </span>
                      <span className="rounded-full bg-[#DCEFF5] px-3 py-0.5 text-xs font-semibold text-[#07394B]">
                        {job.department}
                      </span>
                      <span className="rounded-full bg-[#F1F8FB] px-2.5 py-0.5 text-xs text-[#4F6A78] border border-[#DCE8ED]">
                        {job.employmentType} • {job.workMode}
                      </span>
                    </div>

                    <h4 className="mt-3 text-xl font-bold text-[#152B38]">
                      {job.title}
                    </h4>

                    <p className="mt-1 text-xs text-[#607D8B]">
                      {job.location} • Experience: {job.experienceRange}
                    </p>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#3E5866]">
                      {job.summary}
                    </p>

                    {/* Skill Badges */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-[#F1F8FB] px-2 py-0.5 text-[11px] font-medium text-[#152B38] border border-[#DCE8ED]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2.5 shrink-0 pt-2 sm:pt-0">
                    <Link
                      className="rounded-full bg-[oklch(39.8%_0.07_227.392)] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#07394B]"
                      href={`/submit-resume?jobId=${job.id}`}
                    >
                      Apply Now
                    </Link>

                    <Link
                      className="rounded-full border border-[#DCE8ED] bg-[#F1F8FB] px-4 py-2 text-xs font-semibold text-[#152B38] transition hover:bg-[#DCEFF5]"
                      href={`/careers/${job.id}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              action={
                <button
                  className="rounded-full border border-[oklch(39.8%_0.07_227.392)] px-4 py-2 text-xs font-semibold text-[oklch(39.8%_0.07_227.392)] hover:bg-[#DCEFF5]"
                  onClick={clearFilters}
                  type="button"
                >
                  Clear filters
                </button>
              }
              description="Try another keyword or reset location and department filters."
              title="No matching opportunities"
            />
          </div>
        )}
      </div>
    </div>
  );
}
