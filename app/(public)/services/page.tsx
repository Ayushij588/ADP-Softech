import Link from "next/link";
import { recruitmentServices } from "@/constants/public-content";

export default function ServicesPage() {
  return (
    <main>
      <section className="bg-blue-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Recruitment services
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Talent solutions shaped around your business.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            From a critical specialist hire to a broader workforce plan, we
            bring focus and care to every search.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="grid gap-5 md:grid-cols-2">
          {recruitmentServices.map((service, index) => (
            <article
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8"
              key={service.name}
            >
              <p className="text-sm font-semibold text-blue-700">
                SERVICE 0{index + 1}
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">
                {service.name}
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                {service.description}
              </p>
              <p className="mt-6 border-t border-slate-100 pt-5 text-sm font-medium text-slate-700">
                {service.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">
            How we work
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            A clear process, with people at its centre.
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ["01", "Understand", "We learn about your goals, team, and role."],
              ["02", "Connect", "We identify and engage relevant talent."],
              ["03", "Support", "We guide conversations through to a decision."],
            ].map(([number, title, description]) => (
              <li className="border-t border-white/20 pt-5" key={number}>
                <span className="text-sm font-semibold text-blue-300">
                  {number}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-5 rounded-2xl bg-blue-50 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Looking for a recruitment partner?
            </h2>
            <p className="mt-2 text-slate-600">
              Let’s talk about the people your business needs.
            </p>
          </div>
          <Link
            className="rounded-lg bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800"
            href="/contact"
          >
            Discuss your hiring needs
          </Link>
        </div>
      </section>
    </main>
  );
}
