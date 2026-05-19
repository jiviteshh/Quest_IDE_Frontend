"use client";

import MonacoEditor from "@/src/components/MonacoEditor";
import EditorToolbar from "@/src/components/EditorToolbar";
import ExecutionProgress from "@/src/components/ExecutionProgress";
import { LANGUAGE_GUIDANCE } from "@/src/lib/templates";
import type { LanguageOption, MonacoLanguage, ParsedTestcase } from "@/src/types/judge";

type EditorPanelProps = {
  selectedLanguageId: number;
  selectedMonacoLanguage?: MonacoLanguage;
  languages: LanguageOption[];
  sourceCode: string;
  stdin: string;
  onChangeLanguage: (id: number) => void;
  onChangeCode: (value: string) => void;
  onChangeStdin: (value: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  publicTestcases: ParsedTestcase[];
  isRunning: boolean;
  isSubmitting: boolean;
};

export default function EditorPanel({
  selectedLanguageId,
  selectedMonacoLanguage,
  languages,
  sourceCode,
  onChangeLanguage,
  onChangeCode,
  onRun,
  onSubmit,
  publicTestcases,
  isRunning,
  isSubmitting,
}: EditorPanelProps) {
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col gap-2 overflow-hidden">
      <EditorToolbar
        selectedLanguageId={selectedLanguageId}
        languages={languages}
        onLanguageChange={onChangeLanguage}
        onRun={onRun}
        onSubmit={onSubmit}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
      />

      {isRunning || isSubmitting ? (
        <ExecutionProgress
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          language={selectedMonacoLanguage}
          totalTestcases={publicTestcases.length}
        />
      ) : null}

      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
        <MonacoEditor
          language={selectedMonacoLanguage}
          value={sourceCode}
          onChange={onChangeCode}
        />
      </div>

      {selectedMonacoLanguage ? (
        <p className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-300">
          {LANGUAGE_GUIDANCE[selectedMonacoLanguage]}
        </p>
      ) : null}
    </section>
  );
}
