export default function TermsPage() {
  return (
    <main className="bg-[#F1F8FB] min-h-screen">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#07394B] to-[#102D42] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
            Terms of Service &amp; Usage
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#DCEFF5]">
            Last updated: November 2026 • Official ADP Softech Terms
          </p>
        </div>
      </section>

      {/* Main Content */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="rounded-3xl border border-[#DCE8ED] bg-white p-6 sm:p-10 shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-[#2E4857]">
          <section>
            <h2 className="text-xl font-bold text-[#152B38]">
              1. Acceptance of Terms
            </h2>
            <p className="mt-3">
              By accessing the ADP Softech website, submitting an application, or submitting an employer inquiry, you agree to comply with and be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="border-t border-[#DCE8ED] pt-6">
            <h2 className="text-xl font-bold text-[#152B38]">
              2. Independent Entity Representation
            </h2>
            <p className="mt-3">
              ADP Softech is an independent recruitment and talent solutions company. It is not a subsidiary, division, or affiliate of ADRS Techno. All staffing, commercial, and candidate agreements are conducted under the independent brand and governance of ADP Softech.
            </p>
          </section>

          <section className="border-t border-[#DCE8ED] pt-6">
            <h2 className="text-xl font-bold text-[#152B38]">
              3. Nature of Job Listings and Resume Submissions
            </h2>
            <p className="mt-3">
              All job listings published on this website represent active or illustrative hiring mandates:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-2 text-[#3E5866]">
              <li>
                Publication of a Job ID or job description does not constitute a legally binding offer of employment.
              </li>
              <li>
                Resume submission does not guarantee an interview, client screening, or job placement.
              </li>
              <li>
                All applications are subject to independent recruiter review and client selection.
              </li>
            </ul>
          </section>

          <section className="border-t border-[#DCE8ED] pt-6">
            <h2 className="text-xl font-bold text-[#152B38]">
              4. Accuracy of Candidate Submissions
            </h2>
            <p className="mt-3">
              Candidates represent that all information provided—including work history, certifications, experience durations, and skills—is accurate, verifiable, and free of false representation.
            </p>
          </section>

          <section className="border-t border-[#DCE8ED] pt-6">
            <h2 className="text-xl font-bold text-[#152B38]">
              5. Governing Law and Inquiries
            </h2>
            <p className="mt-3">
              For any questions regarding these terms, please contact ADP Softech at{" "}
              <a href="mailto:info@adpsoftech.com" className="font-bold text-[oklch(39.8%_0.07_227.392)] underline">
                info@adpsoftech.com
              </a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
