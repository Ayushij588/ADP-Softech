"use client";

import { useRef, useState } from "react";
import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import { WebsiteContentFormDialog } from "@/components/super-admin/website-content-form-dialog";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { websiteContentSections } from "@/constants/super-admin-content";
import type { WebsiteContentValues } from "@/lib/admin-form-schemas";
import type { WebsiteContentRecord } from "@/components/super-admin/website-content-form-dialog";

const initialContent: WebsiteContentRecord[] = websiteContentSections.map(
  (section) => ({
    ...section,
    content: `Sample website copy for the ${section.section} section. This text is illustrative and can be edited in the local demo form.`,
  }),
);

const columns: DataTableColumn<WebsiteContentRecord>[] = [
  {
    key: "section",
    header: "Section",
    render: (section) => (
      <span className="font-semibold text-slate-900">{section.section}</span>
    ),
  },
  {
    key: "path",
    header: "Page path",
    render: (section) => (
      <span className="font-mono text-xs text-slate-600">{section.path}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (section) => (
      <StatusBadge
        label={section.status}
        tone={section.status === "Published" ? "success" : "warning"}
      />
    ),
  },
  {
    key: "lastUpdated",
    header: "Last updated",
    render: (section) => (
      <span className="whitespace-nowrap">{section.lastUpdated}</span>
    ),
  },
  {
    key: "updatedBy",
    header: "Updated by",
    render: (section) => section.updatedBy,
  },
];

export function WebsiteContentManagementView() {
  const [sections, setSections] = useState(initialContent);
  const [activeRecord, setActiveRecord] = useState<
    WebsiteContentRecord | null | undefined
  >(undefined);
  const [feedback, setFeedback] = useState("");
  const nextSectionNumber = useRef(6);

  function saveContent(values: WebsiteContentValues) {
    if (activeRecord) {
      setSections((currentSections) =>
        currentSections.map((section) =>
          section.id === activeRecord.id
            ? {
                ...section,
                ...values,
                lastUpdated: "Just now",
                updatedBy: "Demo Admin",
              }
            : section,
        ),
      );
      setFeedback(`${values.section} was updated in the temporary demo list.`);
    } else {
      const id = `WEB-${String(nextSectionNumber.current).padStart(2, "0")}`;
      nextSectionNumber.current += 1;
      setSections((currentSections) => [
        {
          id,
          ...values,
          lastUpdated: "Just now",
          updatedBy: "Demo Admin",
        },
        ...currentSections,
      ]);
      setFeedback(`${values.section} was added to the temporary demo list.`);
    }

    setActiveRecord(undefined);
  }

  const contentColumns: DataTableColumn<WebsiteContentRecord>[] = [
    ...columns,
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (section) => (
        <button
          className="whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
          onClick={() => {
            setFeedback("");
            setActiveRecord(section);
          }}
          type="button"
        >
          Edit content
        </button>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Review public website sections and manage sample copy locally."
        title="Website Content Management"
      />
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Managed website sections
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Content changes stay in this page’s temporary demo state.
            </p>
          </div>
          <button
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            onClick={() => {
              setFeedback("");
              setActiveRecord(null);
            }}
            type="button"
          >
            Add content section
          </button>
        </div>
        {feedback && (
          <p
            className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"
            role="status"
          >
            {feedback}
          </p>
        )}
        <DataTable
          caption="Website content sections"
          columns={contentColumns}
          getRowKey={(section) => section.id}
          rows={sections}
        />
      </section>
      {activeRecord !== undefined && (
        <WebsiteContentFormDialog
          key={activeRecord?.id ?? "new-content"}
          onClose={() => setActiveRecord(undefined)}
          onSave={saveContent}
          record={activeRecord ?? undefined}
        />
      )}
    </main>
  );
}
