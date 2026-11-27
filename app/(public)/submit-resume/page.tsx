import Link from "next/link";
import { Suspense } from "react";
import { ResumeSubmissionForm } from "@/components/public/resume-submission-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function SubmitResumePage() {
  return (
    <main className="bg-[#F1F8FB] min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#07394B] to-[#102D42] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <p className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
            Candidate Application Journey
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Submit Your Resume
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#DCEFF5] leading-relaxed">
            Apply directly to published IT and BPO roles using a valid Job ID. No account registration or login required.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:px-8 py-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-3xl border border-[#DCE8ED] bg-white p-6 sm:p-10 shadow-sm">
          <Suspense fallback={<LoadingSpinner label="Loading application form..." />}>
            <ResumeSubmissionForm />
          </Suspense>
        </div>

        {/* Sidebar Information Card */}
        <aside className="space-y-6">
          <div className="rounded-3xl bg-[#07394B] p-7 text-white shadow-md border border-[#07394B]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
              How it works
            </span>
            <h2 className="mt-2 text-xl font-bold">
              Human Review &amp; Structured Evaluation
            </h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#DCEFF5]/90">
              Every submitted resume is parsed and organized against the specific Job ID. Our recruitment specialists review skills and project experience before presenting shortlists to clients.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-[#DCEFF5]/90 border-t border-white/10 pt-5">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#14B8C4]">✓</span>
                No candidate registration or password needed
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#14B8C4]">✓</span>
                Instant unique Application ID generated on submission
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#14B8C4]">✓</span>
                Candidate data protected under strict confidentiality
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#14B8C4]">✓</span>
                No automated hiring decisions without human recruiter review
              </li>
            </ul>

            <div className="mt-6 pt-5 border-t border-white/10">
              <Link
                className="inline-flex items-center text-xs font-semibold text-[#14B8C4] hover:text-white transition"
                href="/careers"
              >
                Browse all open jobs <span className="ml-1.5" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="rounded-2xl border border-[#DCE8ED] bg-white p-5 text-xs text-[#4F6A78]">
            <p className="font-bold text-[#152B38]">Privacy &amp; Data Protection</p>
            <p className="mt-1 leading-relaxed">
              Your details are used exclusively for evaluating job fit. Learn more in our{" "}
              <Link href="/privacy-policy" className="text-[oklch(39.8%_0.07_227.392)] font-semibold underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
