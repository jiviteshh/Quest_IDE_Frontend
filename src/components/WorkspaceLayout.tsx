"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_PANEL_SIZES,
  type PanelSizes,
  getPanelSizes,
  savePanelSizes,
} from "@/src/lib/workspace-storage";

type WorkspaceLayoutProps = {
  left: ReactNode;
  center: ReactNode;
  assistant: ReactNode;
};

export default function WorkspaceLayout({
  left,
  center,
  assistant,
}: WorkspaceLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<PanelSizes>(() =>
    typeof window === "undefined" ? DEFAULT_PANEL_SIZES : getPanelSizes(),
  );
  const [isProblemDragging, setIsProblemDragging] = useState(false);
  const [isAssistantDragging, setIsAssistantDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth < 900,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const persistSizes = useCallback((next: PanelSizes) => {
    savePanelSizes(next);
    window.dispatchEvent(new Event("questide-layout-change"));
    return next;
  }, []);

  const setAssistantOpen = useCallback(
    (assistantOpen: boolean) => {
      setSizes((current) => persistSizes({ ...current, assistantOpen }));
    },
    [persistSizes],
  );

  const toggleAssistant = useCallback(() => {
    setSizes((current) =>
      persistSizes({ ...current, assistantOpen: !current.assistantOpen }),
    );
  }, [persistSizes]);

  const onProblemMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsProblemDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onAssistantMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsAssistantDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    if (!isProblemDragging) return;

    function onMove(event: MouseEvent) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((event.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(44, Math.max(22, pct));
      setSizes((current) => persistSizes({ ...current, problemWidth: clamped }));
    }

    function onUp() {
      setIsProblemDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isProblemDragging, persistSizes]);

  useEffect(() => {
    if (!isAssistantDragging) return;

    function onMove(event: MouseEvent) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.right - event.clientX;
      const maxWidth = Math.min(560, rect.width * 0.42);
      const clamped = Math.min(maxWidth, Math.max(320, width));
      setSizes((current) =>
        persistSizes({ ...current, assistantWidth: clamped, assistantOpen: true }),
      );
    }

    function onUp() {
      setIsAssistantDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isAssistantDragging, persistSizes]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("questide-layout-change"));
    }, 320);
    return () => window.clearTimeout(timer);
  }, [sizes.assistantOpen, sizes.assistantWidth]);

  if (isMobile) {
    return (
      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 px-3 py-3 text-zinc-100">
        <section className="mx-auto flex h-full min-h-0 w-full max-w-[1800px] flex-col gap-3 overflow-hidden">
          <div className="min-h-0 flex-[0_0_34%] overflow-hidden">{left}</div>
          <div className="min-h-0 flex-1 overflow-hidden">{center}</div>
        </section>

        {!sizes.assistantOpen ? <AssistantDock onClick={toggleAssistant} /> : null}

        <div
          className={`fixed inset-0 z-[180] bg-zinc-950/70 backdrop-blur-sm transition-opacity duration-300 ${
            sizes.assistantOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setAssistantOpen(false)}
        />
        <aside
          className={`fixed inset-y-0 right-0 z-[190] w-full max-w-md transform p-3 transition-transform duration-300 ease-out ${
            sizes.assistantOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full min-h-0 overflow-hidden">
            <AssistantCloseButton onClick={() => setAssistantOpen(false)} />
            {sizes.assistantOpen ? assistant : null}
          </div>
        </aside>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-0 flex-1 overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 px-3 py-3 text-zinc-100 md:px-5 md:py-4">
      <section
        ref={containerRef}
        className="mx-auto flex h-full min-h-0 w-full max-w-[1900px] overflow-hidden"
      >
        <div
          className="min-h-0 overflow-hidden pr-1"
          style={{ flex: `0 0 ${sizes.problemWidth}%` }}
        >
          {left}
        </div>

        <DragHandle
          active={isProblemDragging}
          accent="indigo"
          onMouseDown={onProblemMouseDown}
        />

        <div className="h-full min-h-0 min-w-0 flex-1 overflow-hidden px-1 transition-[flex-basis,width] duration-300 ease-out">
          {center}
        </div>

        <div
          className="flex h-full min-h-0 shrink-0 overflow-hidden transition-[flex-basis,width,opacity] duration-300 ease-out"
          style={{
            flexBasis: sizes.assistantOpen ? sizes.assistantWidth : 0,
            width: sizes.assistantOpen ? sizes.assistantWidth : 0,
            opacity: sizes.assistantOpen ? 1 : 0,
          }}
        >
          {sizes.assistantOpen ? (
            <>
              <DragHandle
                active={isAssistantDragging}
                accent="cyan"
                onMouseDown={onAssistantMouseDown}
              />
              <aside className="relative h-full min-h-0 min-w-0 flex-1 overflow-hidden pl-1">
                <AssistantCloseButton onClick={() => setAssistantOpen(false)} />
                {assistant}
              </aside>
            </>
          ) : null}
        </div>
      </section>

      {!sizes.assistantOpen ? <AssistantDock onClick={toggleAssistant} /> : null}
    </main>
  );
}

function AssistantDock({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed right-3 top-1/2 z-[170] flex -translate-y-1/2 items-center gap-2 rounded-l-2xl border border-r-0 border-cyan-400/30 bg-[linear-gradient(135deg,rgba(8,47,73,0.92),rgba(24,24,27,0.96))] px-3 py-3 text-sm font-semibold text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.16)] backdrop-blur transition duration-200 hover:-translate-x-1 hover:border-cyan-300/60 hover:shadow-[0_0_38px_rgba(34,211,238,0.25)]"
      aria-label="Open QuestIDE AI assistant"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-100">
        AI
      </span>
      <span className="hidden whitespace-nowrap md:inline">QuestIDE AI</span>
    </button>
  );
}

function AssistantCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close QuestIDE AI assistant"
      className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-950/80 text-sm font-semibold text-zinc-300 shadow-lg transition hover:border-cyan-500/50 hover:text-cyan-100"
    >
      x
    </button>
  );
}

function DragHandle({
  active,
  accent,
  onMouseDown,
}: {
  active: boolean;
  accent: "indigo" | "cyan";
  onMouseDown: (event: React.MouseEvent) => void;
}) {
  const activeClass = accent === "indigo" ? "bg-indigo-500/20" : "bg-cyan-500/20";
  const barClass = accent === "indigo" ? "bg-indigo-400" : "bg-cyan-300";

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      onMouseDown={onMouseDown}
      className={`group relative z-10 flex w-2 shrink-0 cursor-col-resize items-center justify-center transition-colors ${
        active ? activeClass : "hover:bg-zinc-700/30"
      }`}
    >
      <div
        className={`h-8 w-0.5 rounded-full transition-colors ${
          active ? barClass : "bg-zinc-700 group-hover:bg-zinc-500"
        }`}
      />
    </div>
  );
}
