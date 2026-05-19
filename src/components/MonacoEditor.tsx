"use client";

import { useCallback, useEffect, useRef } from "react";
import { Editor, type OnChange, type OnMount } from "@monaco-editor/react";
import type { MonacoLanguage } from "@/src/types/judge";

type MonacoEditorProps = {
  language?: MonacoLanguage;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  readOnly?: boolean;
};

type MountedEditor = Parameters<OnMount>[0];

export default function MonacoEditor({
  language = "python",
  value,
  onChange,
  className = "",
  readOnly = false,
}: MonacoEditorProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<MountedEditor | null>(null);
  const frameRef = useRef<number | null>(null);

  const requestLayout = useCallback(() => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      editorRef.current?.layout();
      frameRef.current = null;
    });
  }, []);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
    requestLayout();
  };

  const handleChange: OnChange = (nextValue) => {
    onChange(nextValue ?? "");
  };

  useEffect(() => {
    const target = shellRef.current;
    if (!target) return;

    const observer = new ResizeObserver(() => requestLayout());
    observer.observe(target);

    window.addEventListener("resize", requestLayout);
    window.addEventListener("questide-layout-change", requestLayout);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", requestLayout);
      window.removeEventListener("questide-layout-change", requestLayout);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [requestLayout]);

  return (
    <div
      ref={shellRef}
      className={[
        "flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/30",
        className,
      ].join(" ")}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-400">
        <span className="font-medium uppercase tracking-wider">{language}</span>
        <span className="text-zinc-500">Workspace Editor</span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          onMount={handleMount}
          onChange={handleChange}
          options={{
            readOnly,
            fontSize: 14,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "off",
            padding: { top: 8, bottom: 12 },
            tabSize: 4,
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
            renderLineHighlight: "all",
          }}
        />
      </div>
    </div>
  );
}
