/**
 * workspace-storage.ts
 * ─────────────────────────────────────────────────────────────
 * Centralized localStorage utilities for autosave, recent
 * workspaces, submission history, and panel sizes.
 *
 * DOES NOT touch execution flow, parser, or testcase schema.
 * ─────────────────────────────────────────────────────────────
 */

import type { StoredProblem } from "@/src/lib/problem-storage";

/* ── Storage keys ────────────────────────────────────────── */
const PREFIX = "ai-coding-platform";
const KEYS = {
  autosave: `${PREFIX}:autosave`,
  recentWorkspaces: `${PREFIX}:recent-workspaces`,
  submissionHistory: `${PREFIX}:submission-history`,
  panelSizes: `${PREFIX}:panel-sizes`,
  assistantStateInitialized: `${PREFIX}:assistant-state-initialized`,
} as const;

/* ── Types ───────────────────────────────────────────────── */

export type AutosaveData = {
  problemTitle: string;
  selectedLanguageId: number;
  codeByLanguage: Record<number, string>;
  stdin: string;
  savedAt: number; // timestamp ms
};

export type RecentWorkspace = {
  title: string;
  difficulty: string;
  language: string;
  languageId: number;
  lastEdited: number; // timestamp ms
  problem?: StoredProblem;
};

export type SubmissionRecord = {
  id: string;
  problemTitle: string;
  language: string;
  languageId: number;
  verdict: string;
  passedCount: number;
  totalCount: number;
  runtime?: string | null;
  memory?: number | null;
  timestamp: number; // timestamp ms
};

export type PanelSizes = {
  /** Horizontal split: problem panel width % (0-100) */
  problemWidth: number;
  /** Vertical split: editor panel height % in the right column (0-100) */
  editorHeight: number;
  /** AI assistant sidebar width in px */
  assistantWidth: number;
  /** Whether the contextual assistant sidebar is open */
  assistantOpen: boolean;
};

/* ── Helpers ─────────────────────────────────────────────── */

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded — silently ignore
  }
}

/* ── Autosave ────────────────────────────────────────────── */

export function saveAutosaveData(data: AutosaveData) {
  safeSet(KEYS.autosave, data);
}

export function getAutosaveData(): AutosaveData | null {
  return safeGet<AutosaveData>(KEYS.autosave);
}

export function clearAutosaveData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEYS.autosave);
}

/* ── Recent Workspaces ───────────────────────────────────── */

const MAX_RECENT = 10;

export function getRecentWorkspaces(): RecentWorkspace[] {
  return (safeGet<RecentWorkspace[]>(KEYS.recentWorkspaces) ?? []).filter(
    (workspace) => Boolean(workspace.problem),
  );
}

export function addRecentWorkspace(entry: RecentWorkspace) {
  const list = getRecentWorkspaces();
  // Deduplicate by title
  const filtered = list.filter(
    (w) => w.title.toLowerCase() !== entry.title.toLowerCase(),
  );
  filtered.unshift(entry);
  safeSet(KEYS.recentWorkspaces, filtered.slice(0, MAX_RECENT));
}

/* ── Submission History ──────────────────────────────────── */

const MAX_SUBMISSIONS = 50;

export function getSubmissionHistory(): SubmissionRecord[] {
  return safeGet<SubmissionRecord[]>(KEYS.submissionHistory) ?? [];
}

export function addSubmissionRecord(record: SubmissionRecord) {
  const list = getSubmissionHistory();
  list.unshift(record);
  safeSet(KEYS.submissionHistory, list.slice(0, MAX_SUBMISSIONS));
}

/* ── Panel Sizes ─────────────────────────────────────────── */

export const DEFAULT_PANEL_SIZES: PanelSizes = {
  problemWidth: 32,
  editorHeight: 55,
  assistantWidth: 380,
  assistantOpen: false,
};

export function getPanelSizes(): PanelSizes {
  const stored = safeGet<Partial<PanelSizes>>(KEYS.panelSizes) ?? {};
  const assistantStateInitialized = safeGet<boolean>(KEYS.assistantStateInitialized);
  if (!assistantStateInitialized) {
    safeSet(KEYS.assistantStateInitialized, true);
    return {
      ...DEFAULT_PANEL_SIZES,
      ...stored,
      assistantOpen: false,
    };
  }
  return {
    ...DEFAULT_PANEL_SIZES,
    ...stored,
  };
}

export function savePanelSizes(sizes: PanelSizes) {
  safeSet(KEYS.panelSizes, sizes);
}
