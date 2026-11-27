"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  defaultRecruitmentDashboardFilters,
  RecruitmentDashboardFilters,
  type RecruitmentDashboardFilterValues,
} from "@/components/admin/recruitment-dashboard-filters";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  applicationManagementRecords,
  candidateManagementRecords,
  jobManagementRecords,
} from "@/constants/admin-content";

const referenceDateMs = new Date("2026-11-27T00:00:00Z").getTime();

const trendDays = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
const matchBands = [
  { name: "Strong match (85–100%)", color: "var(--brand-primary)", matches: (score: number) => score >= 85 },
  { name: "Good match (70–84%)", color: "var(--brand-primary-soft)", matches: (score: number) => score >= 70 && score < 85 },
  { name: "Moderate match (50–69%)", color: "oklch(82.5% 0.05 227.392)", matches: (score: number) => score >= 50 && score < 70 },
  { name: "Low match (<50%)", color: "#cbd5e1", matches: (score: number) => score < 50 },
];

const initialTasks = [
  { id: 1, title: "Follow up on Northstar client submission", detail: "APP-2088 · Aarav Mehta · Senior Software Engineer", due: "Today", done: false },
  { id: 2, title: "Prepare Portfolio Walkthrough feedback", detail: "APP-2087 · Mira Shah · Product Designer", due: "Today", done: false },
  { id: 3, title: "Review scanned PDF manual fallback", detail: "APP-2083 · Diya Kapoor · ATS Failed", due: "Tomorrow", done: false },
];

const initialNotifications = [
  { id: 1, title: "Client submission logged", detail: "Aarav Mehta (Resume v2) submitted to Northstar Technologies", time: "12 min ago", unread: true, color: "bg-blue-600" },
  { id: 2, title: "Interview scheduled", detail: "Mira Shah · Product Designer · 28 Nov, 2:30 PM", time: "1 hour ago", unread: true, color: "bg-sky-500" },
  { id: 3, title: "ATS manual review flagged", detail: "APP-2083 (Diya Kapoor) needs manual review due to scanned PDF", time: "3 hours ago", unread: false, color: "bg-indigo-500" },
];

const chartTooltipStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  fontSize: "12px",
};

function getDaysAgo(isoDate: string) {
  const diff = referenceDateMs - new Date(`${isoDate}T00:00:00Z`).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function getWeekdayLabel(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}

function getStatusTone(status: string) {
  if (["Selected", "Hired / Joined", "Client Approved"].includes(status)) return "success" as const;
  if (["Shortlisted", "Interview Scheduled", "Submitted to Client", "Technical Screening"].includes(status)) return "info" as const;
  if (status === "On Hold") return "hold" as const;
  if (["Rejected", "Client Rejected"].includes(status)) return "danger" as const;
  if (status === "Resume Under Review") return "warning" as const;
  return "neutral" as const;
}

function SectionHeading({ title, detail, href, action }: { title: string; detail?: string; href?: string; action?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-slate-950">{title}</h2>
        {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
      </div>
      {href && action && <Link className="shrink-0 text-xs font-semibold text-blue-700 hover:text-blue-900" href={href}>{action}</Link>}
    </div>
  );
}

export function RecruitmentCrmDashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filters, setFilters] = useState(defaultRecruitmentDashboardFilters);
  const unreadCount = notifications.filter((item) => item.unread).length;

  const dateRangeDays: Record<RecruitmentDashboardFilterValues["dateRange"], number> = {
    Today: 2,
    "Last 7 days": 7,
    "Last 30 days": 30,
    "This quarter": 90,
  };

  const filteredApplications = applicationManagementRecords.filter((application) =>
    getDaysAgo(application.applicationDateIso) <= dateRangeDays[filters.dateRange] &&
    (!filters.recruiter || application.recruiterOwner === filters.recruiter) &&
    (!filters.client || application.clientName === filters.client) &&
    (!filters.job || application.jobId === filters.job),
  );

  const filteredJobs = jobManagementRecords.filter((job) =>
    (!filters.recruiter || job.recruiterOwner === filters.recruiter) &&
    (!filters.client || job.clientName === filters.client) &&
    (!filters.job || job.jobId === filters.job),
  );

  const activeJobRecords = filteredJobs.filter((job) =>
    ["Published", "Active"].includes(job.status),
  );

  const statusCounts = {
    shortlisted: filteredApplications.filter((a) => a.status === "Shortlisted").length,
    interviews: filteredApplications.filter((a) => ["Interview Scheduled", "Technical Screening"].includes(a.status)).length,
    submittedToClient: filteredApplications.filter((a) => a.status === "Submitted to Client" || Boolean(a.clientSubmissions?.length)).length,
    selected: filteredApplications.filter((a) => ["Selected", "Hired / Joined", "Client Approved"].includes(a.status)).length,
    rejected: filteredApplications.filter((a) => ["Rejected", "Client Rejected"].includes(a.status)).length,
    onHold: filteredApplications.filter((a) => a.status === "On Hold").length,
  };

  const metrics = [
    { label: "Active JDs", value: activeJobRecords.length, context: "Published or active open jobs", icon: "JD", tone: "bg-blue-50 text-blue-700" },
    { label: "New Applications", value: filteredApplications.length, context: `Received in ${filters.dateRange.toLowerCase()}`, icon: "AP", tone: "bg-sky-50 text-sky-700" },
    { label: "Total Candidates", value: filters.recruiter || filters.client || filters.job ? new Set(filteredApplications.map((a) => a.candidateId)).size : candidateManagementRecords.length, context: "Unique candidates matching filters", icon: "CA", tone: "bg-indigo-50 text-indigo-700" },
    { label: "Shortlisted", value: statusCounts.shortlisted, context: "Ready for client or technical review", icon: "SL", tone: "bg-cyan-50 text-cyan-700" },
    { label: "Interview Scheduled", value: statusCounts.interviews, context: "Screening & interview stages", icon: "IN", tone: "bg-emerald-50 text-emerald-700" },
    { label: "Submitted to Client", value: statusCounts.submittedToClient, context: "Shared with hiring clients", icon: "CS", tone: "bg-blue-50 text-blue-700" },
  ];

  const applicationTrend = trendDays.map((day) => {
    const dayApplications = filteredApplications.filter((application) => getWeekdayLabel(application.applicationDateIso) === day);
    return {
      day,
      applications: dayApplications.length,
      shortlisted: dayApplications.filter((application) => ["Shortlisted", "Submitted to Client", "Interview Scheduled"].includes(application.status)).length,
    };
  });

  const matchDistribution = matchBands.map((band) => {
    const matchingApplications = filteredApplications.filter((application) =>
      band.matches(Number.parseInt(application.atsScore, 10)),
    ).length;
    return {
      name: band.name,
      color: band.color,
      value: filteredApplications.length
        ? Math.round((matchingApplications / filteredApplications.length) * 100)
        : 0,
    };
  });

  const averageMatch = filteredApplications.length
    ? Math.round(
        filteredApplications.reduce(
          (total, application) => total + Number.parseInt(application.atsScore, 10),
          0,
        ) / filteredApplications.length,
      )
    : 0;

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  }

  function markNotificationsRead() {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  }

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Recruitment workspace</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Recruitment Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Centralized visibility across JDs, candidate applications, ATS match distribution, and client submissions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">27 November 2026</span>
          <Link className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800" href="/admin/jobs">
            <span className="text-lg leading-none">+</span> Manage JDs
          </Link>
        </div>
      </header>

      <RecruitmentDashboardFilters onApply={setFilters} />

      <section aria-label="Recruitment key performance indicators" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric) => (
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" key={metric.label}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-slate-500">{metric.label}</p>
              <span className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${metric.tone}`}>{metric.icon}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{metric.value.toLocaleString()}</p>
            <p className="mt-1 text-xs text-slate-500">{metric.context}</p>
          </article>
        ))}
      </section>

      <section aria-label="Selected, rejected, and on hold breakdown" className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Selected / Hired</span>
          <span className="text-lg font-bold tabular-nums text-emerald-950">{statusCounts.selected}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50/70 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-800">On Hold</span>
          <span className="text-lg font-bold tabular-nums text-orange-950">{statusCounts.onHold}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-rose-800">Rejected</span>
          <span className="text-lg font-bold tabular-nums text-rose-950">{statusCounts.rejected}</span>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.9fr)]">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <SectionHeading title="Applications trend" detail="Applications received and shortlisted/progressed by day" />
            <span className="rounded-md bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">{filters.dateRange}</span>
          </div>
          <div className="mt-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="applicationsGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--brand-primary)" stopOpacity={0.2} /><stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="shortlistedGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--brand-primary-soft)" stopOpacity={0.2} /><stop offset="95%" stopColor="var(--brand-primary-soft)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} dataKey="day" tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area dataKey="applications" fill="url(#applicationsGradient)" stroke="var(--brand-primary)" strokeWidth={2.5} type="monotone" />
                <Area dataKey="shortlisted" fill="url(#shortlistedGradient)" stroke="var(--brand-primary-soft)" strokeWidth={2} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex gap-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-blue-600" />Applications</span>
            <span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-sky-400" />Progressed</span>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="ATS match distribution" detail="Configurable score bands across filtered applications" href="/admin/ats" action="View reports" />
          <div className="relative mt-1 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={matchDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={58} outerRadius={84} paddingAngle={3} stroke="none">
                  {matchDistribution.map((item) => <Cell fill={item.color} key={item.name} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}%`, "Applications"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-slate-950">{averageMatch}%</span>
              <span className="text-[11px] text-slate-500">avg. match</span>
            </div>
          </div>
          <ul className="mt-1 space-y-2.5">
            {matchDistribution.map((item) => (
              <li className="flex items-center justify-between text-xs" key={item.name}>
                <span className="inline-flex items-center gap-2 text-slate-600"><i className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>
                <span className="font-semibold tabular-nums text-slate-900">{item.value}%</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,1fr)]">
        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Recent applications" detail="Latest JD-linked candidate applications" href="/admin/applications" action="View all" />
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead><tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400"><th className="pb-3 pr-4 font-medium">Candidate</th><th className="pb-3 pr-4 font-medium">Job ID & Role</th><th className="pb-3 pr-4 font-medium">ATS match</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 font-medium">Received</th></tr></thead>
              <tbody>
                {filteredApplications.length ? filteredApplications.slice(0, 6).map((application) => (
                  <tr className="border-b border-slate-50 last:border-0" key={application.id}>
                    <td className="py-3.5 pr-4">
                      <Link className="font-semibold text-blue-700 hover:text-blue-900" href={`/admin/applications/${application.id}`}>
                        {application.candidateName}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-slate-400">{application.id} · Resume {application.resumeVersion}</p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-slate-800">{application.jobTitle}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{application.jobId} · JD {application.jdVersion}</p>
                    </td>
                    <td className="py-3.5 pr-4 font-semibold tabular-nums text-slate-800">{application.atsScore}</td>
                    <td className="py-3.5 pr-4"><StatusBadge label={application.status} tone={getStatusTone(application.status)} /></td>
                    <td className="whitespace-nowrap py-3.5 text-xs text-slate-500">{application.submissionDate}</td>
                  </tr>
                )) : <tr><td className="py-8 text-center text-sm text-slate-500" colSpan={5}>No applications match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Applications by JD" detail="Open roles grouped by Job ID" href="/admin/jobs" action="Manage jobs" />
          <div className="mt-5 space-y-4">
            {filteredJobs.length ? filteredJobs.slice(0, 4).map((job) => {
              const appCount = applicationManagementRecords.filter((app) => app.jobId === job.jobId).length;
              const progress = Math.min(100, Math.max(18, appCount * 28));
              return (
                <div key={job.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link className="block truncate text-sm font-semibold text-slate-900 hover:text-blue-700" href={`/admin/jobs/${job.id}`}>
                        {job.title}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-slate-400">{job.jobId} · {job.recruiterOwner} · {job.status}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{job.metric}</span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} /></div>
                </div>
              );
            }) : <p className="py-8 text-center text-sm text-slate-500">No jobs match these filters.</p>}
          </div>
          <Link className="mt-5 inline-flex w-full justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50" href="/admin/jobs">
            View {filteredJobs.length} matching {filteredJobs.length === 1 ? "JD" : "JDs"}
          </Link>
        </article>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Recruiter tasks" detail={`${tasks.filter((task) => !task.done).length} tasks remaining`} href="/admin/applications" action="Open pipeline" />
          <ul className="mt-4 divide-y divide-slate-100">
            {tasks.map((task) => (
              <li className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0" key={task.id}>
                <input aria-label={`Mark ${task.title} complete`} checked={task.done} className="mt-1 size-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600" onChange={() => toggleTask(task.id)} type="checkbox" />
                <div className="min-w-0 flex-1"><p className={`text-sm font-medium ${task.done ? "text-slate-400 line-through" : "text-slate-800"}`}>{task.title}</p><p className="mt-1 text-xs text-slate-500">{task.detail}</p></div>
                <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold ${task.due === "Today" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{task.due}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <SectionHeading title="Notifications" detail={unreadCount ? `${unreadCount} unread updates` : "You’re all caught up"} />
            {unreadCount > 0 && <button className="shrink-0 text-xs font-semibold text-blue-700 hover:text-blue-900" onClick={markNotificationsRead} type="button">Mark all read</button>}
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {notifications.map((notification) => (
              <li className={`flex gap-3 py-3.5 first:pt-0 last:pb-0 ${notification.unread ? "" : "opacity-70"}`} key={notification.id}>
                <span className={`mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${notification.color}`}>{notification.title.slice(0, 1)}</span>
                <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold text-slate-800">{notification.title}</p>{notification.unread && <i className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-600" />}</div><p className="mt-1 text-xs leading-5 text-slate-500">{notification.detail}</p><p className="mt-1.5 text-[10px] text-slate-400">{notification.time}</p></div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeading title="Quick actions" detail="Shortcuts to common recruitment tasks" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link className="group flex items-center gap-3 rounded-lg border border-slate-200 p-3.5 transition hover:border-blue-200 hover:bg-blue-50/50" href="/admin/jobs"><span className="inline-flex size-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">+</span><span><span className="block text-sm font-semibold text-slate-800">Create a JD</span><span className="mt-0.5 block text-xs text-slate-500">Add or upload a client JD</span></span></Link>
          <Link className="group flex items-center gap-3 rounded-lg border border-slate-200 p-3.5 transition hover:border-blue-200 hover:bg-blue-50/50" href="/admin/applications"><span className="inline-flex size-9 items-center justify-center rounded-lg bg-sky-50 text-sm font-bold text-sky-700">↗</span><span><span className="block text-sm font-semibold text-slate-800">Review applications</span><span className="mt-0.5 block text-xs text-slate-500">Triage JD-linked applicants</span></span></Link>
          <Link className="group flex items-center gap-3 rounded-lg border border-slate-200 p-3.5 transition hover:border-blue-200 hover:bg-blue-50/50" href="/admin/candidates"><span className="inline-flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">ID</span><span><span className="block text-sm font-semibold text-slate-800">Search candidates</span><span className="mt-0.5 block text-xs text-slate-500">Name, email, phone, skills</span></span></Link>
          <Link className="group flex items-center gap-3 rounded-lg border border-slate-200 p-3.5 transition hover:border-blue-200 hover:bg-blue-50/50" href="/admin/reports"><span className="inline-flex size-9 items-center justify-center rounded-lg bg-cyan-50 text-xs font-bold text-cyan-700">▤</span><span><span className="block text-sm font-semibold text-slate-800">View reports</span><span className="mt-0.5 block text-xs text-slate-500">Track hiring performance</span></span></Link>
        </div>
      </section>
      <p className="mt-5 text-center text-[11px] text-slate-400">Recruitment insights shown are illustrative sample data for frontend demonstration.</p>
    </main>
  );
}
