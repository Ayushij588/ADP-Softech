import Link from "next/link";
import { openPositions, recruitmentServices } from "@/constants/public-content";
import { SectionHeading } from "@/components/public/section-heading";

export function CompanyIntroduction() {
  return (
    <section
      aria-labelledby="company-introduction-heading"
      className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:py-24 lg:grid-cols-2 lg:items-center"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          A recruitment partner
        </p>
        <h2
          className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
          id="company-introduction-heading"
        >
          We connect ambition with opportunity.
        </h2>
      </div>
      <div className="space-y-4 text-base leading-7 text-slate-600">
        <p>
          ADP Softech works with organizations to find the people who make a
          difference—and with professionals ready to take their next step.
        </p>
        <p>
          Our approach starts with listening. By understanding the role, the
          team, and each person’s goals, we make recruitment more considered
          for everyone involved.
        </p>
        <Link
          className="inline-flex pt-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          href="/about"
        >
          Get to know us <span className="ml-2" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

export function ServicesOverview() {
  return (
    <section
      aria-labelledby="services-overview-heading"
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="What we do"
            id="services-overview-heading"
            title="Recruitment built around real people."
          />
          <Link
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            href="/services"
          >
            View all services <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div
          aria-labelledby="services-overview-heading"
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {recruitmentServices.map((service, index) => (
            <article
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              key={service.name}
            >
              <span className="text-sm font-semibold text-blue-700">
                0{index + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">
                {service.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const differentiators = [
  {
    number: "01",
    title: "We begin by listening",
    description:
      "A clear understanding of your goals helps us focus on the right people and the right opportunity.",
  },
  {
    number: "02",
    title: "We bring specialist focus",
    description:
      "Our structured search connects role requirements with real skills, experience, and potential.",
  },
  {
    number: "03",
    title: "We value every relationship",
    description:
      "Thoughtful communication keeps clients and candidates informed throughout the process.",
  },
] as const;

export function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="mx-auto max-w-7xl px-6 py-20 sm:py-24"
    >
      <SectionHeading
        eyebrow="Why ADP Softech"
        id="why-choose-us-heading"
        title="A thoughtful approach makes a difference."
        description="Recruitment works best when it is clear, collaborative, and built around people—not just job descriptions."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {differentiators.map((item) => (
          <article
            className="rounded-xl border border-slate-200 bg-white p-6"
            key={item.number}
          >
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-800">
              {item.number}
            </span>
            <h3 className="mt-5 text-lg font-semibold text-slate-950">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CurrentOpeningsPreview() {
  return (
    <section
      aria-labelledby="current-openings-heading"
      className="bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Current openings"
            id="current-openings-heading"
            title="A few opportunities to explore."
          />
          <Link
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            href="/careers"
          >
            Browse all careers <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {openPositions.map((job) => (
            <article
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
              key={job.id}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                {job.department}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">
                {job.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {job.location} <span aria-hidden="true">·</span>{" "}
                {job.employmentType}
              </p>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                {job.summary}
              </p>
              <Link
                className="mt-6 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                href={`/careers/${job.id}`}
              >
                View opportunity{" "}
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-slate-500">
          Sample listings for demonstration; availability may change.
        </p>
      </div>
    </section>
  );
}

type HomeCallToActionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  tone?: "navy" | "blue" | "white";
};

const callToActionTones = {
  navy: {
    section: "bg-slate-950 text-white",
    eyebrow: "text-blue-300",
    description: "text-slate-300",
    button: "bg-white text-slate-950 hover:bg-blue-50",
  },
  blue: {
    section: "bg-blue-50 text-slate-950",
    eyebrow: "text-blue-700",
    description: "text-slate-600",
    button: "bg-blue-700 text-white hover:bg-blue-800",
  },
  white: {
    section: "border border-slate-200 bg-white text-slate-950",
    eyebrow: "text-blue-700",
    description: "text-slate-600",
    button: "bg-blue-700 text-white hover:bg-blue-800",
  },
} as const;

export function HomeCallToAction({
  id,
  eyebrow,
  title,
  description,
  linkLabel,
  href,
  tone = "blue",
}: HomeCallToActionProps) {
  const styles = callToActionTones[tone];

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="mx-auto max-w-7xl px-6 py-5 sm:py-7"
    >
      <div
        className={`grid gap-6 rounded-2xl p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center ${styles.section}`}
      >
        <div className="max-w-2xl">
          <p
            className={`text-sm font-semibold uppercase tracking-[0.16em] ${styles.eyebrow}`}
          >
            {eyebrow}
          </p>
          <h2
            className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
            id={`${id}-heading`}
          >
            {title}
          </h2>
          <p className={`mt-3 leading-7 ${styles.description}`}>
            {description}
          </p>
        </div>
        <Link
          className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${styles.button}`}
          href={href}
        >
          {linkLabel}
          <span aria-hidden="true" className="ml-2">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
