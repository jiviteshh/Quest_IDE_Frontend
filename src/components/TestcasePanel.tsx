"use client";

import { useMemo, useState } from "react";
import type { SubmitCodeResponse } from "@/src/types/judge";

type TestcasePanelProps = {
  submission: SubmitCodeResponse | null;
};

export default function TestcasePanel({ submission }: TestcasePanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const testcases = submission?.testcases ?? [];
  const safeActiveIndex = Math.min(activeIndex, Math.max(testcases.length - 1, 0));
  const current = testcases[safeActiveIndex];

  const summary = useMemo(() => {
    if (!submission) return "Submit code to see testcase verdicts.";
    return `Passed ${submission.passed_count ?? submission.passed_testcases ?? 0}/${submission.total_count ?? submission.total_testcases ?? 0} testcases`;
  }, [submission]);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-100">Testcases</h3>
        <p className="text-xs text-zinc-400">{summary}</p>
      </div>

      {!submission || testcases.length === 0 ? (
        <div className="rounded-md border border-zinc-800 bg-zinc-950/70 p-3 text-xs text-zinc-400">
          No testcase details yet.
        </div>
      ) : (
        <>
          <div className="mb-3 flex max-w-full flex-wrap gap-2 overflow-x-auto pb-1">
            {testcases.map((tc, index) => (
              <button
                key={`${index}-${tc.input}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-md border px-2.5 py-1 text-xs ${
                  safeActiveIndex === index
                    ? "border-zinc-500 bg-zinc-800 text-zinc-100"
                    : tc.passed
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-rose-500/40 bg-rose-500/10 text-rose-200"
                }`}
              >
                #{tc.testcase ?? index + 1} {tc.passed ? "Pass" : "Fail"}
                {tc.status ? ` (${tc.status})` : ""}
              </button>
            ))}
          </div>

          {current ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Panel title="Input" value={current.input} />
              <Panel title="Expected" value={current.expected_output} />
              <Panel title="Actual" value={current.actual_output} />
              <Panel title="Stdout" value={current.stdout ?? current.actual_output} />
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function Panel({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/80 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{title}</p>
      <pre className="max-h-28 overflow-auto whitespace-pre-wrap text-xs text-zinc-200">
        {value?.trim() ? value : "N/A"}
      </pre>
    </div>
  );
}
