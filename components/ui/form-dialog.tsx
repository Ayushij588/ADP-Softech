"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type FormDialogProps = {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
  maxWidthClassName?: string;
};

export function FormDialog({
  title,
  description,
  onClose,
  children,
  maxWidthClassName = "max-w-xl",
}: FormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={`m-auto max-h-[90vh] w-[calc(100%-2rem)] ${maxWidthClassName} overflow-y-auto rounded-2xl bg-white p-0 text-slate-950 shadow-2xl backdrop:bg-slate-950/50`}
      onClose={onClose}
      ref={dialogRef}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-7">
        <div>
          <h2
            className="text-xl font-semibold tracking-tight"
            id={titleId}
          >
            {title}
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-600" id={descriptionId}>
            {description}
          </p>
        </div>
        <button
          aria-label="Close dialog"
          className="shrink-0 rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          onClick={() => dialogRef.current?.close()}
          type="button"
        >
          Close
        </button>
      </div>
      {children}
    </dialog>
  );
}
