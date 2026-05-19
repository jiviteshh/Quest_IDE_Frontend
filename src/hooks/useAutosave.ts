/**
 * useAutosave.ts
 * ─────────────────────────────────────────────────────────────
 * Debounced autosave of workspace state to localStorage.
 * Restores on mount if a matching problem is found.
 *
 * Does NOT touch execution flow or testcase schema.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  type AutosaveData,
  getAutosaveData,
  saveAutosaveData,
} from "@/src/lib/workspace-storage";

type UseAutosaveOptions = {
  problemTitle: string;
  selectedLanguageId: number;
  codeByLanguage: Record<number, string>;
  stdin: string;
  /** Called when restore data is found matching the current problem */
  onRestore?: (data: AutosaveData) => void;
  /** Debounce interval in ms (default 3000) */
  intervalMs?: number;
  enabled?: boolean;
};

export function useAutosave({
  problemTitle,
  selectedLanguageId,
  codeByLanguage,
  stdin,
  onRestore,
  intervalMs = 3000,
  enabled = true,
}: UseAutosaveOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoredRef = useRef(false);

  // Restore on mount (once)
  useEffect(() => {
    if (!enabled || restoredRef.current || !problemTitle) return;
    restoredRef.current = true;

    const saved = getAutosaveData();
    if (
      saved &&
      saved.problemTitle === problemTitle &&
      saved.codeByLanguage &&
      Object.keys(saved.codeByLanguage).length > 0
    ) {
      onRestore?.(saved);
    }
  }, [enabled, problemTitle, onRestore]);

  // Debounced save
  const scheduleSave = useCallback(() => {
    if (!enabled || !problemTitle) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      saveAutosaveData({
        problemTitle,
        selectedLanguageId,
        codeByLanguage,
        stdin,
        savedAt: Date.now(),
      });
    }, intervalMs);
  }, [enabled, problemTitle, selectedLanguageId, codeByLanguage, stdin, intervalMs]);

  // Trigger save whenever deps change
  useEffect(() => {
    scheduleSave();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scheduleSave]);
}
