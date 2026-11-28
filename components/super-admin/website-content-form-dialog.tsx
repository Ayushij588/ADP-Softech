"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/ui/field-error";
import { FormDialog } from "@/components/ui/form-dialog";
import {
  contentStatuses,
  websiteContentSchema,
  type WebsiteContentValues,
} from "@/lib/admin-form-schemas";

export type WebsiteContentRecord = WebsiteContentValues & {
  id: string;
  lastUpdated: string;
  updatedBy: string;
};

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function WebsiteContentFormDialog({
  record,
  onClose,
  onSave,
}: {
  record?: WebsiteContentRecord;
  onClose: () => void;
  onSave: (values: WebsiteContentValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WebsiteContentValues>({
    resolver: zodResolver(websiteContentSchema),
    mode: "onBlur",
    defaultValues: {
      section: record?.section ?? "",
      path: record?.path ?? "",
      metaTitle: record?.metaTitle ?? "",
      metaDescription: record?.metaDescription ?? "",
      content: record?.content ?? "",
      status: record?.status === "Draft" ? "Draft" : "Published",
    },
  });

  return (
    <FormDialog
      description="Manage public page copy, SEO metadata, and publishing status in the local demo list."
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      title={record ? "Edit website content & SEO" : "Add website content"}
    >
      <form
        className="space-y-4 px-5 py-6 sm:px-7"
        noValidate
        onSubmit={handleSubmit(onSave)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Section title
            <input
              {...register("section")}
              aria-describedby={
                errors.section ? "content-section-error" : undefined
              }
              aria-invalid={Boolean(errors.section)}
              className={fieldClassName}
              placeholder="e.g. Our approach"
            />
            <FieldError
              id="content-section-error"
              message={errors.section?.message}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Page path
            <input
              {...register("path")}
              aria-describedby={errors.path ? "content-path-error" : undefined}
              aria-invalid={Boolean(errors.path)}
              className={fieldClassName}
              placeholder="e.g. /about"
            />
            <FieldError
              id="content-path-error"
              message={errors.path?.message}
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          SEO Meta Title
          <input
            {...register("metaTitle")}
            aria-describedby={
              errors.metaTitle ? "content-meta-title-error" : undefined
            }
            aria-invalid={Boolean(errors.metaTitle)}
            className={fieldClassName}
            placeholder="e.g. ADP Softech | Recruitment & Offshore Staffing"
          />
          <FieldError
            id="content-meta-title-error"
            message={errors.metaTitle?.message}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          SEO Meta Description
          <textarea
            {...register("metaDescription")}
            aria-describedby={
              errors.metaDescription ? "content-meta-desc-error" : undefined
            }
            aria-invalid={Boolean(errors.metaDescription)}
            className={`${fieldClassName} min-h-20 resize-y`}
            placeholder="Concise search engine description (max 240 characters)..."
            rows={2}
          />
          <FieldError
            id="content-meta-desc-error"
            message={errors.metaDescription?.message}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Content
          <textarea
            {...register("content")}
            aria-describedby={
              errors.content ? "content-body-error" : undefined
            }
            aria-invalid={Boolean(errors.content)}
            className={`${fieldClassName} min-h-32 resize-y`}
            placeholder="Enter sample website copy..."
            rows={4}
          />
          <FieldError
            id="content-body-error"
            message={errors.content?.message}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Publishing status
          <select
            {...register("status")}
            aria-describedby={
              errors.status ? "content-status-error" : undefined
            }
            aria-invalid={Boolean(errors.status)}
            className={fieldClassName}
          >
            {contentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <FieldError
            id="content-status-error"
            message={errors.status?.message}
          />
        </label>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <button
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            Save changes
          </button>
        </div>
      </form>
    </FormDialog>
  );
}
