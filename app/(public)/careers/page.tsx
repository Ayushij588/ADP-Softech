import Link from "next/link";
import { openPositions } from "@/constants/public-content";
import { CareerOpenRoles } from "@/components/public/career-open-roles";

export default function CareersPage() {
  return (
    <main className="bg-[#F1F8FB] min-h-screen">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#07394B] to-[#102D42] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
            ADP Softech Careers
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Find Work That Moves You Forward
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#DCEFF5] leading-relaxed">
            Browse published opportunities across software engineering, cloud, data, and BPO operations. Apply directly without creating an account or managing passwords.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              className="rounded-full bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#07394B] shadow-sm transition hover:bg-[#DCEFF5]"
              href="/submit-resume"
            >
              Submit Resume Directly
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <CareerOpenRoles jobs={openPositions} />
      </section>
    </main>
  );
}
