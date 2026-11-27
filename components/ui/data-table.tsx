import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];
  getRowKey: (row: T) => string | number;
  caption?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  caption = "Data table",
  isLoading = false,
  loadingLabel = "Loading table data",
  emptyTitle = "No records",
  emptyDescription = "There is no data to display yet.",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div
        aria-busy="true"
        className="flex min-h-48 items-center justify-center rounded-xl border border-slate-200 bg-white"
      >
        <LoadingSpinner label={loadingLabel} />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    /* The outer div scrolls horizontally on small screens so tables never
       push the page wider than the viewport. */
    <div className="-mx-0 overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[36rem] divide-y divide-slate-200 text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((column) => (
              <th
                className={`px-4 py-3 font-semibold first:pl-5 last:pr-5 ${column.className ?? ""}`}
                key={column.key}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr className="text-slate-700 hover:bg-slate-50/60 transition-colors" key={getRowKey(row)}>
              {columns.map((column) => (
                <td
                  className={`px-4 py-3 first:pl-5 last:pr-5 ${column.className ?? ""}`}
                  key={column.key}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
