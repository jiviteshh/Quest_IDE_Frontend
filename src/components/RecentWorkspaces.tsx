/**
 * RecentWorkspaces.tsx
 * ─────────────────────────────────────────────────────────────
 * Displays recent workspaces on the landing page.
 * Clicking restores the workspace from localStorage.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useState } from "react";
import {
  type RecentWorkspace,
  getRecentWorkspaces,
} from "@/src/lib/workspace-storage";

type RecentWorkspacesProps = {
  onSelect: (workspace: RecentWorkspace) => void;
};

function difficultyColor(difficulty: string) {
  const d = difficulty.toLowerCase();
  if (d === "easy") return "text-emerald-400";
  if (d === "medium") return "text-amber-400";
  if (d === "hard") return "text-rose-400";
  return "text-zinc-400";
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

export default function RecentWorkspaces({
  onSelect,
}: RecentWorkspacesProps) {
  const [workspaces] = useState<RecentWorkspace[]>(() =>
    typeof window !== "undefined" ? getRecentWorkspaces() : [],
  );

  if (workspaces.length === 0) return null;

  return (
    <section className="mt-5">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Recent Workspaces
      </h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {workspaces.map((ws, index) => (
          <button
            key={`${ws.title}-${index}`}
            type="button"
            onClick={() => onSelect(ws)}
            className="group flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-left transition hover:border-zinc-600 hover:bg-zinc-800/60"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-zinc-100">
                {ws.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[11px]">
                <span className={`font-semibold ${difficultyColor(ws.difficulty)}`}>
                  {ws.difficulty}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-500">{ws.language}</span>
              </div>
            </div>
            <span className="shrink-0 text-[11px] text-zinc-600">
              {timeAgo(ws.lastEdited)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
