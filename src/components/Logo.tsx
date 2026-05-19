/**
 * Logo.tsx
 * ─────────────────────────────────────────────────────────────
 * Premium modern logo for QuestIDE.
 * ─────────────────────────────────────────────────────────────
 */

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
      >
        <path d="M16 2L2 9L2 23L16 30L30 23L30 9L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 2L16 16L30 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 9L16 16L16 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16" cy="16" r="4" fill="currentColor" />
      </svg>
      <span className="hidden sm:inline font-bold tracking-tight text-zinc-100 font-sans">
        QuestIDE
      </span>
    </div>
  );
}
