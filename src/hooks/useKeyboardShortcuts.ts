/**
 * useKeyboardShortcuts.ts
 * ─────────────────────────────────────────────────────────────
 * Professional keyboard shortcuts for the workspace.
 * - Ctrl+Enter → Run Code
 * - Ctrl+Shift+Enter → Submit Solution
 *
 * Does NOT modify execution flow.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect } from "react";

type UseKeyboardShortcutsOptions = {
  onRun: () => void;
  onSubmit: () => void;
  enabled?: boolean;
};

export function useKeyboardShortcuts({
  onRun,
  onSubmit,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      // Ctrl+Shift+Enter → Submit
      if (event.ctrlKey && event.shiftKey && event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        onSubmit();
        return;
      }

      // Ctrl+Enter → Run Code
      if (event.ctrlKey && !event.shiftKey && event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        onRun();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onRun, onSubmit, enabled]);
}
