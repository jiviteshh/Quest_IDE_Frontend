/**
 * useToast.ts
 * ─────────────────────────────────────────────────────────────
 * Lightweight toast notification system. No external library.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useCallback, useState } from "react";

export type ToastMessage = {
  id: string;
  text: string;
  type: "success" | "error" | "info";
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (text: string, type: ToastMessage["type"] = "success", durationMs = 2500) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, text, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, durationMs);
    },
    [],
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}
