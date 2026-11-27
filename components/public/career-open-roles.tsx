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
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function CareerOpenRoles({ jobs }: CareerOpenRolesProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [experience, setExperience] = useState("");

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
  const workModes = useMemo(
    () => [...new Set(jobs.map((job) => job.workMode))].sort(),
    [jobs],
  );
  const experienceRanges = useMemo(
    () => [...new Set(jobs.map((job) => job.experience))].sort(),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        [job.title, job.department, job.location, job.summary, ...job.skills].some((value) =>
          value.toLowerCase().includes(searchTerm),
        );

      return (
        matchesSearch &&
        (!location || job.location === location) &&
        (!department || job.department === department) &&
        (!employmentType || job.employmentType === employmentType) &&
        (!workMode || job.workMode === workMode) &&
        (!experience || job.experience === experience)
      );
    });
  }, [department, employmentType, experience, jobs, location, query, workMode]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    location !== "" ||
    department !== "" ||
    employmentType !== "" ||
    workMode !== "" ||
    experience !== "";

  function clearFilters() {
    setQuery("");
    setLocation("");
    setDepartment("");
    setEmploymentType("");
    setWorkMode("");
    setExperience("");
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside
        aria-labelledby="career-filter-heading"
        className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          <h3
            className="text-base font-semibold text-slate-950"
            id="career-filter-heading"
          >
            Refine your search
          </h3>
          {hasActiveFilters && (
            <button
              className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              onClick={clearFilters}
              type="button"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="mt-5 space-y-5">
          <SearchBar
            label="Search roles"
            onChange={setQuery}
            placeholder="Title, skill, or keyword"
            value={query}
          />
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="career-location-filter"
          >
            Location
            <select
              className={selectClasses}
              id="career-location-filter"
              onChange={(event) => setLocation(event.currentTarget.value)}
              value={location}
            >
              <option value="">All locations</option>
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="career-department-filter"
          >
            Department
            <select
              className={selectClasses}
              id="career-department-filter"
              onChange={(event) => setDepartment(event.currentTarget.value)}
              value={department}
            >
              <option value="">All departments</option>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="career-employment-filter"
          >
            Employment type
            <select
              className={selectClasses}
              id="career-employment-filter"
              onChange={(event) => setEmploymentType(event.currentTarget.value)}
              value={employmentType}
            >
              <option value="">All types</option>
              {employmentTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700" htmlFor="career-work-mode-filter">
            Work mode
            <select className={selectClasses} id="career-work-mode-filter" onChange={(event) => setWorkMode(event.currentTarget.value)} value={workMode}>
              <option value="">All work modes</option>
              {workModes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700" htmlFor="career-experience-filter">
            Experience
            <select className={selectClasses} id="career-experience-filter" onChange={(event) => setExperience(event.currentTarget.value)} value={experience}>
              <option value="">All experience ranges</option>
              {experienceRanges.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </aside>

      <div>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <h3 className="text-lg font-semibold text-slate-950">
            Open opportunities
          </h3>
          <p
            aria-live="polite"
            className="text-sm text-slate-500"
            role="status"
          >
            Showing {filteredJobs.length} of {jobs.length} sample roles
          </p>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="mt-4 space-y-4">
            {filteredJobs.map((job) => (
              <article
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
                key={job.id}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                        {job.department}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {job.employmentType}
                      </span>
                    </div>
                    <h4 className="mt-3 text-xl font-semibold text-slate-950">
                      {job.title}
                    </h4>
                    <p className="mt-2 text-sm text-slate-600">
                      {job.location} <span aria-hidden="true">·</span>{" "}
                      {job.workMode}
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                      {job.summary}
                    </p>
                  </div>
                  <Link
                    className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    href={`/careers/${job.id}`}
                  >
                    View details
                    <span aria-hidden="true" className="ml-2">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              action={
                <button
                  className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  onClick={clearFilters}
                  type="button"
                >
                  Clear filters
                </button>
              }
              description="Try another keyword or remove one of the selected filters."
              title="No matching roles"
            />
          </div>
        )}
        <p className="mt-5 text-xs leading-5 text-slate-500">
          These sample listings are for demonstration and may not represent
          current vacancies.
        </p>
      </div>
    </div>
  );
}
