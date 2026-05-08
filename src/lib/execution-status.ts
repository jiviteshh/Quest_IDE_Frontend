import type { RunCodeResponse, RunVerdict, SubmitCodeResponse } from "@/src/types/judge";

type VerdictSource = {
  statusId?: string | null;
  statusDescription?: string | null;
  message?: string | null;
  stderr?: string | null;
  compileOutput?: string | null;
  exitCode?: number | null;
  signal?: string | null;
};

function toLower(value?: string | null) {
  return (value ?? "").toLowerCase();
}

function isCompilationError(source: VerdictSource): boolean {
  const text = [source.compileOutput, source.stderr, source.message].map(toLower).join("\n");
  if (toLower(source.statusId) === "ce") return true;
  return text.includes("compilation") || text.includes("cannot find symbol") || text.includes("error:");
}

function isTimeLimitExceeded(source: VerdictSource): boolean {
  const statusId = toLower(source.statusId);
  const text = [source.statusDescription, source.message, source.stderr].map(toLower).join("\n");
  return statusId === "to" || toLower(source.signal).includes("sigkill") || text.includes("time limit exceeded");
}

export function normalizeExecutionStatus(source: VerdictSource): RunVerdict {
  if (isTimeLimitExceeded(source)) return "Time Limit Exceeded";
  if (isCompilationError(source)) return "Compilation Error";
  if (toLower(source.statusId) === "wa") return "Wrong Answer";
  if ((source.stderr ?? "").trim().length > 0) return "Runtime Error";
  if ((source.exitCode ?? 0) !== 0) return "Runtime Error";
  return "Accepted";
}

export function verdictFromRunResult(result: RunCodeResponse | null): RunVerdict | null {
  if (!result) return null;
  const verdict = normalizeExecutionStatus({
    statusId: result.status?.id,
    statusDescription: result.status?.description,
    message: result.message,
    stderr: result.stderr,
    compileOutput: result.compile_output,
    exitCode: result.exit_code,
    signal: result.signal,
  });
  console.log("[execution-status] run verdict mapping", { raw: result, verdict });
  return verdict;
}

export function verdictFromSubmissionResult(result: SubmitCodeResponse | null): RunVerdict | null {
  if (!result) return null;
  const verdictText = toLower(result.verdict);
  const map: Record<string, RunVerdict> = {
    accepted: "Accepted",
    "wrong answer": "Wrong Answer",
    "runtime error": "Runtime Error",
    "compilation error": "Compilation Error",
    "time limit exceeded": "Time Limit Exceeded",
    "internal error": "Internal Error",
  };
  return map[verdictText] ?? "Internal Error";
}
