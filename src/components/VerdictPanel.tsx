"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import VerdictBadge from "@/src/components/VerdictBadge";
import SubmissionHistoryPanel from "@/src/components/SubmissionHistoryPanel";
import { verdictFromSubmissionResult } from "@/src/lib/execution-status";
import { getSubmissionHistory } from "@/src/lib/workspace-storage";
import type {
  ParsedTestcase,
  RunCodeResponse,
  RunVerdict,
  SubmitCodeResponse,
  TestcaseResult,
} from "@/src/types/judge";

type VerdictPanelProps = {
  runResult: RunCodeResponse | null;
  runVerdict: RunVerdict | null;
  runError: string | null;
  runSuiteResult: SubmitCodeResponse | null;
  isRunning: boolean;
  isSubmitting: boolean;
  submission: SubmitCodeResponse | null;
  submitError: string | null;
  visibleTestcases: ParsedTestcase[];
  customStdin: string;
  onChangeCustomStdin: (value: string) => void;
  onRunCustomInput: () => void;
};

type TabKey = "testcase" | "run-result" | "submit-result" | "custom-input" | "history";

const TABS: Array<{ id: TabKey; label: string }> = [
  { id: "testcase", label: "Testcases" },
  { id: "run-result", label: "Run Result" },
  { id: "submit-result", label: "Submit Result" },
  { id: "custom-input", label: "Custom Input" },
  { id: "history", label: "History" },
];

export default function VerdictPanel({
  runResult,
  runVerdict,
  runError,
  runSuiteResult,
  isRunning,
  isSubmitting,
  submission,
  submitError,
  visibleTestcases,
  customStdin,
  onChangeCustomStdin,
  onRunCustomInput,
}: VerdictPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("testcase");
  const [submissionHistory, setSubmissionHistory] = useState(() =>
    typeof window !== "undefined" ? getSubmissionHistory() : [],
  );

  useEffect(() => {
    if (activeTab === "history" || submission) {
      queueMicrotask(() => setSubmissionHistory(getSubmissionHistory()));
    }
  }, [activeTab, submission]);

  useEffect(() => {
    if (isRunning) queueMicrotask(() => setActiveTab("run-result"));
  }, [isRunning]);

  useEffect(() => {
    if (isSubmitting) queueMicrotask(() => setActiveTab("submit-result"));
  }, [isSubmitting]);

  useEffect(() => {
    if (runSuiteResult || runVerdict || runError) {
      queueMicrotask(() => setActiveTab("run-result"));
    }
  }, [runSuiteResult, runVerdict, runError]);

  useEffect(() => {
    if (submission || submitError) {
      queueMicrotask(() => setActiveTab("submit-result"));
    }
  }, [submission, submitError]);

  const submitVerdict = useMemo(
    () => verdictFromSubmissionResult(submission),
    [submission],
  );
  const runSuiteVerdict = useMemo(
    () => verdictFromSubmissionResult(runSuiteResult),
    [runSuiteResult],
  );

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/85 shadow-xl shadow-black/20">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-3 py-2">
        <nav className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "history") setSubmissionHistory(getSubmissionHistory());
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="shrink-0">
          {activeTab === "run-result" ? (
            <VerdictBadge verdict={runSuiteVerdict ?? runVerdict} />
          ) : null}
          {activeTab === "submit-result" ? (
            <VerdictBadge verdict={submitVerdict} />
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-3">
        {activeTab === "testcase" ? (
          <VisibleTestcasesDisplay testcases={visibleTestcases} />
        ) : null}

        {activeTab === "run-result" ? (
          <RunResultDisplay
            runSuiteResult={runSuiteResult}
            runResult={runResult}
            runVerdict={runVerdict}
            runError={runError}
            isRunning={isRunning}
          />
        ) : null}

        {activeTab === "submit-result" ? (
          <SubmitResultDisplay
            submission={submission}
            submitError={submitError}
            isSubmitting={isSubmitting}
          />
        ) : null}

        {activeTab === "custom-input" ? (
          <CustomInputPanel
            customStdin={customStdin}
            onChangeCustomStdin={onChangeCustomStdin}
            onRunCustomInput={onRunCustomInput}
            isRunning={isRunning}
            runResult={runResult}
            runVerdict={runVerdict}
            runError={runError}
          />
        ) : null}

        {activeTab === "history" ? (
          <SubmissionHistoryPanel history={submissionHistory} />
        ) : null}
      </div>
    </section>
  );
}

function VisibleTestcasesDisplay({ testcases }: { testcases: ParsedTestcase[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(testcases.length - 1, 0));
  const current = testcases[safeIndex];

  if (!testcases.length) {
    return <EmptyState message="No visible testcases available. Parse a problem first." />;
  }

  return (
    <div className="space-y-3">
      <ChipRow>
        {testcases.map((tc, index) => (
          <button
            key={`vis-${tc.id}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`shrink-0 rounded-md border px-2.5 py-1 text-xs transition ${
              safeIndex === index
                ? "border-indigo-500 bg-indigo-500/20 text-indigo-100"
                : "border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-500"
            }`}
          >
            Case {index + 1}
          </button>
        ))}
      </ChipRow>
      {current ? (
        <CardGrid>
          <InfoBlock title="Input (stdin)" value={current.stdin || current.display_input} />
          <InfoBlock title="Expected Output" value={current.expected_output || current.display_output} />
        </CardGrid>
      ) : null}
    </div>
  );
}

function RunResultDisplay({
  runSuiteResult,
  runResult,
  runVerdict,
  runError,
  isRunning,
}: {
  runSuiteResult: SubmitCodeResponse | null;
  runResult: RunCodeResponse | null;
  runVerdict: RunVerdict | null;
  runError: string | null;
  isRunning: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (isRunning) return <LoadingState message="Running code..." />;
  if (runError) return <ErrorPanel message={runError} />;

  if (runSuiteResult) {
    const results = runSuiteResult.testcases ?? [];
    const passed = runSuiteResult.passed_count ?? runSuiteResult.passed_testcases ?? 0;
    const total = runSuiteResult.total_count ?? runSuiteResult.total_testcases ?? results.length;
    const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));
    const current = results[safeIndex];

    return (
      <div className="space-y-3">
        <ResultSummary
          label="Visible testcase run"
          detail={`Passed ${passed}/${total} visible testcases`}
          verdict={verdictFromSubmissionResult(runSuiteResult)}
        />
        <ChipRow>
          {results.map((tc, index) => (
            <TestcaseChip
              key={`run-${tc.testcase ?? index}`}
              active={safeIndex === index}
              passed={tc.passed}
              label={`Case ${tc.testcase ?? index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </ChipRow>
        {current ? <TestcaseResultCards testcase={current} /> : null}
      </div>
    );
  }

  if (runResult) {
    return (
      <div className="space-y-3">
        <ResultSummary label="Custom input run" detail="Executed with your custom stdin." verdict={runVerdict} />
        <CardGrid>
          <InfoBlock title="Stdout" value={runResult.stdout ?? ""} />
        </CardGrid>
      </div>
    );
  }

  return <EmptyState message="Run your solution to analyze execution." />;
}

function SubmitResultDisplay({
  submission,
  submitError,
  isSubmitting,
}: {
  submission: SubmitCodeResponse | null;
  submitError: string | null;
  isSubmitting: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (isSubmitting) return <LoadingState message="Evaluating all visible and hidden testcases..." />;
  if (submitError) return <ErrorPanel message={submitError} />;
  if (!submission) return <EmptyState message="No submission yet. Submit to evaluate all testcases." />;

  const results = submission.testcases ?? [];
  const passed = submission.passed_count ?? submission.passed_testcases ?? 0;
  const total = submission.total_count ?? submission.total_testcases ?? results.length;
  const submitVerdict = verdictFromSubmissionResult(submission);
  const allPassed = submitVerdict === "Accepted";
  const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));
  const current = results[safeIndex];

  return (
    <div className="space-y-4">
      {allPassed ? (
        <div className="rounded-xl border border-emerald-400/30 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_34%),linear-gradient(135deg,rgba(6,78,59,0.55),rgba(9,9,11,0.9))] p-5 shadow-[0_0_28px_rgba(16,185,129,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">Verdict</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-100">Submission Accepted</p>
              <p className="mt-1 text-sm text-emerald-200/80">
                Passed {passed}/{total} testcases - Problem Solved
              </p>
            </div>
            <div className="rounded-lg border border-emerald-300/20 bg-emerald-950/40 px-4 py-3 text-right">
              <p className="text-3xl font-bold text-emerald-100">{passed}</p>
              <p className="text-[11px] uppercase tracking-wide text-emerald-300/70">of {total} passed</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-zinc-900/80 to-zinc-950 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-300/80">Verdict</p>
              <p className="mt-1 text-xl font-bold text-rose-200">{submitVerdict ?? "Wrong Answer"}</p>
              <p className="mt-1 text-sm text-rose-300/80">Passed {passed}/{total} testcases</p>
            </div>
            <VerdictBadge verdict={submitVerdict} />
          </div>
        </div>
      )}

      <ChipRow>
        {results.map((tc, index) => (
          <TestcaseChip
            key={`sub-${tc.testcase ?? index}`}
            active={safeIndex === index}
            passed={tc.passed}
            label={tc.is_hidden ? `Hidden ${index + 1}` : `Case ${tc.testcase ?? index + 1}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </ChipRow>

      {current ? <TestcaseResultCards testcase={current} /> : null}
    </div>
  );
}

function CustomInputPanel({
  customStdin,
  onChangeCustomStdin,
  onRunCustomInput,
  isRunning,
  runResult,
  runVerdict,
  runError,
}: {
  customStdin: string;
  onChangeCustomStdin: (value: string) => void;
  onRunCustomInput: () => void;
  isRunning: boolean;
  runResult: RunCodeResponse | null;
  runVerdict: RunVerdict | null;
  runError: string | null;
}) {
  return (
    <div className="grid min-h-full gap-3 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Custom Stdin</p>
          <button
            type="button"
            onClick={onRunCustomInput}
            disabled={isRunning}
            className="shrink-0 rounded-md border border-cyan-500/40 bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRunning ? "Running..." : "Run Custom Input"}
          </button>
        </div>
        <textarea
          value={customStdin}
          onChange={(event) => onChangeCustomStdin(event.target.value)}
          placeholder="Enter custom stdin here..."
          className="min-h-36 max-h-64 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs leading-relaxed text-zinc-100 outline-none ring-cyan-500/30 transition focus:ring-2"
        />
      </section>

      <section className="min-w-0 space-y-3">
        {runError ? <ErrorPanel message={runError} /> : null}
        {runResult && !isRunning ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-zinc-100">Output</p>
              {runVerdict ? <VerdictBadge verdict={runVerdict} /> : null}
            </div>
            <CardGrid>
              <InfoBlock title="Stdout" value={runResult.stdout ?? ""} />
            </CardGrid>
          </div>
        ) : null}
        {!runResult && !runError && !isRunning ? (
          <EmptyState message="Enter custom input and run your solution to see stdout here." />
        ) : null}
        {isRunning ? <LoadingState message="Running custom input..." /> : null}
      </section>
    </div>
  );
}

function TestcaseResultCards({ testcase }: { testcase: TestcaseResult }) {
  return (
    <CardGrid>
      {testcase.is_hidden ? (
        <>
          <InfoBlock title="Input" value="(hidden)" />
          <InfoBlock title="Expected" value="(hidden)" />
        </>
      ) : (
        <>
          <InfoBlock title="Input" value={testcase.input} />
          <InfoBlock title="Expected" value={testcase.expected_output} />
        </>
      )}
      <InfoBlock title="Actual (stdout)" value={testcase.actual_output ?? testcase.stdout ?? ""} />
    </CardGrid>
  );
}

function ChipRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-full flex-wrap gap-2 overflow-x-auto pb-1 sm:flex-nowrap">
      {children}
    </div>
  );
}

function TestcaseChip({
  active,
  passed,
  label,
  onClick,
}: {
  active: boolean;
  passed: boolean;
  label: string;
  onClick: () => void;
}) {
  const color = passed
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
    : "border-rose-500/40 bg-rose-500/10 text-rose-200";
  const activeColor = passed
    ? "border-emerald-300 bg-emerald-500/25 text-emerald-100 ring-1 ring-emerald-500/30"
    : "border-rose-300 bg-rose-500/25 text-rose-100 ring-1 ring-rose-500/30";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium transition ${active ? activeColor : color}`}
    >
      {passed ? "Pass" : "Fail"} - {label}
    </button>
  );
}

function ResultSummary({
  label,
  detail,
  verdict,
}: {
  label: string;
  detail: string;
  verdict?: string | null;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold text-zinc-100">{label}</p>
        <p className="mt-0.5 text-xs text-zinc-500">{detail}</p>
      </div>
      <VerdictBadge verdict={verdict} />
    </div>
  );
}

function CardGrid({ children }: { children: ReactNode }) {
  return <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-3">{children}</div>;
}

function InfoBlock({
  title,
  value,
}: {
  title: string;
  value?: string | null;
}) {
  return (
    <div className="flex min-h-32 min-w-0 flex-col rounded-lg border border-zinc-800 bg-zinc-950/80 p-3">
      <p className="mb-2 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
        {title}
      </p>
      <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-zinc-200">
        {value?.trim() ? value : "N/A"}
      </pre>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
      <p className="text-xs text-zinc-400">{message}</p>
    </div>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      <p className="text-xs text-zinc-300">{message}</p>
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  const lowerMessage = message.toLowerCase();
  let label = "Error";

  if (lowerMessage.includes("compil")) {
    label = "Compilation Error";
  } else if (lowerMessage.includes("runtime") || lowerMessage.includes("traceback")) {
    label = "Runtime Error";
  } else if (lowerMessage.includes("time limit") || lowerMessage.includes("tle") || lowerMessage.includes("timeout")) {
    label = "Time Limit Exceeded";
  } else if (lowerMessage.includes("network") || lowerMessage.includes("connect") || lowerMessage.includes("econnrefused")) {
    label = "Network Error";
  }

  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
      <p className="mb-2 text-xs font-bold text-rose-300">{label}</p>
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-rose-200/80">
        {message}
      </pre>
    </div>
  );
}
