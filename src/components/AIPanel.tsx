"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { requestAIAssist, type AIContextPayload } from "@/src/lib/ai-service";
import type { RunCodeResponse, SubmitCodeResponse } from "@/src/types/judge";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  error?: string | null;
};

type AIPanelProps = {
  problemTitle: string;
  problemDescription: string;
  userCode: string;
  language: string;
  runResult: RunCodeResponse | null;
  runSuiteResult: SubmitCodeResponse | null;
  submitResult: SubmitCodeResponse | null;
  lastVerdict?: string | null;
  failedTestcase?: {
    input: string;
    expected_output: string;
    actual_output: string;
  } | null;
};

const STORAGE_KEY = "ai-coding-platform:quest-ai-chat";

const STARTER_MESSAGE: ChatMessage = {
  id: "starter",
  role: "assistant",
  content:
    "Ask QuestIDE anything about this problem. I can help debug failures, explain testcases, review complexity, suggest optimizations, or translate your current solution.",
  createdAt: 0,
};

const SUGGESTIONS = [
  "Give me a hint",
  "Find the bug in my code",
  "What's the complexity?",
  "Optimize this solution",
  "Explain testcase 2",
  "Generate edge cases",
];

function loadStoredMessages(problemTitle: string): ChatMessage[] {
  if (typeof window === "undefined") return [STARTER_MESSAGE];
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY}:${problemTitle}`);
    if (!raw) return [STARTER_MESSAGE];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) && parsed.length ? parsed : [STARTER_MESSAGE];
  } catch {
    return [STARTER_MESSAGE];
  }
}

export default function AIPanel({
  problemTitle,
  problemDescription,
  userCode,
  language,
  runResult,
  runSuiteResult,
  submitResult,
  lastVerdict,
  failedTestcase,
}: AIPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadStoredMessages(problemTitle),
  );
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        `${STORAGE_KEY}:${problemTitle}`,
        JSON.stringify(messages.slice(-40)),
      );
    } catch {
      // Chat history is useful, but never essential to the workspace.
    }
  }, [messages, problemTitle]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const aiContext = useMemo<AIContextPayload>(
    () => ({
      problem_title: problemTitle,
      problem_description: problemDescription,
      user_code: userCode,
      language,
      last_verdict: lastVerdict,
      failed_testcase: failedTestcase,
      latest_run_result: runResult,
      latest_run_suite_result: runSuiteResult,
      latest_submit_result: submitResult,
      execution_metadata: {
        run_status: runResult?.status?.description ?? runResult?.status?.id ?? null,
        run_exit_code: runResult?.exit_code ?? null,
        run_time: runResult?.time ?? runResult?.wall_time ?? null,
        run_memory: runResult?.memory ?? null,
        submit_verdict: submitResult?.verdict ?? null,
        submit_passed:
          submitResult?.passed_count ?? submitResult?.passed_testcases ?? null,
        submit_total:
          submitResult?.total_count ?? submitResult?.total_testcases ?? null,
      },
    }),
    [
      problemTitle,
      problemDescription,
      userCode,
      language,
      lastVerdict,
      failedTestcase,
      runResult,
      runSuiteResult,
      submitResult,
    ],
  );

  const sendPrompt = useCallback(
    async (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed || isLoading) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };
      setMessages((current) => [...current, userMessage]);
      setDraft("");
      setIsLoading(true);
      setLastPrompt(trimmed);

      try {
        const result = await requestAIAssist({
          action: "chat",
          query: trimmed,
          problem_description: problemDescription,
          user_code: userCode,
          language,
          failed_testcase: failedTestcase,
          last_verdict: lastVerdict,
          context: aiContext,
        });

        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              result.error ??
              result.content ??
              "I could not generate a response. Please try again.",
            createdAt: Date.now(),
            error: result.error,
          },
        ]);
      } catch {
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "AI request failed. Check backend connectivity and retry.",
            createdAt: Date.now(),
            error: "AI request failed.",
          },
        ]);
      } finally {
        setIsLoading(false);
        textareaRef.current?.focus();
      }
    },
    [
      aiContext,
      failedTestcase,
      isLoading,
      language,
      lastVerdict,
      problemDescription,
      userCode,
    ],
  );

  const clearChat = useCallback(() => {
    setMessages([STARTER_MESSAGE]);
  }, []);

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-800/90 bg-[linear-gradient(180deg,rgba(24,24,27,0.96),rgba(9,9,11,0.98))] shadow-2xl shadow-black/30">
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-3 pr-12">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.75)]" />
            <h2 className="truncate text-sm font-semibold tracking-tight text-zinc-100">
              QuestIDE Assistant
            </h2>
          </div>
          <p className="mt-1 truncate text-[11px] text-zinc-500">
            Context: problem, code, language, verdicts, failed cases, metadata
          </p>
        </div>
        <button
          type="button"
          onClick={clearChat}
          className="rounded-md border border-zinc-700 bg-zinc-950/60 px-2 py-1 text-[11px] font-medium text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
        >
          Clear
        </button>
      </header>

      <div ref={scrollerRef} className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} onRetry={() => lastPrompt && sendPrompt(lastPrompt)} />
          ))}
          {isLoading ? <TypingIndicator /> : null}
        </div>
      </div>

      <div className="shrink-0 border-t border-zinc-800 bg-zinc-950/70 p-3">
        {messages.length <= 1 ? (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendPrompt(suggestion)}
                className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-[11px] text-zinc-300 transition hover:border-cyan-500/50 hover:text-cyan-100"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}

        <form
          className="rounded-xl border border-zinc-700/80 bg-zinc-950 shadow-inner shadow-black/30 transition focus-within:border-cyan-500/50"
          onSubmit={(event) => {
            event.preventDefault();
            sendPrompt(draft);
          }}
        >
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendPrompt(draft);
              }
            }}
            placeholder="Ask QuestIDE anything about this problem."
            className="max-h-36 min-h-20 w-full resize-none bg-transparent px-3 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
          />
          <div className="flex items-center justify-between border-t border-zinc-800 px-3 py-2">
            <p className="text-[11px] text-zinc-500">
              Shift+Enter for newline
            </p>
            <button
              type="submit"
              disabled={isLoading || !draft.trim()}
              className="rounded-md border border-cyan-500/40 bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Thinking..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function ChatBubble({
  message,
  onRetry,
}: {
  message: ChatMessage;
  onRetry: () => void;
}) {
  const isUser = message.role === "user";
  return (
    <article className={`flex min-w-0 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`min-w-0 max-w-[92%] rounded-xl border px-3.5 py-3 text-sm leading-relaxed ${
          isUser
            ? "border-cyan-500/30 bg-cyan-500/12 text-cyan-50"
            : message.error
              ? "border-rose-500/30 bg-rose-500/10 text-rose-100"
              : "border-zinc-800 bg-zinc-900/75 text-zinc-200"
        }`}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            {isUser ? "You" : "Quest AI"}
          </span>
          {message.error ? (
            <button
              type="button"
              onClick={onRetry}
              className="rounded border border-rose-400/30 px-2 py-0.5 text-[11px] text-rose-200 transition hover:bg-rose-500/10"
            >
              Retry
            </button>
          ) : null}
        </div>
        <MarkdownLite content={message.content} />
      </div>
    </article>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/75 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 [animation-delay:120ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 [animation-delay:240ms]" />
          <span className="ml-1">Reading workspace context...</span>
        </div>
      </div>
    </div>
  );
}

function MarkdownLite({ content }: { content: string }) {
  const segments = useMemo(() => {
    const parts: Array<{ type: "text" | "code"; value: string; lang?: string }> = [];
    const regex = /```([\w+-]*)\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
      }
      parts.push({ type: "code", lang: match[1] || "text", value: match[2] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
      parts.push({ type: "text", value: content.slice(lastIndex) });
    }
    return parts;
  }, [content]);

  return (
    <div className="space-y-3">
      {segments.map((segment, index) =>
        segment.type === "code" ? (
          <div key={`${segment.type}-${index}`} className="min-w-0 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950">
            <div className="border-b border-zinc-800 px-3 py-1 text-[11px] uppercase tracking-wide text-zinc-500">
              {segment.lang}
            </div>
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words p-3 text-xs leading-relaxed text-zinc-100">
              <code>{segment.value.trim() || " "}</code>
            </pre>
          </div>
        ) : (
          <TextMarkdown key={`${segment.type}-${index}`} value={segment.value} />
        ),
      )}
    </div>
  );
}

function TextMarkdown({ value }: { value: string }) {
  const lines = value.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-1" />;
        if (trimmed.startsWith("### ")) {
          return <h4 key={index} className="text-sm font-semibold text-zinc-100">{trimmed.slice(4)}</h4>;
        }
        if (trimmed.startsWith("## ")) {
          return <h3 key={index} className="text-sm font-semibold text-zinc-100">{trimmed.slice(3)}</h3>;
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <p key={index} className="pl-3 text-sm text-zinc-200 before:mr-2 before:text-cyan-300 before:content-['-']">
              {renderInline(trimmed.slice(2))}
            </p>
          );
        }
        return (
          <p key={index} className="text-sm text-zinc-200">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(value: string) {
  const chunks = value.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return chunks.map((chunk, index) => {
    if (chunk.startsWith("`") && chunk.endsWith("`")) {
      return (
        <code key={index} className="rounded border border-zinc-700 bg-zinc-950 px-1 py-0.5 text-[0.9em] text-cyan-100">
          {chunk.slice(1, -1)}
        </code>
      );
    }
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return <strong key={index} className="font-semibold text-zinc-100">{chunk.slice(2, -2)}</strong>;
    }
    return <span key={index}>{chunk}</span>;
  });
}
