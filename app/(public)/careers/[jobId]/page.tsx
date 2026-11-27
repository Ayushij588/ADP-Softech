import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getJobById, openPositions } from "@/constants/public-content";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function generateStaticParams() {
  return openPositions.map(({ id }) => ({ jobId: id }));
}

type CareerDetailsPageProps = {
  params: Promise<{ jobId: string }>;
};

export default function CareerDetailsPage({
  params,
}: CareerDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-96 items-center justify-center">
          <LoadingSpinner label="Loading career opportunity..." />
        </main>
      }
    >
      <CareerDetailsContent params={params} />
    </Suspense>
  );
}

async function CareerDetailsContent({ params }: CareerDetailsPageProps) {
  const { jobId } = await params;
  const job = getJobById(jobId);

  if (!job) {
    notFound();
  }

  return (
    <main className="bg-[#F1F8FB] min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#07394B] to-[#102D42] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <Link
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#14B8C4] hover:text-white transition"
            href="/careers"
          >
            ← Back to all openings
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-[oklch(39.8%_0.07_227.392)] px-3 py-1 text-xs font-bold text-white">
              {job.id}
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#DCEFF5]">
              {job.department}
            </span>
          </div>

          <h1 className="mt-4 max-w-4xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {job.title}
          </h1>

          <p className="mt-4 text-xs sm:text-sm text-[#DCEFF5]/90">
            {job.location} • {job.workMode} • {job.employmentType} • Experience: {job.experienceRange}
          </p>
        </div>
      </section>

      {/* Details & Apply Layout */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Main Job Description Content */}
        <article className="space-y-10 rounded-3xl border border-[#DCE8ED] bg-white p-6 sm:p-10 shadow-sm">
          {/* Summary / About the Role */}
          <section>
            <h2 className="text-xl font-bold text-[#152B38]">
              About the Role
            </h2>
            <p className="mt-4 leading-relaxed text-[#3E5866] text-sm sm:text-base">
              {job.description}
            </p>
          </section>

          {/* Key Responsibilities */}
          <section className="border-t border-[#DCE8ED] pt-8">
            <h2 className="text-xl font-bold text-[#152B38]">
              Key Responsibilities
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm sm:text-base leading-relaxed text-[#3E5866] marker:text-[oklch(39.8%_0.07_227.392)]">
              {job.responsibilities.map((resp) => (
                <li key={resp}>{resp}</li>
              ))}
            </ul>
          </section>

          {/* Role Requirements & Eligibility */}
          <section className="border-t border-[#DCE8ED] pt-8">
            <h2 className="text-xl font-bold text-[#152B38]">
              Required Qualifications &amp; Skills
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm sm:text-base leading-relaxed text-[#3E5866] marker:text-[oklch(39.8%_0.07_227.392)]">
              {job.requirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </section>

          {/* Primary Skills */}
          <section className="border-t border-[#DCE8ED] pt-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#152B38]">
              Target Technologies &amp; Competencies
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-[#DCEFF5] px-3 py-1 text-xs font-semibold text-[#07394B]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </article>

        {/* Aside Application Card */}
        <aside className="space-y-6">
          <div className="h-fit rounded-3xl border border-[#DCE8ED] bg-white p-6 sm:p-7 shadow-sm">
            <span className="rounded-full bg-[#DCEFF5] px-2.5 py-0.5 text-[11px] font-bold text-[#07394B]">
              Job ID: {job.id}
            </span>
            <h3 className="mt-4 text-lg font-bold text-[#152B38]">
              Ready to Apply?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#4F6A78] leading-relaxed">
              Submit your resume directly against this Job ID. No login or registration required.
            </p>

            <Link
              href={`/submit-resume?jobId=${job.id}`}
              className="mt-6 flex w-full items-center justify-center rounded-full bg-[oklch(39.8%_0.07_227.392)] px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#07394B]"
            >
              Apply for this Position →
            </Link>

            <div className="mt-6 border-t border-[#DCE8ED] pt-4 space-y-2 text-xs text-[#4F6A78]">
              <div className="flex justify-between">
                <span className="font-semibold">Department:</span>
                <span>{job.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Location:</span>
                <span>{job.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Work Mode:</span>
                <span>{job.workMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Experience:</span>
                <span>{job.experienceRange}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 leading-relaxed">
            <p className="font-bold">Recruiter Review Policy:</p>
            <p className="mt-1">
              Applications are reviewed by recruitment managers. Candidate profiles are held in strict confidence and shared with clients only upon verified match and consent.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
