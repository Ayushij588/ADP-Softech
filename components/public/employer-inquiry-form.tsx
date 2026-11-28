"use client";

import { useState } from "react";

const fieldClassName =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function EmployerInquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6" aria-live="polite">
        <h2 className="text-xl font-semibold text-slate-950">Thank you for your inquiry</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">Your hiring requirements have been recorded in this frontend demo. The ADP Softech team would review the details and respond using the contact information provided.</p>
        <button className="mt-5 text-sm font-semibold text-blue-700" onClick={() => setSubmitted(false)} type="button">Submit another inquiry</button>
      </section>
    );
  }

  return (
    <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Company name *<input className={fieldClassName} name="companyName" required /></label>
        <label className="text-sm font-medium text-slate-700">Contact person *<input className={fieldClassName} name="contactPerson" required /></label>
        <label className="text-sm font-medium text-slate-700">Business email *<input className={fieldClassName} name="email" type="email" required /></label>
        <label className="text-sm font-medium text-slate-700">Phone<input className={fieldClassName} name="phone" type="tel" /></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Job title / role *<input className={fieldClassName} name="jobTitle" required /></label>
      </div>
      <label className="block text-sm font-medium text-slate-700">Required skills *<textarea className={`${fieldClassName} min-h-24`} name="skills" required /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Experience range<input className={fieldClassName} name="experience" placeholder="e.g. 3-5 years" /></label>
        <label className="text-sm font-medium text-slate-700">Number of positions *<input className={fieldClassName} name="positions" type="number" min="1" required /></label>
        <label className="text-sm font-medium text-slate-700">Work mode<select className={fieldClassName} name="workMode" required><option value="">Select</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label>
        <label className="text-sm font-medium text-slate-700">Location *<input className={fieldClassName} name="location" required /></label>
        <label className="text-sm font-medium text-slate-700">Engagement type<select className={fieldClassName} name="engagementType" required><option value="">Select</option><option>Permanent</option><option>Contract</option><option>Contract-to-hire</option><option>Dedicated team</option></select></label>
        <label className="text-sm font-medium text-slate-700">Expected timeline<input className={fieldClassName} name="timeline" placeholder="e.g. 30 days" /></label>
      </div>
      <label className="block text-sm font-medium text-slate-700">Additional message<textarea className={`${fieldClassName} min-h-28`} name="message" /></label>
      <button className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800" type="submit">Send hiring inquiry</button>
    </form>
  );
}
