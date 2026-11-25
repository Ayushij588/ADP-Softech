import Link from "next/link";
import { ResumeSubmissionForm } from "@/components/public/resume-submission-form";

export default function SubmitResumePage() {
  return (
    <main>
      <section className="bg-blue-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Take the next step
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Share your resume
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Tell us a little about yourself. Our recruitment team can keep your
            details in mind for relevant opportunities.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ResumeSubmissionForm />
        </div>
        <aside className="h-fit rounded-2xl bg-slate-950 p-6 text-white">
          <p className="text-sm font-semibold text-blue-300">What happens next</p>
          <h2 className="mt-3 text-xl font-semibold">
            A thoughtful review, not an automated promise.
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            When resume submission is available, a recruiter will review your
            experience and contact you if a suitable opportunity comes up.
          </p>
          <Link
            className="mt-6 inline-flex text-sm font-semibold text-blue-200 hover:text-white"
            href="/careers"
          >
            Browse current opportunities <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </aside>
      </section>
    </main>
  );
}
