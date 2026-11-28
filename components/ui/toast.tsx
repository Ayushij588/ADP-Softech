"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastTone = "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  toast: (message: string, tone?: ToastTone) => void;
};

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Individual Toast ─────────────────────────────────────────────────────────

const toneStyles: Record<ToastTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error:   "border-rose-200   bg-rose-50   text-rose-900",
  info:    "border-blue-200   bg-blue-50   text-blue-900",
  warning: "border-amber-200  bg-amber-50  text-amber-900",
};

const toneIcons: Record<ToastTone, string> = {
  success: "✓",
  error:   "✕",
  info:    "ℹ",
  warning: "⚠",
};

function ToastItem({ message, tone, onDismiss }: { message: string; tone: ToastTone; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      aria-live="polite"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg text-sm animate-in fade-in slide-in-from-right-4 duration-200 ${toneStyles[tone]}`}
      role="status"
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-base font-bold leading-none">
        {toneIcons[tone]}
      </span>
      <p className="flex-1 leading-5">{message}</p>
      <button
        aria-label="Dismiss notification"
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
        onClick={onDismiss}
        type="button"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    counter.current += 1;
    const id = `toast-${counter.current}`;
    setToasts((current) => [...current, { id, message, tone }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container — fixed bottom-right, stacks upward */}
      <div
        aria-label="Notifications"
        className="fixed bottom-5 right-4 z-[9999] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2.5"
        role="region"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} message={t.message} tone={t.tone} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
