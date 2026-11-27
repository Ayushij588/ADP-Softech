"use client";

import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { RecruiterNotesPanel } from "@/components/admin/recruiter-notes-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  applicationManagementRecords,
  candidateManagementRecords,
  type ResumeManagementRecord,
} from "@/constants/admin-content";

const statusTones: Record<string, "neutral" | "success" | "warning" | "danger" | "info"> = {
  reviewed: "success",
  "needs review": "warning",
  "ats pending": "info",
  "ats failed": "danger",
  parsed: "info",
};

function getStatusTone(status: string) {
  return statusTones[status.toLowerCase()] ?? "neutral";
}

function getScoreTone(score: number) {
  if (score >= 85) return "text-emerald-700 bg-emerald-50";
  if (score >= 70) return "text-blue-700 bg-blue-50";
  return "text-amber-700 bg-amber-50";
}

export function ResumePreviewView({ resume: initialResume }: { resume: ResumeManagementRecord }) {
  const [resume, setResume] = useState(initialResume);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const candidate = candidateManagementRecords.find((item) => item.id === resume.candidateId);
  const applications = applicationManagementRecords.filter((item) => item.candidateId === resume.candidateId);
  const applicationHref = applications[0] ? `/admin/applications/${applications[0].id}` : "/admin/applications";
  const matchedSkills = Math.min(resume.skills.length, Math.max(1, Math.round((resume.atsScore / 100) * resume.skills.length)));
  const isFallbackNeeded = resume.status === "ATS Pending" || resume.status === "ATS Failed";

  function downloadResume() {
    const content = [
      `Resume preview for ${resume.title}`,
      `Resume ID: ${resume.id}`,
      `Version: ${resume.version}`,
      `Role: ${resume.category}`,
      `Location: ${resume.location}`,
      `Experience: ${resume.experienceYears} years`,
      `Skills: ${resume.skills.join(", ")}`,
      `ATS score: ${resume.atsScore}%`,
      "",
      "This is illustrative demo content; the original resume file is not connected.",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${resume.id.toLowerCase()}-${resume.version}-preview.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setFeedback("Downloaded demo text preview (no live private file storage connected).");
  }

  function retryAtsParsing() {
    setResume((current) => ({
      ...current,
      status: "Needs Review",
      parseErrorReason: undefined,
    }));
    setFeedback("Queued ATS re-analysis in local demo state. Marked as Needs Review for recruiter verification.");
  }

  function handleVersionUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (!/\.(pdf|doc|docx)$/i.test(file.name)) {
      setFeedback("Only PDF, DOC, or DOCX resume files are allowed.");
      return;
    }
    const nextVersion = `v${resume.versions.length + 1}`;
    setResume((current) => ({
      ...current,
      version: nextVersion,
      detail: file.name,
      date: "Just now",
      status: "ATS Pending",
      versions: [
        {
          version: nextVersion,
          fileName: file.name,
          uploadDate: "Just now",
          atsScore: current.atsScore,
        },
        ...current.versions,
      ],
    }));
    setFeedback(`Added ${nextVersion} (${file.name}) to local resume version history.`);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <Link className="text-sm font-medium text-blue-700 hover:text-blue-900" href="/admin/resumes">
        ← Back to resumes
      </Link>

      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Resume detail · {resume.id}</p>
      <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">{resume.title}</h1>
          <p className="mt-2 text-slate-600">{resume.detail} <span className="mx-1 text-slate-300">·</span> {resume.category}</p>
        </div>
        <StatusBadge label={resume.status} tone={getStatusTone(resume.status)} />
      </div>

      {isFallbackNeeded && (
        <section aria-live="polite" className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-semibold text-amber-950">
              {resume.status === "ATS Failed"
                ? "ATS Analysis Failed – Manual Review Required"
                : "ATS Analysis Pending – Manual Review Available"}
            </h2>
            <p className="mt-1 text-sm text-amber-900">
              {resume.parseErrorReason ?? "Automated parsing is pending or incomplete. The application remains preserved for manual review."}
            </p>
          </div>
          <button
            className="shrink-0 rounded-lg bg-amber-900 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-950"
            onClick={retryAtsParsing}
            type="button"
          >
            Retry ATS analysis
          </button>
        </section>
      )}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "ATS match score", value: `${resume.atsScore}%`, detail: "Illustrative match snapshot" },
          { label: "Experience", value: `${resume.experienceYears} years`, detail: "Candidate-reported" },
          { label: "Resume version", value: resume.version, detail: `${resume.versions.length} version${resume.versions.length === 1 ? "" : "s"} on record` },
          { label: "Applications", value: String(applications.length), detail: "Linked application records" },
        ].map((metric) => (
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={metric.label}>
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{metric.value}</p>
            <p className="mt-1 text-xs text-slate-500">{metric.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section aria-labelledby="candidate-information-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-lg font-semibold text-slate-950" id="candidate-information-heading">Candidate Information</h2><p className="mt-1 text-sm text-slate-500">Contact and availability details associated with this resume.</p></div>
              {candidate && <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={`/admin/candidates/${candidate.id}`}>Open candidate profile →</Link>}
            </div>
            <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                ["Candidate ID", resume.candidateId],
                ["Email", candidate?.detail ?? resume.candidateEmail],
                ["Phone", candidate?.phoneNumber ?? "Not provided"],
                ["Location", resume.location],
                ["Notice period", candidate?.noticePeriod ?? "Not provided"],
                ["Experience", `${resume.experienceYears} years`],
              ].map(([label, value]) => <div key={label}><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-800">{value}</dd></div>)}
            </dl>
          </section>

          <section aria-labelledby="parsed-info-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-950" id="parsed-info-heading">Parsed Resume Summary</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{resume.parsedSummary.summary}</p>
            <dl className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Education</dt>
                <dd className="mt-1 text-sm text-slate-800">{resume.parsedSummary.education}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Certifications</dt>
                <dd className="mt-1 text-sm text-slate-800">
                  {resume.parsedSummary.certifications.length > 0 ? resume.parsedSummary.certifications.join(", ") : "None detected"}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="skills-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-950" id="skills-heading">Skills Extracted</h2>
            <div className="mt-4 flex flex-wrap gap-2">{resume.skills.map((skill) => <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800" key={skill}>{skill}</span>)}</div>
          </section>

          <section aria-labelledby="ats-snapshot-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-lg font-semibold text-slate-950" id="ats-snapshot-heading">ATS Snapshot</h2><p className="mt-1 text-sm text-slate-500">Illustrative frontend score; no ATS engine is connected.</p></div>
              <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${getScoreTone(resume.atsScore)}`}>{resume.atsScore}% match</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-medium text-slate-600"><span>Role skill coverage</span><span>{matchedSkills} of {resume.skills.length} profile skills</span></div>
              <div aria-label={`${resume.atsScore}% illustrative ATS score`} className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${resume.atsScore}%` }} /></div>
            </div>
          </section>

          <section aria-labelledby="versions-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-950" id="versions-heading">Resume Versions</h2>
              <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                + Upload new version
                <input accept=".pdf,.doc,.docx" className="sr-only" onChange={handleVersionUpload} type="file" />
              </label>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {resume.versions.map((version) => (
                <div className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0" key={`${resume.id}-${version.version}`}>
                  <div><p className="font-medium text-slate-900">{version.version} <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">{version.version === resume.version ? "Current" : "Previous"}</span></p><p className="mt-1 text-sm text-slate-600">{version.fileName}</p><p className="mt-1 text-xs text-slate-500">Uploaded {version.uploadDate}</p></div>
                  <span className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">ATS {version.atsScore}%</span>
                </div>
              ))}
            </div>
          </section>

          <RecruiterNotesPanel
            description="Private notes for recruiter follow-up. Changes remain local to this demo."
            initialNotes={[
              {
                id: `${resume.id}-review-note`,
                text: "Confirm notice period and role-specific project ownership during the next recruiter conversation.",
                author: "Aisha Patel",
                createdAt: "26 Nov 2026 · 11:10 AM",
                tags: ["Follow-up"],
              },
            ]}
          />

          <section aria-labelledby="application-history-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-slate-950" id="application-history-heading">Application History</h2><Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={applicationHref}>View applications →</Link></div>
            {applications.length > 0 ? <div className="mt-4 space-y-3">{applications.map((application) => <Link className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:bg-blue-50/40" href={`/admin/applications/${application.id}`} key={application.id}><div><p className="font-semibold text-slate-900">{application.jobTitle}</p><p className="mt-1 text-sm text-slate-500">{application.id} · {application.jobId} (JD {application.jdVersion}) · {application.submissionDate}</p></div><div className="flex items-center gap-3"><span className="text-sm font-semibold text-slate-700">ATS {application.atsScore}</span><StatusBadge label={application.status} tone="info" /></div></Link>)}</div> : <p className="mt-4 text-sm text-slate-500">No linked applications in the sample records.</p>}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <section aria-labelledby="quick-actions-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-950" id="quick-actions-heading">Quick Actions</h2>
            <div className="mt-4 space-y-2.5">
              <button className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800" onClick={() => { setPreviewOpen((open) => !open); setFeedback(""); }} type="button">{previewOpen ? "Close resume preview" : "View Resume"}</button>
              <button className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={downloadResume} type="button">Download Resume</button>
              {candidate && <Link className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/candidates/${candidate.id}`}>Candidate Profile</Link>}
              <Link className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" href={applicationHref}>Application History</Link>
            </div>
            {feedback && <p className="mt-3 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-900" role="status">{feedback}</p>}
          </section>
        </aside>
      </div>

      {previewOpen && <section aria-label="Resume document preview" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={() => setPreviewOpen(false)}>
        <article className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-10" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5"><div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Sample resume preview · {resume.version}</p><h2 className="mt-2 text-2xl font-semibold text-slate-950">{resume.title}</h2><p className="mt-1 text-sm text-slate-600">{candidate?.detail ?? resume.candidateEmail} · {resume.location}</p></div><button aria-label="Close resume preview" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={() => setPreviewOpen(false)} type="button">Close</button></div>
          <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Illustrative preview only. Original private storage file is not connected.</p>
          <section className="mt-7"><h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Parsed summary</h3><p className="mt-3 text-sm leading-7 text-slate-700">{resume.parsedSummary.summary}</p></section>
          <section className="mt-7"><h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Education</h3><p className="mt-2 text-sm text-slate-700">{resume.parsedSummary.education}</p></section>
          <section className="mt-7"><h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">Skills</h3><div className="mt-3 flex flex-wrap gap-2">{resume.skills.map((skill) => <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700" key={skill}>{skill}</span>)}</div></section>
        </article>
      </section>}
    </main>
  );
}
