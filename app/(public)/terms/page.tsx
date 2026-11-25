const termsSections = [
  {
    title: "Using this website",
    text: "You may use this website to learn about ADP Softech, review sample career opportunities, and contact our team. Please use the site lawfully and do not interfere with its operation or attempt to misuse its content.",
  },
  {
    title: "Career information",
    text: "Career listings and descriptions on this preview site are illustrative. A listing is not an offer of employment, and availability, requirements, and details should be confirmed directly with the relevant recruiter.",
  },
  {
    title: "Website content",
    text: "Website text and visual materials are provided for general information. Do not copy, republish, or rely on materials without permission or without checking that they are current and accurate.",
  },
  {
    title: "Third-party websites",
    text: "This website may link to external websites for convenience. ADP Softech does not control third-party content or practices, and users should review the applicable terms and privacy information.",
  },
  {
    title: "Updates and contact",
    text: "These sample terms may change when the website is finalized. For questions about the site, please contact ADP Softech using the contact page.",
  },
];

export default function TermsPage() {
  return (
    <main>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">
            Legal information
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Terms &amp; conditions
          </h1>
          <p className="mt-5 text-sm text-slate-300">
            Sample content for review · Updated November 2026
          </p>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          These placeholder terms are for a website preview only. They are not
          legal advice and require review and approval before publication.
        </p>
        <p className="mt-8 text-base leading-7 text-slate-600">
          By using the ADP Softech website, you agree to use it responsibly and
          in accordance with applicable laws. These sample terms describe
          general expectations for a public website.
        </p>
        <div className="mt-10 space-y-8">
          {termsSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-slate-950">
                {section.title}
              </h2>
              <p className="mt-3 leading-7 text-slate-600">{section.text}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
