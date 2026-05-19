/**
 * ExecutionProgress.tsx
 * ─────────────────────────────────────────────────────────────
 * Animated execution progress indicator.
 * Shows compilation/running status with step indicators.
 *
 * Does NOT modify execution flow — purely visual.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useState } from "react";

type ExecutionProgressProps = {
  isRunning: boolean;
  isSubmitting: boolean;
  language?: string;
  totalTestcases?: number;
};

const STEPS_RUN = [
  { label: "Preparing...", icon: "⚙️" },
  { label: "Compiling...", icon: "🔨" },
  { label: "Running testcases...", icon: "▶️" },
  { label: "Comparing outputs...", icon: "🔍" },
];

const STEPS_SUBMIT = [
  { label: "Preparing submission...", icon: "📦" },
  { label: "Compiling...", icon: "🔨" },
  { label: "Running visible testcases...", icon: "▶️" },
  { label: "Executing hidden testcases...", icon: "🔒" },
  { label: "Computing final verdict...", icon: "⚖️" },
];

export default function ExecutionProgress({
  isRunning,
  isSubmitting,
  language = "code",
  totalTestcases = 0,
}: ExecutionProgressProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const isActive = isRunning || isSubmitting;
  const steps = isSubmitting ? STEPS_SUBMIT : STEPS_RUN;

  useEffect(() => {
    if (!isActive) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev; // Stay on last step
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isActive, steps.length]);

  if (!isActive) return null;

  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];

  // Build dynamic label
  let label = currentStep.label;
  if (label.includes("Compiling")) {
    label = `Compiling ${language}...`;
  }
  if (label.includes("Running testcases") && totalTestcases > 0) {
    label = `Running testcase ${Math.min(stepIndex, totalTestcases)}/${totalTestcases}...`;
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-2.5">
      <div className="relative flex items-center justify-center">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-indigo-200">
          {currentStep.icon} {label}
        </p>
        {/* Step dots */}
        <div className="mt-1.5 flex gap-1">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className={`h-1 rounded-full transition-all duration-300 ${
                index <= stepIndex
                  ? "w-5 bg-indigo-400"
                  : "w-3 bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
