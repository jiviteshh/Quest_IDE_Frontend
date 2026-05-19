"use client";

import { useState } from "react";

type ProblemInputFormProps = {
  onSubmit: (problemText: string) => Promise<void>;
  onAPIKeyClick?: () => void;
};

export default function ProblemInputForm({ onSubmit, onAPIKeyClick }: ProblemInputFormProps) {
  const [problemText, setProblemText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = problemText.trim();
    if (!trimmed) {
      setError("Please enter a coding problem statement.");
      return;
    }
    if (trimmed.length < 10) {
      setError("Problem statement must be at least 10 characters.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await onSubmit(trimmed);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Failed to parse problem.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl shadow-black/20 md:p-4">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Problem Statement
      </label>
      <textarea
        value={problemText}
        onChange={(event) => setProblemText(event.target.value)}
        placeholder="Paste or write your coding problem..."
        className="min-h-40 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none ring-zinc-500 transition focus:ring-2 md:min-h-44"
      />
      {error ? (
        <p className="mt-3 rounded-md border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          {error}
        </p>
      ) : null}
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onAPIKeyClick}
            className="rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-800/30 hover:text-zinc-300"
            title="Add or update your NVIDIA API key"
          >
            <svg
              className="inline h-3 w-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Enter API Key
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md border border-zinc-600 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Generating..." : "Generate Problem"}
          </button>
        </div>
      </div>
    </form>
  );
}
