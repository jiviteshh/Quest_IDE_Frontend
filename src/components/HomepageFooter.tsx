export default function HomepageFooter() {
  return (
    <footer className="mt-14 border-t border-zinc-800/80 pt-8">
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/55 px-5 py-5 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur md:px-6">
        <div className="grid gap-6 text-center md:grid-cols-[1fr_auto_1fr] md:items-center md:text-left">
          <div>
            <p className="text-sm font-semibold tracking-tight text-zinc-100">
              QuestIDE
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              AI-native coding workspace for modern developers.
            </p>
            <p className="mt-3 text-xs text-zinc-400">
              Developed by{" "}
              <span className="font-medium text-zinc-200">
                Jivitesh Naragam
              </span>
            </p>
          </div>

          <div className="hidden h-12 w-px bg-zinc-800 md:block" />

          <div className="flex flex-col items-center gap-3 md:items-end">
            <p className="text-xs text-zinc-500">
              © 2026 QuestIDE. All rights reserved.
            </p>
            <div className="flex flex-col items-center gap-2 sm:flex-row md:justify-end">
              <a
                href="mailto:jivinaragam@gmail.com"
                className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-cyan-500/45 hover:text-cyan-100 hover:shadow-[0_0_18px_rgba(34,211,238,0.10)]"
              >
                Feedback: jivinaragam@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/naragam-jivitesh-71a4b8313/"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:-translate-y-0.5 hover:border-sky-500/45 hover:text-sky-100 hover:shadow-[0_0_18px_rgba(14,165,233,0.12)]"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded bg-sky-500/15 text-[10px] font-bold text-sky-300">
                  in
                </span>
                Connect on LinkedIn
                <span className="transition group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
