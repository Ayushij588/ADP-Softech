"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/ui/field-error";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  atsSettingsSchema,
  type AtsSettingsValues,
} from "@/lib/admin-form-schemas";

const initialValues: AtsSettingsValues = {
  skillsWeight: 40,
  experienceWeight: 30,
  locationWeight: 15,
  availabilityWeight: 15,
  minimumReviewScore: 50,
};

const weightFields = [
  {
    name: "skillsWeight",
    label: "Skills alignment",
    color: "bg-blue-600",
  },
  {
    name: "experienceWeight",
    label: "Relevant experience",
    color: "bg-indigo-500",
  },
  {
    name: "locationWeight",
    label: "Location suitability",
    color: "bg-emerald-500",
  },
  {
    name: "availabilityWeight",
    label: "Availability",
    color: "bg-amber-500",
  },
] as const;

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function AtsSettingsForm() {
  const [previewValues, setPreviewValues] =
    useState<AtsSettingsValues>(initialValues);
  const [feedback, setFeedback] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AtsSettingsValues>({
    resolver: zodResolver(atsSettingsSchema),
    mode: "onBlur",
    defaultValues: initialValues,
  });

  function onValid(values: AtsSettingsValues) {
    setPreviewValues(values);
    setFeedback(
      "Settings validated and updated in this page's temporary preview only.",
    );
  }

  return (
    <section
      aria-labelledby="ats-form-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2
            className="text-lg font-semibold text-slate-950"
            id="ats-form-heading"
          >
            Match scoring configuration
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Adjust sample weights and the minimum review threshold.
          </p>
        </div>
        <StatusBadge label="Preview only · not applied" tone="info" />
      </div>

      <form
        className="mt-6"
        noValidate
        onSubmit={handleSubmit(onValid)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {weightFields.map((field) => (
            <label
              className="block text-sm font-medium text-slate-700"
              key={field.name}
            >
              {field.label} weight (%)
              <input
                {...register(field.name, { valueAsNumber: true })}
                aria-describedby={
                  errors[field.name] ? `${field.name}-error` : undefined
                }
                aria-invalid={Boolean(errors[field.name])}
                className={inputClassName}
                max={100}
                min={0}
                step={1}
                type="number"
              />
              <FieldError
                id={`${field.name}-error`}
                message={errors[field.name]?.message}
              />
            </label>
          ))}
          <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
            Minimum review score (%)
            <input
              {...register("minimumReviewScore", { valueAsNumber: true })}
              aria-describedby={
                errors.minimumReviewScore
                  ? "minimum-review-score-error"
                  : undefined
              }
              aria-invalid={Boolean(errors.minimumReviewScore)}
              className={inputClassName}
              max={100}
              min={0}
              step={1}
              type="number"
            />
            <FieldError
              id="minimum-review-score-error"
              message={errors.minimumReviewScore?.message}
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          <p className="text-xs leading-5 text-slate-500">
            Scoring weights must total 100%. Validated values remain in this
            page session only.
          </p>
          <button
            className="shrink-0 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            Preview settings
          </button>
        </div>
      </form>

      {feedback && (
        <p
          className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"
          role="status"
        >
          {feedback}
        </p>
      )}

      <div className="mt-7 border-t border-slate-100 pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-900">Local preview</h3>
          <StatusBadge
            label={`Review threshold ${previewValues.minimumReviewScore}%`}
            tone="neutral"
          />
        </div>
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {weightFields.map((field) => {
            const percentage = previewValues[field.name];

            return (
              <li key={field.name}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-700">{field.label}</span>
                  <span className="tabular-nums text-slate-500">
                    {percentage}%
                  </span>
                </div>
                <div
                  aria-label={`${field.label}: ${percentage}%`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={percentage}
                  className="h-2 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                >
                  <div
                    className={`h-full rounded-full ${field.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
