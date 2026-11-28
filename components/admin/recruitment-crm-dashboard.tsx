"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAsyncData } from "@/hooks/use-async-data";
import { useAuth } from "@/hooks/use-auth";
import { getApplications } from "@/services/applications.service";
import { getClients } from "@/services/clients.service";
import { getDashboard } from "@/services/dashboard.service";
import { getJobs } from "@/services/jobs.service";
import { getRecruiters } from "@/services/users.service";
import type {
  ApiApplication,
  ApiClient,
  ApiDashboardData,
  ApiJob,
  ApiUser,
} from "@/types/api";

const trendDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const matchBands = [
  { name: "Strong match (85–100%)", color: "var(--brand-primary)", matches: (score: number) => score >= 85 },
  { name: "Good match (70–84%)", color: "var(--brand-primary-soft)", matches: (score: number) => score >= 70 && score < 85 },
  { name: "Moderate match (50–69%)", color: "oklch(82.5% 0.05 227.392)", matches: (score: number) => score >= 50 && score < 70 },
  { name: "Low match (<50%)", color: "#cbd5e1", matches: (score: number) => score < 50 },
];

const initialTasks = [
  { id: 1, title: "Follow up on client submissions", detail: "Review candidates in Submitted to Client stage", due: "Today", done: false },
  { id: 2, title: "Confirm scheduled interview panels", detail: "Check upcoming Interview Scheduled records", due: "Today", done: false },
  { id: 3, title: "Review new incoming applications", detail: "Triage New Application queue by JD", due: "Tomorrow", done: false },
];

const initialNotifications = [
  { id: 1, title: "Dashboard connected", detail: "Live metrics synced with /api/dashboard", time: "Just now", unread: true, color: "bg-blue-600" },
  { id: 2, title: "Pipeline tracking active", detail: "Status updates and notes sync to MongoDB", time: "Active", unread: false, color: "bg-sky-500" },
];

const chartTooltipStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  fontSize: "12px",
};

const statusLabels: Record<string, string> = {
  new_application: "New Application",
  resume_under_review: "Resume Under Review",
  shortlisted: "Shortlisted",
  technical_screening: "Technical Screening",
  interview_scheduled: "Interview Scheduled",
  selected: "Selected",
  rejected: "Rejected",
  on_hold: "On Hold",
  submitted_to_client: "Submitted to Client",
  client_approved: "Client Approved",
  client_rejected: "Client Rejected",
  hired: "Hired / Joined",
};

function getDateRangeBounds(range: RecruitmentDashboardFilterValues["dateRange"]) {
  const daysMap: Record<RecruitmentDashboardFilterValues["dateRange"], number> = {
    Today: 1,
    "Last 7 days": 7,
    "Last 30 days": 30,
    "This quarter": 90,
  };
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - daysMap[range]);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function getStatusTone(status: string) {
  if (["selected", "hired", "client_approved"].includes(status)) return "success" as const;
  if (["shortlisted", "interview_scheduled", "submitted_to_client", "technical_screening"].includes(status)) return "info" as const;
  if (status === "on_hold") return "hold" as const;
  if (["rejected", "client_rejected"].includes(status)) return "danger" as const;
  if (status === "resume_under_review") return "warning" as const;
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

type DashboardBundle = {
  dashboard: ApiDashboardData;
  applications: ApiApplication[];
  jobs: ApiJob[];
  recruiters: ApiUser[];
  clients: ApiClient[];
};

export function RecruitmentCrmDashboard() {
  const { user, isAuthenticated } = useAuth("admin");
  const isSuperAdmin = user?.role === "super_admin";
  const [tasks, setTasks] = useState(initialTasks);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filters, setFilters] = useState(defaultRecruitmentDashboardFilters);

  const fetcher = useCallback(async (): Promise<DashboardBundle> => {
    const bounds = getDateRangeBounds(filters.dateRange);
    const [dashboard, applications, jobs, recruiters, clients] = await Promise.all([
      getDashboard({
        startDate: bounds.startDate,
        endDate: bounds.endDate,
        recruiterId: isSuperAdmin ? filters.recruiterId || undefined : undefined,
        clientId: isSuperAdmin ? filters.clientId || undefined : undefined,
        jobId: filters.jobId || undefined,
      }),
      getApplications(),
      getJobs(),
      isSuperAdmin ? getRecruiters().catch(() => []) : Promise.resolve([]),
      isSuperAdmin ? getClients().catch(() => []) : Promise.resolve([]),
    ]);
    return { dashboard, applications, jobs, recruiters, clients };
  }, [filters, isSuperAdmin]);

  const { data, isLoading, error, refetch } = useAsyncData<DashboardBundle>(
    fetcher,
    isAuthenticated,
  );

  const dashboard = data?.dashboard;
  const applications = useMemo(() => data?.applications ?? [], [data?.applications]);
  const jobs = useMemo(() => data?.jobs ?? [], [data?.jobs]);

  const jobOptions = useMemo(
    () => jobs.map((job) => ({ id: job._id, label: `${job.jobId} · ${job.jobTitle}` })),
    [jobs],
  );
  const recruiterOptions = useMemo(
    () =>
      (data?.recruiters ?? []).map((r) => ({
        id: r._id ?? r.id ?? "",
        label: r.name,
      })),
    [data?.recruiters],
  );
  const clientOptions = useMemo(
    () =>
      (data?.clients ?? []).map((c) => ({
        id: c._id,
        label: c.companyName,
      })),
    [data?.clients],
  );

  const metrics = [
    { label: "Active JDs", value: dashboard?.activeJDs ?? 0, context: "Published or active open jobs", icon: "JD", tone: "bg-blue-50 text-blue-700" },
    { label: "Applications", value: dashboard?.newApplications ?? 0, context: `Received in ${filters.dateRange.toLowerCase()}`, icon: "AP", tone: "bg-sky-50 text-sky-700" },
    { label: "Total Candidates", value: dashboard?.totalCandidates ?? 0, context: "Unique candidates in scope", icon: "CA", tone: "bg-indigo-50 text-indigo-700" },
    { label: "Shortlisted", value: dashboard?.shortlisted ?? 0, context: "Ready for client or technical review", icon: "SL", tone: "bg-cyan-50 text-cyan-700" },
    { label: "Interview Scheduled", value: dashboard?.interviewScheduled ?? 0, context: "Interview stages scheduled", icon: "IN", tone: "bg-emerald-50 text-emerald-700" },
    { label: "Submitted to Client", value: dashboard?.submittedToClient ?? 0, context: "Shared with hiring clients", icon: "CS", tone: "bg-blue-50 text-blue-700" },
  ];

  const applicationTrend = useMemo(
    () =>
      trendDays.map((day) => {
        const dayApps = applications.filter((app) => {
          const weekday = new Date(app.appliedAt || app.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
          });
          return weekday === day;
        });
        return {
          day,
          applications: dayApps.length,
          shortlisted: dayApps.filter((a) =>
            ["shortlisted", "submitted_to_client", "interview_scheduled", "selected", "hired"].includes(a.status),
          ).length,
        };
      }),
    [applications],
  );

  const scoredApps = useMemo(
    () => applications.filter((a) => typeof a.atsScore === "number"),
    [applications],
  );

  const matchDistribution = matchBands.map((band) => {
    const matching = scoredApps.filter((a) => band.matches(a.atsScore ?? 0)).length;
    return {
      name: band.name,
      color: band.color,
      value: scoredApps.length ? Math.round((matching / scoredApps.length) * 100) : 0,
    };
  });

  const averageMatch = scoredApps.length
    ? Math.round(scoredApps.reduce((sum, a) => sum + (a.atsScore ?? 0), 0) / scoredApps.length)
    : 0;

  const unreadCount = notifications.filter((item) => item.unread).length;

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
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
          <p className="mt-2 text-sm text-slate-500">Live visibility across JDs, candidate applications, and pipeline stages.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800" href="/admin/jobs">
            <span className="text-lg leading-none">+</span> Manage JDs
          </Link>
        </div>
      </header>

      {!isAuthenticated && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Sign in on <Link className="font-semibold underline" href="/admin/login">/admin/login</Link> to load live metrics from <span className="font-mono text-xs">/api/dashboard</span>.
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <span>{error}</span>
          <button className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100" onClick={() => void refetch()} type="button">
            Retry
          </button>
        </div>
      )}

      <RecruitmentDashboardFilters
        clientOptions={clientOptions}
        jobOptions={jobOptions}
        onApply={setFilters}
        recruiterOptions={recruiterOptions}
        showSuperAdminFilters={isSuperAdmin}
      />

      {isLoading ? (
        <div className="mt-8 flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <LoadingSpinner label="Loading live dashboard metrics..." />
        </div>
      ) : (
        <>
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
              <span className="text-lg font-bold tabular-nums text-emerald-950">{dashboard?.selected ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50/70 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-orange-800">On Hold</span>
              <span className="text-lg font-bold tabular-nums text-orange-950">{dashboard?.onHold ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-rose-800">Rejected</span>
              <span className="text-lg font-bold tabular-nums text-rose-950">{dashboard?.rejected ?? 0}</span>
            </div>
          </section>
        </>
      )}

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.9fr)]">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <SectionHeading title="Applications trend" detail="Applications received and progressed by weekday" />
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
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="ATS match distribution" detail="Score bands across evaluated applications" href="/admin/ats" action="View reports" />
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
                {applications.length ? applications.slice(0, 6).map((application) => {
                  const candidateObj = typeof application.candidate === "object" ? application.candidate : null;
                  const jobObj = typeof application.job === "object" ? application.job : null;
                  const candidateName = candidateObj?.fullName ?? candidateObj?.name ?? "Candidate";
                  return (
                    <tr className="border-b border-slate-50 last:border-0" key={application._id}>
                      <td className="py-3.5 pr-4">
                        <Link className="font-semibold text-blue-700 hover:text-blue-900" href={`/admin/applications/${application._id}`}>
                          {candidateName}
                        </Link>
                        <p className="mt-0.5 text-[11px] text-slate-400">{application.applicationId}</p>
                      </td>
                      <td className="py-3.5 pr-4">
                        <p className="font-medium text-slate-800">{jobObj?.jobTitle ?? "Job"}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">{jobObj?.jobId ?? "—"}</p>
                      </td>
                      <td className="py-3.5 pr-4 font-semibold tabular-nums text-slate-800">
                        {typeof application.atsScore === "number" ? `${application.atsScore}%` : "Pending"}
                      </td>
                      <td className="py-3.5 pr-4"><StatusBadge label={statusLabels[application.status] ?? application.status} tone={getStatusTone(application.status)} /></td>
                      <td className="whitespace-nowrap py-3.5 text-xs text-slate-500">
                        {new Date(application.appliedAt || application.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td className="py-8 text-center text-sm text-slate-500" colSpan={5}>No applications loaded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeading title="Applications by JD" detail="Application counts grouped by Job ID" href="/admin/jobs" action="Manage jobs" />
          <div className="mt-5 space-y-4">
            {dashboard?.applicationsByJD?.length ? dashboard.applicationsByJD.slice(0, 5).map((item) => {
              const progress = Math.min(100, Math.max(15, item.applicationCount * 20));
              return (
                <div key={item.jobId}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{item.jobTitle}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{item.jobId}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                      {item.applicationCount} {item.applicationCount === 1 ? "applicant" : "applicants"}
                    </span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} /></div>
                </div>
              );
            }) : <p className="py-8 text-center text-sm text-slate-500">No JD application counts available.</p>}
          </div>
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
    </main>
  );
}
