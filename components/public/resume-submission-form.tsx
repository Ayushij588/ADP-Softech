"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getJobById, isValidJobId, openPositions } from "@/constants/public-content";

const maxResumeSize = 10 * 1024 * 1024; // 10 MB limit per DOCX
const allowedResumeExtension = /\.(pdf|doc|docx)$/i;

function isFileList(value: unknown): value is FileList {
  return (
    typeof value === "object" &&
    value !== null &&
    "length" in value &&
    typeof value.length === "number" &&
    "item" in value &&
    typeof value.item === "function"
  );
}

const resumeFileSchema = z
  .custom<FileList>(isFileList, {
    message: "Please select a resume file (PDF, DOC, or DOCX).",
  })
  .superRefine((files, context) => {
    const file = files.item(0);

    if (!file) {
      context.addIssue({
        code: "custom",
        message: "Please choose a resume file.",
      });
      return;
    }

    if (!allowedResumeExtension.test(file.name)) {
      context.addIssue({
        code: "custom",
        message: "Invalid file format. Upload a PDF, DOC, or DOCX document.",
      });
    }

    if (file.size > maxResumeSize) {
      context.addIssue({
        code: "custom",
        message: "Resume file must be 10 MB or smaller.",
      });
    }
  });

const resumeSubmissionSchema = z
  .object({
    jobId: z
      .string()
      .trim()
      .min(1, "Job ID is required.")
      .refine((id) => isValidJobId(id), {
        message: "Invalid or inactive Job ID. Please enter a valid Job ID (e.g. ADP-JD-1001).",
      }),
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name must be 100 characters or fewer."),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email address is too long."),
    mobileNumber: z
      .string()
      .trim()
      .min(7, "Enter a valid mobile number with country code.")
      .max(24, "Mobile number must be 24 characters or fewer.")
      .regex(/^[+()\d.\-\s]+$/, "Use only digits and standard phone symbols (e.g. +91 98765 43210)."),
    currentLocation: z
      .string()
      .trim()
      .min(2, "Enter your current city and country.")
      .max(100, "Location must be 100 characters or fewer."),
    totalExperience: z
      .number({ error: "Enter your total experience in years." })
      .min(0, "Experience cannot be less than 0.")
      .max(50, "Enter a valid experience up to 50 years."),
    relevantExperience: z
      .number({ error: "Enter your relevant experience in years." })
      .min(0, "Relevant experience cannot be less than 0.")
      .max(50, "Enter a valid experience up to 50 years."),
    primarySkills: z
      .string()
      .trim()
      .min(2, "Enter primary skills and technologies.")
      .max(400, "Skills must be 400 characters or fewer."),
    noticePeriod: z.string().min(1, "Select your current notice period or availability."),
    resume: resumeFileSchema,
    consent: z.boolean().refine((accepted) => accepted === true, {
      message: "You must consent to data processing for recruitment purposes.",
    }),
  })
  .superRefine((values, context) => {
    if (values.relevantExperience > values.totalExperience) {
      context.addIssue({
        code: "custom",
        message: "Relevant experience cannot exceed total experience.",
        path: ["relevantExperience"],
      });
    }
  });

type ResumeSubmissionValues = z.infer<typeof resumeSubmissionSchema>;

interface SubmissionConfirmationData {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
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

function generateApplicationId(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timeMs = (now.getTime() % 10000).toString().padStart(4, "0");
  return `ADP-APP-${dateStr}-${timeMs}`;
}

export function ResumeSubmissionForm() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";

  const [confirmation, setConfirmation] = useState<SubmissionConfirmationData | null>(null);
  const [enteredJobId, setEnteredJobId] = useState(initialJobId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResumeSubmissionValues>({
    resolver: zodResolver(resumeSubmissionSchema),
    mode: "onBlur",
    defaultValues: {
      jobId: initialJobId,
      fullName: "",
      email: "",
      mobileNumber: "",
      currentLocation: "",
      primarySkills: "",
      noticePeriod: "",
      consent: false,
    },
  });

  const matchedJob = enteredJobId ? getJobById(enteredJobId) : undefined;



  function onSubmit(data: ResumeSubmissionValues) {
    const now = new Date();
    const generatedAppId = generateApplicationId();
    const job = getJobById(data.jobId);

    setConfirmation({
      applicationId: generatedAppId,
      jobId: data.jobId,
      jobTitle: job ? job.title : "Candidate Application",
      candidateName: data.fullName,
      submittedAt: now.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    });
  }

  // Confirmation View upon successful submission
  if (confirmation) {
    return (
      <div className="rounded-3xl border border-[#DCE8ED] bg-white p-8 sm:p-10 shadow-sm text-center">
        {/* Success Icon */}
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
          Application Received Successfully
        </h2>

        <p className="mt-3 text-sm text-[#4F6A78] max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="text-[#152B38]">{confirmation.candidateName}</strong>. Your
          resume has been safely recorded in ADP Softech’s candidate database.
        </p>

        {/* Confirmation Metadata Summary Card */}
        <div className="mt-8 mx-auto max-w-md rounded-2xl border border-[#DCE8ED] bg-[#F1F8FB] p-6 text-left space-y-3">
          <div className="flex justify-between items-center text-xs border-b border-[#DCE8ED] pb-2.5">
            <span className="font-semibold text-[#17647B]">Application ID:</span>
            <span className="font-mono font-bold text-[#07394B] text-sm">
              {confirmation.applicationId}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs border-b border-[#DCE8ED] pb-2.5">
            <span className="font-semibold text-[#17647B]">Job ID:</span>
            <span className="font-mono font-bold text-[oklch(39.8%_0.07_227.392)]">
              {confirmation.jobId}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs border-b border-[#DCE8ED] pb-2.5">
            <span className="font-semibold text-[#17647B]">Target Position:</span>
            <span className="font-bold text-[#152B38] text-right">
              {confirmation.jobTitle}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[#17647B]">Date &amp; Time:</span>
            <span className="text-[#4F6A78]">{confirmation.submittedAt}</span>
          </div>
        </div>

        {/* Mandatory Candidate Notice per DOCX Section 6.4 */}
        <div className="mt-6 mx-auto max-w-md rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 text-left leading-relaxed">
          <p className="font-bold">Important Notice:</p>
          <p className="mt-1">
            This confirmation acknowledges receipt of your application for review by ADP Softech’s
            recruitment specialists. Application submission does not promise an interview or guarantee
            selection. If your profile matches client criteria, a recruiter will reach out directly.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/careers"
            className="rounded-full bg-[oklch(39.8%_0.07_227.392)] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#07394B] transition"
          >
            Browse Other Openings
          </Link>
          <button
            type="button"
            onClick={() => {
              setConfirmation(null);
            }}
            className="rounded-full border border-[#DCE8ED] bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#152B38] hover:bg-[#F1F8FB] transition"
          >
            Submit Another Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#152B38]">
          Candidate Information
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#4F6A78]">
          Apply directly to published openings without an account. Enter or confirm the Job ID below.
        </p>
      </div>

      {/* Selected Job Card Preview */}
      {matchedJob ? (
        <div className="rounded-2xl border border-[oklch(39.8%_0.07_227.392)]/40 bg-[#DCEFF5]/50 p-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[oklch(39.8%_0.07_227.392)] px-2.5 py-0.5 text-[10px] font-bold text-white">
                {matchedJob.id}
              </span>
              <span className="text-xs font-semibold text-[#07394B]">
                {matchedJob.department}
              </span>
            </div>
            <h3 className="mt-1.5 text-base font-bold text-[#152B38]">
              {matchedJob.title}
            </h3>
            <p className="text-xs text-[#4F6A78]">
              {matchedJob.location} • {matchedJob.workMode} • {matchedJob.experienceRange}
            </p>
          </div>
          <Link
            href={`/careers/${matchedJob.id}`}
            className="text-xs font-semibold text-[oklch(39.8%_0.07_227.392)] underline hover:text-[#07394B]"
          >
            View JD
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#DCE8ED] bg-[#F1F8FB] p-4 text-xs text-[#4F6A78]">
          <p className="font-semibold text-[#152B38]">Need a Job ID?</p>
          <p className="mt-1">
            You can browse published openings on our{" "}
            <Link href="/careers" className="text-[oklch(39.8%_0.07_227.392)] underline font-bold">
              Careers Page
            </Link>{" "}
            and click &quot;Apply Now&quot;, or select one of:{" "}
            {openPositions.slice(0, 3).map((j, i) => (
              <button
                key={j.id}
                type="button"
                onClick={() => {
                  setValue("jobId", j.id, { shouldValidate: true });
                  setEnteredJobId(j.id);
                }}
                className="font-mono font-bold text-[#07394B] underline mx-1"
              >
                {j.id}{i < 2 ? "," : ""}
              </button>
            ))}
          </p>
        </div>
      )}

      {/* Form Fields Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Job ID Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Job ID <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("jobId", {
              onChange: (e) => setEnteredJobId(e.target.value),
            })}
            aria-describedby={errors.jobId ? "job-id-error" : undefined}
            aria-invalid={Boolean(errors.jobId)}
            autoComplete="off"
            className={inputClasses}
            placeholder="e.g. ADP-JD-1001"
          />
          <FieldError id="job-id-error" message={errors.jobId?.message} />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Full Name <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("fullName")}
            aria-describedby={errors.fullName ? "full-name-error" : undefined}
            aria-invalid={Boolean(errors.fullName)}
            autoComplete="name"
            className={inputClasses}
            placeholder="Enter your full name"
          />
          <FieldError id="full-name-error" message={errors.fullName?.message} />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Email Address <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("email")}
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className={inputClasses}
            placeholder="you@example.com"
            type="email"
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Mobile Number <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("mobileNumber")}
            aria-describedby={errors.mobileNumber ? "mobile-number-error" : undefined}
            aria-invalid={Boolean(errors.mobileNumber)}
            autoComplete="tel"
            className={inputClasses}
            placeholder="+91 98765 43210"
            type="tel"
          />
          <FieldError id="mobile-number-error" message={errors.mobileNumber?.message} />
        </div>

        {/* Current Location */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Current Location <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("currentLocation")}
            aria-describedby={errors.currentLocation ? "location-error" : undefined}
            aria-invalid={Boolean(errors.currentLocation)}
            autoComplete="address-level2"
            className={inputClasses}
            placeholder="City, Country (e.g. Bengaluru, India)"
          />
          <FieldError id="location-error" message={errors.currentLocation?.message} />
        </div>

        {/* Notice Period */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Notice Period / Availability <span className="text-rose-600">*</span>
          </label>
          <select
            {...register("noticePeriod")}
            aria-describedby={errors.noticePeriod ? "notice-period-error" : undefined}
            aria-invalid={Boolean(errors.noticePeriod)}
            className={inputClasses}
          >
            <option value="">Select notice period</option>
            <option value="Immediate">Immediate</option>
            <option value="15 days">15 days</option>
            <option value="30 days">30 days</option>
            <option value="45 days">45 days</option>
            <option value="60 days">60 days</option>
            <option value="90 days">90 days</option>
          </select>
          <FieldError id="notice-period-error" message={errors.noticePeriod?.message} />
        </div>

        {/* Total Experience */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Total Experience (Years) <span className="text-rose-600">*</span>
          </label>
          <input
            {...register("totalExperience", { valueAsNumber: true })}
            aria-describedby={errors.totalExperience ? "total-experience-error" : undefined}
            aria-invalid={Boolean(errors.totalExperience)}
            className={inputClasses}
            max={50}
            min={0}
            placeholder="e.g. 5"
            step="0.5"
            type="number"
          />
          <FieldError id="total-experience-error" message={errors.totalExperience?.message} />
        </div>

        {/* Relevant Experience */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
            Relevant Experience (Years)
          </label>
          <input
            {...register("relevantExperience", { valueAsNumber: true })}
            aria-describedby={errors.relevantExperience ? "relevant-experience-error" : undefined}
            aria-invalid={Boolean(errors.relevantExperience)}
            className={inputClasses}
            max={50}
            min={0}
            placeholder="e.g. 3.5"
            step="0.5"
            type="number"
          />
          <FieldError id="relevant-experience-error" message={errors.relevantExperience?.message} />
        </div>
      </div>

      {/* Primary Skills */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
          Primary Skills &amp; Tech Stack <span className="text-rose-600">*</span>
        </label>
        <textarea
          {...register("primarySkills")}
          aria-describedby={errors.primarySkills ? "primary-skills-error" : undefined}
          aria-invalid={Boolean(errors.primarySkills)}
          className={`${inputClasses} min-h-24 resize-y`}
          placeholder="e.g. React, Next.js, TypeScript, Node.js, AWS, PostgreSQL"
          rows={3}
        />
        <FieldError id="primary-skills-error" message={errors.primarySkills?.message} />
      </div>

      {/* Resume File Upload */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#152B38]">
          Resume Upload (PDF, DOC, DOCX) <span className="text-rose-600">*</span>
        </label>
        <input
          {...register("resume")}
          accept=".pdf,.doc,.docx"
          aria-describedby={errors.resume ? "resume-error" : "resume-help"}
          aria-invalid={Boolean(errors.resume)}
          className="mt-2 block w-full rounded-xl border border-[#DCE8ED] bg-white text-sm text-[#4F6A78] file:mr-4 file:border-0 file:bg-[#DCEFF5] file:px-4 file:py-2.5 file:font-semibold file:text-[#07394B] hover:file:bg-[#14B8C4]/20"
          type="file"
        />
        <p className="mt-1.5 text-xs text-[#607D8B]" id="resume-help">
          Accepted formats: PDF, DOC, DOCX. Maximum file size: 10 MB.
        </p>
        <FieldError id="resume-error" message={errors.resume?.message} />
      </div>

      {/* Consent Checkbox per DOCX Section 6.2 */}
      <div>
        <label className="flex items-start gap-3 text-xs leading-5 text-[#3E5866]">
          <input
            {...register("consent")}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            aria-invalid={Boolean(errors.consent)}
            className="mt-0.5 size-4 rounded border-[#DCE8ED] text-[oklch(39.8%_0.07_227.392)] focus:ring-[oklch(39.8%_0.07_227.392)]"
            type="checkbox"
          />
          <span>
            I acknowledge that I have read ADP Softech&apos;s Privacy Policy and consent to the
            processing of my personal and professional information for recruitment purposes,
            including potential sharing with relevant hiring clients for matching positions.
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent?.message} />
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-[#DCE8ED]">
        <button
          className="inline-flex w-full items-center justify-center rounded-full bg-[oklch(39.8%_0.07_227.392)] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#07394B] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Submitting Application..." : "Submit Application →"}
        </button>
      </div>
    </form>
  );
}
