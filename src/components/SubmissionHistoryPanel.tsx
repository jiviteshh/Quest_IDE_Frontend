/**
 * SubmissionHistoryPanel.tsx
 * ─────────────────────────────────────────────────────────────
 * Displays local submission history from localStorage.
 * No backend DB required.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import type { SubmissionRecord } from "@/src/lib/workspace-storage";

type SubmissionHistoryPanelProps = {
  history: SubmissionRecord[];
};

function verdictColor(verdict: string) {
  const v = verdict.toLowerCase();
  if (v === "accepted") return "text-emerald-300";
  if (v.includes("wrong")) return "text-rose-300";
  if (v.includes("runtime")) return "text-amber-300";
  if (v.includes("compilation")) return "text-orange-300";
  if (v.includes("time")) return "text-yellow-300";
  return "text-zinc-300";
}

function timeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function SubmissionHistoryPanel({
  history,
}: SubmissionHistoryPanelProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-8 text-center">
        <svg className="mb-1 h-6 w-6 text-zinc-600 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm font-medium text-zinc-400">
          No submissions yet.
        </p>
        <p className="text-xs text-zinc-500">
          Submit your solution to track your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {history.map((record) => (
        <div
          key={record.id}
          className="flex items-center justify-between gap-2 rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className={`font-semibold ${verdictColor(record.verdict)}`}>
              {record.verdict}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">{record.language}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">
              {record.passedCount}/{record.totalCount}
            </span>
          </div>
          <span className="shrink-0 text-zinc-600">
            {timeAgo(record.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}
