import type { RunVerdict, SubmitCodeResponse } from "@/src/types/judge";

type VerdictBadgeProps = {
  verdict?: SubmitCodeResponse["verdict"] | RunVerdict | null;
};

const verdictStyles: Record<string, string> = {
  Accepted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "Wrong Answer": "border-rose-500/30 bg-rose-500/10 text-rose-300",
  "Runtime Error": "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Compilation Error": "border-orange-500/30 bg-orange-500/10 text-orange-300",
  "Time Limit Exceeded": "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  "Internal Error": "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300",
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
