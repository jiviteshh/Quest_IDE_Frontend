"use client";

import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "Crafting Your QuestIDE Workspace...",
  "Preparing Intelligent Execution Environment...",
  "Analyzing Problem Structure...",
  "Generating Smart Testcases...",
  "Building Execution Context...",
  "Preparing Intelligent Starter Code...",
  "Almost Ready...",
];

type GeneratingModalProps = {
  isOpen: boolean;
};

export default function GeneratingModal({ isOpen }: GeneratingModalProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setMessageIndex(0);
      setDots("");
      return;
    }

    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2800);

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => {
      clearInterval(msgInterval);
      clearInterval(dotInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm" />

      {/* Modal content */}
      <div className="relative flex flex-col items-center gap-6 rounded-2xl border border-zinc-700/50 bg-zinc-900/95 px-10 py-10 shadow-2xl shadow-black/40">
        {/* Spinner */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-indigo-500" />
          <div
            className="absolute inset-1.5 rounded-full border-[3px] border-transparent border-t-violet-400"
            style={{ animation: "spin 1.2s linear infinite reverse" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xl">
            🧠
          </div>
        </div>

        {/* Message */}
        <p className="min-w-[280px] text-center text-sm font-medium text-zinc-200 transition-all duration-300">
          {LOADING_MESSAGES[messageIndex]}
        </p>

        {/* Progress dots */}
        <p className="h-4 font-mono text-xs text-zinc-500">
          Processing{dots}
        </p>
      </div>
    </div>
  );
}
