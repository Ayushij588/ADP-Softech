"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/ui/field-error";
import { FormDialog } from "@/components/ui/form-dialog";
import {
  userCreationSchema,
  userRoles,
  userStatuses,
  type UserCreationValues,
} from "@/lib/admin-form-schemas";

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function UserCreationDialog({
  user,
  onClose,
  onSave,
}: {
  user?: UserCreationValues & { id: string };
  onClose: () => void;
  onSave: (values: UserCreationValues) => void;
}) {
  const isEdit = Boolean(user);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCreationValues>({
    resolver: zodResolver(userCreationSchema),
    mode: "onBlur",
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "Recruitment Admin",
      assignedTeam: user?.assignedTeam ?? "Engineering & Offshore",
      status: user?.status ?? "Invited",
    },
  });

  return (
    <FormDialog
      description={
        isEdit
          ? "Update account role, team assignment, or status in the local demo list."
          : "User details are validated locally and are not sent as an invitation."
      }
      onClose={onClose}
      title={isEdit ? `Edit ${user?.name}` : "Create user"}
    >
      <form
        className="space-y-4 px-5 py-6 sm:px-7"
        noValidate
        onSubmit={handleSubmit(onSave)}
      >
        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input
            {...register("name")}
            aria-describedby={errors.name ? "user-name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            className={fieldClassName}
            placeholder="e.g. Taylor Morgan"
          />
          <FieldError id="user-name-error" message={errors.name?.message} />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Work email
          <input
            {...register("email")}
            aria-describedby={errors.email ? "user-email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className={fieldClassName}
            placeholder="name@adpsoftech.example"
            type="email"
          />
          <FieldError id="user-email-error" message={errors.email?.message} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Role
            <select
              {...register("role")}
              aria-describedby={errors.role ? "user-role-error" : undefined}
              aria-invalid={Boolean(errors.role)}
              className={fieldClassName}
            >
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <FieldError id="user-role-error" message={errors.role?.message} />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Account status
            <select
              {...register("status")}
              aria-describedby={errors.status ? "user-status-error" : undefined}
              aria-invalid={Boolean(errors.status)}
              className={fieldClassName}
            >
              {userStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <FieldError id="user-status-error" message={errors.status?.message} />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Assigned team / scope
          <input
            {...register("assignedTeam")}
            aria-describedby={
              errors.assignedTeam ? "user-team-error" : undefined
            }
            aria-invalid={Boolean(errors.assignedTeam)}
            className={fieldClassName}
            placeholder="e.g. Engineering & Offshore"
          />
          <FieldError
            id="user-team-error"
            message={errors.assignedTeam?.message}
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
            {isEdit ? "Save changes" : "Create user"}
          </button>
        </div>
      </form>
    </FormDialog>
  );
}
