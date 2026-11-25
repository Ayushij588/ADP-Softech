import Link from "next/link";

export default function ContactPage() {
  return (
    <main>
      <section className="bg-blue-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Get in touch
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Let’s start a conversation.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Whether you are exploring a new opportunity or planning a hire, our
            team would be glad to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-blue-700">Email</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">
              General enquiries
            </h2>
            <Link
              className="mt-2 inline-flex text-sm text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-blue-700"
              href="mailto:hello@adpsoftech.example"
            >
              hello@adpsoftech.example
            </Link>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-blue-700">Office</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">
              ADP Softech
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Bengaluru, India
              <br />
              Sample office details for this website preview.
            </p>
          </article>
          <p className="text-xs leading-5 text-slate-500">
            Contact details shown here are sample content.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-950">
            Send an enquiry
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            This sample form is not connected to a submission service.
          </p>
          <form className="mt-7 space-y-5">
            <label className="block text-sm font-medium text-slate-700">
              Your name
              <input
                autoComplete="name"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                name="name"
                placeholder="Name"
                type="text"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Work email
              <input
                autoComplete="email"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                name="email"
                placeholder="you@company.com"
                type="email"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              How can we help?
              <textarea
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                name="message"
                placeholder="Tell us a little about your enquiry"
                rows={4}
              />
            </label>
            <button
              className="cursor-not-allowed rounded-lg bg-slate-300 px-5 py-3 text-sm font-semibold text-slate-600"
              disabled
              type="button"
            >
              Enquiry form coming soon
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
