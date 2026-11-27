"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { atsMatchDistribution, jobManagementRecords } from "@/constants/admin-content";
import { hiringReportRecords } from "@/constants/reports-content";
import { downloadXlsx } from "@/lib/xlsx-export";

const months = [
  { key: "2026-06", label: "Jun" },
  { key: "2026-07", label: "Jul" },
  { key: "2026-08", label: "Aug" },
  { key: "2026-09", label: "Sep" },
  { key: "2026-10", label: "Oct" },
  { key: "2026-11", label: "Nov" },
];

const matchColors = ["var(--brand-primary)", "var(--brand-primary-soft)", "#f59e0b", "#94a3b8"];
const funnelStages = ["Applied", "Screened", "Shortlisted", "Interview", "Selected", "Hired"];
const interviewedStatuses = new Set(["Technical Screening", "Interview Scheduled", "Submitted to Client", "Selected", "Hired / Joined"]);
const shortlistedStatuses = new Set(["Shortlisted", ...interviewedStatuses]);
const selectedStatuses = new Set(["Selected", "Hired / Joined"]);
const chartTooltipStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  fontSize: "12px",
};

type RecruiterSummary = {
  recruiter: string;
  applications: number;
  interviews: number;
  hires: number;
  atsTotal: number;
  averageAts: number;
};

type JdReportSummary = {
  jobId: string;
  jobRecordId: string;
  jobTitle: string;
  client: string;
  applications: number;
  shortlisted: number;
  interviews: number;
  hires: number;
  averageAts: number;
};

function getStatusTone(status: string) {
  if (status === "Hired / Joined" || status === "Selected") return "success" as const;
  if (["Shortlisted", "Interview Scheduled", "Technical Screening", "Submitted to Client"].includes(status)) return "info" as const;
  if (status === "Rejected") return "danger" as const;
  if (status === "On Hold") return "hold" as const;
  if (status === "Resume Under Review") return "warning" as const;
  return "neutral" as const;
}

function escapeCsv(value: string) {
  const safeValue = /^[\t\r\n ]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

function formatReportDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RecruitmentReportsDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recruiterFilter, setRecruiterFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [exportMessage, setExportMessage] = useState("");

  const recruiters = useMemo(() => [...new Set(hiringReportRecords.map((record) => record.recruiter))].sort(), []);
  const departments = useMemo(() => [...new Set(hiringReportRecords.map((record) => record.department))].sort(), []);
  const clients = useMemo(() => [...new Set(hiringReportRecords.map((record) => record.client))].sort(), []);
  const statuses = useMemo(() => [...new Set(hiringReportRecords.map((record) => record.status))].sort(), []);

  const filteredRecords = useMemo(
    () => hiringReportRecords.filter((record) =>
      (!startDate || record.applicationDate >= startDate) &&
      (!endDate || record.applicationDate <= endDate) &&
      (!recruiterFilter || record.recruiter === recruiterFilter) &&
      (!departmentFilter || record.department === departmentFilter) &&
      (!clientFilter || record.client === clientFilter) &&
      (!jobFilter || record.jobId === jobFilter) &&
      (!statusFilter || record.status === statusFilter),
    ),
    [clientFilter, departmentFilter, endDate, jobFilter, recruiterFilter, startDate, statusFilter],
  );

  const hires = filteredRecords.filter((record) => record.status === "Hired / Joined").length;
  const interviews = filteredRecords.filter((record) => interviewedStatuses.has(record.status)).length;
  const averageAts = filteredRecords.length
    ? Math.round(filteredRecords.reduce((sum, record) => sum + record.atsScore, 0) / filteredRecords.length)
    : 0;
  const kpis = [
    { title: "Applications", value: filteredRecords.length.toLocaleString(), description: "Matching selected report filters" },
    { title: "Hires", value: hires.toLocaleString(), description: "Sample candidates marked hired" },
    { title: "Interviews", value: interviews.toLocaleString(), description: "Technical screening or interview stage" },
    { title: "Average ATS score", value: `${averageAts}%`, description: "Average of illustrative sample scores" },
  ];

  const trendData = months.map((month) => {
    const monthRecords = filteredRecords.filter((record) => record.applicationDate.startsWith(month.key));
    return {
      month: month.label,
      applications: monthRecords.length,
      hires: monthRecords.filter((record) => record.status === "Hired / Joined").length,
    };
  });

  const funnelData = funnelStages.map((stage) => {
    const recordsAtStage = filteredRecords.filter((record) => {
      if (stage === "Applied") return true;
      if (stage === "Screened") return record.status !== "New Application";
      if (stage === "Shortlisted") return shortlistedStatuses.has(record.status);
      if (stage === "Interview") return interviewedStatuses.has(record.status);
      if (stage === "Selected") return selectedStatuses.has(record.status);
      return record.status === "Hired / Joined";
    });
    return { stage, candidates: recordsAtStage.length };
  });

  const recruiterSummaries = useMemo(() => {
    const summaries = new Map<string, RecruiterSummary>();
    for (const record of filteredRecords) {
      const current = summaries.get(record.recruiter) ?? {
        recruiter: record.recruiter,
        applications: 0,
        interviews: 0,
        hires: 0,
        atsTotal: 0,
        averageAts: 0,
      };
      current.applications += 1;
      current.interviews += interviewedStatuses.has(record.status) ? 1 : 0;
      current.hires += record.status === "Hired / Joined" ? 1 : 0;
      current.atsTotal += record.atsScore;
      current.averageAts = Math.round(current.atsTotal / current.applications);
      summaries.set(record.recruiter, current);
    }
    return Array.from(summaries.values()).sort((left, right) => right.hires - left.hires || right.applications - left.applications);
  }, [filteredRecords]);

  const jdSummaries = useMemo(() => {
    const map = new Map<string, JdReportSummary & { atsSum: number }>();
    for (const record of filteredRecords) {
      const jobRecord = jobManagementRecords.find((j) => j.jobId === record.jobId);
      const current = map.get(record.jobId) ?? {
        jobId: record.jobId,
        jobRecordId: jobRecord?.id ?? "JOB-1042",
        jobTitle: record.jobTitle,
        client: record.client,
        applications: 0,
        shortlisted: 0,
        interviews: 0,
        hires: 0,
        atsSum: 0,
        averageAts: 0,
      };
      current.applications += 1;
      current.shortlisted += shortlistedStatuses.has(record.status) ? 1 : 0;
      current.interviews += interviewedStatuses.has(record.status) ? 1 : 0;
      current.hires += record.status === "Hired / Joined" ? 1 : 0;
      current.atsSum += record.atsScore;
      current.averageAts = Math.round(current.atsSum / current.applications);
      map.set(record.jobId, current);
    }
    return Array.from(map.values()).sort((a, b) => b.applications - a.applications);
  }, [filteredRecords]);

  const recruiterColumns: DataTableColumn<RecruiterSummary>[] = [
    { key: "recruiter", header: "Recruiter", render: (row) => <span className="whitespace-nowrap font-semibold text-slate-900">{row.recruiter}</span> },
    { key: "applications", header: "Applications", render: (row) => <span className="tabular-nums">{row.applications}</span> },
    { key: "interviews", header: "Interviews", render: (row) => <span className="tabular-nums">{row.interviews}</span> },
    { key: "hires", header: "Hires", render: (row) => <span className="font-semibold tabular-nums text-emerald-700">{row.hires}</span> },
    { key: "averageAts", header: "Avg. ATS", render: (row) => <span className="font-medium tabular-nums">{row.averageAts}%</span> },
  ];

  const jdColumns: DataTableColumn<JdReportSummary>[] = [
    {
      key: "jobId",
      header: "Job ID",
      render: (row) => (
        <Link className="whitespace-nowrap font-semibold text-blue-700 hover:text-blue-900" href={`/admin/jobs/${row.jobRecordId}`}>
          {row.jobId}
        </Link>
      ),
    },
    { key: "jobTitle", header: "Role & Client", render: (row) => <div><p className="font-medium text-slate-900">{row.jobTitle}</p><p className="text-[11px] text-slate-500">{row.client}</p></div> },
    { key: "applications", header: "Applications", render: (row) => <span className="tabular-nums">{row.applications}</span> },
    { key: "shortlisted", header: "Shortlisted+", render: (row) => <span className="tabular-nums">{row.shortlisted}</span> },
    { key: "hires", header: "Hires", render: (row) => <span className="font-semibold tabular-nums text-emerald-700">{row.hires}</span> },
    { key: "averageAts", header: "Avg. ATS", render: (row) => <span className="tabular-nums">{row.averageAts}%</span> },
  ];

  const departmentData = useMemo(() => {
    const counts = new Map<string, { department: string; hires: number; applications: number }>();
    for (const record of filteredRecords) {
      const current = counts.get(record.department) ?? { department: record.department, hires: 0, applications: 0 };
      current.applications += 1;
      current.hires += record.status === "Hired / Joined" ? 1 : 0;
      counts.set(record.department, current);
    }
    return Array.from(counts.values()).sort((left, right) => right.hires - left.hires || right.applications - left.applications);
  }, [filteredRecords]);

  const atsData = atsMatchDistribution.map((category, index) => ({
    name: category.label.replace(/ ·.*/, ""),
    value: filteredRecords.filter((record) => record.matchCategory === ["Strong Match", "Good Match", "Moderate Match", "Low Match"][index]).length,
    color: matchColors[index],
  }));

  const recentActivity = [...filteredRecords]
    .sort((left, right) => right.applicationDate.localeCompare(left.applicationDate))
    .slice(0, 6);

  const jobs = useMemo(() => {
    const visibleJobs = hiringReportRecords.filter((record) =>
      (!startDate || record.applicationDate >= startDate) &&
      (!endDate || record.applicationDate <= endDate) &&
      (!recruiterFilter || record.recruiter === recruiterFilter) &&
      (!departmentFilter || record.department === departmentFilter) &&
      (!clientFilter || record.client === clientFilter) &&
      (!statusFilter || record.status === statusFilter),
    );
    const jobIds = new Set(visibleJobs.map((record) => record.jobId));
    return jobManagementRecords.filter((job) => jobIds.has(job.jobId));
  }, [clientFilter, departmentFilter, endDate, recruiterFilter, startDate, statusFilter]);

  const hasFilters = Boolean(startDate || endDate || recruiterFilter || departmentFilter || clientFilter || jobFilter || statusFilter);
  const filterSelectClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
  const filterInputClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  function clearFilters() {
    setStartDate("");
    setEndDate("");
    setRecruiterFilter("");
    setDepartmentFilter("");
    setClientFilter("");
    setJobFilter("");
    setStatusFilter("");
    setExportMessage("");
  }

  function exportCsv() {
    const headings = ["Application ID", "Candidate", "Job ID", "Job Title", "Client", "Department", "Recruiter", "Status", "ATS Score", "Match Category", "Application Date"];
    const rows = filteredRecords.map((record) => [
      record.id,
      record.candidateName,
      record.jobId,
      record.jobTitle,
      record.client,
      record.department,
      record.recruiter,
      record.status,
      `${record.atsScore}%`,
      record.matchCategory,
      record.applicationDate,
    ]);
    const csv = [headings, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "adp-softech-hiring-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setExportMessage(`${filteredRecords.length} filtered records exported as CSV.`);
  }

  function exportXlsx() {
    const headings = ["Application ID", "Candidate", "Job ID", "Job Title", "Client", "Department", "Recruiter", "Status", "ATS Score", "Match Category", "Application Date"];
    const rows = filteredRecords.map((record) => [
      record.id,
      record.candidateName,
      record.jobId,
      record.jobTitle,
      record.client,
      record.department,
      record.recruiter,
      record.status,
      `${record.atsScore}%`,
      record.matchCategory,
      record.applicationDate,
    ]);
    downloadXlsx("adp-softech-hiring-report.xlsx", "Hiring Report", headings, rows);
    setExportMessage(`${filteredRecords.length} filtered records exported as XLSX.`);
  }

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Recruitment analytics</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Reports Dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Track hiring activity, JD-wise conversion, pipeline outcomes, and recruiter performance.</p>
        </div>
        <StatusBadge label="Illustrative sample data" tone="info" />
      </header>

      <section aria-label="Report filters" className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-950">Report Filters</h2><p className="mt-1 text-xs text-slate-500">Filters apply to charts, KPIs, JD summary, recruiter report, and exports.</p></div>{hasFilters && <button className="text-sm font-semibold text-blue-700 hover:text-blue-900" onClick={clearFilters} type="button">Clear all</button>}</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-7">
          <label className="text-xs font-medium text-slate-600">Date from<input className={filterInputClass} max={endDate || undefined} onChange={(event) => setStartDate(event.currentTarget.value)} type="date" value={startDate} /></label>
          <label className="text-xs font-medium text-slate-600">Date to<input className={filterInputClass} min={startDate || undefined} onChange={(event) => setEndDate(event.currentTarget.value)} type="date" value={endDate} /></label>
          <label className="text-xs font-medium text-slate-600">Recruiter<select className={filterSelectClass} onChange={(event) => setRecruiterFilter(event.currentTarget.value)} value={recruiterFilter}><option value="">All recruiters</option>{recruiters.map((recruiter) => <option key={recruiter}>{recruiter}</option>)}</select></label>
          <label className="text-xs font-medium text-slate-600">Department<select className={filterSelectClass} onChange={(event) => setDepartmentFilter(event.currentTarget.value)} value={departmentFilter}><option value="">All departments</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></label>
          <label className="text-xs font-medium text-slate-600">Client<select className={filterSelectClass} onChange={(event) => setClientFilter(event.currentTarget.value)} value={clientFilter}><option value="">All clients</option>{clients.map((client) => <option key={client}>{client}</option>)}</select></label>
          <label className="text-xs font-medium text-slate-600">Job<select className={filterSelectClass} onChange={(event) => setJobFilter(event.currentTarget.value)} value={jobFilter}><option value="">All jobs</option>{jobs.map((job) => <option key={job.jobId} value={job.jobId}>{job.jobId} · {job.title}</option>)}</select></label>
          <label className="text-xs font-medium text-slate-600">Status<select className={filterSelectClass} onChange={(event) => setStatusFilter(event.currentTarget.value)} value={statusFilter}><option value="">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        </div>
        <p aria-live="polite" className="mt-3 text-xs text-slate-500" role="status">Showing {filteredRecords.length} of {hiringReportRecords.length} sample applications</p>
      </section>

      <section aria-label="Hiring key performance indicators" className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => <DashboardCard description={kpi.description} key={kpi.title} title={kpi.title} value={kpi.value} />)}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section aria-labelledby="hiring-funnel-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div><h2 className="text-base font-semibold text-slate-950" id="hiring-funnel-heading">Hiring Funnel</h2><p className="mt-1 text-xs text-slate-500">Sample candidate volume by recruitment stage</p></div>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 4, right: 12, left: 16, bottom: 4 }}>
                <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" horizontal={false} />
                <XAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} type="number" />
                <YAxis axisLine={false} dataKey="stage" tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} type="category" width={112} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="candidates" fill="var(--brand-primary)" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section aria-labelledby="applications-trend-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div><h2 className="text-base font-semibold text-slate-950" id="applications-trend-heading">Applications Trend</h2><p className="mt-1 text-xs text-slate-500">Applications and hires by month</p></div>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs><linearGradient id="reportAppsFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--brand-primary)" stopOpacity={0.2} /><stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} dataKey="month" tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area dataKey="applications" fill="url(#reportAppsFill)" stroke="var(--brand-primary)" strokeWidth={2.5} type="monotone" />
                <Area dataKey="hires" fill="transparent" stroke="var(--brand-primary-soft)" strokeWidth={2} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex gap-5 text-xs text-slate-500"><span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-blue-600" />Applications</span><span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-sky-400" />Hires</span></div>
        </section>
      </div>

      <section aria-labelledby="jd-wise-report-heading" className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4"><h2 className="text-base font-semibold text-slate-950" id="jd-wise-report-heading">JD-wise Recruitment Report</h2><p className="mt-1 text-xs text-slate-500">Applications, shortlist progression, hires, and average ATS score grouped by Job ID</p></div>
        <DataTable caption="JD-wise recruitment report" columns={jdColumns} emptyDescription="Adjust filters to view JD-wise breakdown." emptyTitle="No JD data" getRowKey={(row) => row.jobId} rows={jdSummaries} />
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <section aria-labelledby="recruiter-performance-heading" className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4"><h2 className="text-base font-semibold text-slate-950" id="recruiter-performance-heading">Recruiter Performance</h2><p className="mt-1 text-xs text-slate-500">Applications, interviews, hires and average sample ATS score</p></div>
          <DataTable caption="Recruiter performance report" columns={recruiterColumns} emptyDescription="Adjust filters to view recruiter performance." emptyTitle="No recruiter data" getRowKey={(row) => row.recruiter} rows={recruiterSummaries} />
        </section>

        <section aria-labelledby="department-hiring-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div><h2 className="text-base font-semibold text-slate-950" id="department-hiring-heading">Department-wise Hiring</h2><p className="mt-1 text-xs text-slate-500">Hires and application volume by department</p></div>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 8, right: 8, left: -18, bottom: 36 }}>
                <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} dataKey="department" interval={0} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} angle={-25} textAnchor="end" />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="hires" fill="var(--brand-primary)" name="Hires" radius={[5, 5, 0, 0]} />
                <Bar dataKey="applications" fill="var(--brand-primary-soft)" name="Applications" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section aria-labelledby="ats-analytics-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div><h2 className="text-base font-semibold text-slate-950" id="ats-analytics-heading">ATS Analytics</h2><p className="mt-1 text-xs text-slate-500">Distribution across BRD score bands</p></div>
          <div className="relative mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={atsData} dataKey="value" cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={3} stroke="none">
                  {atsData.map((item) => <Cell fill={item.color} key={item.name} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-semibold text-slate-950">{filteredRecords.length}</span><span className="text-[11px] text-slate-500">reports</span></div>
          </div>
          <ul className="mt-2 space-y-2">{atsData.map((item) => <li className="flex items-center justify-between text-xs" key={item.name}><span className="inline-flex items-center gap-2 text-slate-600"><i className="size-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><span className="font-semibold tabular-nums text-slate-900">{item.value}</span></li>)}</ul>
        </section>

        <section aria-labelledby="recent-hiring-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div><h2 className="text-base font-semibold text-slate-950" id="recent-hiring-heading">Recent Hiring Activity</h2><p className="mt-1 text-xs text-slate-500">Latest application and hiring milestones in the filtered sample</p></div>
          {recentActivity.length ? <ol className="mt-5 space-y-0">{recentActivity.map((record, index) => <li className="relative flex gap-4 pb-5 last:pb-0" key={record.id}><div className="flex flex-col items-center"><span className={`mt-1 size-2.5 shrink-0 rounded-full ${record.status === "Hired / Joined" ? "bg-emerald-500" : "bg-blue-600"}`} />{index < recentActivity.length - 1 && <span className="mt-1 w-px flex-1 bg-slate-200" />}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-900">{record.candidateName}</p><time className="text-xs text-slate-500" dateTime={record.applicationDate}>{formatReportDate(record.applicationDate)}</time></div><p className="mt-1 text-xs text-slate-600">{record.jobTitle} · {record.client}</p><div className="mt-2 flex flex-wrap items-center gap-2"><StatusBadge label={record.status} tone={getStatusTone(record.status)} /><span className="text-[11px] text-slate-500">{record.recruiter}</span></div></div></li>)}</ol> : <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No activity matches the selected filters.</p>}
        </section>
      </div>

      <section aria-labelledby="export-reports-heading" className="mt-5 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
        <div><h2 className="text-base font-semibold text-slate-950" id="export-reports-heading">Export Reports</h2><p className="mt-1 text-sm text-slate-600">Download {filteredRecords.length} records using the current filters.</p>{exportMessage && <p aria-live="polite" className="mt-2 text-xs font-medium text-emerald-800" role="status">{exportMessage}</p>}</div>
        <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={exportCsv} type="button"><span aria-hidden="true">↓</span> Export CSV</button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800" onClick={exportXlsx} type="button"><span aria-hidden="true">↓</span> Export XLSX</button>
        </div>
      </section>
    </main>
  );
}
