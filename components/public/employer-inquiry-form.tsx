"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const employerInquirySchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters.")
    .max(120, "Company name must be 120 characters or fewer."),
  contactPerson: z
    .string()
    .trim()
    .min(2, "Contact person name is required.")
    .max(100, "Contact person name is too long."),
  businessEmail: z
    .string()
    .trim()
    .email("Enter a valid corporate email address.")
    .max(254, "Email address is too long."),
  phone: z
    .string()
    .trim()
    .max(24, "Phone number is too long.")
    .optional()
    .or(z.literal("")),
  jobTitle: z
    .string()
    .trim()
    .min(2, "Target role or job title is required.")
    .max(100, "Job title is too long."),
  requiredSkills: z
    .string()
    .trim()
    .min(2, "Specify required skills and technologies.")
    .max(400, "Skills list is too long."),
  experienceRequired: z
    .string()
    .trim()
    .min(1, "Select expected experience level."),
  numberOfPositions: z
    .number()
    .min(1, "At least 1 position is required.")
    .max(200, "For 200+ positions, please contact our enterprise team directly."),
  workMode: z.enum(["Remote", "Hybrid", "On-site"]),
  location: z
    .string()
    .trim()
    .min(2, "Specify target city or delivery region."),
  engagementType: z.enum([
    "Permanent Recruitment",
    "Contract Staffing",
    "Offshore Staffing",
    "Dedicated Development Team",
    "BPO & Customer Support",
  ]),
  expectedTimeline: z.enum([
    "Immediate (within 7 days)",
    "1 - 2 Weeks",
    "1 Month",
    "Flexible / Planning Stage",
  ]),
  message: z
    .string()
    .trim()
    .min(10, "Please provide brief details regarding your hiring requirements.")
    .max(1000, "Message must be 1000 characters or fewer."),
});

type EmployerInquiryValues = z.infer<typeof employerInquirySchema>;

interface InquiryConfirmation {
  inquiryId: string;
  companyName: string;
  jobTitle: string;
  contactPerson: string;
  submittedAt: string;
}

const inputClasses =
  "mt-2 w-full rounded-xl border border-[#DCE8ED] bg-white px-3.5 py-2.5 text-sm text-[#152B38] outline-none transition placeholder:text-[#607D8B]/60 focus:border-[oklch(39.8%_0.07_227.392)] focus:ring-2 focus:ring-[#DCEFF5]";

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-semibold text-rose-600" id={id} role="alert">
      {message}
    </p>
  );
}

function generateInquiryId(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timeMs = (now.getTime() % 10000).toString().padStart(4, "0");
  return `ADP-INQ-${dateStr}-${timeMs}`;
}

export function EmployerInquiryForm() {
  const [confirmation, setConfirmation] = useState<InquiryConfirmation | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployerInquiryValues>({
    resolver: zodResolver(employerInquirySchema),
    mode: "onBlur",
    defaultValues: {
      companyName: "",
      contactPerson: "",
      businessEmail: "",
      phone: "",
      jobTitle: "",
      requiredSkills: "",
      experienceRequired: "3 - 5 Years",
      numberOfPositions: 1,
      workMode: "Hybrid",
      location: "",
      engagementType: "Permanent Recruitment",
      expectedTimeline: "1 - 2 Weeks",
      message: "",
    },
  });

  function onSubmit(data: EmployerInquiryValues) {
    const now = new Date();
    const generatedInqId = generateInquiryId();

    setConfirmation({
      inquiryId: generatedInqId,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      contactPerson: data.contactPerson,
      submittedAt: now.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    });
  }

  if (confirmation) {
    return (
      <div className="rounded-3xl border border-[#DCE8ED] bg-white p-8 sm:p-10 shadow-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DCEFF5] text-[oklch(39.8%_0.07_227.392)] shadow-xs">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold text-[#152B38]">
          Hiring Inquiry Logged
        </h2>

        <p className="mt-3 text-sm text-[#4F6A78] max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="text-[#152B38]">{confirmation.contactPerson}</strong>. Your talent
          request for <strong className="text-[#152B38]">{confirmation.companyName}</strong> has been received.
        </p>

        <div className="mt-8 mx-auto max-w-md rounded-2xl border border-[#DCE8ED] bg-[#F1F8FB] p-6 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center border-b border-[#DCE8ED] pb-2.5">
            <span className="font-semibold text-[#17647B]">Inquiry Reference:</span>
            <span className="font-mono font-bold text-[#07394B] text-sm">
              {confirmation.inquiryId}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-[#DCE8ED] pb-2.5">
            <span className="font-semibold text-[#17647B]">Position / Mandate:</span>
            <span className="font-bold text-[#152B38] text-right">
              {confirmation.jobTitle}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#17647B]">Logged Timestamp:</span>
            <span className="text-[#4F6A78]">{confirmation.submittedAt}</span>
          </div>
        </div>

        {/* Integration notice */}
        <p className="mt-6 text-xs text-[#607D8B] italic max-w-md mx-auto">
          *Frontend verification completed. Real-time internal recruiter alert &amp; database persistence will activate upon API endpoint connection.
        </p>

        <button
          type="button"
          onClick={() => {
            setConfirmation(null);
            reset();
          }}
          className="mt-6 rounded-full bg-[oklch(39.8%_0.07_227.392)] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#07394B] transition"
        >
          Submit Another Hiring Mandate
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#152B38]">
          Share Your Hiring Requirements
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#4F6A78]">
          Tell us about your technical mandate, required competencies, and team structure.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Company Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Company Name <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("companyName")}
            aria-describedby={errors.companyName ? "company-name-error" : undefined}
            aria-invalid={Boolean(errors.companyName)}
            className={inputClasses}
            placeholder="Acme Tech Inc."
          />
          <FieldError id="company-name-error" message={errors.companyName?.message} />
        </div>

        {/* Contact Person */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Contact Person <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("contactPerson")}
            aria-describedby={errors.contactPerson ? "contact-person-error" : undefined}
            aria-invalid={Boolean(errors.contactPerson)}
            className={inputClasses}
            placeholder="Jane Doe (Hiring Manager / Talent Lead)"
          />
          <FieldError id="contact-person-error" message={errors.contactPerson?.message} />
        </div>

        {/* Business Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Business Email <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("businessEmail")}
            aria-describedby={errors.businessEmail ? "business-email-error" : undefined}
            aria-invalid={Boolean(errors.businessEmail)}
            className={inputClasses}
            placeholder="jane@acmetech.com"
            type="email"
          />
          <FieldError id="business-email-error" message={errors.businessEmail?.message} />
        </div>

        {/* Phone (Optional/Configurable per DOCX Section 5.4) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Phone Number <span className="text-xs font-normal text-[#607D8B] lowercase">(optional)</span>
          </label>
          <input
            {...register("phone")}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            aria-invalid={Boolean(errors.phone)}
            className={inputClasses}
            placeholder="+1 (555) 000-0000"
            type="tel"
          />
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>

        {/* Target Job Title / Role */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Role / Job Title Needed <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("jobTitle")}
            aria-describedby={errors.jobTitle ? "job-title-error" : undefined}
            aria-invalid={Boolean(errors.jobTitle)}
            className={inputClasses}
            placeholder="e.g. Senior Backend Engineer"
          />
          <FieldError id="job-title-error" message={errors.jobTitle?.message} />
        </div>

        {/* Experience Required */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Experience Level <span className="text-rose-600">*</span>
          </label>
          <select {...register("experienceRequired")} className={inputClasses}>
            <option value="1 - 3 Years">Entry-Mid (1 - 3 Years)</option>
            <option value="3 - 5 Years">Mid-Senior (3 - 5 Years)</option>
            <option value="5 - 8 Years">Senior (5 - 8 Years)</option>
            <option value="8+ Years">Lead / Principal (8+ Years)</option>
          </select>
          <FieldError id="exp-error" message={errors.experienceRequired?.message} />
        </div>

        {/* Number of Positions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Number of Positions <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("numberOfPositions", { valueAsNumber: true })}
            aria-describedby={errors.numberOfPositions ? "num-pos-error" : undefined}
            aria-invalid={Boolean(errors.numberOfPositions)}
            className={inputClasses}
            min={1}
            max={200}
            type="number"
          />
          <FieldError id="num-pos-error" message={errors.numberOfPositions?.message} />
        </div>

        {/* Work Mode */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Work Mode <span className="text-rose-600">*</span>
          </label>
          <select {...register("workMode")} className={inputClasses}>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>

        {/* Engagement Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Engagement Type <span className="text-rose-600">*</span>
          </label>
          <select {...register("engagementType")} className={inputClasses}>
            <option value="Permanent Recruitment">Permanent Recruitment</option>
            <option value="Contract Staffing">Contract Staffing</option>
            <option value="Offshore Staffing">Offshore Staffing</option>
            <option value="Dedicated Development Team">Dedicated Development Team</option>
            <option value="BPO & Customer Support">BPO &amp; Customer Support</option>
          </select>
        </div>

        {/* Expected Timeline */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Expected Hiring Timeline <span className="text-rose-600">*</span>
          </label>
          <select {...register("expectedTimeline")} className={inputClasses}>
            <option value="Immediate (within 7 days)">Immediate (within 7 days)</option>
            <option value="1 - 2 Weeks">1 - 2 Weeks</option>
            <option value="1 Month">1 Month</option>
            <option value="Flexible / Planning Stage">Flexible / Planning Stage</option>
          </select>
        </div>

        {/* Location / Target Region */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Work Location / Delivery Region <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("location")}
            aria-describedby={errors.location ? "location-error" : undefined}
            aria-invalid={Boolean(errors.location)}
            className={inputClasses}
            placeholder="e.g. India, US EST Hours, London (UK), UAE, etc."
          />
          <FieldError id="location-error" message={errors.location?.message} />
        </div>

        {/* Required Skills & Stack */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Required Skills &amp; Stack <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("requiredSkills")}
            aria-describedby={errors.requiredSkills ? "skills-error" : undefined}
            aria-invalid={Boolean(errors.requiredSkills)}
            className={inputClasses}
            placeholder="e.g. Next.js, Node.js, AWS, Kubernetes, Postgres"
          />
          <FieldError id="skills-error" message={errors.requiredSkills?.message} />
        </div>

        {/* Message / Details */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Project Scope or Role Description <span className="text-rose-600">*</span>
          </label>
          <textarea
            {...register("message")}
            aria-describedby={errors.message ? "message-error" : undefined}
            aria-invalid={Boolean(errors.message)}
            className={`${inputClasses} min-h-24 resize-y`}
            placeholder="Provide context on project objectives, deliverables, budget range, and team size..."
            rows={4}
          />
          <FieldError id="message-error" message={errors.message?.message} />
        </div>
      </div>

      <div className="pt-4 border-t border-[#DCE8ED]">
        <button
          className="inline-flex w-full items-center justify-center rounded-full bg-[oklch(39.8%_0.07_227.392)] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#07394B] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Submitting Inquiry..." : "Submit Hiring Mandate →"}
        </button>
      </div>
    </form>
  );
}
