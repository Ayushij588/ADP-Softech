import Link from "next/link";
import { recruitmentServices } from "@/constants/public-content";
import { EmployerInquiryForm } from "@/components/public/employer-inquiry-form";

export default function EmployersPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-slate-950 to-blue-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">
            For employers
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Find the people who will help you grow.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A considered recruitment partnership helps you reach the right
            talent, make confident decisions, and build teams for what’s next.
          </p>
          <Link
            className="mt-8 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-blue-50"
            href="/contact"
          >
            Talk to our team
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            A partner in your search
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            More clarity at every stage of hiring.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            We learn how your business works before we begin a search, then
            bring structure and thoughtful communication to the process.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recruitmentServices.map((service, index) => (
            <article
              className="rounded-xl border border-slate-200 p-6"
              key={service.name}
            >
              <span className="text-sm font-semibold text-blue-700">
                0{index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">
                {service.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Built on partnership
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              The right fit matters on both sides.
            </h2>
          </div>
          <p className="text-lg leading-8 text-slate-600">
            Our recruiters bring context to every conversation. We look beyond
            a list of requirements to understand the goals, working style, and
            strengths that help a person and a team succeed together.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.35fr_0.65fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Hiring requirements</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Tell us who you need</h2>
            <p className="mt-4 leading-7 text-slate-600">Share the role, team and working model so our recruitment team can start with the right context.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <EmployerInquiryForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-5 rounded-2xl bg-slate-950 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold">
              Have a role you need to fill?
            </h2>
            <p className="mt-2 text-slate-300">
              Start with a conversation about your hiring goals.
            </p>
          </div>
          <Link
            className="rounded-lg bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-blue-50"
            href="/contact"
          >
            Contact ADP Softech
          </Link>
        </div>
      </section>
    </main>
  );
}
