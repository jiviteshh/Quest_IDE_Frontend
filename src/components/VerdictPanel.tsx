import OutputConsole from "@/src/components/OutputConsole";
import TestcasePanel from "@/src/components/TestcasePanel";
import VerdictBadge from "@/src/components/VerdictBadge";
import { verdictFromSubmissionResult } from "@/src/lib/execution-status";
import type { RunCodeResponse, RunVerdict, SubmitCodeResponse } from "@/src/types/judge";

type VerdictPanelProps = {
  runResult: RunCodeResponse | null;
  runVerdict: RunVerdict | null;
  runError: string | null;
  isRunning: boolean;
  submission: SubmitCodeResponse | null;
  submitError: string | null;
};

export default function VerdictPanel({
  runResult,
  runVerdict,
  runError,
  isRunning,
  submission,
  submitError,
}: VerdictPanelProps) {
  return (
    <section className="grid gap-3">
      <OutputConsole
        result={runResult}
        runVerdict={runVerdict}
        isLoading={isRunning}
        errorMessage={runError}
      />
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100">Submission Verdict</h3>
          <VerdictBadge verdict={verdictFromSubmissionResult(submission)} />
        </div>
        {submitError ? (
          <p className="mb-3 rounded-md border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-200">
            {submitError}
          </p>
        ) : null}
        <TestcasePanel submission={submission} />
      </section>
    </section>
  );
}
