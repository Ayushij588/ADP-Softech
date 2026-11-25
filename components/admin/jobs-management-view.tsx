"use client";

import { useMemo, useRef, useState } from "react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { JobFormDialog } from "@/components/admin/job-form-dialog";
import { FormDialog } from "@/components/ui/form-dialog";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AdminManagementRecord } from "@/constants/admin-content";
import { jobManagementRecords } from "@/constants/admin-content";
import {
  jobEmploymentTypes,
  jobStatuses,
  type JobFormValues,
} from "@/lib/admin-form-schemas";

type JobDialogState = {
  mode: "add" | "edit" | "view";
  job?: AdminManagementRecord;
};

const pageSize = 5;

const statusTones: Record<
  string,
  "neutral" | "success" | "warning" | "danger" | "info"
> = {
  published: "success",
  draft: "neutral",
  "on hold": "warning",
  closed: "neutral",
};

const filterClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

function getStatusTone(status: string) {
  return statusTones[status.toLowerCase()] ?? "neutral";
}

function JobDetailsDialog({
  job,
  onClose,
}: {
  job: AdminManagementRecord;
  onClose: () => void;
}) {
  return (
    <FormDialog
      description="Sample job listing details."
      onClose={onClose}
      title="Job details"
    >
      <dl className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
        <DetailItem label="Job ID" value={job.id} />
        <DetailItem label="Job title" value={job.title} />
        <DetailItem label="Department" value={job.category} />
        <DetailItem label="Location" value={job.location} />
        <DetailItem label="Employment type" value={job.detail} />
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Status
          </dt>
          <dd className="mt-2">
            <StatusBadge label={job.status} tone={getStatusTone(job.status)} />
          </dd>
        </div>
        <DetailItem label="Applications" value={job.metric} />
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Last updated
          </dt>
          <dd className="mt-1 text-sm text-slate-900">{job.date}</dd>
        </div>
      </dl>
      <div className="flex justify-end border-t border-slate-100 px-5 py-4 sm:px-7">
        <button
          className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          onClick={onClose}
          type="button"
        >
          Done
        </button>
      </div>
    </FormDialog>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-900">{value || "—"}</dd>
    </div>
  );
}

function FilterSelect({
  label,
  emptyLabel,
  value,
  options,
  onChange,
}: {
  label: string;
  emptyLabel: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <select
        className={`${filterClassName} mt-1.5`}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function JobsManagementView() {
  const [jobs, setJobs] = useState<AdminManagementRecord[]>(() => [
    ...jobManagementRecords,
  ]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialog, setDialog] = useState<JobDialogState | null>(null);
  const nextJobNumber = useRef(1043);

  const departments = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.category))).sort(),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        Object.values(job).some((value) =>
          value.toLowerCase().includes(searchTerm),
        );
      const matchesStatus = !statusFilter || job.status === statusFilter;
      const matchesDepartment =
        !departmentFilter || job.category === departmentFilter;
      const matchesType = !typeFilter || job.detail === typeFilter;

      return (
        matchesSearch && matchesStatus && matchesDepartment && matchesType
      );
    });
  }, [departmentFilter, jobs, query, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const visibleJobs = filteredJobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function resetPage() {
    setCurrentPage(1);
  }

  function saveJob(fields: JobFormValues) {
    if (dialog?.mode === "edit" && dialog.job) {
      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === dialog.job?.id ? { ...job, ...fields } : job,
        ),
      );
    } else {
      const id = `JOB-${String(nextJobNumber.current).padStart(4, "0")}`;
      nextJobNumber.current += 1;
      setJobs((currentJobs) => [
        {
          id,
          ...fields,
          date: "Just now",
          metric: "0 applicants",
          score: "—",
        },
        ...currentJobs,
      ]);
    }

    setDialog(null);
    resetPage();
  }

  const columns: DataTableColumn<AdminManagementRecord>[] = [
    {
      key: "id",
      header: "Job ID",
      render: (job) => (
        <span className="whitespace-nowrap font-medium text-slate-600">
          {job.id}
        </span>
      ),
    },
    {
      key: "title",
      header: "Job title",
      render: (job) => (
        <span className="min-w-48 font-semibold text-slate-900">
          {job.title}
        </span>
      ),
    },
    {
      key: "category",
      header: "Department",
      render: (job) => job.category,
    },
    {
      key: "location",
      header: "Location",
      render: (job) => job.location,
    },
    {
      key: "detail",
      header: "Type",
      render: (job) => job.detail,
    },
    {
      key: "status",
      header: "Status",
      render: (job) => (
        <StatusBadge label={job.status} tone={getStatusTone(job.status)} />
      ),
    },
    {
      key: "metric",
      header: "Applications",
      render: (job) => job.metric,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (job) => (
        <div className="flex min-w-48 justify-end gap-2">
          <button
            className="rounded-md px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
            onClick={() => setDialog({ mode: "view", job })}
            type="button"
          >
            View job
          </button>
          <button
            className="rounded-md px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            onClick={() => setDialog({ mode: "edit", job })}
            type="button"
          >
            Edit job
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Recruitment operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Jobs Management
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Manage open roles, review job details, and track application volume.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label="Sample data · not live" tone="info" />
          <button
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
            onClick={() => setDialog({ mode: "add" })}
            type="button"
          >
            <span aria-hidden="true" className="mr-1.5">
              +
            </span>
            Add job
          </button>
        </div>
      </header>

      <section
        aria-label="Job listings and filters"
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SearchBar
            className="sm:col-span-2 xl:col-span-1"
            label="Search jobs"
            onChange={(value) => {
              setQuery(value);
              resetPage();
            }}
            placeholder="Search title, ID, location..."
            value={query}
          />
          <FilterSelect
            emptyLabel="All statuses"
            label="Status"
            onChange={(value) => {
              setStatusFilter(value);
              resetPage();
            }}
            options={jobStatuses}
            value={statusFilter}
          />
          <FilterSelect
            emptyLabel="All departments"
            label="Department"
            onChange={(value) => {
              setDepartmentFilter(value);
              resetPage();
            }}
            options={departments}
            value={departmentFilter}
          />
          <FilterSelect
            emptyLabel="All employment types"
            label="Employment type"
            onChange={(value) => {
              setTypeFilter(value);
              resetPage();
            }}
            options={jobEmploymentTypes}
            value={typeFilter}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p aria-live="polite" className="text-sm text-slate-500" role="status">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
          {(query || statusFilter || departmentFilter || typeFilter) && (
            <button
              className="text-sm font-medium text-blue-700 hover:text-blue-900"
              onClick={() => {
                setQuery("");
                setStatusFilter("");
                setDepartmentFilter("");
                setTypeFilter("");
                resetPage();
              }}
              type="button"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-4">
          <DataTable
            caption="Jobs management table"
            columns={columns}
            emptyDescription="Try changing your search or filters to find jobs."
            emptyTitle="No jobs match your filters"
            getRowKey={(job) => job.id}
            rows={visibleJobs}
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
        Add and edit actions update this page’s temporary in-memory demo data
        only. Nothing is sent to or saved by a server.
      </p>

      {dialog?.mode === "view" && dialog.job && (
        <JobDetailsDialog
          key={dialog.job.id}
          job={dialog.job}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog && dialog.mode !== "view" && (
        <JobFormDialog
          key={`${dialog.mode}-${dialog.job?.id ?? "new"}`}
          job={dialog.job}
          mode={dialog.mode}
          onClose={() => setDialog(null)}
          onSave={saveJob}
        />
      )}
    </main>
  );
}
