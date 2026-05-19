/**
 * useSubmissionHistory.ts
 * ─────────────────────────────────────────────────────────────
 * Local submission history tracking via localStorage.
 *
 * Does NOT require backend DB.
 * Does NOT touch execution flow.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useCallback, useState } from "react";
import {
  type SubmissionRecord,
  addSubmissionRecord,
  getSubmissionHistory,
} from "@/src/lib/workspace-storage";

export function useSubmissionHistory() {
  const [history, setHistory] = useState<SubmissionRecord[]>(() => {
    if (typeof window === "undefined") return [];
    return getSubmissionHistory();
  });

  const recordSubmission = useCallback(
    (record: Omit<SubmissionRecord, "id" | "timestamp">) => {
      const full: SubmissionRecord = {
        ...record,
        id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
      };
      addSubmissionRecord(full);
      setHistory(getSubmissionHistory());
    },
    [],
  );

  const refreshHistory = useCallback(() => {
    setHistory(getSubmissionHistory());
  }, []);

  return { history, recordSubmission, refreshHistory };
}
