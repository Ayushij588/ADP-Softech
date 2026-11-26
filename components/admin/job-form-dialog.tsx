"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/ui/field-error";
import { FormDialog } from "@/components/ui/form-dialog";
import {
  jobEmploymentTypes,
  jobFormSchema,
  jobStatuses,
  type JobFormValues,
} from "@/lib/admin-form-schemas";
import type { AdminManagementRecord } from "@/constants/admin-content";

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

function getDefaultValues(job?: AdminManagementRecord): JobFormValues {
  return {
    title: job?.title ?? "",
    category: job?.category ?? "",
    location: job?.location ?? "",
    detail: job?.detail === "Contract" ? "Contract" : "Permanent",
    status:
      job?.status === "Published" ||
      job?.status === "On hold" ||
      job?.status === "Closed"
        ? job.status
        : "Draft",
  };
}

export function JobFormDialog({
  mode,
  job,
  onClose,
  onSave,
}: {
  mode: "add" | "edit";
  job?: AdminManagementRecord;
  onClose: () => void;
  onSave: (values: JobFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    mode: "onBlur",
    defaultValues: getDefaultValues(job),
  });

  function onValid(values: JobFormValues) {
    onSave(values);
  }

  return (
    <FormDialog
      description="Required fields are validated locally; this demo does not save to a server."
      onClose={onClose}
      title={mode === "add" ? "Create job" : "Edit job"}
    >
      <form
        className="px-5 py-6 sm:px-7"
        noValidate
        onSubmit={handleSubmit(onValid)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Job title
            <input
              {...register("title")}
              aria-describedby={errors.title ? "job-title-error" : undefined}
              aria-invalid={Boolean(errors.title)}
              className={fieldClassName}
              placeholder="e.g. Senior Software Engineer"
            />
            <FieldError id="job-title-error" message={errors.title?.message} />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Department
            <input
              {...register("category")}
              aria-describedby={
                errors.category ? "job-department-error" : undefined
              }
              aria-invalid={Boolean(errors.category)}
              className={fieldClassName}
              placeholder="e.g. Technology"
            />
            <FieldError
              id="job-department-error"
              message={errors.category?.message}
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Location
            <input
              {...register("location")}
              aria-describedby={
                errors.location ? "job-location-error" : undefined
              }
              aria-invalid={Boolean(errors.location)}
              className={fieldClassName}
              placeholder="e.g. Bengaluru"
            />
            <FieldError
              id="job-location-error"
              message={errors.location?.message}
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Employment type
            <select
              {...register("detail")}
              aria-describedby={
                errors.detail ? "job-type-error" : undefined
              }
              aria-invalid={Boolean(errors.detail)}
              className={fieldClassName}
            >
              {jobEmploymentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <FieldError id="job-type-error" message={errors.detail?.message} />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Status
            <select
              {...register("status")}
              aria-describedby={
                errors.status ? "job-status-error" : undefined
              }
              aria-invalid={Boolean(errors.status)}
              className={fieldClassName}
            >
              {jobStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <FieldError
              id="job-status-error"
              message={errors.status?.message}
            />
          </label>
        </div>

        <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <button
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {mode === "add" ? "Create job" : "Save changes"}
          </button>
        </div>
      </form>
    </FormDialog>
  );
}
