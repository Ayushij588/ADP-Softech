"use client";

import { useMemo, useState } from "react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ApplicationManagementRecord } from "@/constants/admin-content";
import { applicationManagementRecords } from "@/constants/admin-content";

const pageSize = 5;

const statusTones: Record<
  string,
  "neutral" | "success" | "warning" | "danger" | "info"
> = {
  shortlisted: "success",
  "interview scheduled": "info",
  "in review": "warning",
  new: "info",
  rejected: "danger",
};

function getStatusTone(status: string) {
  return statusTones[status.toLowerCase()] ?? "neutral";
}

const columns: DataTableColumn<ApplicationManagementRecord>[] = [
  {
    key: "candidateName",
    header: "Candidate Name",
    render: (application) => (
      <span className="whitespace-nowrap font-semibold text-slate-900">
        {application.candidateName}
      </span>
    ),
  },
  {
    key: "jobId",
    header: "Job ID",
    render: (application) => (
      <span className="whitespace-nowrap font-medium text-slate-600">
        {application.jobId}
      </span>
    ),
  },
  {
    key: "jobTitle",
    header: "Job Title",
    render: (application) => application.jobTitle,
  },
  {
    key: "status",
    header: "Status",
    render: (application) => (
      <StatusBadge
        label={application.status}
        tone={getStatusTone(application.status)}
      />
    ),
  },
  {
    key: "atsScore",
    header: "ATS Score",
    render: (application) => (
      <span className="font-semibold tabular-nums text-slate-800">
        {application.atsScore}
      </span>
    ),
  },
  {
    key: "submissionDate",
    header: "Submission Date",
    render: (application) => (
      <span className="whitespace-nowrap">{application.submissionDate}</span>
    ),
  },
];

export function ApplicationsManagementView() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredApplications = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return applicationManagementRecords;

    return applicationManagementRecords.filter((application) =>
      Object.values(application).some((value) =>
        value.toLowerCase().includes(searchTerm),
      ),
    );
  }, [query]);

  const totalPages = Math.ceil(filteredApplications.length / pageSize);
  const visibleApplications = filteredApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function updateSearch(value: string) {
    setQuery(value);
    setCurrentPage(1);
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Recruitment operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Applications Management
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Review candidate submissions, job matches, and application status.
          </p>
        </div>
        <StatusBadge label="Sample data · not live" tone="info" />
      </header>

      <section
        aria-label="Applications table"
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SearchBar
            className="w-full sm:max-w-sm"
            label="Search applications"
            onChange={updateSearch}
            placeholder="Search candidate, job ID, or title..."
            value={query}
          />
          <p aria-live="polite" className="text-sm text-slate-500" role="status">
            Showing {filteredApplications.length} of{" "}
            {applicationManagementRecords.length} applications
          </p>
        </div>

        <div className="mt-5">
          <DataTable
            caption="Applications management table"
            columns={columns}
            emptyDescription="Try a different candidate name, job ID, or title."
            emptyTitle="No applications found"
            getRowKey={(application) => application.id}
            rows={visibleApplications}
          />
        </div>

        {totalPages > 1 && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </section>

      <p className="mt-4 text-xs text-slate-500">
        Application records and ATS scores are illustrative sample data.
      </p>
    </main>
  );
}
