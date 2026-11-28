"use client";

import Link from "next/link";
import { useState } from "react";
import { JobFormDialog } from "@/components/admin/job-form-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  applicationManagementRecords,
  type JobManagementRecord,
} from "@/constants/admin-content";
import type { JobFormValues } from "@/lib/admin-form-schemas";

function getStatusTone(status: string) {
  if (status === "Published" || status === "Active") return "success" as const;
  if (status === "On Hold") return "hold" as const;
  if (status === "Closed") return "closed" as const;
  if (status === "Internal Review") return "warning" as const;
  return "info" as const;
}

export function JobDetailView({ initialJob }: { initialJob: JobManagementRecord }) {
  const [job, setJob] = useState<JobManagementRecord>(initialJob);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const linkedApplications = applicationManagementRecords.filter(
    (app) => app.jobId === job.jobId,
  );

  function handleSave(fields: JobFormValues) {
    const nextVersion = `v${job.versions.length + 1}`;
    setJob((current) => ({
      ...current,
      ...fields,
      mandatorySkills: fields.mandatorySkills.split(",").map((s) => s.trim()).filter(Boolean),
      preferredSkills: fields.preferredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      certifications: fields.certifications.split(",").map((s) => s.trim()).filter(Boolean),
      currentVersion: nextVersion,
      date: "Just now",
      versions: [
        {
          version: nextVersion,
          updatedAt: "Just now",
          updatedBy: fields.recruiterOwner || "Demo Recruiter",
          summary: `Updated JD details (${fields.status} · ${fields.publication}).`,
        },
        ...current.versions,
      ],
    }));
    setIsEditOpen(false);
    setFeedback(`Saved ${nextVersion} of ${job.jobId} in local demo state.`);
  }

  function applyWorkflowAction(
    status: JobManagementRecord["status"],
    publication: JobManagementRecord["publication"],
    note: string,
  ) {
    setJob((current) => ({
      ...current,
      status,
      publication,
      date: "Just now",
    }));
    setActionsOpen(false);
    setFeedback(note);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <Link className="text-sm font-medium text-blue-700 hover:text-blue-900" href="/admin/jobs">
        ← Back to jobs
      </Link>

      <header className="mt-5 flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:p-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{job.jobId}</p>
            <StatusBadge label={`JD ${job.currentVersion}`} tone="info" />
            <StatusBadge label={job.status} tone={getStatusTone(job.status)} />
            <StatusBadge label={job.publication} tone={job.publication === "Published" ? "success" : "neutral"} />
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{job.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{job.clientName} · {job.category} · {job.location} ({job.workMode})</p>
        </div>

        <div className="relative flex flex-wrap gap-2.5">
          <button
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setIsEditOpen(true)}
            type="button"
          >
            Edit JD
          </button>
          <button
            aria-expanded={actionsOpen}
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            onClick={() => setActionsOpen((open) => !open)}
            type="button"
          >
            Workflow actions <span aria-hidden="true">⌄</span>
          </button>
          {actionsOpen && (
            <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
              <button
                className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => applyWorkflowAction("Published", "Published", "JD approved and published to public careers.")}
                type="button"
              >
                Approve &amp; Publish
              </button>
              <button
                className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => applyWorkflowAction("On Hold", "Unpublished", "JD placed on hold and unpublished.")}
                type="button"
              >
                Put On Hold
              </button>
              <button
                className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-rose-700 hover:bg-rose-50"
                onClick={() => applyWorkflowAction("Closed", "Unpublished", "JD closed; new public applications blocked.")}
                type="button"
              >
                Close JD
              </button>
              <button
                className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
                onClick={() => applyWorkflowAction("Archived", "Unpublished", "JD archived in demo state.")}
                type="button"
              >
                Archive JD
              </button>
            </div>
          )}
        </div>
      </header>

      {feedback && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status">
          {feedback}
        </p>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.8fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-slate-950">Job overview</h2>
            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <DetailItem label="Client name (internal)" value={job.clientName} />
              <DetailItem label="Department" value={job.category} />
              <DetailItem label="Location" value={job.location} />
              <DetailItem label="Work mode" value={job.workMode} />
              <DetailItem label="Work timings / time zone" value={job.workTimings} />
              <DetailItem label="Engagement type" value={job.detail} />
              <DetailItem label="Experience required" value={job.experienceRequired} />
              <DetailItem label="Number of positions" value={String(job.numberOfPositions)} />
              <DetailItem label="Application deadline" value={job.deadline} />
              <DetailItem label="Eligibility / restrictions" value={job.eligibility || "None specified"} />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-slate-950">Skills and qualifications</h2>
            <div className="mt-5 space-y-5">
              <SkillList label="Mandatory skills" items={job.mandatorySkills} tone="blue" />
              <SkillList label="Preferred skills" items={job.preferredSkills} tone="slate" />
              <DetailItem label="Education" value={job.education} />
              <SkillList label="Certifications" items={job.certifications} tone="slate" />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-slate-950">Responsibilities</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{job.responsibilities}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-950">JD Version History</h2>
              <span className="text-xs font-medium text-slate-500">{job.versions.length} versions</span>
            </div>
            <ul className="mt-4 divide-y divide-slate-100">
              {job.versions.map((ver, index) => (
                <li className="py-3.5 first:pt-0 last:pb-0" key={`${job.id}-${ver.version}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{ver.version}</span>
                      {index === 0 && <StatusBadge label="Current" tone="info" />}
                      <span className="text-xs text-slate-500">by {ver.updatedBy}</span>
                    </div>
                    <time className="text-xs text-slate-500">{ver.updatedAt}</time>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600">{ver.summary}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-950">Applications for this JD</h2>
              <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" href="/admin/applications">
                All applications →
              </Link>
            </div>
            {linkedApplications.length > 0 ? (
              <ul className="mt-4 divide-y divide-slate-100">
                {linkedApplications.map((app) => (
                  <li className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0" key={app.id}>
                    <div>
                      <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={`/admin/applications/${app.id}`}>
                        {app.candidateName} · {app.id}
                      </Link>
                      <p className="mt-0.5 text-xs text-slate-500">JD {app.jdVersion} · Resume {app.resumeVersion} · ATS {app.atsScore}</p>
                    </div>
                    <StatusBadge label={app.status} tone="info" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No linked sample applications for this Job ID yet.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-950">Hiring &amp; Source File</h2>
            <dl className="mt-5 space-y-5">
              <DetailItem label="Recruiter owner" value={job.recruiterOwner} />
              <DetailItem label="Budget / rate · internal" value={job.budget} />
              <DetailItem label="Original client JD (confidential)" value={job.originalJdFile || "Manual entry"} />
              <DetailItem label="Applications received" value={job.metric} />
              <DetailItem label="Last updated" value={job.date} />
            </dl>
          </section>

          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-blue-950">Public JD Preview ({job.publication})</h2>
            <p className="mt-2 text-sm leading-6 text-blue-900">{job.publicDescription}</p>
            <p className="mt-3 text-xs text-blue-800">
              Client name, budget, and the original source JD file are kept confidential and excluded from public display.
            </p>
          </section>
        </aside>
      </div>

      {isEditOpen && (
        <JobFormDialog
          generatedJobId={job.jobId}
          job={job}
          mode="edit"
          onClose={() => setIsEditOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1.5 break-words text-sm leading-6 text-slate-900">{value || "—"}</dd>
    </div>
  );
}

function SkillList({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "blue" | "slate";
}) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</h3>
      {items.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <li className={`rounded-full px-3 py-1 text-xs font-medium ${tone === "blue" ? "bg-blue-50 text-blue-800" : "bg-slate-100 text-slate-700"}`} key={item}>{item}</li>
          ))}
        </ul>
      ) : <p className="mt-2 text-sm text-slate-500">Not specified</p>}
    </div>
  );
}
