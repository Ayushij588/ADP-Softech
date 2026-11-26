import { SectionHeading } from "@/components/public/section-heading";

const companyValues = [
  {
    number: "01",
    title: "Integrity",
    description:
      "We communicate honestly, respect confidentiality, and do what we say we will do.",
  },
  {
    number: "02",
    title: "Partnership",
    description:
      "We work alongside clients and professionals to understand what success means to them.",
  },
  {
    number: "03",
    title: "Care",
    description:
      "We treat every person’s time, aspirations, and contribution with consideration.",
  },
  {
    number: "04",
    title: "Curiosity",
    description:
      "We keep learning about people, industries, and the changing world of work.",
  },
] as const;

const differentiators = [
  {
    title: "Context before matching",
    description:
      "We take time to understand the role, the team, and the reasons behind a hire.",
  },
  {
    title: "Focused, thoughtful search",
    description:
      "We look beyond keywords to connect relevant experience with real opportunity.",
  },
  {
    title: "Clear communication",
    description:
      "We aim to keep every conversation respectful, timely, and transparent.",
  },
] as const;

export default function AboutPage() {
  return (
    <main>
      <section
        aria-labelledby="company-story-heading"
        className="overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              About ADP Softech
            </p>
            <h1
              className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl"
              id="company-story-heading"
            >
              Good recruitment begins with understanding.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Our story is about bringing people and organizations together
              with care, clarity, and a shared view of what comes next.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
              Our story
            </p>
            <p className="mt-4 leading-7 text-white">
              ADP Softech was shaped by a simple belief: the best hiring
              decisions happen when people are seen as more than a job title or
              a list of requirements.
            </p>
            <p className="mt-4 leading-7 text-blue-100">
              We partner with businesses navigating growth and change, and
              support professionals as they consider their next opportunity.
              Every search starts by listening to the people involved.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="mission-heading"
        className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"
      >
        <SectionHeading
          eyebrow="Our mission"
          id="mission-heading"
          title="Make meaningful connections at work."
        />
        <p className="max-w-3xl text-lg leading-8 text-slate-600">
          Our mission is to help organizations find the talent they need and
          help professionals discover work where they can contribute and grow.
          We do this through responsive service, considered search, and respect
          for every person in the process.
        </p>
      </section>

      <section
        aria-labelledby="vision-heading"
        className="bg-blue-50"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionHeading
            eyebrow="Our vision"
            id="vision-heading"
            title="A world of work with better-fit opportunities."
          />
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            We envision a future where recruitment feels more human and
            intentional—where businesses can build capable teams, and people
            can make confident, informed career choices.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="values-heading"
        className="mx-auto max-w-7xl px-6 py-20 sm:py-24"
      >
        <SectionHeading
          eyebrow="Our values"
          id="values-heading"
          title="Principles that shape how we work."
          description="Our values guide the way we build relationships, approach each search, and support the people we work with."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {companyValues.map((value) => (
            <article
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              key={value.number}
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-800">
                {value.number}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="why-adp-heading"
        className="bg-slate-950 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">
              Why ADP Softech
            </p>
            <h2
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              id="why-adp-heading"
            >
              A recruitment partner who sees the whole picture.
            </h2>
            <p className="mt-5 leading-7 text-slate-300">
              We bring care to the details and keep the wider goals in view—from
              the first conversation through to the next step.
            </p>
          </div>
          <div className="divide-y divide-white/15">
            {differentiators.map((item, index) => (
              <article
                className="grid gap-3 py-5 first:pt-0 sm:grid-cols-[3rem_1fr]"
                key={item.title}
              >
                <span className="text-sm font-semibold text-blue-300">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
