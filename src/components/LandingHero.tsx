type LandingHeroProps = {
  title: string;
  subtitle: string;
};

export default function LandingHero({ title, subtitle }: LandingHeroProps) {
  return (
    <header className="relative z-10 mb-7 mt-2 text-center md:mb-8 md:mt-3">
      <div className="absolute left-1/2 top-1/2 -z-10 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/15 blur-[95px]" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[130px] w-[130px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-[70px]" />
      
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)] backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
        </span>
        QuestIDE Platform
      </p>
      <h1 className="mx-auto mb-4 max-w-4xl text-balance text-4xl font-extrabold tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-[3.45rem] lg:leading-[1.02]">
        {title}
      </h1>
      <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
        {subtitle}
      </p>
    </header>
  );
}
