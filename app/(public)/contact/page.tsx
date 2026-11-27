import Link from "next/link";
import { ContactInquiryForm } from "@/components/public/contact-inquiry-form";

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
          <ContactInquiryForm />
        </div>
      </section>
    </main>
  );
}
