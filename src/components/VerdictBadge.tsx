import type { RunVerdict, SubmitCodeResponse } from "@/src/types/judge";

type VerdictBadgeProps = {
  verdict?: SubmitCodeResponse["verdict"] | RunVerdict | null;
};

const verdictStyles: Record<string, string> = {
  Accepted: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
  "Wrong Answer": "border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]",
  "Runtime Error": "border-orange-500/50 bg-orange-500/10 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]",
  "Compilation Error": "border-red-700/60 bg-red-950/40 text-red-300 shadow-[0_0_10px_rgba(185,28,28,0.2)]",
  "Time Limit Exceeded": "border-yellow-500/50 bg-yellow-500/10 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
  "Internal Error": "border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-400",
};

const verdictIcons: Record<string, string> = {
  Accepted: "OK",
  "Wrong Answer": "WA",
  "Runtime Error": "RE",
  "Compilation Error": "CE",
  "Time Limit Exceeded": "TLE",
  "Internal Error": "IE",
};

export default function VerdictBadge({ verdict }: VerdictBadgeProps) {
  if (!verdict) {
    return (
      <span className="inline-flex items-center rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300">
        Pending
      </span>
    );
  }

  const className = verdictStyles[verdict] ?? "border-zinc-700 bg-zinc-900 text-zinc-200";
  const icon = verdictIcons[verdict] ?? "??";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${className}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      <span aria-hidden>{icon}</span>
      {verdict}
    </span>
  );
}
