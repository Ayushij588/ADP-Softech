"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { atsReportRecords, type AtsMatchCategory, type AtsReportRecord } from "@/constants/ats-reports";
import { downloadXlsx } from "@/lib/xlsx-export";

const pageSize = 5;

const matchCategoryTones: Record<AtsMatchCategory, "success" | "info" | "warning" | "danger"> = {
  "Strong Match": "success",
  "Good Match": "info",
  "Moderate Match": "warning",
  "Low Match": "danger",
};

const analysisStatusTones = {
  Completed: "success",
  Pending: "info",
  Failed: "danger",
} as const;

const matchCategories = Object.keys(matchCategoryTones) as AtsMatchCategory[];
const scoreRanges = [
  { value: "85+", label: "85% and above" },
  { value: "70-84", label: "70–84%" },
  { value: "50-69", label: "50–69%" },
  { value: "below-50", label: "Below 50%" },
] as const;

function getScore(score: string) {
  const parsed = Number.parseInt(score, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function escapeCsv(value: string) {
  const safeValue = /^[\t\r\n ]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function AtsReportsManagementView() {
  const { toast } = useToast();
  const [candidateFilter, setCandidateFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [analysisStatusFilter, setAnalysisStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const candidates = useMemo(
    () => [...new Set(atsReportRecords.map((report) => report.candidateName))].sort(),
    [],
  );
  const jobs = useMemo(() => {
    const distinctJobs = new Map<string, string>();
    for (const report of atsReportRecords) {
      distinctJobs.set(report.jobId, report.jobTitle);
    }
    return Array.from(distinctJobs, ([jobId, title]) => ({ jobId, title }));
  }, []);

  const filteredReports = useMemo(
    () => atsReportRecords.filter((report) => {
      const score = getScore(report.atsScore);
      const matchesScore =
        !scoreFilter ||
        (scoreFilter === "85+" && score >= 85) ||
        (scoreFilter === "70-84" && score >= 70 && score <= 84) ||
        (scoreFilter === "50-69" && score >= 50 && score <= 69) ||
        (scoreFilter === "below-50" && score < 50);
      const matchesDate =
        (!startDate || report.analysisDate >= startDate) &&
        (!endDate || report.analysisDate <= endDate);
      return (
        (!candidateFilter || report.candidateName === candidateFilter) &&
        (!jobFilter || report.jobId === jobFilter) &&
        matchesScore &&
        (!categoryFilter || report.matchCategory === categoryFilter) &&
        (!analysisStatusFilter || report.analysisStatus === analysisStatusFilter) &&
        matchesDate
      );
    }),
    [analysisStatusFilter, candidateFilter, categoryFilter, endDate, jobFilter, scoreFilter, startDate],
  );

  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const visibleReports = filteredReports.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectClassName =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  const columns: DataTableColumn<AtsReportRecord>[] = [
    { key: "analysisId", header: "Analysis ID", render: (report) => <Link className="whitespace-nowrap font-semibold text-blue-700 hover:text-blue-900" href={`/admin/ats/${report.id}`}>{report.analysisId}</Link> },
    { key: "candidateName", header: "Candidate", render: (report) => <span className="whitespace-nowrap font-medium text-slate-900">{report.candidateName}</span> },
    {
      key: "jobId",
      header: "JD & Versions",
      render: (report) => (
        <div>
          <span className="whitespace-nowrap font-medium text-slate-700">{report.jobId} · JD {report.jdVersion}</span>
          <p className="text-[11px] text-slate-500">{report.jobTitle} · Resume {report.resumeVersion}</p>
        </div>
      ),
    },
    { key: "atsScore", header: "ATS Score", render: (report) => <span className="font-semibold tabular-nums text-slate-800">{report.atsScore}</span> },
    { key: "matchCategory", header: "Match Band", render: (report) => <StatusBadge label={report.matchCategory} tone={matchCategoryTones[report.matchCategory]} /> },
    { key: "analysisStatus", header: "Engine Status", render: (report) => <StatusBadge label={report.analysisStatus} tone={analysisStatusTones[report.analysisStatus]} /> },
    { key: "analysisDateLabel", header: "Analysis Date", render: (report) => <span className="whitespace-nowrap">{report.analysisDateLabel}</span> },
    { key: "actions", header: "Actions", className: "text-right", render: (report) => <Link className="whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50" href={`/admin/ats/${report.id}`}>View report</Link> },
  ];

  const hasFilters = Boolean(candidateFilter || jobFilter || scoreFilter || categoryFilter || analysisStatusFilter || startDate || endDate);

  function clearFilters() {
    setCandidateFilter("");
    setJobFilter("");
    setScoreFilter("");
    setCategoryFilter("");
    setAnalysisStatusFilter("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  }

  function updateFilter(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setCurrentPage(1);
    };
  }

  function exportReports() {
    const headings = [
      "Analysis ID",
      "Candidate",
      "Job ID",
      "JD Version",
      "Resume Version",
      "Job Title",
      "ATS Score",
      "Match Category",
      "Analysis Status",
      "Analysis Date",
      "Recommendation",
    ];
    const rows = filteredReports.map((report) => [
      report.analysisId,
      report.candidateName,
      report.jobId,
      report.jdVersion,
      report.resumeVersion,
      report.jobTitle,
      report.atsScore,
      report.matchCategory,
      report.analysisStatus,
      report.analysisDateLabel,
      report.recommendation,
    ]);
    const csv = [headings, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "adp-softech-ats-reports.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast(`${filteredReports.length} ATS reports exported as CSV.`, "success");
  }

  function exportReportsXlsx() {
    const headings = [
      "Analysis ID",
      "Candidate",
      "Job ID",
      "JD Version",
      "Resume Version",
      "Job Title",
      "ATS Score",
      "Match Category",
      "Analysis Status",
      "Analysis Date",
      "Recommendation",
    ];
    const rows = filteredReports.map((report) => [
      report.analysisId,
      report.candidateName,
      report.jobId,
      report.jdVersion,
      report.resumeVersion,
      report.jobTitle,
      report.atsScore,
      report.matchCategory,
      report.analysisStatus,
      report.analysisDateLabel,
      report.recommendation,
    ]);
    downloadXlsx("adp-softech-ats-reports.xlsx", "ATS Reports", headings, rows);
    toast(`${filteredReports.length} ATS reports exported as XLSX.`, "success");
  }

  return (
    <section aria-label="ATS report list and filters" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">ATS Analysis Reports</h2>
          <p className="mt-1 text-sm text-slate-500">Explainable match reports linked to exact JD and resume versions. Recruiter review required.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={exportReports}
            type="button"
          >
            <span aria-hidden="true">↓</span> Export CSV
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={exportReportsXlsx}
            type="button"
          >
            <span aria-hidden="true">↓</span> Export XLSX
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="block text-sm font-medium text-slate-700">Candidate
          <select className={selectClassName} onChange={(event) => updateFilter(setCandidateFilter)(event.currentTarget.value)} value={candidateFilter}><option value="">All candidates</option>{candidates.map((candidate) => <option key={candidate}>{candidate}</option>)}</select>
        </label>
        <label className="block text-sm font-medium text-slate-700">Job ID
          <select className={selectClassName} onChange={(event) => updateFilter(setJobFilter)(event.currentTarget.value)} value={jobFilter}><option value="">All jobs</option>{jobs.map((job) => <option key={job.jobId} value={job.jobId}>{job.jobId} · {job.title}</option>)}</select>
        </label>
        <label className="block text-sm font-medium text-slate-700">ATS score
          <select className={selectClassName} onChange={(event) => updateFilter(setScoreFilter)(event.currentTarget.value)} value={scoreFilter}><option value="">Any score</option>{scoreRanges.map((range) => <option key={range.value} value={range.value}>{range.label}</option>)}</select>
        </label>
        <label className="block text-sm font-medium text-slate-700">Match band
          <select className={selectClassName} onChange={(event) => updateFilter(setCategoryFilter)(event.currentTarget.value)} value={categoryFilter}><option value="">All bands</option>{matchCategories.map((category) => <option key={category}>{category}</option>)}</select>
        </label>
        <label className="block text-sm font-medium text-slate-700">Analysis status
          <select className={selectClassName} onChange={(event) => updateFilter(setAnalysisStatusFilter)(event.currentTarget.value)} value={analysisStatusFilter}><option value="">All statuses</option><option>Completed</option><option>Pending</option><option>Failed</option></select>
        </label>
        <label className="block text-sm font-medium text-slate-700">Analysis date from
          <input className={selectClassName} max={endDate || undefined} onChange={(event) => updateFilter(setStartDate)(event.currentTarget.value)} type="date" value={startDate} />
        </label>
        <label className="block text-sm font-medium text-slate-700">Analysis date to
          <input className={selectClassName} min={startDate || undefined} onChange={(event) => updateFilter(setEndDate)(event.currentTarget.value)} type="date" value={endDate} />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p aria-live="polite" className="text-sm text-slate-500" role="status">Showing {filteredReports.length} of {atsReportRecords.length} reports</p>
        {hasFilters && <button className="text-sm font-medium text-blue-700 hover:text-blue-900" onClick={clearFilters} type="button">Clear filters</button>}
      </div>
      <div className="mt-4">
        <DataTable caption="ATS reports table" columns={columns} emptyDescription="Try a different candidate, job, score range or date range." emptyTitle="No ATS reports found" getRowKey={(report) => report.analysisId} rows={visibleReports} />
      </div>
      {totalPages > 1 && <div className="mt-5 border-t border-slate-100 pt-4"><Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages} /></div>}
    </section>
  );
}
