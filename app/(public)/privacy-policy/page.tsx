export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#F1F8FB] min-h-screen">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#07394B] to-[#102D42] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
            Data Protection &amp; Confidentiality
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#DCEFF5]">
            Last updated: November 2026 • Official ADP Softech Policy
          </p>
        </div>
      </section>

      {/* Main Content */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="rounded-3xl border border-[#DCE8ED] bg-white p-6 sm:p-10 shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-[#2E4857]">
          <section>
            <h2 className="text-xl font-bold text-[#152B38]">
              1. Overview and Purpose
            </h2>
            <p className="mt-3">
              ADP Softech (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is an independent recruitment, IT staffing, and offshore talent solutions company. We are committed to protecting the privacy, accuracy, and confidentiality of personal data provided by candidates, job applicants, and employer partners.
            </p>
          </section>

          <section className="border-t border-[#DCE8ED] pt-6">
            <h2 className="text-xl font-bold text-[#152B38]">
              2. Information We Collect
            </h2>
            <p className="mt-3">
              We collect information strictly necessary to provide recruitment and talent matching services:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-2 text-[#3E5866]">
              <li>
                <strong>Candidate Data:</strong> Full name, email address, mobile number, current city/country, total experience, relevant experience, primary skills, notice period, and uploaded resume files (PDF/DOC/DOCX).
              </li>
              <li>
                <strong>Employer Inquiries:</strong> Company name, contact person, business email, phone, job role requirements, skills, headcount, and project descriptions.
              </li>
            </ul>
          </section>

          <section className="border-t border-[#DCE8ED] pt-6">
            <h2 className="text-xl font-bold text-[#152B38]">
              3. How We Use and Share Information
            </h2>
            <p className="mt-3">
              Candidate resumes and details are used solely to evaluate compatibility with active client vacancies against specific Job IDs.
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-2 text-[#3E5866]">
              <li>
                Resumes are shared with hiring clients <strong>only</strong> when a candidate matches a legitimate job mandate and explicit consent has been recorded.
              </li>
              <li>
                We do not sell, rent, or trade personal candidate information to third-party data brokers.
              </li>
              <li>
                All internal resume scoring and ATS matching serve as recruiter decision-support tools. No automated hiring or rejection decisions are made without human recruiter oversight.
              </li>
            </ul>
          </section>

          <section className="border-t border-[#DCE8ED] pt-6">
            <h2 className="text-xl font-bold text-[#152B38]">
              4. Data Security and Retention
            </h2>
            <p className="mt-3">
              We apply industry-standard security safeguards including encrypted data transmission (HTTPS/TLS) and restricted, role-based internal admin access. Candidate records are retained in our centralized database for consideration in ongoing and future vacancies, unless deletion is requested.
            </p>
          </section>

          <section className="border-t border-[#DCE8ED] pt-6">
            <h2 className="text-xl font-bold text-[#152B38]">
              5. Your Rights and Contact Information
            </h2>
            <p className="mt-3">
              Candidates may request access, correction, or deletion of their submitted resume records at any time by contacting us at{" "}
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
