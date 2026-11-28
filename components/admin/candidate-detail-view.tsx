"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { FormDialog } from "@/components/ui/form-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  RecruiterNotesPanel,
  type RecruiterNote,
} from "@/components/admin/recruiter-notes-panel";
import {
  applicationManagementRecords,
  resumeManagementRecords,
  type CandidateManagementRecord,
  type InterviewRecord,
} from "@/constants/admin-content";

const candidateStatuses = [
  "Available",
  "Resume Under Review",
  "Shortlisted",
  "Technical Screening",
  "Interview Scheduled",
  "On Hold",
  "Rejected",
] as const;

const initialCandidateNotes: readonly RecruiterNote[] = [
  {
    id: "candidate-review",
    text: "Strong background for current roles. Confirm availability and project ownership during the next conversation.",
    author: "Aisha Patel",
    createdAt: "25 Nov 2026 · 3:20 PM",
    tags: ["Technical", "Follow-up"],
  },
];

function getStatusTone(status: string) {
  if (status === "Shortlisted") return "info" as const;
  if (["Available", "Selected", "Submitted to Client"].includes(status)) return "success" as const;
  if (status === "On Hold") return "hold" as const;
  if (["Interview Scheduled", "Technical Screening"].includes(status)) return "info" as const;
  if (status === "Resume Under Review") return "warning" as const;
  if (status === "Rejected") return "danger" as const;
  return "neutral" as const;
}

export function CandidateDetailView({
  candidate,
}: {
  candidate: CandidateManagementRecord;
}) {
  const [status, setStatus] = useState(candidate.status);
  const [duplicateWarning, setDuplicateWarning] = useState(candidate.duplicateWarning ?? "");
  const [actionMessage, setActionMessage] = useState("");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [interviewStage, setInterviewStage] = useState("Technical Screening");
  const [interviewDateTime, setInterviewDateTime] = useState("");
  const [participants, setParticipants] = useState("Aisha Patel");
  const [interviewNote, setInterviewNote] = useState("");

  const applications = useMemo(
    () => applicationManagementRecords.filter((application) => application.candidateId === candidate.id),
    [candidate.id],
  );
  const resume = resumeManagementRecords.find((item) => item.candidateId === candidate.id);
  const topApplication = applications[0];

  const [interviews, setInterviews] = useState<InterviewRecord[]>(() =>
    applications.flatMap((app) => app.interviews ?? []),
  );

  function scheduleInterview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!interviewDateTime.trim()) return;
    setInterviews((current) => [
      {
        id: `INT-${910 + current.length}`,
        stage: interviewStage,
        scheduledFor: interviewDateTime.trim(),
        participants: participants.trim() || "Recruitment Team",
        outcome: "Scheduled",
        feedback: interviewNote.trim() || "Scheduled from candidate profile.",
      },
      ...current,
    ]);
    setStatus("Interview Scheduled");
    setIsScheduleOpen(false);
    setInterviewDateTime("");
    setInterviewNote("");
    setActionMessage(`Scheduled ${interviewStage} in local demo state.`);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <Link className="text-sm font-medium text-blue-700 hover:text-blue-900" href="/admin/candidates">← Back to candidates</Link>
      <header className="mt-5 flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:p-8">
        <div className="flex items-start gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-800">{candidate.title.split(" ").map((part) => part[0]).join("")}</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Candidate profile · {candidate.id}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{candidate.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{candidate.detail} · {candidate.location}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {duplicateWarning && <StatusBadge label="Possible duplicate" tone="warning" />}
          <StatusBadge label={status} tone={getStatusTone(status)} />
        </div>
      </header>

      {duplicateWarning && (
        <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 sm:flex-row sm:items-center" role="alert">
          <p>
            <strong>Duplicate candidate check:</strong> {duplicateWarning}
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-950 hover:bg-amber-100"
              onClick={() => {
                setDuplicateWarning("");
                setActionMessage("Duplicate flag dismissed; kept as separate canonical candidate record.");
              }}
              type="button"
            >
              Keep separate
            </button>
            <button
              className="rounded-lg bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-950"
              onClick={() => {
                setDuplicateWarning("");
                setActionMessage("Merged duplicate profile metadata into canonical candidate record (demo state).");
              }}
              type="button"
            >
              Merge duplicate
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.9fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-slate-950">Candidate Information</h2>
            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Info label="Full name" value={candidate.title} />
              <Info label="Email address" value={candidate.detail} />
              <Info label="Mobile number" value={candidate.phoneNumber} />
              <Info label="Current location" value={candidate.location} />
              <Info label="Total experience" value={`${candidate.experienceYears} years`} />
              <Info label="Notice period" value={candidate.noticePeriod} />
              <Info label="Total applications" value={String(applications.length || candidate.totalApplications)} />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current status</dt>
                <dd className="mt-2"><StatusBadge label={status} tone={getStatusTone(status)} /></dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-lg font-semibold text-slate-950">Skills</h2><p className="mt-1 text-sm text-slate-500">Primary skills and candidate profile highlights</p></div>
              <span className="text-xs text-slate-500">Updated {candidate.date.replace("Updated ", "")}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {candidate.primarySkills.map((skill) => <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-800" key={skill}>{skill}</span>)}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div><h2 className="text-lg font-semibold text-slate-950">Resume</h2><p className="mt-1 text-sm text-slate-500">Latest resume on file</p></div>
              {resume && <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={`/admin/resumes/${resume.id}`}>Open resume →</Link>}
            </div>
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-rose-700 shadow-sm">DOC</span>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{resume?.detail ?? candidate.resumeFile}</p><p className="mt-1 text-xs text-slate-500">Uploaded {resume?.date ?? candidate.resumeUpdated} · {resume?.version ?? "v1"}</p></div>
              {resume && <Link className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-100" href={`/admin/resumes/${resume.id}`}>Preview</Link>}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-lg font-semibold text-slate-950">Application History</h2><p className="mt-1 text-sm text-slate-500">Separate JD-linked application records for this candidate</p></div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{applications.length} applications</span>
            </div>
            {applications.length > 0 ? (
              <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Application</th><th className="px-4 py-3">Job &amp; Versions</th><th className="px-4 py-3">Applied</th><th className="px-4 py-3">ATS</th><th className="px-4 py-3">Status</th></tr></thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr className="border-t border-slate-100" key={application.id}>
                        <td className="px-4 py-3"><Link className="font-semibold text-blue-700 hover:text-blue-900" href={`/admin/applications/${application.id}`}>{application.id}</Link></td>
                        <td className="px-4 py-3"><p className="font-medium text-slate-800">{application.jobTitle}</p><p className="mt-0.5 text-xs text-slate-500">{application.jobId} · JD {application.jdVersion} · Resume {application.resumeVersion}</p></td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">{application.submissionDate}</td>
                        <td className="px-4 py-3 font-semibold"><Link className="text-blue-700 hover:text-blue-900" href={`/admin/ats/${application.id}`}>{application.atsScore}</Link></td>
                        <td className="px-4 py-3"><StatusBadge label={application.status} tone={getStatusTone(application.status)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="mt-5 text-sm text-slate-500">No applications are linked to this candidate in the sample records.</p>}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-950">Interviews</h2>
              <button className="text-sm font-semibold text-blue-700 hover:text-blue-900" onClick={() => setIsScheduleOpen(true)} type="button">+ Schedule interview</button>
            </div>
            {interviews.length > 0 ? (
              <ul className="mt-4 divide-y divide-slate-100">
                {interviews.map((item) => (
                  <li className="py-3 first:pt-0 last:pb-0" key={item.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{item.stage} · {item.scheduledFor}</p>
                      <StatusBadge label={item.outcome} tone={item.outcome === "Passed" ? "success" : "info"} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Participants: {item.participants}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.feedback}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No interviews scheduled yet.</p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div><h2 className="text-lg font-semibold text-slate-950">ATS Summary</h2><p className="mt-1 text-sm text-slate-500">Explainable decision support · human review required</p></div>
              {topApplication && <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={`/admin/ats/${topApplication.id}`}>View ATS report →</Link>}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <div className="flex flex-col items-center justify-center rounded-xl bg-blue-50 p-5"><span className="text-3xl font-semibold text-blue-900">{candidate.atsScore}%</span><span className="mt-1 text-xs text-blue-700">Top match</span></div>
              <div className="rounded-xl border border-slate-100 p-4"><p className="text-sm leading-6 text-slate-700">{candidate.atsInsight}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">Relevant skills found</span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">Recruiter validation required</span></div></div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-950">Quick Actions</h2>
            <div className="mt-4 grid gap-2">
              <a className="rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-800" href={`mailto:${candidate.detail}`}>Email candidate</a>
              {topApplication && <Link className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/applications/${topApplication.id}`}>Open latest application</Link>}
              {topApplication && <Link className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/ats/${topApplication.id}`}>Review ATS report</Link>}
              <button className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setIsScheduleOpen(true)} type="button">Schedule interview</button>
            </div>
            <label className="mt-5 block text-sm font-medium text-slate-700">Candidate status
              <select className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm" onChange={(event) => { setStatus(event.currentTarget.value); setActionMessage("Candidate status updated in local demo state."); }} value={status}>
                {candidateStatuses.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            {actionMessage && <p className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-900" role="status">{actionMessage}</p>}
          </section>

          <RecruiterNotesPanel
            description="Private to the recruitment team; not visible to candidates."
            initialNotes={initialCandidateNotes}
          />
        </aside>
      </div>

      {isScheduleOpen && (
        <FormDialog
          description={`Schedule an internal interview stage for ${candidate.title}.`}
          onClose={() => setIsScheduleOpen(false)}
          title="Schedule interview"
        >
          <form className="space-y-4 px-5 py-6 sm:px-7" onSubmit={scheduleInterview}>
            <label className="block text-sm font-medium text-slate-700">Interview stage
              <select className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm" value={interviewStage} onChange={(e) => setInterviewStage(e.currentTarget.value)}>
                <option>Technical Screening</option>
                <option>Portfolio Walkthrough</option>
                <option>Client Interview</option>
                <option>Final Discussion</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">Date &amp; time
              <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" placeholder="e.g. 30 Nov 2026 · 11:30 AM IST" required value={interviewDateTime} onChange={(e) => setInterviewDateTime(e.currentTarget.value)} />
            </label>
            <label className="block text-sm font-medium text-slate-700">Participants
              <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" value={participants} onChange={(e) => setParticipants(e.currentTarget.value)} />
            </label>
            <label className="block text-sm font-medium text-slate-700">Preparation notes
              <textarea className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" rows={3} value={interviewNote} onChange={(e) => setInterviewNote(e.currentTarget.value)} />
            </label>
            <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-4 sm:flex-row">
              <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700" onClick={() => setIsScheduleOpen(false)} type="button">Cancel</button>
              <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800" type="submit">Save schedule</button>
            </div>
          </form>
        </FormDialog>
      )}
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1.5 text-sm text-slate-900">{value || "—"}</dd></div>;
}
