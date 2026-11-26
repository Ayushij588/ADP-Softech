"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const maxResumeSize = 10 * 1024 * 1024;
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
    message: "Please choose a resume file.",
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
        message: "Upload a PDF or Word document.",
      });
    }

    if (file.size > maxResumeSize) {
      context.addIssue({
        code: "custom",
        message: "Resume must be 10 MB or smaller.",
      });
    }
  });

const resumeSubmissionSchema = z
  .object({
    jobId: z.string().trim().min(1, "Enter the Job ID."),
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name.")
      .max(100, "Full name must be 100 characters or fewer."),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email address is too long."),
    mobileNumber: z
      .string()
      .trim()
      .min(7, "Enter a valid mobile number.")
      .max(24, "Mobile number must be 24 characters or fewer.")
      .regex(/^[+()\d.\-\s]+$/, "Use only digits and standard phone symbols."),
    currentLocation: z
      .string()
      .trim()
      .min(2, "Enter your current location.")
      .max(100, "Location must be 100 characters or fewer."),
    totalExperience: z
      .number({ error: "Enter your total experience in years." })
      .min(0, "Experience cannot be less than zero.")
      .max(50, "Enter a value of 50 years or less."),
    relevantExperience: z
      .number({ error: "Enter your relevant experience in years." })
      .min(0, "Experience cannot be less than zero.")
      .max(50, "Enter a value of 50 years or less."),
    primarySkills: z
      .string()
      .trim()
      .min(2, "Enter your primary skills.")
      .max(300, "Skills must be 300 characters or fewer."),
    noticePeriod: z.string().min(1, "Select your notice period."),
    resume: resumeFileSchema,
    consent: z.boolean().refine((accepted) => accepted, {
      message: "Consent is required to continue.",
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

const inputClasses =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 text-sm text-rose-700" id={id} role="alert">
      {message}
    </p>
  );
}

export function ResumeSubmissionForm() {
  const [validationMessage, setValidationMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResumeSubmissionValues>({
    resolver: zodResolver(resumeSubmissionSchema),
    mode: "onBlur",
    defaultValues: {
      jobId: "",
      fullName: "",
      email: "",
      mobileNumber: "",
      currentLocation: "",
      primarySkills: "",
      noticePeriod: "",
      consent: false,
    },
  });

  function onValidForm() {
    setValidationMessage(
      "Your details passed validation. This demo does not send or store your information.",
    );
  }

  return (
    <form
      className="space-y-6"
      noValidate
      onChange={() => setValidationMessage("")}
      onSubmit={handleSubmit(onValidForm)}
    >
      <div>
        <h2 className="text-xl font-semibold text-slate-950">
          Your information
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Complete each field below. This form is validated locally and is not
          connected to a submission service.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Job ID
          <input
            {...register("jobId")}
            aria-describedby={errors.jobId ? "job-id-error" : undefined}
            aria-invalid={Boolean(errors.jobId)}
            autoComplete="off"
            className={inputClasses}
            placeholder="e.g. senior-software-engineer"
          />
          <FieldError id="job-id-error" message={errors.jobId?.message} />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input
            {...register("fullName")}
            aria-describedby={errors.fullName ? "full-name-error" : undefined}
            aria-invalid={Boolean(errors.fullName)}
            autoComplete="name"
            className={inputClasses}
            placeholder="Your full name"
          />
          <FieldError id="full-name-error" message={errors.fullName?.message} />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Email
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
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Mobile number
          <input
            {...register("mobileNumber")}
            aria-describedby={
              errors.mobileNumber ? "mobile-number-error" : undefined
            }
            aria-invalid={Boolean(errors.mobileNumber)}
            autoComplete="tel"
            className={inputClasses}
            placeholder="+91 98765 43210"
            type="tel"
          />
          <FieldError
            id="mobile-number-error"
            message={errors.mobileNumber?.message}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Current location
          <input
            {...register("currentLocation")}
            aria-describedby={
              errors.currentLocation ? "location-error" : undefined
            }
            aria-invalid={Boolean(errors.currentLocation)}
            autoComplete="address-level2"
            className={inputClasses}
            placeholder="City, country"
          />
          <FieldError
            id="location-error"
            message={errors.currentLocation?.message}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Notice period
          <select
            {...register("noticePeriod")}
            aria-describedby={
              errors.noticePeriod ? "notice-period-error" : undefined
            }
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
          <FieldError
            id="notice-period-error"
            message={errors.noticePeriod?.message}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Total experience (years)
          <input
            {...register("totalExperience", { valueAsNumber: true })}
            aria-describedby={
              errors.totalExperience ? "total-experience-error" : undefined
            }
            aria-invalid={Boolean(errors.totalExperience)}
            className={inputClasses}
            max={50}
            min={0}
            placeholder="e.g. 5"
            step="0.5"
            type="number"
          />
          <FieldError
            id="total-experience-error"
            message={errors.totalExperience?.message}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Relevant experience (years)
          <input
            {...register("relevantExperience", { valueAsNumber: true })}
            aria-describedby={
              errors.relevantExperience
                ? "relevant-experience-error"
                : undefined
            }
            aria-invalid={Boolean(errors.relevantExperience)}
            className={inputClasses}
            max={50}
            min={0}
            placeholder="e.g. 3"
            step="0.5"
            type="number"
          />
          <FieldError
            id="relevant-experience-error"
            message={errors.relevantExperience?.message}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Primary skills
        <textarea
          {...register("primarySkills")}
          aria-describedby={
            errors.primarySkills ? "primary-skills-error" : undefined
          }
          aria-invalid={Boolean(errors.primarySkills)}
          className={`${inputClasses} min-h-24 resize-y`}
          placeholder="e.g. React, TypeScript, stakeholder management"
          rows={3}
        />
        <FieldError
          id="primary-skills-error"
          message={errors.primarySkills?.message}
        />
      </label>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Resume upload
          <input
            {...register("resume")}
            accept=".pdf,.doc,.docx"
            aria-describedby={errors.resume ? "resume-error" : "resume-help"}
            aria-invalid={Boolean(errors.resume)}
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            type="file"
          />
        </label>
        <p className="mt-2 text-xs text-slate-500" id="resume-help">
          PDF or Word document, up to 10 MB.
        </p>
        <FieldError id="resume-error" message={errors.resume?.message} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
          <input
            {...register("consent")}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            aria-invalid={Boolean(errors.consent)}
            className="mt-1 size-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
            type="checkbox"
          />
          <span>
            I consent to ADP Softech reviewing the information I have provided
            for recruitment purposes.
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent?.message} />
      </div>

      <div className="border-t border-slate-200 pt-5">
        <p className="text-xs leading-5 text-slate-500">
          This demo form does not upload, transmit, or save your information.
        </p>
        <button
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          disabled={isSubmitting}
          type="submit"
        >
          Validate resume details
        </button>
        {validationMessage && (
          <p
            className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900"
            role="status"
          >
            {validationMessage}
          </p>
        )}
      </div>
    </form>
  );
}
