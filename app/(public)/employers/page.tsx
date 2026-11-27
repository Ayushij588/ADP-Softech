import { EmployerInquiryForm } from "@/components/public/employer-inquiry-form";
import { recruitmentServices } from "@/constants/public-content";

export default function EmployersPage() {
  return (
    <main className="bg-[#F1F8FB] min-h-screen">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#07394B] to-[#102D42] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-22">
          <p className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
            ADP Softech • Employer Talent Solutions
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Hire Top Engineering &amp; Operations Talent
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#DCEFF5] leading-relaxed">
            From specialized contract developers to full dedicated offshore squads and BPO teams. Share your hiring mandate and connect with pre-vetted professionals.
          </p>
        </div>
      </section>

      {/* Main Layout: Form + Staffing Models */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Employer Inquiry Form */}
          <div className="lg:col-span-8 rounded-3xl border border-[#DCE8ED] bg-white p-6 sm:p-10 shadow-sm">
            <EmployerInquiryForm />
          </div>

          {/* Right Column: Why Partner With ADP Softech */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl bg-[#07394B] p-7 text-white shadow-md border border-[#07394B]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
                Staffing Advantage
              </span>
              <h2 className="mt-2 text-xl font-bold">
                Why Partner With Us?
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-[#DCEFF5]">
                We combine deep technical vetting with personalized recruitment management to deliver production-ready talent faster.
              </p>

              <div className="mt-6 space-y-4 border-t border-white/10 pt-5 text-xs">
                <div>
                  <p className="font-bold text-white">Pre-Screened Talent</p>
                  <p className="text-[#DCEFF5]/80 mt-0.5">Rigorous coding, architecture, and communication checks.</p>
                </div>
                <div>
                  <p className="font-bold text-white">Rapid Turnaround</p>
                  <p className="text-[#DCEFF5]/80 mt-0.5">First shortlist of qualified candidates presented within 48–72 hours.</p>
                </div>
                <div>
                  <p className="font-bold text-white">Flexible Engagements</p>
                  <p className="text-[#DCEFF5]/80 mt-0.5">Permanent, contract staffing, offshore squads, and BPO operations.</p>
                </div>
                <div>
                  <p className="font-bold text-white">Confidentiality Guarantee</p>
                  <p className="text-[#DCEFF5]/80 mt-0.5">Strict NDA protection for all proprietary project roadmaps.</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="rounded-2xl border border-[#DCE8ED] bg-white p-6 text-xs text-[#4F6A78]">
              <p className="font-bold text-[#152B38] text-sm">Need Immediate Assistance?</p>
              <p className="mt-2 leading-relaxed">
                Connect directly with our corporate talent acquisition team:
              </p>
              <p className="mt-3 font-semibold text-[#07394B]">
                📧 <a href="mailto:info@adpsoftech.com" className="underline">info@adpsoftech.com</a>
              </p>
              <p className="mt-1 font-semibold text-[#07394B]">
                📞 <a href="tel:+919876543210" className="underline">+91 98765 43210</a>
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Engagement Models Grid */}
      <section className="bg-white border-t border-[#DCE8ED] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[oklch(39.8%_0.07_227.392)]">
              Flexible Hiring Models
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#152B38]">
              Tailored to Your Delivery Objectives
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recruitmentServices.slice(0, 4).map((service, idx) => (
              <div
                key={service.id}
                className="rounded-2xl border border-[#DCE8ED] bg-[#F1F8FB] p-6 shadow-xs"
              >
                <span className="text-xs font-bold text-[oklch(39.8%_0.07_227.392)]">
                  0{idx + 1}
                </span>
                <h3 className="mt-3 text-base font-bold text-[#152B38]">
                  {service.name}
                </h3>
                <p className="mt-2 text-xs text-[#4F6A78] leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
