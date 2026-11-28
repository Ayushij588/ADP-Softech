"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FieldError } from "@/components/ui/field-error";
import { FormDialog } from "@/components/ui/form-dialog";

const createSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Must include an uppercase letter.")
    .regex(/[a-z]/, "Must include a lowercase letter.")
    .regex(/[0-9]/, "Must include a number."),
});

const editSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof editSchema>;

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function UserCreationDialog({
  user,
  onClose,
  onSave,
}: {
  user?: { id: string; name: string; email: string };
  onClose: () => void;
  onSave: (values: FormValues) => Promise<void> | void;
}) {
  const isEdit = Boolean(user);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    mode: "onBlur",
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
    },
  });

  return (
    <FormDialog
      description={
        isEdit
          ? "Update recruiter name or work email via /api/users/recruiters."
          : "Create a recruiter account via /api/auth/create-recruiter."
      }
      onClose={onClose}
      title={isEdit ? `Edit ${user?.name}` : "Create recruiter"}
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
            placeholder="e.g. Aisha Patel"
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
            placeholder="recruiter@adpsoftech.com"
            type="email"
          />
          <FieldError id="user-email-error" message={errors.email?.message} />
        </label>

        {!isEdit && (
          <label className="block text-sm font-medium text-slate-700">
            Initial password
            <input
              {...register("password")}
              aria-describedby={
                errors.password ? "user-password-error" : undefined
              }
              aria-invalid={Boolean(errors.password)}
              autoComplete="new-password"
              className={fieldClassName}
              placeholder="Min 8 chars (A-Z, a-z, 0-9)"
              type="password"
            />
            <FieldError
              id="user-password-error"
              message={errors.password?.message}
            />
          </label>
        )}

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
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Save changes"
                : "Create recruiter"}
          </button>
        </div>
      </form>
    </FormDialog>
  );
}
