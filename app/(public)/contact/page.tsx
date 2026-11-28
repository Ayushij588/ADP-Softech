import { ContactInquiryForm } from "@/components/public/contact-inquiry-form";

export default function ContactPage() {
  return (
    <main className="bg-[#F1F8FB] min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#07394B] to-[#102D42] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-wider text-[#14B8C4]">
            Get In Touch
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Contact ADP Softech
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#DCEFF5] leading-relaxed">
            Whether you are planning an engineering team expansion, exploring contract staffing, or seeking your next technology role, we are here to assist.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Details & Form */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Official Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-[#DCE8ED] bg-white p-7 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[oklch(39.8%_0.07_227.392)]">
                Direct Communications
              </span>
              <h2 className="mt-2 text-xl font-bold text-[#152B38]">
                Official Contact Points
              </h2>
              <div className="mt-5 space-y-3 text-sm text-[#4F6A78]">
                <p>
                  Email:{" "}
                  <a href="mailto:info@adpsoftech.com" className="font-semibold text-[#07394B] underline">
                    info@adpsoftech.com
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a href="tel:+919876543210" className="font-semibold text-[#07394B] underline">
                    +91 98765 43210
                  </a>
                </p>
                <p>Locations: India | Global Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-950">
              Send an enquiry
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This sample form is not connected to a submission service.
            </p>
            <ContactInquiryForm />
          </div>
        </div>
      </section>
    </main>
  );
}
