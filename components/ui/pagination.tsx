"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const buttonClasses =
  "rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const hasPages = totalPages > 0;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <button
        className={buttonClasses}
        disabled={!hasPages || currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        Previous
      </button>
      <span aria-live="polite" className="text-sm text-slate-600">
        {hasPages ? `Page ${currentPage} of ${totalPages}` : "No pages"}
      </span>
      <button
        className={buttonClasses}
        disabled={!hasPages || currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        Next
      </button>
    </nav>
  );
}
