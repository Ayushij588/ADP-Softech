"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/ui/field-error";
import { FormDialog } from "@/components/ui/form-dialog";
import {
  roleCreationSchema,
  type RoleCreationValues,
} from "@/lib/admin-form-schemas";

const permissionGroups = [
  "Jobs",
  "Applications",
  "Candidates",
  "Reports",
  "Website content",
  "Platform settings",
] as const;

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function RoleCreationDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (values: RoleCreationValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoleCreationValues>({
    resolver: zodResolver(roleCreationSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  return (
    <FormDialog
      description="Define a sample role and select its permission groups."
      onClose={onClose}
      title="Create role"
    >
      <form
        className="space-y-5 px-5 py-6 sm:px-7"
        noValidate
        onSubmit={handleSubmit(onCreate)}
      >
        <label className="block text-sm font-medium text-slate-700">
          Role name
          <input
            {...register("name")}
            aria-describedby={errors.name ? "role-name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
            className={fieldClassName}
            placeholder="e.g. Hiring Coordinator"
          />
          <FieldError id="role-name-error" message={errors.name?.message} />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Description
          <textarea
            {...register("description")}
            aria-describedby={
              errors.description ? "role-description-error" : undefined
            }
            aria-invalid={Boolean(errors.description)}
            className={`${fieldClassName} min-h-24 resize-y`}
            placeholder="Describe the access scope for this role."
            rows={3}
          />
          <FieldError
            id="role-description-error"
            message={errors.description?.message}
          />
        </label>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700">
            Permission groups
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {permissionGroups.map((permission) => (
              <label
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700"
                key={permission}
              >
                <input
                  {...register("permissions")}
                  className="size-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                  type="checkbox"
                  value={permission}
                />
                {permission}
              </label>
            ))}
          </div>
          <FieldError
            id="role-permissions-error"
            message={errors.permissions?.message}
          />
        </fieldset>

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
            Add role to demo list
          </button>
        </div>
      </form>
    </FormDialog>
  );
}
