import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { openPositions } from "@/constants/public-content";
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
          <LoadingSpinner label="Loading career opportunity" />
        </main>
      }
    >
      <CareerDetailsContent params={params} />
    </Suspense>
  );
}

async function CareerDetailsContent({ params }: CareerDetailsPageProps) {
  const { jobId } = await params;
  const job = openPositions.find((position) => position.id === jobId);

  if (!job) {
    notFound();
  }

  return (
    <main>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
          <Link
            className="text-sm font-medium text-blue-200 hover:text-white"
            href="/careers"
          >
            <span aria-hidden="true">←</span> All careers
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">
            {job.department}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {job.title}
          </h1>
          <p className="mt-5 text-slate-300">
            {job.location} <span aria-hidden="true">·</span>{" "}
            {job.employmentType} <span aria-hidden="true">·</span>{" "}
            {job.workMode}
          </p>
          <p className="mt-3 text-sm text-blue-200">
            Job ID: {job.jobId} · {job.experience} experience · Applications close {job.deadline}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              About the role
            </h2>
            <p className="mt-4 leading-7 text-slate-600">{job.description}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              What you’ll do
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-slate-600 marker:text-blue-700">
              {job.responsibilities.map((responsibility) => (
                <li key={responsibility}>{responsibility}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-950">
              What you’ll bring
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-slate-600 marker:text-blue-700">
              {job.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </section>
        </article>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">
            Interested in this role?
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Share your resume and our recruitment team can learn more about
            your experience.
          </p>
          <Link
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            href={`/submit-resume?jobId=${encodeURIComponent(job.jobId)}&jobTitle=${encodeURIComponent(job.title)}`}
          >
            Submit your resume
          </Link>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            This is a sample listing for demonstration.
          </p>
        </aside>
      </div>
    </main>
  );
}
