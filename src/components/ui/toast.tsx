"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";

export type ToastVariant = "success" | "error";

interface ToastProps {
  open: boolean;
  message: string;
  variant?: ToastVariant;
}

export function Toast({ open, message, variant = "success" }: ToastProps) {
  if (!open) return null;

  const isSuccess = variant === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50"
    >
      <div
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold shadow-lg ${
          isSuccess
            ? "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]"
            : "border-[var(--border-strong)] bg-[var(--bg-accent-soft)] text-[var(--text-primary)]"
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="h-4 w-4 text-[var(--action-primary)]" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-[var(--action-primary)]" aria-hidden="true" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}
