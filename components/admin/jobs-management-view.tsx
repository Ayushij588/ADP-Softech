"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { JobFormDialog } from "@/components/admin/job-form-dialog";
import { FormDialog } from "@/components/ui/form-dialog";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import type { JobManagementRecord } from "@/constants/admin-content";
import { jobManagementRecords } from "@/constants/admin-content";
import { employerInquiries } from "@/constants/super-admin-content";
import {
  jobEmploymentTypes,
  jobStatuses,
  type JobFormValues,
} from "@/lib/admin-form-schemas";
import { downloadXlsx } from "@/lib/xlsx-export";

type EmployerInquiryRecord = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  roleNeeded: string;
  positions: number;
  engagementType: string;
  workMode: string;
  timeline: string;
  receivedDate: string;
  status: string;
};

type JobDialogState = {
  mode: "add" | "edit" | "view";
  job?: JobManagementRecord;
  prefill?: Partial<JobFormValues>;
  inquiryId?: string;
};

const pageSize = 5;

const statusTones: Record<
  string,
  "neutral" | "success" | "warning" | "hold" | "danger" | "closed" | "info"
> = {
  published: "success",
  active: "success",
  approved: "info",
  "internal review": "warning",
  draft: "neutral",
  "on hold": "hold",
  closed: "closed",
  archived: "neutral",
};

const filterClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

function getStatusTone(status: string) {
  return statusTones[status.toLowerCase()] ?? "neutral";
}

function escapeCsv(value: string) {
  const safeValue = /^[\t\r\n ]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

function JobDetailsDialog({
  job,
  onClose,
  onEdit,
}: {
  job: JobManagementRecord;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <FormDialog
      description="Internal JD details, confidential client file, approved public summary, and version history."
      maxWidthClassName="max-w-3xl"
      onClose={onClose}
      title={`${job.jobId} · ${job.title}`}
    >
      <div className="space-y-6 px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={job.status} tone={getStatusTone(job.status)} />
          <StatusBadge
            label={job.publication}
            tone={job.publication === "Published" ? "success" : "neutral"}
          />
          <StatusBadge label={`JD ${job.currentVersion}`} tone="info" />
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="Record ID" value={job.id} />
          <DetailItem label="Client name (internal)" value={job.clientName} />
          <DetailItem label="Original JD file" value={job.originalJdFile || "Created manually"} />
          <DetailItem label="Department" value={job.category} />
          <DetailItem label="Location & Work mode" value={`${job.location} · ${job.workMode}`} />
          <DetailItem label="Work timings / time zone" value={job.workTimings} />
          <DetailItem label="Engagement type" value={job.detail} />
          <DetailItem label="Experience required" value={job.experienceRequired} />
          <DetailItem label="Mandatory skills" value={job.mandatorySkills.join(", ")} />
          <DetailItem label="Preferred skills" value={job.preferredSkills.join(", ")} />
          <DetailItem label="Education" value={job.education} />
          <DetailItem label="Certifications" value={job.certifications.join(", ")} />
          <DetailItem label="Positions" value={String(job.numberOfPositions)} />
          <DetailItem label="Budget / rate (internal)" value={job.budget} />
          <DetailItem label="Application deadline" value={job.deadline} />
          <DetailItem label="Recruiter owner" value={job.recruiterOwner} />
        </dl>

        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Approved public JD summary</p>
          <p className="mt-1.5 text-sm leading-6 text-slate-800">{job.publicDescription}</p>
        </div>

        {job.eligibility && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Eligibility / restrictions</p>
            <p className="mt-1 text-sm text-slate-800">{job.eligibility}</p>
          </div>
        )}

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Responsibilities</p>
          <p className="mt-1 text-sm leading-6 text-slate-800">{job.responsibilities}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">JD version history</p>
          <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50">
            {job.versions.map((ver) => (
              <li className="px-4 py-3 text-xs" key={`${job.id}-${ver.version}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">{ver.version} · {ver.updatedBy}</span>
                  <span className="text-slate-500">{ver.updatedAt}</span>
                </div>
                <p className="mt-1 text-slate-600">{ver.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-7">
        <Link className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/jobs/${job.id}`}>
          Open full JD page
        </Link>
        <div className="flex gap-2">
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={onEdit} type="button">Edit JD</button>
          <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800" onClick={onClose} type="button">Done</button>
        </div>
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
  const [jobs, setJobs] = useState<JobManagementRecord[]>(() => [
    ...jobManagementRecords,
  ]);
  const [inquiries, setInquiries] = useState<EmployerInquiryRecord[]>(() =>
    employerInquiries.map((item) => ({ ...item })),
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialog, setDialog] = useState<JobDialogState | null>(null);
  const [nextJobNumber, setNextJobNumber] = useState(1043);
  const [exportMessage, setExportMessage] = useState("");

  const departments = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.category))).sort(),
    [jobs],
  );
  const workModes = ["Remote", "Hybrid", "On-site"] as const;
  const clients = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.clientName))).sort(),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        Object.values(job).some((value) =>
          String(value).toLowerCase().includes(searchTerm),
        );
      const matchesStatus = !statusFilter || job.status === statusFilter;
      const matchesDepartment =
        !departmentFilter || job.category === departmentFilter;
      const matchesType = !typeFilter || job.detail === typeFilter;
      const matchesWorkMode = !workModeFilter || job.workMode === workModeFilter;
      const matchesClient = !clientFilter || job.clientName === clientFilter;

      return (
        matchesSearch && matchesStatus && matchesDepartment && matchesType &&
        matchesWorkMode && matchesClient
      );
    });
  }, [clientFilter, departmentFilter, jobs, query, statusFilter, typeFilter, workModeFilter]);

  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const visibleJobs = filteredJobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function resetPage() {
    setCurrentPage(1);
  }

  function exportJobs() {
    const headings = [
      "Job ID",
      "JD Version",
      "Job Title",
      "Client",
      "Department",
      "Location",
      "Work Mode",
      "Employment Type",
      "Experience Required",
      "Positions",
      "Budget",
      "Status",
      "Publication",
      "Applications",
      "Deadline",
      "Recruiter Owner",
    ];
    const rows = filteredJobs.map((job) => [
      job.jobId,
      job.currentVersion,
      job.title,
      job.clientName,
      job.category,
      job.location,
      job.workMode,
      job.detail,
      job.experienceRequired,
      String(job.numberOfPositions),
      job.budget,
      job.status,
      job.publication,
      job.metric,
      job.deadline,
      job.recruiterOwner,
    ]);
    const csv = [headings, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "adp-softech-jobs.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setExportMessage(`${filteredJobs.length} job records exported as CSV.`);
  }

  function exportJobsXlsx() {
    const headings = [
      "Job ID",
      "JD Version",
      "Job Title",
      "Client",
      "Department",
      "Location",
      "Work Mode",
      "Employment Type",
      "Experience Required",
      "Positions",
      "Budget",
      "Status",
      "Publication",
      "Applications",
      "Deadline",
      "Recruiter Owner",
    ];
    const rows = filteredJobs.map((job) => [
      job.jobId,
      job.currentVersion,
      job.title,
      job.clientName,
      job.category,
      job.location,
      job.workMode,
      job.detail,
      job.experienceRequired,
      String(job.numberOfPositions),
      job.budget,
      job.status,
      job.publication,
      job.metric,
      job.deadline,
      job.recruiterOwner,
    ]);
    downloadXlsx("adp-softech-jobs.xlsx", "Jobs", headings, rows);
    setExportMessage(`${filteredJobs.length} job records exported as XLSX.`);
  }

  function saveJob(fields: JobFormValues) {
    if (dialog?.mode === "edit" && dialog.job) {
      setJobs((currentJobs) =>
        currentJobs.map((job) => {
          if (job.id !== dialog.job?.id) return job;
          const nextVersionNum = job.versions.length + 1;
          const nextVersion = `v${nextVersionNum}`;
          return {
            ...job,
            ...fields,
            mandatorySkills: fields.mandatorySkills.split(",").map((item) => item.trim()).filter(Boolean),
            preferredSkills: fields.preferredSkills.split(",").map((item) => item.trim()).filter(Boolean),
            certifications: fields.certifications.split(",").map((item) => item.trim()).filter(Boolean),
            currentVersion: nextVersion,
            date: "Just now",
            versions: [
              {
                version: nextVersion,
                updatedAt: "Just now",
                updatedBy: fields.recruiterOwner || "Demo Recruiter",
                summary: `Updated JD fields (${fields.status} · ${fields.publication}).`,
              },
              ...job.versions,
            ],
          };
        }),
      );
      setExportMessage(`Saved new version for ${dialog.job.jobId} in demo state.`);
    } else {
      const id = `JOB-${String(nextJobNumber).padStart(4, "0")}`;
      const jobId = `ADP-JD-${String(nextJobNumber).padStart(4, "0")}`;
      setNextJobNumber((current) => current + 1);
      setJobs((currentJobs) => [
        {
          id,
          ...fields,
          jobId,
          mandatorySkills: fields.mandatorySkills.split(",").map((item) => item.trim()).filter(Boolean),
          preferredSkills: fields.preferredSkills.split(",").map((item) => item.trim()).filter(Boolean),
          certifications: fields.certifications.split(",").map((item) => item.trim()).filter(Boolean),
          currentVersion: "v1",
          versions: [
            {
              version: "v1",
              updatedAt: "Just now",
              updatedBy: fields.recruiterOwner || "Demo Recruiter",
              summary: dialog?.inquiryId
                ? `Initial JD created from employer inquiry ${dialog.inquiryId}.`
                : "Initial JD created in demo workspace.",
            },
          ],
          date: "Just now",
          metric: "0 applicants",
          score: "—",
        },
        ...currentJobs,
      ]);
      if (dialog?.inquiryId) {
        setInquiries((current) =>
          current.map((item) =>
            item.id === dialog.inquiryId ? { ...item, status: "Converted to JD" } : item,
          ),
        );
      }
      setExportMessage(`Created ${jobId} in local demo state.`);
    }

    setDialog(null);
    resetPage();
  }

  function updateJobWorkflow(id: string, updates: Partial<JobManagementRecord>, label: string) {
    setJobs((current) =>
      current.map((item) => (item.id === id ? { ...item, ...updates, date: "Just now" } : item)),
    );
    setExportMessage(label);
  }

  const columns: DataTableColumn<JobManagementRecord>[] = [
    {
      key: "id",
      header: "Job ID",
      render: (job) => (
        <Link className="whitespace-nowrap font-semibold text-blue-700 hover:text-blue-900" href={`/admin/jobs/${job.id}`}>
          {job.jobId}
          <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">{job.currentVersion}</span>
        </Link>
      ),
    },
    {
      key: "title",
      header: "Job title",
      render: (job) => (
        <span className="min-w-44 font-semibold text-slate-900">
          {job.title}
        </span>
      ),
    },
    {
      key: "clientName",
      header: "Client",
      render: (job) => job.clientName,
    },
    {
      key: "category",
      header: "Department",
      render: (job) => job.category,
    },
    {
      key: "location",
      header: "Location",
      render: (job) => `${job.location} (${job.workMode})`,
    },
    {
      key: "status",
      header: "Workflow & Visibility",
      render: (job) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge label={job.status} tone={getStatusTone(job.status)} />
          <StatusBadge
            label={job.publication}
            tone={job.publication === "Published" ? "success" : "neutral"}
          />
        </div>
      ),
    },
    {
      key: "metric",
      header: "Applications",
      render: (job) => <span className="whitespace-nowrap">{job.metric}</span>,
    },
    {
      key: "deadline",
      header: "Deadline",
      render: (job) => <span className="whitespace-nowrap">{job.deadline}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (job) => (
        <div className="flex flex-wrap justify-end gap-1.5">
          <button
            className="whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
            onClick={() => setDialog({ mode: "view", job })}
            type="button"
          >
            Quick view
          </button>
          <button
            className="whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            onClick={() => setDialog({ mode: "edit", job })}
            type="button"
          >
            Edit
          </button>
          <button
            className="whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
            onClick={() =>
              updateJobWorkflow(
                job.id,
                {
                  publication: job.publication === "Published" ? "Unpublished" : "Published",
                  status: job.publication === "Published" ? "On Hold" : "Published",
                },
                `${job.jobId} marked ${job.publication === "Published" ? "Unpublished (On Hold)" : "Published"}.`,
              )
            }
            type="button"
          >
            {job.publication === "Published" ? "Unpublish" : "Publish"}
          </button>
          <Link
            className="whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
            href={`/admin/jobs/${job.id}`}
          >
            Full page
          </Link>
        </div>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Recruitment operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Jobs &amp; JD Management
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Create JDs manually or attach confidential client files, manage approved public JDs, and track version history.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            onClick={exportJobs}
            type="button"
          >
            <span aria-hidden="true">↓</span> Export CSV
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            onClick={exportJobsXlsx}
            type="button"
          >
            <span aria-hidden="true">↓</span> Export XLSX
          </button>
          <button
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
            onClick={() => setDialog({ mode: "add" })}
            type="button"
          >
            <span aria-hidden="true" className="mr-1.5">
              +
            </span>
            Create JD
          </button>
        </div>
      </header>

      <section
        aria-label="Job listings and filters"
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SearchBar
            label="Search JDs"
            onChange={(value) => {
              setQuery(value);
              resetPage();
            }}
            placeholder="Search title, Job ID, client, skills..."
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
            emptyLabel="All engagement types"
            label="Engagement type"
            onChange={(value) => {
              setTypeFilter(value);
              resetPage();
            }}
            options={jobEmploymentTypes}
            value={typeFilter}
          />
          <FilterSelect
            emptyLabel="All work modes"
            label="Work mode"
            onChange={(value) => {
              setWorkModeFilter(value);
              resetPage();
            }}
            options={workModes}
            value={workModeFilter}
          />
          <FilterSelect
            emptyLabel="All clients"
            label="Client"
            onChange={(value) => {
              setClientFilter(value);
              resetPage();
            }}
            options={clients}
            value={clientFilter}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p aria-live="polite" className="text-sm text-slate-500" role="status">
            Showing {filteredJobs.length} of {jobs.length} JDs
          </p>
          {(query || statusFilter || departmentFilter || typeFilter || workModeFilter || clientFilter) && (
            <button
              className="text-sm font-medium text-blue-700 hover:text-blue-900"
              onClick={() => {
                setQuery("");
                setStatusFilter("");
                setDepartmentFilter("");
                setTypeFilter("");
                setWorkModeFilter("");
                setClientFilter("");
                resetPage();
              }}
              type="button"
            >
              Clear filters
            </button>
          )}
        </div>

        {exportMessage && (
          <p
            aria-live="polite"
            className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
            role="status"
          >
            {exportMessage}
          </p>
        )}

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

      <section
        aria-label="Employer hiring inquiries"
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Employer Hiring Inquiries</h2>
            <p className="mt-1 text-sm text-slate-500">
              Incoming client staffing inquiries from the public Hire Talent form ready for triage and JD conversion.
            </p>
          </div>
          <StatusBadge label={`${inquiries.filter((i) => i.status === "New").length} New`} tone="info" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {inquiries.map((inquiry) => (
            <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4" key={inquiry.id}>
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">{inquiry.id}</span>
                  <StatusBadge
                    label={inquiry.status}
                    tone={inquiry.status === "Converted to JD" ? "success" : inquiry.status === "New" ? "info" : "warning"}
                  />
                </div>
                <h3 className="mt-2 text-sm font-semibold text-slate-900">{inquiry.roleNeeded}</h3>
                <p className="mt-1 text-xs text-slate-600">{inquiry.companyName} · {inquiry.contactPerson}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {inquiry.positions} positions · {inquiry.engagementType} · {inquiry.workMode} · Timeline: {inquiry.timeline}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">Received {inquiry.receivedDate}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200/70 pt-3">
                {inquiry.status === "New" && (
                  <button
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() =>
                      setInquiries((current) =>
                        current.map((item) => (item.id === inquiry.id ? { ...item, status: "In Review" } : item)),
                      )
                    }
                    type="button"
                  >
                    Mark In Review
                  </button>
                )}
                {inquiry.status !== "Converted to JD" && (
                  <button
                    className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
                    onClick={() =>
                      setDialog({
                        mode: "add",
                        inquiryId: inquiry.id,
                        prefill: {
                          title: inquiry.roleNeeded,
                          clientName: inquiry.companyName,
                          numberOfPositions: inquiry.positions,
                          detail: (jobEmploymentTypes as readonly string[]).includes(inquiry.engagementType)
                            ? (inquiry.engagementType as JobFormValues["detail"])
                            : "Permanent",
                          workMode:
                            inquiry.workMode === "Remote" || inquiry.workMode === "On-site"
                              ? inquiry.workMode
                              : "Hybrid",
                          category: "Technology",
                        },
                      })
                    }
                    type="button"
                  >
                    Convert to JD
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="mt-4 text-xs text-slate-500">
        Add, edit, and version updates apply to this page’s local demo state only. Nothing is sent to a backend server.
      </p>

      {dialog?.mode === "view" && dialog.job && (
        <JobDetailsDialog
          key={dialog.job.id}
          job={dialog.job}
          onClose={() => setDialog(null)}
          onEdit={() => setDialog({ mode: "edit", job: dialog.job })}
        />
      )}
      {dialog && dialog.mode !== "view" && (
        <JobFormDialog
          key={`${dialog.mode}-${dialog.job?.id ?? dialog.inquiryId ?? "new"}`}
          job={dialog.job}
          prefill={dialog.prefill}
          generatedJobId={`ADP-JD-${String(nextJobNumber).padStart(4, "0")}`}
          mode={dialog.mode}
          onClose={() => setDialog(null)}
          onSave={saveJob}
        />
      )}
    </main>
  );
}
