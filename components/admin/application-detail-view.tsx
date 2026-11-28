"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  RecruiterNotesPanel,
  type RecruiterNote,
} from "@/components/admin/recruiter-notes-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  ApplicationManagementRecord,
  ClientSubmissionEntry,
  InterviewRecord,
} from "@/constants/admin-content";

type ApplicationTimelineEntry = {
  id: string;
  status: string;
  actor: string;
  date: string;
  description: string;
};

const initialApplicationNotes: readonly RecruiterNote[] = [
  {
    id: "application-review",
    text: "Confirm the candidate's ownership of production work and role-specific project outcomes.",
    author: "Aisha Patel",
    createdAt: "26 Nov 2026 · 10:15 AM",
    tags: ["Screening", "Follow-up"],
  },
];

const statuses = [
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

const clientFeedbackStatuses = [
  "Submitted to Client",
  "Pending Feedback",
  "Client Approved",
  "Client Rejected",
] as const;

export function ApplicationDetailView({
  application,
}: {
  application: ApplicationManagementRecord;
}) {
  const [status, setStatus] = useState(application.status);
  const [savedStatus, setSavedStatus] = useState(application.status);
  const [recruiterOwner, setRecruiterOwner] = useState(application.recruiterOwner);
  const [savedRecruiter, setSavedRecruiter] = useState(application.recruiterOwner);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");

  const [statusHistory, setStatusHistory] = useState<ApplicationTimelineEntry[]>(() => [
    {
      id: "application-received",
      status: "New Application",
      actor: "Website Submission",
      date: application.submissionDate,
      description: `Application submitted against ${application.jobId} (JD ${application.jdVersion}) with Resume ${application.resumeVersion}.`,
    },
    ...(application.status === "New Application"
      ? []
      : [
          {
            id: "current-status",
            status: application.status,
            actor: application.recruiterOwner,
            date: "26 Nov 2026",
            description: "Current sample application stage.",
          },
        ]),
  ]);

  const [submissions, setSubmissions] = useState<ClientSubmissionEntry[]>(
    () => application.clientSubmissions ?? [],
  );
  const [clientName, setClientName] = useState(application.clientName);
  const [submittedResumeVersion, setSubmittedResumeVersion] = useState(application.resumeVersion);
  const [clientFeedbackStatus, setClientFeedbackStatus] =
    useState<ClientSubmissionEntry["feedbackStatus"]>("Submitted to Client");
  const [submissionNote, setSubmissionNote] = useState("");

  const [interviews, setInterviews] = useState<InterviewRecord[]>(
    () => application.interviews ?? [],
  );
  const [interviewStage, setInterviewStage] = useState("Technical Interview");
  const [interviewWhen, setInterviewWhen] = useState("");
  const [interviewParticipants, setInterviewParticipants] = useState(application.recruiterOwner);
  const [interviewOutcome, setInterviewOutcome] =
    useState<InterviewRecord["outcome"]>("Scheduled");
  const [interviewNotes, setInterviewNotes] = useState("");

  function saveLocalChanges() {
    const statusChanged = status !== savedStatus;
    const recruiterChanged = recruiterOwner !== savedRecruiter;
    if (statusChanged || recruiterChanged) {
      const date = new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date());
      const defaultSummary = [
        statusChanged ? `Application status updated to ${status}` : "",
        recruiterChanged ? `Recruiter assigned to ${recruiterOwner}` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      setStatusHistory((current) => [
        ...current,
        {
          id: `status-${Date.now()}`,
          status,
          actor: "Demo Recruiter",
          date,
          description: reason.trim() || `${defaultSummary}.`,
        },
      ]);
      setSavedStatus(status);
      setSavedRecruiter(recruiterOwner);
      setReason("");
    }

    setFeedback("Internal status and recruiter assignment saved in this demo view.");
  }

  function recordClientSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clientName.trim()) return;
    const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date());
    const entry: ClientSubmissionEntry = {
      id: `SUB-${400 + submissions.length + 1}`,
      client: clientName.trim(),
      jdVersion: application.jdVersion,
      resumeVersion: submittedResumeVersion,
      submittedDate: date,
      recruiter: "Demo Recruiter",
      feedbackStatus: clientFeedbackStatus,
      notes: submissionNote.trim() || "Profile and resume shared with client contact.",
    };
    setSubmissions((current) => [entry, ...current]);
    setStatus(clientFeedbackStatus === "Pending Feedback" ? "Submitted to Client" : clientFeedbackStatus);
    setSubmissionNote("");
    setFeedback(`Recorded client submission to ${entry.client} (Resume ${entry.resumeVersion}).`);
  }

  function addInterview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!interviewWhen.trim()) return;
    setInterviews((current) => [
      {
        id: `INT-${900 + current.length + 1}`,
        stage: interviewStage,
        scheduledFor: interviewWhen.trim(),
        participants: interviewParticipants.trim() || application.recruiterOwner,
        outcome: interviewOutcome,
        feedback: interviewNotes.trim() || "Pending interview notes.",
      },
      ...current,
    ]);
    setInterviewWhen("");
    setInterviewNotes("");
    setFeedback(`Logged ${interviewStage} in local demo state.`);
  }

  function getStatusTone(value: string) {
    if (["Selected", "Client Approved", "Hired / Joined"].includes(value)) return "success" as const;
    if (["Rejected", "Client Rejected"].includes(value)) return "danger" as const;
    if (value === "On Hold") return "hold" as const;
    if (["Resume Under Review", "Technical Screening"].includes(value)) return "warning" as const;
    return "info" as const;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <Link className="text-sm font-medium text-blue-700 hover:text-blue-900" href="/admin/applications">
        ← Back to applications
      </Link>
      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Application detail</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{application.id}</h1>
          <p className="mt-2 text-slate-600">
            {application.candidateName} · {application.jobId} ({application.jobTitle})
          </p>
        </div>
        <StatusBadge label={status} tone={getStatusTone(status)} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-slate-950">Application record links</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Candidate</dt>
                <dd className="mt-1">
                  <Link className="font-medium text-blue-700 hover:text-blue-900" href={`/admin/candidates/${application.candidateId}`}>
                    {application.candidateName}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Job &amp; JD version</dt>
                <dd className="mt-1">
                  <Link className="font-medium text-blue-700 hover:text-blue-900" href={`/admin/jobs/${application.jobRecordId}`}>
                    {application.jobId} · JD {application.jdVersion}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Resume &amp; version</dt>
                <dd className="mt-1">
                  <Link className="font-medium text-blue-700 hover:text-blue-900" href={`/admin/resumes/${application.resumeId}`}>
                    {application.resumeId} · {application.resumeVersion}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Client (internal)</dt>
                <dd className="mt-1 font-medium text-slate-900">{application.clientName}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">ATS score</dt>
                <dd className="mt-1 font-medium text-slate-900">{application.atsScore}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Applied date</dt>
                <dd className="mt-1 font-medium text-slate-900">{application.submissionDate}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Recruiter owner</dt>
                <dd className="mt-1 font-medium text-slate-900">{savedRecruiter}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="application-timeline-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-slate-950" id="application-timeline-heading">Application Status Timeline</h2>
            <p className="mt-1 text-sm text-slate-500">Internal status history with actor, timestamp, and review comments.</p>
            <ol aria-label="Application status history" className="mt-5 ml-1">
              {statusHistory.map((entry, index) => (
                <li
                  className={`relative border-l border-slate-200 pb-6 pl-6 last:border-transparent last:pb-0 ${
                    index === statusHistory.length - 1 ? "border-blue-300" : ""
                  }`}
                  key={entry.id}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[7px] top-1 size-3 rounded-full ring-4 ring-white ${
                      index === statusHistory.length - 1 ? "bg-blue-700" : "bg-slate-300"
                    }`}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{entry.status}</h3>
                    <span className="text-xs text-slate-500">by {entry.actor}</span>
                    {index === statusHistory.length - 1 && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{entry.description}</p>
                  <time className="mt-1 block text-xs text-slate-500">{entry.date}</time>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">ATS match summary</h2>
                <p className="mt-1 text-sm text-slate-500">Decision support only · evaluated against JD {application.jdVersion} and Resume {application.resumeVersion}</p>
              </div>
              <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={`/admin/ats/${application.id}`}>
                View full ATS report →
              </Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-emerald-50 p-4"><p className="text-xs font-semibold uppercase text-emerald-800">Score</p><p className="mt-2 text-lg font-semibold text-emerald-950">{application.atsScore}</p></div>
              <div className="rounded-lg bg-amber-50 p-4"><p className="text-xs font-semibold uppercase text-amber-800">Human review</p><p className="mt-2 text-sm text-amber-900">Validate mandatory criteria and interview evidence</p></div>
              <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs font-semibold uppercase text-slate-600">Snapshot versions</p><p className="mt-2 text-sm text-slate-800">JD {application.jdVersion} · Resume {application.resumeVersion}</p></div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-slate-950">Update internal status &amp; recruiter</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-medium text-slate-700">Application status
                <select className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm" value={status} onChange={(event) => setStatus(event.currentTarget.value)}>
                  {statuses.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">Assigned recruiter
                <select className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm" value={recruiterOwner} onChange={(event) => setRecruiterOwner(event.currentTarget.value)}>
                  <option>Aisha Patel</option>
                  <option>Daniel Kim</option>
                  <option>Leah Morgan</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">Status reason / comment
                <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" value={reason} onChange={(event) => setReason(event.currentTarget.value)} placeholder="Optional review note" />
              </label>
            </div>
            <button className="mt-4 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800" onClick={saveLocalChanges} type="button">Save status update</button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold text-slate-950">Interviews &amp; Feedback</h2>
            <p className="mt-1 text-sm text-slate-500">Internal interview stages, participants, and outcome tracking.</p>
            <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={addInterview}>
              <label className="text-xs font-medium text-slate-700">Interview stage
                <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={interviewStage} onChange={(e) => setInterviewStage(e.currentTarget.value)} required />
              </label>
              <label className="text-xs font-medium text-slate-700">Date &amp; time
                <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. 29 Nov 2026 · 4:00 PM IST" value={interviewWhen} onChange={(e) => setInterviewWhen(e.currentTarget.value)} required />
              </label>
              <label className="text-xs font-medium text-slate-700">Participants
                <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={interviewParticipants} onChange={(e) => setInterviewParticipants(e.currentTarget.value)} />
              </label>
              <label className="text-xs font-medium text-slate-700">Outcome
                <select className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={interviewOutcome} onChange={(e) => setInterviewOutcome(e.currentTarget.value as InterviewRecord["outcome"])}>
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Passed</option>
                  <option>On Hold</option>
                </select>
              </label>
              <label className="text-xs font-medium text-slate-700 sm:col-span-2">Feedback summary
                <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Key takeaways or next steps" value={interviewNotes} onChange={(e) => setInterviewNotes(e.currentTarget.value)} />
              </label>
              <div className="sm:col-span-2">
                <button className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" type="submit">Log interview entry</button>
              </div>
            </form>

            {interviews.length > 0 ? (
              <ul className="mt-5 divide-y divide-slate-100 border-t border-slate-100 pt-4">
                {interviews.map((item) => (
                  <li className="py-3 first:pt-0 last:pb-0" key={item.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{item.stage} · {item.scheduledFor}</p>
                      <StatusBadge label={item.outcome} tone={item.outcome === "Passed" ? "success" : item.outcome === "On Hold" ? "hold" : "info"} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Participants: {item.participants}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.feedback}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-xs text-slate-500">No interviews logged for this application yet.</p>
            )}
          </section>

          <RecruiterNotesPanel
            description="Private notes for recruiter follow-up. Hidden from candidates."
            initialNotes={initialApplicationNotes}
          />
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Client submission tracking</h2>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Record when this candidate’s profile is shared with a client against JD {application.jdVersion}.
            </p>
            <form className="mt-4 space-y-3.5" onSubmit={recordClientSubmission}>
              <label className="block text-xs font-medium text-slate-700">Client organization
                <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={clientName} onChange={(e) => setClientName(e.currentTarget.value)} required />
              </label>
              <label className="block text-xs font-medium text-slate-700">Submitted resume version
                <select className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={submittedResumeVersion} onChange={(e) => setSubmittedResumeVersion(e.currentTarget.value)}>
                  <option value={application.resumeVersion}>{application.resumeVersion} (Current)</option>
                  <option value="v1">v1</option>
                </select>
              </label>
              <label className="block text-xs font-medium text-slate-700">Client feedback / status
                <select className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={clientFeedbackStatus} onChange={(e) => setClientFeedbackStatus(e.currentTarget.value as ClientSubmissionEntry["feedbackStatus"])}>
                  {clientFeedbackStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="block text-xs font-medium text-slate-700">Submission note
                <textarea className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Consent confirmed; summary shared with hiring manager" rows={2} value={submissionNote} onChange={(e) => setSubmissionNote(e.currentTarget.value)} />
              </label>
              <button className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800" type="submit">
                Record client submission
              </button>
            </form>

            {submissions.length > 0 && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Submission history</h3>
                <ul className="mt-3 space-y-3">
                  {submissions.map((sub) => (
                    <li className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs" key={sub.id}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900">{sub.client}</span>
                        <StatusBadge label={sub.feedbackStatus} tone={getStatusTone(sub.feedbackStatus)} />
                      </div>
                      <p className="mt-1 text-slate-600">JD {sub.jdVersion} · Resume {sub.resumeVersion} · {sub.submittedDate}</p>
                      <p className="mt-1 text-slate-500">By {sub.recruiter}: {sub.notes}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {feedback && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900" role="status">
              {feedback}
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
