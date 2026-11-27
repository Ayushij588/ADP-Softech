"use client";

import { useState } from "react";

export function ContactInquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5" aria-live="polite">
        <h3 className="font-semibold text-slate-950">Your enquiry is ready</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">This frontend demo has captured the form state. Live delivery will be connected by the platform integration.</p>
        <button className="mt-4 text-sm font-semibold text-blue-700" onClick={() => setSubmitted(false)} type="button">Send another enquiry</button>
      </div>
    );
  }

  return (
    <form className="mt-7 space-y-5" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <label className="block text-sm font-medium text-slate-700">Your name<input autoComplete="name" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" name="name" required /></label>
      <label className="block text-sm font-medium text-slate-700">Work email<input autoComplete="email" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" name="email" type="email" required /></label>
      <label className="block text-sm font-medium text-slate-700">How can we help?<textarea className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" name="message" required rows={4} /></label>
      <button className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800" type="submit">Send enquiry</button>
    </form>
  );
}
