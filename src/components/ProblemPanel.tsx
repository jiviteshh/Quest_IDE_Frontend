/**
 * ProblemPanel.tsx
 * ─────────────────────────────────────────────────────────────
 * Displays the parsed problem with:
 * - Difficulty color badges (Easy=green, Medium=amber, Hard=red)
 * - Copy Input / Copy Output buttons per testcase
 * - Clean empty states
 *
 * Does NOT modify parser schema or testcase contracts.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useCallback } from "react";
import type { ParsedProblem } from "@/src/types/judge";

type ProblemPanelProps = {
  problem: ParsedProblem;
  onCopySuccess?: (text: string) => void;
};

function difficultyClassName(difficulty: ParsedProblem["difficulty"]) {
  const normalized = String(difficulty ?? "").toLowerCase();
  if (normalized === "easy") return "border-emerald-500/25 bg-emerald-500/10 text-emerald-300";
  if (normalized === "medium") return "border-amber-500/25 bg-amber-500/10 text-amber-300";
  return "border-rose-500/25 bg-rose-500/10 text-rose-300";
}

function difficultyDot(difficulty: ParsedProblem["difficulty"]) {
  const normalized = String(difficulty ?? "").toLowerCase();
  if (normalized === "easy") return "bg-emerald-400";
  if (normalized === "medium") return "bg-amber-400";
  return "bg-rose-400";
}

function CopyButton({ text, label, onSuccess }: { text: string; label: string; onSuccess?: (msg: string) => void }) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      onSuccess?.(`${label} copied to clipboard`);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      onSuccess?.(`${label} copied to clipboard`);
    }
  }, [text, label, onSuccess]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Copy ${label}`}
      className="rounded border border-zinc-700 bg-zinc-800/50 px-1.5 py-0.5 text-[10px] text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200 active:scale-95"
    >
      📋 {label}
    </button>
  );
}

export default function ProblemPanel({ problem, onCopySuccess }: ProblemPanelProps) {
  const publicCases = (problem.testcases ?? []).filter((tc) => !tc.is_hidden);
  const hiddenCount = (problem.testcases ?? []).filter((tc) => tc.is_hidden).length;

  return (
    <aside className="h-full min-h-0 overflow-auto rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h1 className="text-lg font-semibold text-zinc-100">{problem.title}</h1>
        <span className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${difficultyClassName(problem.difficulty)}`}>
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${difficultyDot(problem.difficulty)}`} />
          {problem.difficulty ?? "Unknown"}
        </span>
      </div>

      <section className="mb-5">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Description</h2>
        <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-200">{problem.description ?? "No description provided."}</p>
      </section>

      {(problem.constraints ?? []).length > 0 && (
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Constraints</h2>
          <ul className="space-y-2 text-sm text-zinc-200">
            {(problem.constraints ?? []).map((constraint) => (
              <li key={constraint} className="rounded-md border border-zinc-800 bg-zinc-950/50 px-3 py-2">
                {constraint}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Public Testcases</h2>
          <p className="text-[11px] text-zinc-500">{hiddenCount} hidden testcase(s) used on submit</p>
        </div>
        <div className="space-y-3">
          {(publicCases.length ? publicCases : (problem.examples ?? []).map((example, index) => ({
            id: index + 1,
            display_input: example.input,
            display_output: example.output,
            stdin: example.input,
            expected_output: example.output,
            is_hidden: false,
          }))).map((example, index) => (
            <article key={`${index}-${example.display_input}`} className="rounded-md border border-zinc-800 bg-zinc-950/60 p-3">
              <p className="mb-2 text-xs font-semibold text-zinc-300">Example {index + 1}</p>
              
              <div className="mb-2">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs text-zinc-400">Input</p>
                  <CopyButton text={example.display_input} label="Input" onSuccess={onCopySuccess} />
                </div>
                <pre className="whitespace-pre-wrap rounded border border-zinc-800 bg-zinc-900/50 px-2 py-1.5 text-xs text-zinc-100">{example.display_input}</pre>
              </div>
              
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs text-zinc-400">Output</p>
                  <CopyButton text={example.display_output} label="Output" onSuccess={onCopySuccess} />
                </div>
                <pre className="whitespace-pre-wrap rounded border border-zinc-800 bg-zinc-900/50 px-2 py-1.5 text-xs text-zinc-100">{example.display_output}</pre>
              </div>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}
