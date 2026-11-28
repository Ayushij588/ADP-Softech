"use client";

import { useMemo, useState } from "react";
import { jobManagementRecords } from "@/constants/admin-content";

export type RecruitmentDashboardFilterValues = {
  dateRange: "Today" | "Last 7 days" | "Last 30 days" | "This quarter";
  recruiter: string;
  client: string;
  job: string;
};

export const defaultRecruitmentDashboardFilters: RecruitmentDashboardFilterValues = {
  dateRange: "Last 30 days",
  recruiter: "",
  client: "",
  job: "",
};

export function RecruitmentDashboardFilters({
  onApply,
}: {
  onApply: (filters: RecruitmentDashboardFilterValues) => void;
}) {
  const [filters, setFilters] = useState(defaultRecruitmentDashboardFilters);
  const [applied, setApplied] = useState(true);

  const recruiters = useMemo(
    () => [...new Set(jobManagementRecords.map((job) => job.recruiterOwner))].sort(),
    [],
  );
  const clients = useMemo(
    () => [...new Set(jobManagementRecords.map((job) => job.clientName))].sort(),
    [],
  );

  const fieldClassName =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  function updateFilter<Key extends keyof RecruitmentDashboardFilterValues>(
    key: Key,
    value: RecruitmentDashboardFilterValues[Key],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
    setApplied(false);
  }

  function clearFilters() {
    setFilters(defaultRecruitmentDashboardFilters);
    onApply(defaultRecruitmentDashboardFilters);
    setApplied(true);
  }

  function applyFilters() {
    onApply(filters);
    setApplied(true);
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Recruitment dashboard filters">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">Dashboard filters</h2>
          <p className="mt-1 text-xs text-slate-500">Filter metrics by date range, recruiter, client, and Job ID.</p>
        </div>
        <button className="self-start text-xs font-semibold text-blue-700 hover:text-blue-900 sm:self-auto" onClick={clearFilters} type="button">Reset filters</button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">Date range
          <select className={fieldClassName} value={filters.dateRange} onChange={(event) => updateFilter("dateRange", event.currentTarget.value as RecruitmentDashboardFilterValues["dateRange"])}>
            <option>Today</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This quarter</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">Recruiter
          <select className={fieldClassName} value={filters.recruiter} onChange={(event) => updateFilter("recruiter", event.currentTarget.value)}>
            <option value="">All recruiters</option>
            {recruiters.map((recruiter) => <option key={recruiter} value={recruiter}>{recruiter}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">Client
          <select className={fieldClassName} value={filters.client} onChange={(event) => updateFilter("client", event.currentTarget.value)}>
            <option value="">All clients</option>
            {clients.map((client) => <option key={client} value={client}>{client}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">Job ID
          <select className={fieldClassName} value={filters.job} onChange={(event) => updateFilter("job", event.currentTarget.value)}>
            <option value="">All jobs</option>
            {jobManagementRecords.map((job) => (
              <option key={job.jobId} value={job.jobId}>
                {job.jobId} · {job.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
        <p className="text-xs text-slate-500" aria-live="polite">
          {applied
            ? `Showing ${filters.dateRange}${filters.recruiter ? ` · ${filters.recruiter}` : ""}${filters.client ? ` · ${filters.client}` : ""}${filters.job ? ` · ${filters.job}` : ""}`
            : "Select Apply filters to update the dashboard."}
        </p>
        <button className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800" onClick={applyFilters} type="button">Apply filters</button>
      </div>
    </section>
  );
}
