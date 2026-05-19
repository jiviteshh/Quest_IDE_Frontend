"use client";

import { useEffect } from "react";

interface APIKeyTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function APIKeyTutorial({ isOpen, onClose }: APIKeyTutorialProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl rounded-2xl border border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-black/50 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-zinc-400 transition hover:text-zinc-200"
            aria-label="Close tutorial"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-bold text-zinc-100">
              How to Get Your NVIDIA API Key
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Follow these steps to generate and use your own API key with QuestIDE
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6 overflow-y-auto max-h-96">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/20">
                <span className="text-sm font-bold text-blue-300">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Go to NVIDIA Build</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Visit{" "}
                  <a
                    href="https://build.nvidia.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded bg-blue-500/20 px-2 py-1 font-mono text-blue-300 transition hover:bg-blue-500/30"
                  >
                    https://build.nvidia.com/
                  </a>
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/20">
                <span className="text-sm font-bold text-blue-300">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">
                  Login or Create Account
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Sign in with your NVIDIA account or create a new one if you don't
                  have one already.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/20">
                <span className="text-sm font-bold text-blue-300">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">
                  Navigate to API Keys Section
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Go to{" "}
                  <a
                    href="https://build.nvidia.com/settings/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded bg-blue-500/20 px-2 py-1 font-mono text-blue-300 transition hover:bg-blue-500/30"
                  >
                    https://build.nvidia.com/settings/api-keys
                  </a>
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/20">
                <span className="text-sm font-bold text-blue-300">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">
                  Generate New API Key
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Click on the "Generate API Key" button to create a new key for your
                  account.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/20">
                <span className="text-sm font-bold text-blue-300">5</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Copy Your Key</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Copy the generated API key from the dashboard. Make sure you save it
                  safely.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/20">
                <span className="text-sm font-bold text-blue-300">6</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Paste into QuestIDE</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Come back to QuestIDE and paste your API key in the input field at the
                  top of the page.
                </p>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-6 border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-500">
              ℹ️ Your API key is stored locally in your browser and never sent to QuestIDE servers.
              It's only used to communicate directly with NVIDIA's API.
            </p>
          </div>

          {/* Close button at bottom */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg border border-zinc-600 bg-zinc-800 px-6 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-700"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
