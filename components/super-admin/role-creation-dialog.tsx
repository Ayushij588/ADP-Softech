"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/ui/field-error";
import { FormDialog } from "@/components/ui/form-dialog";
import { granularPermissions } from "@/constants/super-admin-content";
import {
  roleCreationSchema,
  type RoleCreationValues,
} from "@/lib/admin-form-schemas";

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function RoleCreationDialog({
  role,
  onClose,
  onSave,
}: {
  role?: {
    id: string;
    name: string;
    scope: string;
    permissions: string;
  };
  onClose: () => void;
  onSave: (values: RoleCreationValues) => void;
}) {
  const isEdit = Boolean(role);
  const existingPermissions = role
    ? role.permissions
        .split(",")
        .map((item) => item.trim())
        .filter((item) =>
          (granularPermissions as readonly string[]).includes(item),
        )
    : [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoleCreationValues>({
    resolver: zodResolver(roleCreationSchema),
    mode: "onBlur",
    defaultValues: {
      name: role?.name ?? "",
      description: role?.scope ?? "",
      permissions: existingPermissions,
    },
  });

  return (
    <FormDialog
      description="Assign granular platform permissions for this role (BRD §10.2)."
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      title={isEdit ? `Edit permissions · ${role?.name}` : "Create role"}
    >
      <form
        className="space-y-5 px-5 py-6 sm:px-7"
        noValidate
        onSubmit={handleSubmit(onSave)}
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
          Access scope / description
          <textarea
            {...register("description")}
            aria-describedby={
              errors.description ? "role-description-error" : undefined
            }
            aria-invalid={Boolean(errors.description)}
            className={`${fieldClassName} min-h-20 resize-y`}
            placeholder="Describe the access scope for this role."
            rows={2}
          />
          <FieldError
            id="role-description-error"
            message={errors.description?.message}
          />
        </label>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700">
            Granular permissions ({granularPermissions.length})
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {granularPermissions.map((permission) => (
              <label
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                key={permission}
              >
                <input
                  {...register("permissions")}
                  className="size-4 shrink-0 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                  type="checkbox"
                  value={permission}
                />
                <span>{permission}</span>
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
            {isEdit ? "Save permissions" : "Create role"}
          </button>
        </div>
      </form>
    </FormDialog>
  );
}
