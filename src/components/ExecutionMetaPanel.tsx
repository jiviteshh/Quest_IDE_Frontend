import type { RunCodeResponse } from "@/src/types/judge";

type ExecutionMetaPanelProps = {
  result: RunCodeResponse | null;
};

function formatMemory(bytes?: number | null) {
  if (!bytes || bytes <= 0) return "n/a";
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ExecutionMetaPanel({ result }: ExecutionMetaPanelProps) {
  const time = result?.time ?? "n/a";
  const wallTime = result?.wall_time ?? "n/a";
  const memory = formatMemory(result?.memory);
  const exitCode = result?.exit_code ?? "n/a";
  const signal = result?.signal ?? "n/a";
  const status = result?.status?.id ?? "n/a";
  const message = result?.message ?? result?.status?.description ?? "n/a";

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/80 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Execution Metadata</p>
      <pre className="max-h-32 overflow-auto whitespace-pre-wrap font-mono text-xs text-zinc-200">
        {`Time: ${time}
Wall Time: ${wallTime}
Memory: ${memory}
Exit Code: ${exitCode}
Status: ${status}
Signal: ${signal}
Message: ${message}`}
      </pre>
    </div>
  );
}
