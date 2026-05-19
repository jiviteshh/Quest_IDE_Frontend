import VerdictBadge from "@/src/components/VerdictBadge";
import type { RunCodeResponse, RunVerdict } from "@/src/types/judge";

type OutputConsoleProps = {
  result: RunCodeResponse | null;
  runVerdict?: RunVerdict | null;
  isLoading?: boolean;
  errorMessage?: string | null;
};

function Block({ label, content }: { label: string; content?: string | null }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/80 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
        {label}
      </p>
      <pre className="max-h-36 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-zinc-200">
        {content?.trim() ? content : "No output"}
      </pre>
    </div>
  );
}

export default function OutputConsole({
  result,
  runVerdict,
  isLoading = false,
  errorMessage,
}: OutputConsoleProps) {
  const message = errorMessage ?? result?.message ?? result?.status?.description ?? "";
  const hasRunResult = Boolean(result || errorMessage);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-100">Execution Console</h3>
        <div className="flex items-center gap-2">
          {runVerdict ? <VerdictBadge verdict={runVerdict} /> : null}
          {isLoading ? <span className="text-xs text-zinc-400">Running...</span> : null}
        </div>
      </div>

      <div className="mb-3 rounded-md border border-zinc-800 bg-black p-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-zinc-500">terminal</p>
        <pre className="max-h-52 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-zinc-200">
          {!hasRunResult
            ? "Run your solution to analyze execution."
            : result?.stdout?.trim()
              ? result.stdout
              : message.trim() || "No output"}
        </pre>
      </div>

      <Block label="stdout" content={result?.stdout} />
    </section>
  );
}
