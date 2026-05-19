/**
 * Navbar.tsx
 * ─────────────────────────────────────────────────────────────
 * Top navigation bar.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import Link from "next/link";
import Logo from "@/src/components/Logo";

export default function Navbar() {
  return (
    <nav className="z-50 flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/60 px-4 backdrop-blur-xl md:px-8">
      <Link
        href="/"
        className="group flex items-center transition hover:opacity-90"
      >
        <Logo className="group-hover:scale-105 transition-transform duration-300" />
      </Link>
      <div className="h-7 w-7" aria-hidden />
    </nav>
  );
}
