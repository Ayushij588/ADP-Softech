import Link from "next/link";
import { openPositions } from "@/constants/public-content";
import { CareerOpenRoles } from "@/components/public/career-open-roles";

export default function CareersPage() {
  return (
    <main>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">
            Your next chapter
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Find work that moves you forward.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Explore a selection of opportunities and take the next step in your
            career with ADP Softech.
          </p>
          <Link
            className="mt-8 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-blue-50"
            href="/submit-resume"
          >
            Share your resume
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Current opportunities
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Roles to explore
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            {openPositions.length} sample opportunities
          </p>
        </div>
        <CareerOpenRoles jobs={openPositions} />
      </section>
    </main>
  );
}
