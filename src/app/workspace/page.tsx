/**
 * workspace/page.tsx
 * ─────────────────────────────────────────────────────────────
 * Main workspace page — integrates ALL new features safely:
 *
 * - Resizable panels (via updated WorkspaceLayout)
 * - Keyboard shortcuts (Ctrl+Enter, Ctrl+Shift+Enter)
 * - Code autosave + restore
 * - AI assistant panel (isolated from execution)
 * - Submission history (localStorage)
 * - Toast notifications (copy, status)
 * - Execution progress visualization
 * - Recent workspace tracking
 *
 * CRITICAL: All existing execution flow is PRESERVED.
 * - useCodingWorkspace hook is untouched
 * - API calls are unchanged
 * - Testcase schema is unchanged
 * - Parser output is unchanged
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import EditorPanel from "@/src/components/EditorPanel";
import ProblemPanel from "@/src/components/ProblemPanel";
import VerdictPanel from "@/src/components/VerdictPanel";
import WorkspaceLayout from "@/src/components/WorkspaceLayout";
import ToastContainer from "@/src/components/ToastContainer";
import { useCodingWorkspace } from "@/src/hooks/useCodingWorkspace";
import { useKeyboardShortcuts } from "@/src/hooks/useKeyboardShortcuts";
import { useAutosave } from "@/src/hooks/useAutosave";
import { useSubmissionHistory } from "@/src/hooks/useSubmissionHistory";
import { useToast } from "@/src/hooks/useToast";
import { getParsedProblem, type StoredProblem } from "@/src/lib/problem-storage";
import { addRecentWorkspace, type AutosaveData } from "@/src/lib/workspace-storage";
import { verdictFromSubmissionResult } from "@/src/lib/execution-status";
import type { ParsedProblem, ParsedTestcase, SubmissionTestcase } from "@/src/types/judge";

const AIPanel = dynamic(() => import("@/src/components/AIPanel"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-xs text-zinc-400">
      Loading QuestIDE AI...
    </div>
  ),
});

/* ── Stable hydration helpers ────────────────────────────────── */
const emptySubscribe = () => () => {};
const getHydratedClient = () => true;
const getHydratedServer = () => false;

/* ── Cached problem snapshot ─────────────────────────────────── */
const STORAGE_KEY = "ai-coding-platform:parsed-problem";
let _cachedRaw: string | null = null;
let _cachedProblem: StoredProblem | null = null;

function getCachedProblem(): StoredProblem | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== _cachedRaw) {
    _cachedRaw = raw;
    _cachedProblem = raw ? (getParsedProblem() ?? null) : null;
  }
  return _cachedProblem;
}

const getProblemServer = () => null;

/* ── Helpers ─────────────────────────────────────────────────── */
function toProblemPanelData(problem: StoredProblem | null): ParsedProblem | null {
  if (!problem) return null;
  return {
    title: problem.title,
    difficulty: problem.difficulty,
    description: problem.description,
    constraints: problem.constraints,
    examples: problem.examples,
    testcases: problem.testcases,
  };
}

export default function WorkspacePage() {
  const router = useRouter();
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    getHydratedClient,
    getHydratedServer,
  );
  const storedProblem = useSyncExternalStore(
    emptySubscribe,
    getCachedProblem,
    getProblemServer,
  );

  // ─── Core workspace state (UNCHANGED) ───────────────────
  const {
    languages,
    selectedLanguage,
    selectedLanguageId,
    setSelectedLanguageId,
    sourceCode,
    updateCode,
    stdin,
    setStdin,
    runResult,
    runSuiteResult,
    runVerdict,
    submission,
    runError,
    submitError,
    isRunning,
    isSubmitting,
    loadLanguages,
    executeRunCode,
    executeSubmitCode,
    executeCustomInput,
    applyStarterCode,
  } = useCodingWorkspace();

  // ─── NEW: Toast notifications ───────────────────────────
  const { toasts, showToast, dismissToast } = useToast();

  // ─── NEW: Submission history ────────────────────────────
  const { recordSubmission } = useSubmissionHistory();

  // ─── Existing effects (UNCHANGED) ──────────────────────
  useEffect(() => {
    if (isHydrated && !storedProblem) {
      router.replace("/");
    }
  }, [router, storedProblem, isHydrated]);

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  useEffect(() => {
    if (!storedProblem) return;
    applyStarterCode(storedProblem.starterCodeByLanguage);
  }, [applyStarterCode, storedProblem]);

  // ─── NEW: Track recent workspace ───────────────────────
  useEffect(() => {
    if (!storedProblem) return;
    addRecentWorkspace({
      title: storedProblem.title,
      difficulty: storedProblem.difficulty,
      language: selectedLanguage?.label ?? "Python",
      languageId: selectedLanguageId,
      lastEdited: Date.now(),
      problem: storedProblem,
    });
  }, [storedProblem, selectedLanguage?.label, selectedLanguageId]);

  // ─── NEW: Record submission in history ─────────────────
  useEffect(() => {
    if (!submission || !storedProblem) return;
    const verdict = verdictFromSubmissionResult(submission);
    recordSubmission({
      problemTitle: storedProblem.title,
      language: selectedLanguage?.label ?? "Unknown",
      languageId: selectedLanguageId,
      verdict: verdict ?? submission.verdict ?? "Unknown",
      passedCount: submission.passed_count ?? submission.passed_testcases ?? 0,
      totalCount: submission.total_count ?? submission.total_testcases ?? 0,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submission]);

  // ─── Memos (UNCHANGED) ────────────────────────────────
  const problemForPanel = useMemo(() => toProblemPanelData(storedProblem), [storedProblem]);

  // ALL testcases (visible + hidden) — used for Submit
  const allTestcases: SubmissionTestcase[] = useMemo(
    () => {
      const all = storedProblem?.testcases ?? [];
      return all.map((tc) => ({
        id: tc.id,
        display_input: tc.display_input,
        display_output: tc.display_output,
        stdin: tc.stdin ?? "",
        expected_output: tc.expected_output ?? "",
        is_hidden: tc.is_hidden ?? false,
      }));
    },
    [storedProblem],
  );

  // VISIBLE testcases only — used for Run Code
  const visibleTestcases: SubmissionTestcase[] = useMemo(
    () => allTestcases.filter((tc) => !tc.is_hidden),
    [allTestcases],
  );

  // ParsedTestcase[] for the testcase selector in EditorPanel
  const publicTestcases: ParsedTestcase[] = useMemo(
    () => storedProblem?.publicTestcases ?? [],
    [storedProblem],
  );

  // ─── NEW: Run/Submit callbacks for keyboard shortcuts ──
  const handleRun = useCallback(() => {
    executeRunCode(visibleTestcases);
  }, [executeRunCode, visibleTestcases]);

  const handleSubmit = useCallback(() => {
    executeSubmitCode(allTestcases);
  }, [executeSubmitCode, allTestcases]);

  // ─── NEW: Keyboard shortcuts ───────────────────────────
  useKeyboardShortcuts({
    onRun: handleRun,
    onSubmit: handleSubmit,
    enabled: isHydrated && !!problemForPanel,
  });

  // ─── NEW: Autosave (debounced, non-blocking) ──────────
  useAutosave({
    problemTitle: storedProblem?.title ?? "",
    selectedLanguageId,
    codeByLanguage: useMemo(
      () => ({ [selectedLanguageId]: sourceCode }),
      [selectedLanguageId, sourceCode],
    ),
    stdin,
    enabled: isHydrated && !!storedProblem,
    onRestore: useCallback(
      (data: AutosaveData) => {
        if (data.selectedLanguageId) {
          setSelectedLanguageId(data.selectedLanguageId);
        }
        if (data.codeByLanguage) {
          const code = data.codeByLanguage[data.selectedLanguageId];
          if (code) updateCode(code);
        }
        if (data.stdin) setStdin(data.stdin);
      },
      [setSelectedLanguageId, updateCode, setStdin],
    ),
  });

  // ─── NEW: Failed testcase for AI bug finder ───────────
  const failedTestcase = useMemo(() => {
    const source = submission ?? runSuiteResult;
    if (!source) return null;
    const results =
      source.testcases ??
      source.results?.map((tc) => ({
        input: "",
        expected_output: tc.expected_output ?? "",
        actual_output: tc.stdout ?? "",
        stdout: tc.stdout,
        passed: tc.status === "Passed",
        is_hidden: tc.is_hidden,
      })) ??
      [];
    const failed = results.find((tc) => !tc.passed && !tc.is_hidden);
    if (!failed) return null;
    return {
      input: failed.input ?? "",
      expected_output: failed.expected_output ?? "",
      actual_output: failed.actual_output ?? failed.stdout ?? "",
    };
  }, [runSuiteResult, submission]);

  const lastVerdict = useMemo(() => {
    if (submission) return verdictFromSubmissionResult(submission);
    if (runSuiteResult) return verdictFromSubmissionResult(runSuiteResult);
    return runVerdict;
  }, [runSuiteResult, runVerdict, submission]);

  // ─── Loading state ────────────────────────────────────
  if (!isHydrated || !problemForPanel) {
    return (
      <main className="grid min-h-0 flex-1 place-items-center overflow-hidden bg-zinc-950 text-zinc-300">
        <div className="flex items-center gap-3">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          <p className="text-sm">Loading workspace...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <WorkspaceLayout
        left={
          <ProblemPanel
            problem={problemForPanel}
            onCopySuccess={(msg) => showToast(msg, "success")}
          />
        }
        center={
          <div className="flex h-full min-h-0 min-w-0 flex-col gap-2 overflow-hidden">
            <div className="min-h-[280px] min-w-0 flex-[1_1_0] overflow-hidden">
              <EditorPanel
                selectedLanguageId={selectedLanguageId}
                selectedMonacoLanguage={selectedLanguage?.monacoLanguage}
                languages={languages}
                sourceCode={sourceCode}
                stdin={stdin}
                onChangeLanguage={setSelectedLanguageId}
                onChangeCode={updateCode}
                onChangeStdin={setStdin}
                onRun={handleRun}
                onSubmit={handleSubmit}
                publicTestcases={publicTestcases}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
              />
            </div>
            <div className="min-h-[220px] min-w-0 flex-[0_0_38%] overflow-hidden">
              <VerdictPanel
                runResult={runResult}
                runVerdict={runVerdict}
                runError={runError}
                runSuiteResult={runSuiteResult}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                submission={submission}
                submitError={submitError}
                visibleTestcases={publicTestcases}
                customStdin={stdin}
                onChangeCustomStdin={setStdin}
                onRunCustomInput={() => executeCustomInput()}
              />
            </div>
          </div>
        }
        assistant={
          <AIPanel
            key={storedProblem?.title ?? "Workspace"}
            problemTitle={storedProblem?.title ?? "Workspace"}
            problemDescription={storedProblem?.description ?? ""}
            userCode={sourceCode}
            language={selectedLanguage?.label ?? "Python"}
            runResult={runResult}
            runSuiteResult={runSuiteResult}
            submitResult={submission}
            lastVerdict={lastVerdict}
            failedTestcase={failedTestcase}
          />
        }
      />

      {/* ── Toast Notifications ───────────────────────── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
