"use client";

import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { downloadXlsx } from "@/lib/xlsx-export";
import { platformAuditLogs } from "@/constants/super-admin-content";

type AuditLogRow = (typeof platformAuditLogs)[number];

const pageSize = 5;

export function AuditLogView() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("");
  const [actor, setActor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogRow | null>(null);

  const actions = useMemo(() => [...new Set(platformAuditLogs.map((log) => log.action))], []);
  const actors = useMemo(() => [...new Set(platformAuditLogs.map((log) => log.actor))].sort(), []);

  const filtered = useMemo(
    () =>
      platformAuditLogs.filter((log) => {
        const matchesAction = !action || log.action === action;
        const matchesActor = !actor || log.actor === actor;
        const matchesQuery =
          !query ||
          Object.values(log).some((v) =>
            String(v).toLowerCase().includes(query.toLowerCase()),
          );
        const matchesStart = !startDate || log.dateIso >= startDate;
        const matchesEnd = !endDate || log.dateIso <= endDate;
        return matchesAction && matchesActor && matchesQuery && matchesStart && matchesEnd;
      }),
    [action, actor, query, startDate, endDate],
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const visibleLogs = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: DataTableColumn<AuditLogRow>[] = [
    { key: "id", header: "Event ID", render: (log) => <span className="font-mono text-xs text-slate-500">{log.id}</span> },
    { key: "timestamp", header: "Date & time", render: (log) => <span className="whitespace-nowrap">{log.timestamp}</span> },
    { key: "actor", header: "User", render: (log) => <span className="whitespace-nowrap font-medium text-slate-900">{log.actor}</span> },
    { key: "action", header: "Action", render: (log) => log.action },
    { key: "resource", header: "Resource", render: (log) => log.resource },
    {
      key: "source",
      header: "Source",
      render: (log) =>
        log.source === "Automated" ? (
          <StatusBadge label="Automated" tone="neutral" />
        ) : (
          <span className="font-mono text-xs">{log.source}</span>
        ),
    },
    {
      key: "actions",
      header: "Details",
      className: "text-right",
      render: (log) => (
        <button
          className="rounded-md px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
          onClick={() => setSelectedLog(log)}
          type="button"
        >
          Inspect
        </button>
      ),
    },
  ];

  function exportXlsx() {
    const rows = filtered.map((log) => [log.id, log.timestamp, log.actor, log.action, log.resource, log.source]);
    const header = ["Event ID", "Timestamp", "Actor", "Action", "Resource", "Source"];
    downloadXlsx("adp-softech-audit-log.xlsx", "Audit Log", header, rows);
    toast(`${filtered.length} audit log entries exported as XLSX.`, "success");
  }

  function clearFilters() {
    setQuery("");
    setAction("");
    setActor("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  }

  const selectClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Platform administration</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950">Audit Logs</h1>
      <p className="mt-2 text-sm text-slate-600">
        Track sensitive platform actions including role updates, job publications, exports, and automated ATS runs.
      </p>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <label className="block text-sm font-medium text-slate-700">
            Search audit events
            <input
              className={selectClass}
              onChange={(e) => {
                setQuery(e.currentTarget.value);
                setCurrentPage(1);
              }}
              placeholder="Event ID, actor, or resource"
              type="search"
              value={query}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            User / Actor
            <select
              className={selectClass}
              onChange={(e) => {
                setActor(e.currentTarget.value);
                setCurrentPage(1);
              }}
              value={actor}
            >
              <option value="">All users</option>
              {actors.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Action
            <select
              className={selectClass}
              onChange={(e) => {
                setAction(e.currentTarget.value);
                setCurrentPage(1);
              }}
              value={action}
            >
              <option value="">All actions</option>
              {actions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Date from
            <input
              className={selectClass}
              max={endDate || undefined}
              onChange={(e) => {
                setStartDate(e.currentTarget.value);
                setCurrentPage(1);
              }}
              type="date"
              value={startDate}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Date to
            <input
              className={selectClass}
              min={startDate || undefined}
              onChange={(e) => {
                setEndDate(e.currentTarget.value);
                setCurrentPage(1);
              }}
              type="date"
              value={endDate}
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <p aria-live="polite" className="text-sm text-slate-500" role="status">
              Showing {filtered.length} of {platformAuditLogs.length} entries
            </p>
            {(query || action || actor || startDate || endDate) && (
              <button className="text-sm font-medium text-blue-700 hover:text-blue-900" onClick={clearFilters} type="button">
                Clear filters
              </button>
            )}
          </div>
          <button
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={exportXlsx}
            type="button"
          >
            ↓ Export XLSX
          </button>
        </div>
        <div className="mt-5">
          <DataTable
            caption="Platform audit log"
            columns={columns}
            emptyDescription="No audit events match your current filters. Try adjusting the search query, user, action type, or date range."
            emptyTitle="No audit events found"
            getRowKey={(log) => log.id}
            rows={visibleLogs}
          />
        </div>
        {totalPages > 1 && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages} />
          </div>
        )}
      </section>

      {selectedLog && (
        <FormDialog
          description="Immutable security & operational audit trail record (demo snapshot)."
          onClose={() => setSelectedLog(null)}
          title={`Audit Event · ${selectedLog.id}`}
        >
          <dl className="grid gap-4 px-5 py-6 sm:grid-cols-2 sm:px-7">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Timestamp</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{selectedLog.timestamp}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">ISO Date</dt>
              <dd className="mt-1 font-mono text-sm text-slate-900">{selectedLog.dateIso}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Actor</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{selectedLog.actor}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Source IP / System</dt>
              <dd className="mt-1 font-mono text-sm text-slate-900">{selectedLog.source}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Action</dt>
              <dd className="mt-1 text-sm text-slate-900">{selectedLog.action}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Target resource</dt>
              <dd className="mt-1 text-sm text-slate-900">{selectedLog.resource}</dd>
            </div>
          </dl>
          <div className="flex justify-end border-t border-slate-100 px-5 py-4 sm:px-7">
            <button
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              onClick={() => setSelectedLog(null)}
              type="button"
            >
              Close
            </button>
          </div>
        </FormDialog>
      )}
    </main>
  );
}
