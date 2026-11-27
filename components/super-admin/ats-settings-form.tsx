"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FieldError } from "@/components/ui/field-error";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import {
  atsSettingsSchema,
  type AtsSettingsValues,
} from "@/lib/admin-form-schemas";

const initialValues: AtsSettingsValues = {
  technicalSkillsWeight: 35,
  relevantExperienceWeight: 20,
  requiredTechnologiesWeight: 15,
  responsibilitiesWeight: 15,
  educationWeight: 5,
  otherRequirementsWeight: 10,
  strongMatchMin: 85,
  goodMatchMin: 70,
  moderateMatchMin: 50,
  minimumReviewScore: 50,
  manualFallbackOnFailure: true,
};

const weightFields = [
  {
    name: "technicalSkillsWeight",
    label: "Technical Skills",
    color: "bg-blue-600",
  },
  {
    name: "relevantExperienceWeight",
    label: "Relevant Experience",
    color: "bg-indigo-500",
  },
  {
    name: "requiredTechnologiesWeight",
    label: "Required Technologies",
    color: "bg-sky-500",
  },
  {
    name: "responsibilitiesWeight",
    label: "Responsibilities / Project Experience",
    color: "bg-emerald-500",
  },
  {
    name: "educationWeight",
    label: "Education / Certifications",
    color: "bg-violet-500",
  },
  {
    name: "otherRequirementsWeight",
    label: "Other JD Requirements",
    color: "bg-amber-500",
  },
] as const;

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function AtsSettingsForm() {
  const { toast } = useToast();
  const [previewValues, setPreviewValues] =
    useState<AtsSettingsValues>(initialValues);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AtsSettingsValues>({
    resolver: zodResolver(atsSettingsSchema),
    mode: "onBlur",
    defaultValues: initialValues,
  });

  const watchedWeights = useWatch({
    control,
    name: [
      "technicalSkillsWeight",
      "relevantExperienceWeight",
      "requiredTechnologiesWeight",
      "responsibilitiesWeight",
      "educationWeight",
      "otherRequirementsWeight",
    ],
  });
  const liveTotal = watchedWeights.reduce(
    (sum, value) => sum + (Number.isFinite(value) ? Number(value) : 0),
    0,
  );

  function onValid(values: AtsSettingsValues) {
    setPreviewValues(values);
    toast(
      "6-category ATS weights and match score bands validated in local preview.",
      "success",
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
            Configure the 6-category BRD §9.3 weights, score bands, and failure fallback.
          </p>
        </div>
        <StatusBadge
          label={`Total: ${liveTotal}%`}
          tone={liveTotal === 100 ? "success" : "warning"}
        />
      </div>

      <form
        className="mt-6 space-y-6"
        noValidate
        onSubmit={handleSubmit(onValid)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {weightFields.map((field) => (
            <label
              className="block text-sm font-medium text-slate-700"
              key={field.name}
            >
              {field.label} (%)
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
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-semibold text-slate-900">
            Configurable Score Bands &amp; Thresholds
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Strong Match min (%)
              <input
                {...register("strongMatchMin", { valueAsNumber: true })}
                aria-invalid={Boolean(errors.strongMatchMin)}
                className={inputClassName}
                max={100}
                min={50}
                type="number"
              />
              <FieldError
                id="strong-match-error"
                message={errors.strongMatchMin?.message}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Good Match min (%)
              <input
                {...register("goodMatchMin", { valueAsNumber: true })}
                aria-invalid={Boolean(errors.goodMatchMin)}
                className={inputClassName}
                max={99}
                min={20}
                type="number"
              />
              <FieldError
                id="good-match-error"
                message={errors.goodMatchMin?.message}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Moderate Match min (%)
              <input
                {...register("moderateMatchMin", { valueAsNumber: true })}
                aria-invalid={Boolean(errors.moderateMatchMin)}
                className={inputClassName}
                max={95}
                min={0}
                type="number"
              />
              <FieldError
                id="moderate-match-error"
                message={errors.moderateMatchMin?.message}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Minimum review score (%)
              <input
                {...register("minimumReviewScore", { valueAsNumber: true })}
                aria-invalid={Boolean(errors.minimumReviewScore)}
                className={inputClassName}
                max={100}
                min={0}
                type="number"
              />
              <FieldError
                id="minimum-review-score-error"
                message={errors.minimumReviewScore?.message}
              />
            </label>
          </div>

          <label className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm text-slate-700">
            <input
              {...register("manualFallbackOnFailure")}
              className="mt-0.5 size-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
              type="checkbox"
            />
            <span>
              <span className="block font-medium text-slate-900">
                Manual review fallback on parser/ATS failure
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Always preserve applications and flag for manual recruiter review if ATS fails (BRD §9.7).
              </span>
            </span>
          </label>
        </div>

        <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          <p className="text-xs leading-5 text-slate-500">
            All six weights must total 100%, and mandatory criteria failures are never overridden by overall score.
          </p>
          <button
            className="shrink-0 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            Save scoring settings
          </button>
        </div>
      </form>

      <div className="mt-7 border-t border-slate-100 pt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-900">Active Preview</h3>
          <div className="flex flex-wrap gap-2">
            <StatusBadge
              label={`Strong ≥ ${previewValues.strongMatchMin}%`}
              tone="success"
            />
            <StatusBadge
              label={`Good ≥ ${previewValues.goodMatchMin}%`}
              tone="info"
            />
            <StatusBadge
              label={`Review ≥ ${previewValues.minimumReviewScore}%`}
              tone="neutral"
            />
          </div>
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
