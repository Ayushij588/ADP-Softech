"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FieldError } from "@/components/ui/field-error";
import { FormDialog } from "@/components/ui/form-dialog";
import {
  jobEmploymentTypes,
  jobFormSchema,
  jobPublications,
  jobStatuses,
  jobWorkModes,
  type JobFormValues,
} from "@/lib/admin-form-schemas";
import type { JobManagementRecord } from "@/constants/admin-content";

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

function getDefaultValues(
  job: JobManagementRecord | undefined,
  jobId: string,
  prefill?: Partial<JobFormValues>,
): JobFormValues {
  return {
    jobId: job?.jobId ?? jobId,
    title: job?.title ?? prefill?.title ?? "",
    clientName: job?.clientName ?? prefill?.clientName ?? "",
    originalJdFile: job?.originalJdFile ?? "",
    publicDescription: job?.publicDescription ?? "",
    category: job?.category ?? prefill?.category ?? "",
    location: job?.location ?? prefill?.location ?? "",
    workMode: job?.workMode ?? prefill?.workMode ?? "Hybrid",
    workTimings: job?.workTimings ?? "9:30 AM – 6:30 PM IST",
    detail:
      job?.detail === "Contract" ||
      job?.detail === "Contract-to-hire" ||
      job?.detail === "Dedicated team"
        ? job.detail
        : prefill?.detail ?? "Permanent",
    experienceRequired: job?.experienceRequired ?? "",
    mandatorySkills: job?.mandatorySkills.join(", ") ?? "",
    preferredSkills: job?.preferredSkills.join(", ") ?? "",
    responsibilities: job?.responsibilities ?? "",
    education: job?.education ?? "",
    certifications: job?.certifications.join(", ") ?? "",
    eligibility: job?.eligibility ?? "",
    numberOfPositions: job?.numberOfPositions ?? prefill?.numberOfPositions ?? 1,
    budget: job?.budget ?? "",
    deadline: job?.deadline ?? "",
    recruiterOwner: job?.recruiterOwner ?? "",
    status:
      job?.status && (jobStatuses as readonly string[]).includes(job.status)
        ? (job.status as JobFormValues["status"])
        : "Draft",
    publication: job?.publication ?? "Unpublished",
  };
}

function TextField({
  label,
  name,
  register,
  error,
  type = "text",
  placeholder,
  readOnly = false,
}: {
  label: string;
  name: keyof JobFormValues;
  register: ReturnType<typeof useForm<JobFormValues>>["register"];
  error?: string;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  const errorId = `${name}-error`;
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        {...register(name, name === "numberOfPositions" ? { valueAsNumber: true } : undefined)}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`${fieldClassName} ${readOnly ? "bg-slate-50 text-slate-500" : ""}`}
        placeholder={placeholder}
        readOnly={readOnly}
        type={type}
      />
      <FieldError id={errorId} message={error} />
    </label>
  );
}

export function JobFormDialog({
  mode,
  job,
  prefill,
  generatedJobId,
  onClose,
  onSave,
}: {
  mode: "add" | "edit";
  job?: JobManagementRecord;
  prefill?: Partial<JobFormValues>;
  generatedJobId: string;
  onClose: () => void;
  onSave: (values: JobFormValues) => void;
}) {
  const [selectedFileHint, setSelectedFileHint] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    mode: "onBlur",
    defaultValues: getDefaultValues(job, generatedJobId, prefill),
  });

  const currentFileName = useWatch({ control, name: "originalJdFile" });

  function handleJdFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (!/\.(pdf|doc|docx)$/i.test(file.name)) {
      setSelectedFileHint("Please select a PDF, DOC, or DOCX file.");
      return;
    }
    setValue("originalJdFile", file.name, { shouldDirty: true });
    setSelectedFileHint(`Attached ${file.name} (frontend demo only — not uploaded to a server).`);
  }

  return (
    <FormDialog
      description="Create or update a JD manually, attach the confidential original client JD file, and manage the approved public JD separately."
      maxWidthClassName="max-w-3xl"
      onClose={onClose}
      title={mode === "add" ? "Create job description (JD)" : `Edit ${job?.jobId ?? "JD"}`}
    >
      <form className="px-5 py-6 sm:px-7" noValidate onSubmit={handleSubmit(onSave)}>
        <div className="space-y-7">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">1. Job overview</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField label="Job ID (immutable)" name="jobId" register={register} error={errors.jobId?.message} readOnly />
              <TextField label="Job title" name="title" register={register} error={errors.title?.message} placeholder="e.g. Senior Software Engineer" />
              <TextField label="Client name (internal)" name="clientName" register={register} error={errors.clientName?.message} placeholder="Client organization" />
              <TextField label="Department" name="category" register={register} error={errors.category?.message} placeholder="e.g. Technology" />
              <TextField label="Location" name="location" register={register} error={errors.location?.message} placeholder="City, country" />
              <TextField label="Work timings / time zone" name="workTimings" register={register} error={errors.workTimings?.message} placeholder="e.g. 10:00 AM – 7:00 PM IST" />
              <TextField label="Experience required" name="experienceRequired" register={register} error={errors.experienceRequired?.message} placeholder="e.g. 5-8 years" />
              <label className="block text-sm font-medium text-slate-700">Work mode
                <select {...register("workMode")} aria-invalid={Boolean(errors.workMode)} className={fieldClassName}>
                  {jobWorkModes.map((item) => <option key={item}>{item}</option>)}
                </select>
                <FieldError id="workMode-error" message={errors.workMode?.message} />
              </label>
              <label className="block text-sm font-medium text-slate-700">Engagement type
                <select {...register("detail")} aria-invalid={Boolean(errors.detail)} className={fieldClassName}>
                  {jobEmploymentTypes.map((item) => <option key={item}>{item}</option>)}
                </select>
                <FieldError id="detail-error" message={errors.detail?.message} />
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">2. Original client JD &amp; Public JD</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Original client JD file (PDF, DOC, DOCX · confidential internal)
                  <input
                    accept=".pdf,.doc,.docx"
                    className="mt-2 block w-full rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    onChange={handleJdFileChange}
                    type="file"
                  />
                </label>
                {currentFileName && (
                  <p className="mt-1.5 text-xs font-medium text-slate-700">
                    Current source file: <span className="font-mono">{currentFileName}</span>
                  </p>
                )}
                {selectedFileHint && <p className="mt-1 text-xs text-blue-700">{selectedFileHint}</p>}
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Approved Public JD (candidate-facing summary; omit confidential client/budget details)
                <textarea
                  {...register("publicDescription")}
                  aria-invalid={Boolean(errors.publicDescription)}
                  className={`${fieldClassName} min-h-24`}
                  placeholder="Candidate-facing description approved for the public careers page"
                />
                <FieldError id="publicDescription-error" message={errors.publicDescription?.message} />
              </label>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">3. Role requirements</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">Mandatory skills
                <textarea {...register("mandatorySkills")} aria-invalid={Boolean(errors.mandatorySkills)} className={`${fieldClassName} min-h-24`} placeholder="Separate skills with commas" />
                <FieldError id="mandatorySkills-error" message={errors.mandatorySkills?.message} />
              </label>
              <label className="block text-sm font-medium text-slate-700">Preferred skills
                <textarea {...register("preferredSkills")} className={`${fieldClassName} min-h-24`} placeholder="Optional skills separated with commas" />
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Responsibilities
                <textarea {...register("responsibilities")} aria-invalid={Boolean(errors.responsibilities)} className={`${fieldClassName} min-h-24`} placeholder="Key responsibilities and expected deliverables" />
                <FieldError id="responsibilities-error" message={errors.responsibilities?.message} />
              </label>
              <TextField label="Education" name="education" register={register} error={errors.education?.message} placeholder="Education or equivalent experience" />
              <label className="block text-sm font-medium text-slate-700">Certifications
                <textarea {...register("certifications")} className={`${fieldClassName} min-h-20`} placeholder="Required or preferred certifications" />
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Eligibility / restrictions
                <input {...register("eligibility")} className={fieldClassName} placeholder="e.g. Location availability, notice period cap, work authorization" />
              </label>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">4. Workflow, ownership &amp; publication</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField label="Number of positions" name="numberOfPositions" register={register} error={errors.numberOfPositions?.message} type="number" />
              <TextField label="Budget / rate (internal)" name="budget" register={register} error={errors.budget?.message} placeholder="e.g. INR 28-36 LPA" />
              <TextField label="Application deadline" name="deadline" register={register} error={errors.deadline?.message} type="date" />
              <label className="block text-sm font-medium text-slate-700">Recruiter owner
                <select {...register("recruiterOwner")} aria-invalid={Boolean(errors.recruiterOwner)} className={fieldClassName}>
                  <option value="">Select recruiter</option>
                  <option>Aisha Patel</option>
                  <option>Daniel Kim</option>
                  <option>Leah Morgan</option>
                </select>
                <FieldError id="recruiterOwner-error" message={errors.recruiterOwner?.message} />
              </label>
              <label className="block text-sm font-medium text-slate-700">Workflow status
                <select {...register("status")} aria-invalid={Boolean(errors.status)} className={fieldClassName}>
                  {jobStatuses.map((item) => <option key={item}>{item}</option>)}
                </select>
                <FieldError id="status-error" message={errors.status?.message} />
              </label>
              <label className="block text-sm font-medium text-slate-700">Public website visibility
                <select {...register("publication")} aria-invalid={Boolean(errors.publication)} className={fieldClassName}>
                  {jobPublications.map((item) => <option key={item}>{item}</option>)}
                </select>
                <FieldError id="publication-error" message={errors.publication?.message} />
              </label>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Editing a published JD automatically logs a new version in the demo JD version history. Budget, client name, and original JD file remain internal.
            </p>
          </section>
        </div>

        <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <button className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={onClose} type="button">Cancel</button>
          <button className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">{mode === "add" ? "Create JD" : "Save new version"}</button>
        </div>
      </form>
    </FormDialog>
  );
}
