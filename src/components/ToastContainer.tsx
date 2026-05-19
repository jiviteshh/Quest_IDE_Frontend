/**
 * ToastContainer.tsx
 * ─────────────────────────────────────────────────────────────
 * Renders toast notifications in a fixed overlay.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import type { ToastMessage } from "@/src/hooks/useToast";

type ToastContainerProps = {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
};

const toneClasses: Record<ToastMessage["type"], string> = {
  success:
    "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
  error: "border-rose-500/40 bg-rose-500/15 text-rose-200",
  info: "border-indigo-500/40 bg-indigo-500/15 text-indigo-200",
};

const toneIcons: Record<ToastMessage["type"], string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

export default function ToastContainer({
  toasts,
  onDismiss,
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium shadow-lg backdrop-blur-sm transition-all duration-300 animate-in slide-in-from-right ${toneClasses[toast.type]}`}
          style={{
            animation: "slideInRight 0.25s ease-out",
          }}
        >
          <span className="text-sm">{toneIcons[toast.type]}</span>
          <span>{toast.text}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="ml-2 opacity-60 transition hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
