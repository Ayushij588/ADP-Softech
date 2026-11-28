"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/ui/field-error";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import {
  platformSettingsSchema,
  type PlatformSettingsValues,
} from "@/lib/admin-form-schemas";

const defaultValues: PlatformSettingsValues = {
  platformName: "ADP Softech",
  timeZone: "Asia/Kolkata (IST)",
  language: "English (India)",
  mfaRequired: true,
  sessionTimeoutMinutes: 30,
  passwordPolicy: "Strong · 12 characters",
  jobIdPrefix: "ADP-JD-",
  applicationIdFormat: "ADP-APP-YYYYMMDD-0001",
  maxResumeSizeMb: 5,
  allowedResumeFormats: "PDF, DOC, DOCX",
  supportEmail: "support@adpsoftech.example",
  retentionPolicy: "24 months",
  backupSchedule: "Daily · 02:00 UTC",
  weeklySummary: true,
  criticalAlerts: true,
  candidateAckEmail: true,
  recruiterAlertEmail: true,
  atsFailureAlert: true,
  deadlineReminderAlert: true,
};

const initialTemplates = [
  {
    id: "candidate-ack",
    name: "Candidate Application Acknowledgement",
    subject: "Application received for {{jobTitle}} ({{jobId}})",
    body: "Thank you for applying to ADP Softech. Your application reference is {{applicationId}}. Our recruitment team will review your submission.",
  },
  {
    id: "recruiter-alert",
    name: "New Application Internal Alert",
    subject: "New application {{applicationId}} for {{jobId}}",
    body: "A new resume was submitted for {{jobTitle}}. Open Recruitment Admin to inspect the parsed profile and ATS match report.",
  },
  {
    id: "ats-failure",
    name: "ATS Analysis Failure Fallback Alert",
    subject: "Manual review required · {{applicationId}}",
    body: "Automated resume parsing or ATS scoring failed for {{applicationId}}. The application has been saved for manual recruiter review.",
  },
];

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export function PlatformSettingsForm() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplates[0].id);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlatformSettingsValues>({
    resolver: zodResolver(platformSettingsSchema),
    mode: "onBlur",
    defaultValues,
  });

  const activeTemplate =
    templates.find((item) => item.id === selectedTemplateId) ?? templates[0];

  function onValid() {
    toast("Platform governance, ID formats, security, and alert settings saved in local demo state.", "success");
  }

  function updateTemplate(field: "subject" | "body", value: string) {
    setTemplates((current) =>
      current.map((item) =>
        item.id === activeTemplate.id ? { ...item, [field]: value } : item,
      ),
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <form className="grid gap-5 lg:grid-cols-2" noValidate onSubmit={handleSubmit(onValid)}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-950">Platform profile</h2>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Platform name
              <input {...register("platformName")} className={inputClassName} />
              <FieldError id="platformName-error" message={errors.platformName?.message} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Default time zone
              <select {...register("timeZone")} className={inputClassName}>
                <option>Asia/Kolkata (IST)</option>
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Default language
              <select {...register("language")} className={inputClassName}>
                <option>English (India)</option>
                <option>English (UK)</option>
                <option>English (US)</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-950">Security &amp; authentication</h2>
          <div className="mt-5 space-y-4">
            <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800">
              Require multi-factor authentication (Super Admin)
              <input {...register("mfaRequired")} className="size-4 accent-blue-700" type="checkbox" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Session timeout (minutes)
              <input
                {...register("sessionTimeoutMinutes", { valueAsNumber: true })}
                className={inputClassName}
                max={480}
                min={5}
                type="number"
              />
              <FieldError id="sessionTimeout-error" message={errors.sessionTimeoutMinutes?.message} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password policy
              <select {...register("passwordPolicy")} className={inputClassName}>
                <option>Strong · 12 characters</option>
                <option>Standard · 8 characters</option>
                <option>Strong · 14 characters</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-950">Reference IDs &amp; resume upload limits</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Job ID prefix
              <input {...register("jobIdPrefix")} className={inputClassName} />
              <FieldError id="jobIdPrefix-error" message={errors.jobIdPrefix?.message} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Application ID format
              <input {...register("applicationIdFormat")} className={inputClassName} />
              <FieldError id="applicationIdFormat-error" message={errors.applicationIdFormat?.message} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Max resume file size (MB)
              <input
                {...register("maxResumeSizeMb", { valueAsNumber: true })}
                className={inputClassName}
                max={50}
                min={1}
                type="number"
              />
              <FieldError id="maxResumeSizeMb-error" message={errors.maxResumeSizeMb?.message} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Allowed resume formats
              <input {...register("allowedResumeFormats")} className={inputClassName} />
              <FieldError id="allowedResumeFormats-error" message={errors.allowedResumeFormats?.message} />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-950">Retention, backup &amp; support</h2>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Support email
              <input {...register("supportEmail")} className={inputClassName} type="email" />
              <FieldError id="supportEmail-error" message={errors.supportEmail?.message} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Candidate record retention
                <select {...register("retentionPolicy")} className={inputClassName}>
                  <option>12 months</option>
                  <option>24 months</option>
                  <option>36 months</option>
                  <option>Configured by policy</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Backup schedule
                <select {...register("backupSchedule")} className={inputClassName}>
                  <option>Daily · 02:00 UTC</option>
                  <option>Every 12 hours</option>
                  <option>Weekly · Sunday 00:00 UTC</option>
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-950">Notifications &amp; email alerts (BRD §15)</h2>
          <p className="mt-1 text-sm text-slate-500">
            Emails must never expose confidential ATS scores, private recruiter notes, or raw resume attachments.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {[
              { name: "candidateAckEmail", label: "Candidate acknowledgement email" },
              { name: "recruiterAlertEmail", label: "Recruiter alert on new application" },
              { name: "atsFailureAlert", label: "Alert on ATS completion or failure" },
              { name: "deadlineReminderAlert", label: "JD deadline & unreviewed reminder" },
              { name: "weeklySummary", label: "Weekly platform summary" },
              { name: "criticalAlerts", label: "Critical system & security alerts" },
            ].map((item) => (
              <label
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-3 font-medium text-slate-800"
                key={item.name}
              >
                <span>{item.label}</span>
                <input
                  {...register(item.name as keyof PlatformSettingsValues)}
                  className="size-4 shrink-0 accent-blue-700"
                  type="checkbox"
                />
              </label>
            ))}
          </div>
        </section>

        <div className="lg:col-span-2 flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
          <p className="text-xs text-slate-500">
            Validated settings persist in local demo session only.
          </p>
          <button
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            Save platform settings
          </button>
        </div>
      </form>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Email Templates (BRD §10.1 &amp; §15)</h2>
            <p className="mt-1 text-sm text-slate-500">
              Preview and customize automated acknowledgement and internal alert templates.
            </p>
          </div>
          <StatusBadge label="No sensitive ATS notes included" tone="info" />
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                className={`w-full rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                  template.id === activeTemplate.id
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                type="button"
              >
                {template.name}
              </button>
            ))}
          </div>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <label className="block text-xs font-medium text-slate-700">
              Email subject
              <input
                className={inputClassName}
                onChange={(event) => updateTemplate("subject", event.currentTarget.value)}
                value={activeTemplate.subject}
              />
            </label>
            <label className="block text-xs font-medium text-slate-700">
              Email body
              <textarea
                className={`${inputClassName} min-h-24`}
                onChange={(event) => updateTemplate("body", event.currentTarget.value)}
                rows={3}
                value={activeTemplate.body}
              />
            </label>
            <button
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => toast(`Saved "${activeTemplate.name}" template in local demo state.`, "success")}
              type="button"
            >
              Save template draft
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
