"use client";

import { useMemo, useState } from "react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  AdminManagementRecord,
  AdminRecordColumn,
} from "@/constants/admin-content";
import Link from "next/link";

type ManagementRecordsViewProps = {
  eyebrow: string;
  title: string;
  description: string;
  records: readonly AdminManagementRecord[];
  columns: readonly AdminRecordColumn[];
  searchLabel: string;
  detailHrefPrefix?: string;
};

const pageSize = 5;

const statusTones: Record<
  string,
  "neutral" | "success" | "warning" | "hold" | "danger" | "closed" | "info"
> = {
  active: "success",
  available: "success",
  published: "success",
  shortlisted: "info",
  reviewed: "info",
  "interview scheduled": "info",
  new: "info",
  "in review": "warning",
  "needs review": "warning",
  draft: "neutral",
  closed: "closed",
  "on hold": "hold",
  rejected: "danger",
};

function getStatusTone(status: string) {
  return statusTones[status.toLowerCase()] ?? "neutral";
}

export function ManagementRecordsView({
  eyebrow,
  title,
  description,
  records,
  columns,
  searchLabel,
  detailHrefPrefix,
}: ManagementRecordsViewProps) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) return records;

    return records.filter((record) =>
      Object.values(record).some((value) =>
        value.toLowerCase().includes(searchTerm),
      ),
    );
  }, [query, records]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const visibleRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const tableColumns: DataTableColumn<AdminManagementRecord>[] = columns.map(
    (column) => ({
      key: column.key,
      header: column.header,
      render: (record) =>
        column.kind === "status" ? (
          <StatusBadge
            label={record[column.key]}
            tone={getStatusTone(record[column.key])}
          />
        ) : (
          <span className="whitespace-nowrap">{record[column.key] || "—"}</span>
        ),
    }),
  );
  if (detailHrefPrefix) {
    tableColumns.push({
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (record) => (
        <Link className="rounded-md px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50" href={`${detailHrefPrefix}/${record.id}`}>
          View details
        </Link>
      ),
    });
  }

  function updateSearch(value: string) {
    setQuery(value);
    setCurrentPage(1);
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
        </div>
        <StatusBadge label="Sample data · not live" tone="info" />
      </header>

      <section
        aria-label={`${title} records`}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SearchBar
            className="w-full sm:max-w-sm"
            label={searchLabel}
            onChange={updateSearch}
            placeholder={`Search ${searchLabel.toLowerCase()}...`}
            value={query}
          />
          <p aria-live="polite" className="text-sm text-slate-500" role="status">
            Showing {filteredRecords.length} of {records.length} records
          </p>
        </div>

        <div className="mt-5">
          <DataTable
            caption={title}
            columns={tableColumns}
            emptyDescription="Try a different search term."
            emptyTitle={`No ${title.toLowerCase()} found`}
            getRowKey={(record) => record.id}
            rows={visibleRecords}
          />
        </div>

        {totalPages > 1 && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </section>
      <p className="mt-4 text-xs text-slate-500">
        Records shown are illustrative sample data for the admin interface.
      </p>
    </main>
  );
}
