"use client";

import { Editor, type OnChange } from "@monaco-editor/react";

type MonacoEditorProps = {
  language?: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
  className?: string;
  readOnly?: boolean;
};

export default function MonacoEditor({
  language = "typescript",
  value,
  onChange,
  height = "60vh",
  className = "",
  readOnly = false,
}: MonacoEditorProps) {
  const handleChange: OnChange = (nextValue) => {
    onChange(nextValue ?? "");
  };

  return (
    <div
      className={[
        "w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/30",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-400">
        <span className="font-medium uppercase tracking-wider">{language}</span>
        <span className="text-zinc-500">Monaco Editor</span>
      </div>

      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={handleChange}
        options={{
          readOnly,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          padding: { top: 12, bottom: 12 },
          tabSize: 2,
          smoothScrolling: true,
        }}
      />
    </div>
  );
}
