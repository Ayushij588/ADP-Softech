"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  applicationManagementRecords,
  type ApplicationManagementRecord,
} from "@/constants/admin-content";
import { downloadXlsx } from "@/lib/xlsx-export";

const pageSize = 5;

const applicationStatuses = [
  "New Application",
  "Resume Under Review",
  "Shortlisted",
  "Technical Screening",
  "Interview Scheduled",
  "Selected",
  "Rejected",
  "On Hold",
  "Submitted to Client",
  "Client Approved",
  "Client Rejected",
  "Hired / Joined",
] as const;

const statusTones: Record<
  string,
  "neutral" | "success" | "warning" | "hold" | "danger" | "info"
> = {
  shortlisted: "info",
  selected: "success",
  "hired / joined": "success",
  "interview scheduled": "info",
  "technical screening": "info",
  "submitted to client": "info",
  "client approved": "success",
  "resume under review": "warning",
  "new application": "info",
  "on hold": "hold",
  rejected: "danger",
  "client rejected": "danger",
};

function getStatusTone(status: string) {
  return statusTones[status.toLowerCase()] ?? "neutral";
}

function getScore(score: string) {
  const parsed = Number.parseInt(score, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function escapeCsv(value: string) {
  const safeValue = /^[\t\r\n ]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function ApplicationsManagementView() {
  const [query, setQuery] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [recruiterFilter, setRecruiterFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [exportMessage, setExportMessage] = useState("");

  const jobs = useMemo(() => {
    const distinctJobs = new Map<string, string>();
    for (const application of applicationManagementRecords) {
      distinctJobs.set(application.jobId, application.jobTitle);
    }
    return Array.from(distinctJobs, ([jobId, title]) => ({ jobId, title }));
  }, []);

  const clients = useMemo(
    () => [...new Set(applicationManagementRecords.map((item) => item.clientName))].sort(),
    [],
  );
  const recruiters = useMemo(
    () => [...new Set(applicationManagementRecords.map((item) => item.recruiterOwner))].sort(),
    [],
  );

  const filteredApplications = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return applicationManagementRecords.filter((application) => {
      const matchesSearch =
        !searchTerm ||
        [
          application.id,
          application.candidateName,
          application.candidateEmail,
          application.jobId,
          application.jobTitle,
          application.recruiterOwner,
        ].some((value) => value.toLowerCase().includes(searchTerm));
      const matchesJob = !jobFilter || application.jobId === jobFilter;
      const matchesClient = !clientFilter || application.clientName === clientFilter;
      const matchesRecruiter = !recruiterFilter || application.recruiterOwner === recruiterFilter;
      const matchesStatus = !statusFilter || application.status === statusFilter;
      const score = getScore(application.atsScore);
      const matchesScore =
        !scoreFilter ||
        (scoreFilter === "85+" && score >= 85) ||
        (scoreFilter === "70-84" && score >= 70 && score <= 84) ||
        (scoreFilter === "50-69" && score >= 50 && score <= 69) ||
        (scoreFilter === "below-50" && score < 50);
      const matchesDate =
        (!startDate || application.applicationDateIso >= startDate) &&
        (!endDate || application.applicationDateIso <= endDate);
      return (
        matchesSearch &&
        matchesJob &&
        matchesClient &&
        matchesRecruiter &&
        matchesStatus &&
        matchesScore &&
        matchesDate
      );
    });
  }, [clientFilter, endDate, jobFilter, query, recruiterFilter, scoreFilter, startDate, statusFilter]);

  const totalPages = Math.ceil(filteredApplications.length / pageSize);
  const visibleApplications = filteredApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const columns: DataTableColumn<ApplicationManagementRecord>[] = [
    {
      key: "id",
      header: "Application ID",
      render: (application) => (
        <Link className="whitespace-nowrap font-semibold text-blue-700 hover:text-blue-900" href={`/admin/applications/${application.id}`}>
          {application.id}
        </Link>
      ),
    },
    {
      key: "candidateName",
      header: "Candidate",
      render: (application) => (
        <div>
          <Link className="whitespace-nowrap font-semibold text-slate-900 hover:text-blue-700" href={`/admin/candidates/${application.candidateId}`}>
            {application.candidateName}
          </Link>
          <p className="text-[11px] text-slate-500">Resume {application.resumeVersion}</p>
        </div>
      ),
    },
    {
      key: "jobId",
      header: "JD & Client",
      render: (application) => (
        <div>
          <Link className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-900" href={`/admin/jobs/${application.jobRecordId}`}>
            {application.jobId} · {application.jdVersion}
          </Link>
          <p className="text-[11px] text-slate-500">{application.jobTitle} · {application.clientName}</p>
        </div>
      ),
    },
    {
      key: "submissionDate",
      header: "Applied Date",
      render: (application) => (
        <span className="whitespace-nowrap">{application.submissionDate}</span>
      ),
    },
    {
      key: "recruiterOwner",
      header: "Recruiter",
      render: (application) => (
        <span className="whitespace-nowrap text-slate-700">{application.recruiterOwner}</span>
      ),
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
        <Link className="font-semibold tabular-nums text-blue-700 hover:text-blue-900" href={`/admin/ats/${application.id}`}>
          {application.atsScore}
        </Link>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (application) => (
        <Link className="whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50" href={`/admin/applications/${application.id}`}>
          Review
        </Link>
      ),
    },
  ];

  function updateSearch(value: string) {
    setQuery(value);
    setCurrentPage(1);
  }

  function exportApplications() {
    const headers = [
      "Application ID",
      "Candidate Name",
      "Candidate Email",
      "Job ID",
      "JD Version",
      "Job Title",
      "Client",
      "Resume Version",
      "Applied Date",
      "Status",
      "ATS Score",
    ];
    const rows = filteredApplications.map((application) => [
      application.id,
      application.candidateName,
      application.candidateEmail,
      application.jobId,
      application.jdVersion,
      application.jobTitle,
      application.clientName,
      application.resumeVersion,
      application.submissionDate,
      application.status,
      application.atsScore,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "adp-softech-applications.csv";
    link.click();
    URL.revokeObjectURL(url);
    setExportMessage(`${filteredApplications.length} application records exported as CSV.`);
  }

  function exportApplicationsXlsx() {
    const headings = [
      "Application ID",
      "Candidate Name",
      "Candidate Email",
      "Job ID",
      "JD Version",
      "Job Title",
      "Client",
      "Resume Version",
      "Applied Date",
      "Status",
      "ATS Score",
    ];
    const rows = filteredApplications.map((application) => [
      application.id,
      application.candidateName,
      application.candidateEmail,
      application.jobId,
      application.jdVersion,
      application.jobTitle,
      application.clientName,
      application.resumeVersion,
      application.submissionDate,
      application.status,
      application.atsScore,
    ]);
    downloadXlsx("adp-softech-applications.xlsx", "Applications", headings, rows);
    setExportMessage(`${filteredApplications.length} application records exported as XLSX.`);
  }

  function resetFilters() {
    setQuery("");
    setJobFilter("");
    setClientFilter("");
    setRecruiterFilter("");
    setStatusFilter("");
    setScoreFilter("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    setExportMessage("");
  }

  const selectClassName =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Recruitment operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Applications
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Track JD-wise applications linking candidate, JD version, resume version, and ATS evaluation.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            onClick={exportApplications}
            type="button"
          >
            <span aria-hidden="true">↓</span> Export CSV
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            onClick={exportApplicationsXlsx}
            type="button"
          >
            <span aria-hidden="true">↓</span> Export XLSX
          </button>
        </div>
      </header>

      <section
        aria-label="Applications table and filters"
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SearchBar
            className="sm:col-span-2"
            label="Search application"
            onChange={updateSearch}
            placeholder="Search candidate, email, App ID, or Job ID..."
            value={query}
          />
          <label className="block text-sm font-medium text-slate-700">
            Filter by job
            <select className={selectClassName} onChange={(event) => { setJobFilter(event.currentTarget.value); setCurrentPage(1); }} value={jobFilter}>
              <option value="">All jobs</option>
              {jobs.map((job) => <option key={job.jobId} value={job.jobId}>{job.jobId} · {job.title}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Filter by client
            <select className={selectClassName} onChange={(event) => { setClientFilter(event.currentTarget.value); setCurrentPage(1); }} value={clientFilter}>
              <option value="">All clients</option>
              {clients.map((client) => <option key={client} value={client}>{client}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Filter by recruiter
            <select className={selectClassName} onChange={(event) => { setRecruiterFilter(event.currentTarget.value); setCurrentPage(1); }} value={recruiterFilter}>
              <option value="">All recruiters</option>
              {recruiters.map((recruiter) => <option key={recruiter} value={recruiter}>{recruiter}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Filter by status
            <select className={selectClassName} onChange={(event) => { setStatusFilter(event.currentTarget.value); setCurrentPage(1); }} value={statusFilter}>
              <option value="">All statuses</option>
              {applicationStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            ATS score
            <select className={selectClassName} onChange={(event) => { setScoreFilter(event.currentTarget.value); setCurrentPage(1); }} value={scoreFilter}>
              <option value="">Any score</option>
              <option value="85+">Strong Match · 85–100%</option>
              <option value="70-84">Good Match · 70–84%</option>
              <option value="50-69">Moderate Match · 50–69%</option>
              <option value="below-50">Low Match · Below 50%</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Applied from
            <input className={selectClassName} max={endDate || undefined} onChange={(event) => { setStartDate(event.currentTarget.value); setCurrentPage(1); }} type="date" value={startDate} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Applied to
            <input className={selectClassName} min={startDate || undefined} onChange={(event) => { setEndDate(event.currentTarget.value); setCurrentPage(1); }} type="date" value={endDate} />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p aria-live="polite" className="text-sm text-slate-500" role="status">
            Showing {filteredApplications.length} of {applicationManagementRecords.length} applications
          </p>
          {(query || jobFilter || clientFilter || recruiterFilter || statusFilter || scoreFilter || startDate || endDate) && (
            <button className="text-sm font-medium text-blue-700 hover:text-blue-900" onClick={resetFilters} type="button">
              Clear filters
            </button>
          )}
        </div>

        {exportMessage && <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">{exportMessage}</p>}

        <div className="mt-4">
          <DataTable
            caption="Applications management table"
            columns={columns}
            emptyDescription="Try a different candidate name or adjust the selected filters."
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
        Application statuses are internal to ADP Softech’s recruitment team. Export reflects currently filtered rows.
      </p>
    </main>
  );
}
