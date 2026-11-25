const policySections = [
  {
    title: "Information you provide",
    paragraphs: [
      "When you contact us or share a resume, you may choose to provide details such as your name, contact information, work history, and the contents of your message.",
      "Please only provide information that is relevant to your enquiry or application.",
    ],
  },
  {
    title: "How information may be used",
    paragraphs: [
      "Information may be used to respond to an enquiry, discuss recruitment services, or consider a person for a relevant opportunity.",
      "This preview site does not collect or store submitted form data.",
    ],
  },
  {
    title: "Sharing and retention",
    paragraphs: [
      "In a production service, information would only be shared where appropriate for the recruitment purpose, with suitable safeguards and notice.",
      "Retention periods and deletion procedures should be confirmed in the final policy before launch.",
    ],
  },
  {
    title: "Your choices and contact",
    paragraphs: [
      "You may ask questions about personal information or request a correction through the contact details provided on this website.",
      "This sample policy is illustrative and should be reviewed and replaced with the approved ADP Softech policy before production use.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">
            Legal information
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Privacy policy
          </h1>
          <p className="mt-5 text-sm text-slate-300">
            Sample content for review · Updated November 2026
          </p>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          This is placeholder content for a website preview and is not legal
          advice. It must be reviewed and approved before publication.
        </p>
        <p className="mt-8 text-base leading-7 text-slate-600">
          ADP Softech respects the privacy of people who visit our website,
          contact our team, or explore recruitment opportunities. This sample
          policy describes the kind of information-handling practices a final
          policy should explain.
        </p>
        <div className="mt-10 space-y-9">
          {policySections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-slate-950">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  className="mt-3 leading-7 text-slate-600"
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
