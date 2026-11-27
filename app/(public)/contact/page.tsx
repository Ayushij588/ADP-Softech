"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

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

              <ul className="mt-6 space-y-5 text-sm text-[#3E5866]">
                <li className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DCEFF5] text-[oklch(39.8%_0.07_227.392)]">
                    📧
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#17647B]">
                      Email Enquiries
                    </p>
                    <a
                      href="mailto:info@adpsoftech.com"
                      className="font-bold text-[#152B38] hover:text-[oklch(39.8%_0.07_227.392)]"
                    >
                      info@adpsoftech.com
                    </a>
                    <p className="text-xs text-[#607D8B]">24-hour response turnaround</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DCEFF5] text-[oklch(39.8%_0.07_227.392)]">
                    📞
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#17647B]">
                      Phone / WhatsApp Support
                    </p>
                    <a
                      href="tel:+919876543210"
                      className="font-bold text-[#152B38] hover:text-[oklch(39.8%_0.07_227.392)]"
                    >
                      +91 98765 43210
                    </a>
                    <p className="text-xs text-[#607D8B]">Mon – Fri, 9:00 AM – 7:00 PM IST</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DCEFF5] text-[oklch(39.8%_0.07_227.392)]">
                    📍
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#17647B]">
                      Primary Hub &amp; Global Reach
                    </p>
                    <p className="font-bold text-[#152B38]">Bengaluru, India</p>
                    <p className="text-xs text-[#607D8B]">Serving US, UK, Europe, UAE &amp; APAC</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-xs text-amber-900 leading-relaxed">
              <p className="font-bold">Independent Company Verification:</p>
              <p className="mt-1">
                ADP Softech is an independent recruitment and talent solutions entity. All recruitment mandates and candidate submissions are processed directly through our authorized team.
              </p>
            </div>
          </div>

          {/* Right Column: General Enquiry Form */}
          <div className="lg:col-span-7 rounded-3xl border border-[#DCE8ED] bg-white p-7 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCEFF5] text-[oklch(39.8%_0.07_227.392)]">
                  ✓
                </div>
                <h3 className="mt-4 text-2xl font-bold text-[#152B38]">
                  Enquiry Transmitted
                </h3>
                <p className="mt-2 text-sm text-[#4F6A78] max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. An ADP Softech recruitment manager will follow up with you within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-6 rounded-full bg-[oklch(39.8%_0.07_227.392)] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#07394B] transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-[#152B38]">
                    Send Us a Message
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[#4F6A78]">
                    Fill in your details below and our talent advisors will get back to you shortly.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
                      Your Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="mt-2 w-full rounded-xl border border-[#DCE8ED] bg-white px-3.5 py-2.5 text-sm text-[#152B38] outline-none transition focus:border-[oklch(39.8%_0.07_227.392)] focus:ring-2 focus:ring-[#DCEFF5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
                      Email Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                      className="mt-2 w-full rounded-xl border border-[#DCE8ED] bg-white px-3.5 py-2.5 text-sm text-[#152B38] outline-none transition focus:border-[oklch(39.8%_0.07_227.392)] focus:ring-2 focus:ring-[#DCEFF5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
                    Subject / Area of Interest
                  </label>
                  <input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. IT Staffing, Offshore Squads, BPO Process, General"
                    className="mt-2 w-full rounded-xl border border-[#DCE8ED] bg-white px-3.5 py-2.5 text-sm text-[#152B38] outline-none transition focus:border-[oklch(39.8%_0.07_227.392)] focus:ring-2 focus:ring-[#DCEFF5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
                    Message Details <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please tell us about your inquiry or hiring needs..."
                    className="mt-2 w-full rounded-xl border border-[#DCE8ED] bg-white px-3.5 py-2.5 text-sm text-[#152B38] outline-none transition focus:border-[oklch(39.8%_0.07_227.392)] focus:ring-2 focus:ring-[#DCEFF5]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex rounded-full bg-[oklch(39.8%_0.07_227.392)] px-8 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#07394B]"
                  >
                    Send Message →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
