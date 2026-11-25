import Link from "next/link";
import {
  CompanyIntroduction,
  CurrentOpeningsPreview,
  HomeCallToAction,
  ServicesOverview,
  WhyChooseUs,
} from "@/components/public/home-sections";

export default function HomePage() {
  return (
    <main>
      <section className="overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-32">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              People first. Progress together.
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              The right people move every business forward.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              ADP Softech brings ambitious organizations and talented
              professionals together through thoughtful, specialist recruitment.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-blue-50"
                href="/careers"
              >
                Explore careers
              </Link>
              <Link
                className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                href="/employers"
              >
                Find talent for your team
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur sm:p-8">
            <p className="text-sm font-semibold text-blue-200">
              A more considered search
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Hiring is about more than a match on paper.
            </h2>
            <p className="mt-4 leading-7 text-blue-100">
              We take time to understand the role, the team, and the person
              behind every profile—so the next step feels right for everyone.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/15 pt-6">
              <div>
                <p className="text-2xl font-semibold">People-led</p>
                <p className="mt-1 text-sm text-blue-200">at every step</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">Built on trust</p>
                <p className="mt-1 text-sm text-blue-200">for the long term</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CompanyIntroduction />
      <ServicesOverview />
      <WhyChooseUs />
      <CurrentOpeningsPreview />
      <HomeCallToAction
        description="Tell us about the roles you need to fill. We’ll start by understanding your team, goals, and what the right person looks like."
        eyebrow="For employers"
        href="/employers"
        id="hire-talent"
        linkLabel="Hire talent"
        title="Build your next great team."
        tone="navy"
      />
      <HomeCallToAction
        description="Share your experience and the kinds of opportunities you’re looking for. Our team can keep you in mind for a relevant role."
        eyebrow="For professionals"
        href="/submit-resume"
        id="submit-resume"
        linkLabel="Submit your resume"
        title="Ready for a new opportunity?"
        tone="blue"
      />
      <HomeCallToAction
        description="Whether you’re exploring a career move or planning a hire, we’d be glad to hear from you."
        eyebrow="Start a conversation"
        href="/contact"
        id="contact-team"
        linkLabel="Contact our team"
        title="Let’s talk about what comes next."
        tone="white"
      />
    </main>
  );
}
