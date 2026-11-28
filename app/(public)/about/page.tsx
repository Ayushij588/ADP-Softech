import Link from "next/link";

const companyValues = [
  {
    number: "01",
    title: "Integrity & Discretion",
    description:
      "We operate with transparent communication, respect client and candidate confidentiality, and deliver on our commitments.",
  },
  {
    number: "02",
    title: "Engineering & Domain Depth",
    description:
      "We understand modern technology stacks, architecture paradigms, and operational workflows, ensuring high-fidelity candidate matching.",
  },
  {
    number: "03",
    title: "People-Centric Partnership",
    description:
      "Recruitment is about people and careers. We evaluate context, culture, and long-term potential beyond basic keyword matching.",
  },
  {
    number: "04",
    title: "Global Talent Reach",
    description:
      "Connecting companies with talent hubs across India, North America, the UK, Europe, UAE, and APAC regions.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="bg-[#F1F8FB] min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#07394B] to-[#102D42] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
            About ADP Softech
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Connecting Global Businesses With the Right Technology Talent
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-[#DCEFF5]">
            ADP Softech is an independent recruitment, IT staffing, and offshore talent solutions company. We specialize in software engineering, cloud, data, and BPO operations staffing.
          </p>
        </div>
      </section>

      {/* Company Story & Identity */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[oklch(39.8%_0.07_227.392)]">
              Our Identity
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#152B38] sm:text-4xl">
              An Independent Force in Technology Recruitment
            </h2>
            <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-[#2E4857]">
              <p>
                ADP Softech was established to bridge the gap between ambitious technology organizations and high-caliber professionals. As an independent recruitment consultancy, we operate with singular focus on technology and operational staffing.
              </p>
              <p>
                Whether sourcing specialized full-stack engineers for domestic enterprise roadmaps or orchestrating cross-border offshore staffing for international clients in the US, UK, Canada, Australia, and the Middle East, our human-led screening guarantees precision and velocity.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="rounded-full bg-[oklch(39.8%_0.07_227.392)] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#07394B] transition"
              >
                Our Staffing Services →
              </Link>
              <Link
                href="/careers"
                className="rounded-full border border-[#DCE8ED] bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#152B38] hover:bg-[#DCEFF5] transition"
              >
                Browse Job Openings
              </Link>
            </div>
          </div>

          {/* Mission & Vision Card with Static 3D Depth */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#DCE8ED] bg-white p-7 sm:p-8 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
                Our Mission
              </span>
              <h3 className="mt-2 text-xl font-bold text-[#152B38]">
                Empower Teams to Build the Future
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4F6A78]">
                To help businesses assemble high-performing engineering squads with minimal friction, and empower professionals to find meaningful career opportunities in an evolving digital world.
              </p>
            </div>

            <div className="rounded-3xl border border-[#DCE8ED] bg-white p-7 sm:p-8 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
                Our Vision
              </span>
              <h3 className="mt-2 text-xl font-bold text-[#152B38]">
                The Premier Talent Partner for Scalable Growth
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4F6A78]">
                To be recognized globally as the most trusted, agile, and transparent recruitment platform for technical and operational workforce expansion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white border-y border-[#DCE8ED] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[oklch(39.8%_0.07_227.392)]">
              Core Principles
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#152B38]">
              Values That Guide Every Placement
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {companyValues.map((val) => (
              <div
                key={val.number}
                className="rounded-2xl border border-[#DCE8ED] bg-[#F1F8FB] p-6 shadow-xs"
              >
                <span className="text-xs font-bold text-[oklch(39.8%_0.07_227.392)]">
                  {val.number}
                </span>
                <h3 className="mt-3 text-base font-bold text-[#152B38]">
                  {val.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#4F6A78]">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Markets */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[oklch(39.8%_0.07_227.392)]">
          Global Coverage
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#152B38]">
          Serving Clients &amp; Candidates Across Global Markets
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {["United States", "United Kingdom", "Canada", "Australia", "European Union", "United Arab Emirates", "India", "Global Remote"].map((region) => (
            <span
              key={region}
              className="rounded-full border border-[#DCE8ED] bg-white px-4 py-1.5 text-xs font-semibold text-[#07394B] shadow-xs"
            >
              🌐 {region}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
