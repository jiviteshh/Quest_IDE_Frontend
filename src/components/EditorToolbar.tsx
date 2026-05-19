import LanguageSelector from "@/src/components/LanguageSelector";
import type { LanguageOption } from "@/src/types/judge";

type EditorToolbarProps = {
  selectedLanguageId: number;
  languages: LanguageOption[];
  onLanguageChange: (languageId: number) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
};

export default function EditorToolbar({
  selectedLanguageId,
  languages,
  onLanguageChange,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
}: EditorToolbarProps) {
  const isBusy = isRunning || isSubmitting;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 shadow-lg shadow-black/10">
      <LanguageSelector
        value={selectedLanguageId}
        options={languages}
        onChange={onLanguageChange}
        disabled={isBusy}
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRun}
          disabled={isBusy}
          className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-100 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
              Running...
            </>
          ) : (
            <>
              Run
              <kbd className="ml-1.5 hidden rounded border border-zinc-600 bg-zinc-700/50 px-1 py-0.5 text-[10px] font-normal text-zinc-400 sm:inline">
                Ctrl+Enter
              </kbd>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isBusy}
          className="flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
              Submitting...
            </>
          ) : (
            <>
              Submit
              <kbd className="ml-1.5 hidden rounded border border-emerald-600/50 bg-emerald-700/30 px-1 py-0.5 text-[10px] font-normal text-emerald-400/80 sm:inline">
                Ctrl+Shift+Enter
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
