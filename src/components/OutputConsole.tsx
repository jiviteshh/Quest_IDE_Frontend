import VerdictBadge from "@/src/components/VerdictBadge";
import ExecutionMetaPanel from "@/src/components/ExecutionMetaPanel";
import type { RunCodeResponse, RunVerdict } from "@/src/types/judge";

type OutputConsoleProps = {
  result: RunCodeResponse | null;
  runVerdict?: RunVerdict | null;
  isLoading?: boolean;
  errorMessage?: string | null;
};

function Block({ label, content, tone = "neutral" }: { label: string; content?: string | null; tone?: "neutral" | "error" }) {
  return (
    <div
      className={`rounded-md border p-3 ${
        tone === "error"
          ? "border-rose-500/30 bg-rose-950/20"
          : "border-zinc-800 bg-zinc-950/80"
      }`}
    >
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
      <pre className="max-h-36 overflow-auto whitespace-pre-wrap font-mono text-xs text-zinc-200">
        {content?.trim() ? content : "No output"}
      </pre>
    </div>
  );
}

export default function OutputConsole({ result, runVerdict, isLoading = false, errorMessage }: OutputConsoleProps) {
  const stderr = result?.stderr ?? "";
  const compileOutput = result?.compile_output ?? "";
  const message = result?.message ?? result?.status?.description ?? "";
  const hasErrorOutput = Boolean(stderr.trim() || compileOutput.trim() || errorMessage?.trim() || message.trim());
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
            ? "Run code to see execution output."
            : result?.stdout?.trim()
              ? result.stdout
              : result?.stderr?.trim()
                ? result.stderr
                : message.trim()
                  ? message
                  : "No output"}
        </pre>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Block label="stdout" content={result?.stdout} />
        <Block label="stderr" tone="error" content={result?.stderr} />
        <Block
          label="execution details"
          content={`language: ${result?.language ?? "n/a"}\nversion: ${result?.version ?? "n/a"}\nstatus: ${result?.status?.id ?? "n/a"}\nexit_code: ${result?.exit_code ?? "n/a"}`}
        />
        <ExecutionMetaPanel result={result} />
      </div>

      {hasErrorOutput ? (
        <div className="mt-3">
          <Block
            label="error panel (stderr / compile output)"
            tone="error"
            content={[errorMessage, message, compileOutput, stderr].filter(Boolean).join("\n\n")}
          />
        </div>
      ) : null}
    </section>
  );
}
