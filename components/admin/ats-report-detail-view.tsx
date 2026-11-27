"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { RecruiterNotesPanel } from "@/components/admin/recruiter-notes-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AtsScoreGauge } from "@/components/ui/ats-score-gauge";
import { useToast } from "@/components/ui/toast";
import {
  candidateManagementRecords,
  jobManagementRecords,
} from "@/constants/admin-content";
import {
  type AtsMatchCategory,
  type AtsReportRecord,
} from "@/constants/ats-reports";

const categoryTones: Record<AtsMatchCategory, "success" | "info" | "warning" | "danger"> = {
  "Strong Match": "success",
  "Good Match": "info",
  "Moderate Match": "warning",
  "Low Match": "danger",
};

const criterionTones = {
  Met: "success",
  Unclear: "warning",
  "Not Met": "danger",
} as const;

const analysisStatusTones = {
  Completed: "success",
  Pending: "info",
  Failed: "danger",
} as const;

function getScore(score: string) {
  const parsed = Number.parseInt(score, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getScoreColor(score: number) {
  if (score >= 85) return "bg-emerald-500";
  if (score >= 70) return "bg-blue-600";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

export function AtsReportDetailView({ report: initialReport }: { report: AtsReportRecord }) {
  const { toast } = useToast();
  const [report, setReport] = useState(initialReport);
  const [overrideBand, setOverrideBand] = useState<AtsMatchCategory>(initialReport.matchCategory);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideHistory, setOverrideHistory] = useState<
    { id: string; band: string; reason: string; date: string; actor: string }[]
  >([]);

  const score = getScore(report.atsScore);
  const candidate = candidateManagementRecords.find((item) => item.id === report.candidateId);
  const job = jobManagementRecords.find((item) => item.jobId === report.jobId);
  const applicationHref = `/admin/applications/${report.id}`;
  const hasMandatoryFailure = report.mandatoryCriteria.some((c) => c.result === "Not Met");

  function handleRetryAnalysis() {
    setReport((current) => ({
      ...current,
      analysisStatus: "Completed",
      failureReason: undefined,
      analysisDateLabel: "Just now (demo retry)",
    }));
    toast("ATS re-analysis triggered. Report updated in demo state.", "info");
  }

  function handleOverrideSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!overrideReason.trim()) return;
    const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date());
    setOverrideHistory((current) => [
      {
        id: `OVR-${Date.now()}`,
        band: overrideBand,
        reason: overrideReason.trim(),
        date,
        actor: "Demo Recruiter",
      },
      ...current,
    ]);
    setReport((current) => ({ ...current, matchCategory: overrideBand }));
    setOverrideReason("");
    toast(`Recruiter override saved — ${overrideBand}. Audit entry recorded.`, "success");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <Link className="text-sm font-medium text-blue-700 hover:text-blue-900" href="/admin/ats">← Back to ATS reports</Link>
      <header className="mt-5 flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">ATS detail report · {report.analysisId}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{report.candidateName}</h1>
          <p className="mt-2 text-slate-600">{report.jobId} · {report.jobTitle}</p>
          <p className="mt-2 text-xs text-slate-500">
            JD {report.jdVersion} · Resume {report.resumeVersion} · {report.scoringModelVersion} · {report.analysisDateLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={report.analysisStatus} tone={analysisStatusTones[report.analysisStatus]} />
          <StatusBadge label={report.matchCategory} tone={categoryTones[report.matchCategory]} />
        </div>
      </header>

      {(report.analysisStatus === "Pending" || report.analysisStatus === "Failed") && (
        <section className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center" role="alert">
          <div>
            <h2 className="text-sm font-semibold text-amber-950">
              ATS Analysis {report.analysisStatus} – Manual Review Required
            </h2>
            <p className="mt-1 text-sm text-amber-900">
              {report.failureReason ?? "The application remains saved and available for manual recruiter review."}
            </p>
          </div>
          <button
            className="shrink-0 rounded-lg bg-amber-900 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-950"
            onClick={handleRetryAnalysis}
            type="button"
          >
            Retry ATS analysis
          </button>
        </section>
      )}

      {hasMandatoryFailure && (
        <section className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5" role="alert">
          <h2 className="text-sm font-semibold text-rose-950">Mandatory Requirement Alert</h2>
          <p className="mt-1 text-sm text-rose-900">
            One or more mandatory JD criteria are marked <strong>Not Met</strong> below. Per platform governance, overall score percentages must never override unmet mandatory requirements.
          </p>
        </section>
      )}

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section aria-label="Overall ATS score" className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-950 to-blue-800 p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-100">Overall ATS Score (Decision Support Only)</p>
                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
                  Coverage: <strong>{report.coverageStatus}</strong> ({report.coveragePercent}% text extracted).
                  Protected attributes are excluded from scoring.
                </p>
                <p className="mt-2 text-xs text-blue-200">
                  {report.scoringModelVersion} · {report.analysisDateLabel}
                </p>
              </div>
              {/* Radial gauge — replaces old "circle + progress bar" */}
              <div className="shrink-0">
                <AtsScoreGauge score={score} size={152} />
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section aria-labelledby="candidate-summary-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold text-slate-950" id="candidate-summary-heading">Candidate Summary</h2><p className="mt-1 text-sm text-slate-500">Linked candidate profile</p></div>{candidate && <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={`/admin/candidates/${candidate.id}`}>Profile →</Link>}</div>
              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["Candidate", report.candidateName],
                  ["Candidate ID", report.candidateId],
                  ["Email", report.candidateEmail],
                  ["Location", candidate?.location ?? "Not provided"],
                  ["Experience", candidate ? `${candidate.experienceYears} years` : "Not provided"],
                  ["Resume version", `${report.resumeId} (${report.resumeVersion})`],
                ].map(([label, value]) => <div className="flex justify-between gap-4" key={label}><dt className="text-slate-500">{label}</dt><dd className="text-right font-medium text-slate-800">{value}</dd></div>)}
              </dl>
            </section>

            <section aria-labelledby="job-summary-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold text-slate-950" id="job-summary-heading">Job &amp; Version Context</h2><p className="mt-1 text-sm text-slate-500">Evaluated JD snapshot</p></div>{job && <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={`/admin/jobs/${job.id}`}>Job details →</Link>}</div>
              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ["Job ID", `${report.jobId} (JD ${report.jdVersion})`],
                  ["Job title", report.jobTitle],
                  ["Client (internal)", job?.clientName ?? report.clientName],
                  ["Location & mode", job ? `${job.location} · ${job.workMode}` : "Not provided"],
                  ["Experience required", job?.experienceRequired ?? "Not provided"],
                  ["Model version", report.scoringModelVersion],
                ].map(([label, value]) => <div className="flex justify-between gap-4" key={label}><dt className="text-slate-500">{label}</dt><dd className="text-right font-medium text-slate-800">{value}</dd></div>)}
              </dl>
            </section>
          </div>

          <section aria-labelledby="category-breakdown-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div><h2 className="text-lg font-semibold text-slate-950" id="category-breakdown-heading">6-Category Weighted Breakdown</h2><p className="mt-1 text-sm text-slate-500">Configurable BRD §9.3 scoring framework with evidence explanations.</p></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {report.categoryBreakdown.map((category) => (
                <article className="rounded-xl border border-slate-100 p-4" key={category.name}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-slate-900">{category.name}</h3>
                      <p className="text-[11px] text-slate-500">Weight: {category.weight}%</p>
                    </div>
                    <span className="font-semibold tabular-nums text-slate-800">{category.score}%</span>
                  </div>
                  <div aria-label={`${category.name}: ${category.score}%`} className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${getScoreColor(category.score)}`} style={{ width: `${category.score}%` }} /></div>
                  <p className="mt-3 text-xs leading-5 text-slate-600">{category.evidence}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="mandatory-criteria-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-950" id="mandatory-criteria-heading">Mandatory Criteria Check</h2>
            <p className="mt-1 text-sm text-slate-500">Evaluated separately from the overall percentage score.</p>
            <div className="mt-4 space-y-3">
              {report.mandatoryCriteria.map((criterion) => (
                <article className="flex flex-col justify-between gap-2 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center" key={criterion.criterion}>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{criterion.criterion}</h3>
                    <p className="mt-1 text-sm text-slate-600">{criterion.note}</p>
                  </div>
                  <StatusBadge label={criterion.result} tone={criterionTones[criterion.result]} />
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <section aria-labelledby="matched-skills-heading" className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-950" id="matched-skills-heading">Matched Skills &amp; Evidence</h2>
              <ul className="mt-4 space-y-2.5">
                {report.matchedSkills.map((item) => (
                  <li className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-950" key={item.skill}>
                    <p className="font-semibold">✓ {item.skill}</p>
                    <p className="mt-1 leading-5 text-emerald-900">{item.evidence}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="partial-skills-heading" className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-950" id="partial-skills-heading">Partially Matched Skills</h2>
              {report.partiallyMatchedSkills.length > 0 ? (
                <ul className="mt-4 space-y-2.5">
                  {report.partiallyMatchedSkills.map((item) => (
                    <li className="rounded-lg bg-blue-50 p-3 text-xs text-blue-950" key={item.skill}>
                      <p className="font-semibold">~ {item.skill}</p>
                      <p className="mt-1 leading-5 text-blue-900">{item.explanation}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-xs text-slate-500">No partially matched skills flagged.</p>
              )}
            </section>

            <section aria-labelledby="missing-skills-heading" className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-950" id="missing-skills-heading">Missing Requirements</h2>
              {report.missingSkills.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {report.missingSkills.map((skill) => (
                    <li className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-950" key={skill}>
                      <span aria-hidden="true" className="font-bold">!</span><span>{skill}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900">No missing mandatory or preferred skills recorded.</p>
              )}
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-950">Experience &amp; Education Comparison</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">Experience</h3>
                  <StatusBadge label={report.experienceComparison.status} tone={report.experienceComparison.status === "Aligned" ? "success" : report.experienceComparison.status === "Uncertain" ? "warning" : "danger"} />
                </div>
                <p className="mt-2 text-xs text-slate-500">JD Requirement: <span className="text-slate-800">{report.experienceComparison.jdRequirement}</span></p>
                <p className="mt-1 text-xs text-slate-500">Resume Evidence: <span className="text-slate-800">{report.experienceComparison.resumeEvidence}</span></p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">Education &amp; Certifications</h3>
                  <StatusBadge label={report.educationComparison.status} tone={report.educationComparison.status === "Aligned" ? "success" : report.educationComparison.status === "Partial" ? "warning" : "danger"} />
                </div>
                <p className="mt-2 text-xs text-slate-500">JD Requirement: <span className="text-slate-800">{report.educationComparison.jdRequirement}</span></p>
                <p className="mt-1 text-xs text-slate-500">Resume Evidence: <span className="text-slate-800">{report.educationComparison.resumeEvidence}</span></p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-950">Inconsistencies &amp; Missing Info</h2>
              {report.inconsistencies.length > 0 ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {report.inconsistencies.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No date overlaps or resume inconsistencies flagged.</p>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-950">Suggested Screening Questions</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
                {report.screeningQuestions.map((question) => <li key={question}>{question}</li>)}
              </ol>
            </section>
          </div>

          <section aria-labelledby="recommendation-heading" className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-blue-950" id="recommendation-heading">Recruiter Summary &amp; Override</h2>
            <p className="mt-2 text-sm leading-6 text-blue-900">{report.recommendation}</p>

            <form className="mt-5 grid gap-3 border-t border-blue-200/70 pt-4 sm:grid-cols-[12rem_minmax(0,1fr)_auto]" onSubmit={handleOverrideSubmit}>
              <label className="text-xs font-medium text-blue-950">Override match band
                <select className="mt-1.5 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900" value={overrideBand} onChange={(e) => setOverrideBand(e.currentTarget.value as AtsMatchCategory)}>
                  <option>Strong Match</option>
                  <option>Good Match</option>
                  <option>Moderate Match</option>
                  <option>Low Match</option>
                </select>
              </label>
              <label className="text-xs font-medium text-blue-950">Override reason (required for audit log)
                <input className="mt-1.5 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900" placeholder="Explain human review judgment..." required value={overrideReason} onChange={(e) => setOverrideReason(e.currentTarget.value)} />
              </label>
              <button className="self-end rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800" type="submit">Apply override</button>
            </form>

            {overrideHistory.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-blue-200/70 pt-3">
                {overrideHistory.map((item) => (
                  <li className="rounded-lg bg-white/80 px-3 py-2 text-xs text-slate-800" key={item.id}>
                    <strong>{item.band}</strong> by {item.actor} ({item.date}): {item.reason}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <RecruiterNotesPanel
            description="Notes remain in this page's local demo state."
            initialNotes={[
              {
                id: `${report.analysisId}-sample-note`,
                text: report.recruiterNote,
                author: "Recruitment Team",
                createdAt: report.analysisDateLabel,
                tags: ["ATS review"],
              },
            ]}
          />
        </div>

        <aside className="space-y-5 xl:sticky xl:top-6">
          <section aria-labelledby="quick-actions-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-950" id="quick-actions-heading">Quick Actions</h2>
            <div className="mt-4 space-y-2.5">
              <button className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800" onClick={handleRetryAnalysis} type="button">Request re-analysis</button>
              {candidate && <Link className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/candidates/${candidate.id}`}>Open Candidate Profile</Link>}
              <Link className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" href={applicationHref}>Open Application</Link>
              {job && <Link className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/jobs/${job.id}`}>Open Job Details</Link>}
              <Link className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/ats">All ATS Reports</Link>
            </div>
          </section>
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-950">Human review required</p>
            <p className="mt-2 text-sm leading-6 text-amber-900">Treat this report as recruiter decision support only. Automated hiring decisions without human review are out of scope.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}
