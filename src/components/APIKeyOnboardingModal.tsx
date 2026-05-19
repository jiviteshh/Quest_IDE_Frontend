"use client";

import { useState, useEffect } from "react";
import { useAPIKey } from "@/src/hooks/useAPIKey";

interface APIKeyOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function APIKeyOnboardingModal({
  isOpen,
  onClose,
}: APIKeyOnboardingModalProps) {
  const { saveAPIKey } = useAPIKey();
  const [inputValue, setInputValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Handle ESC key
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

  const handleSave = async () => {
    const trimmedKey = inputValue.trim();
    if (!trimmedKey) {
      setError("Please enter your API key");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Simulate validation delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      saveAPIKey(trimmedKey);
      
      // Show success state briefly
      await new Promise((resolve) => setTimeout(resolve, 500));
      onClose();
    } catch (err) {
      setError("Failed to save API key");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSaving) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleSkip}
        role="button"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 rounded-2xl border border-zinc-700/50 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-black/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute right-4 top-4 text-zinc-400 transition hover:text-zinc-200"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-100">
              Enable QuestIDE AI Features
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Add your NVIDIA API key to unlock Quest AI, AI parsing, testcase generation, debugging assistance, and more.
            </p>
            <p className="mt-2 text-xs text-zinc-500 border-l-2 border-blue-500/30 pl-2">
              QuestIDE uses the <span className="font-mono text-blue-400">qwen/qwen3-coder-480b-a35b-instruct</span> model. This is a <span className="text-green-400 font-semibold">free endpoint</span> — try it safely with no cost concerns!
            </p>
          </div>

          {!showGuide ? (
            <>
              {/* API Key Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    NVIDIA API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setError(null);
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your NVIDIA API Key"
                      disabled={isSaving}
                      className="w-full rounded-lg border border-zinc-600 bg-zinc-950/80 px-4 py-2.5 pr-10 text-sm text-zinc-100 outline-none ring-blue-500 transition placeholder:text-zinc-500 focus:border-blue-500 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    {/* Show/Hide Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSaving}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                      title={showPassword ? "Hide key" : "Show key"}
                    >
                      {showPassword ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.604-3.368A10.048 10.048 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.047 10.047 0 01-5.595 3.6m0 0a10.05 10.05 0 01-5.548 1.2m7.669-11.422l-3.535-3.535m0 0A9.968 9.968 0 0112 2c-4.478 0-8.268 2.943-9.543 7"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !inputValue.trim()}
                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 2v20m10-10H2"
                          />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save Key"
                    )}
                  </button>
                </div>

                {/* How to Get a Key Button */}
                <button
                  type="button"
                  onClick={() => setShowGuide(true)}
                  className="w-full rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:border-blue-500/50 hover:bg-blue-500/15"
                >
                  📖 How to Get an API Key
                </button>
              </div>

              {/* Info Text */}
              <div className="mt-6 border-t border-zinc-800 pt-4">
                <p className="text-xs text-zinc-500">
                  ℹ️ Your API key is stored locally in your browser and never sent to QuestIDE servers. It's only used to communicate directly with NVIDIA's API.
                </p>
                <p className="mt-2 text-xs text-green-400/80">
                  ✓ Free endpoint — no cost concerns. Use the AI features as much as you want!
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Guide Section */}
              <div className="space-y-4 overflow-y-auto max-h-96">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/20">
                    <span className="text-xs font-bold text-blue-300">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-zinc-100">Go to NVIDIA Build Models</h3>
                    <a
                      href="https://build.nvidia.com/models"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block rounded bg-blue-500/20 px-2 py-1 text-xs font-mono text-blue-300 transition hover:bg-blue-500/30"
                    >
                      https://build.nvidia.com/models ↗
                    </a>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/20">
                    <span className="text-xs font-bold text-blue-300">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-zinc-100">Sign In or Create Account</h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Sign in with your NVIDIA account or create a new one to proceed.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-green-500 bg-green-500/20">
                    <span className="text-xs font-bold text-green-300">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-zinc-100">Open QuestIDE Model</h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Click the link to open the QuestIDE model directly:
                    </p>
                    <a
                      href="https://build.nvidia.com/qwen/qwen3-coder-480b-a35b-instruct"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block rounded bg-green-500/20 px-2 py-1 text-xs font-mono text-green-300 transition hover:bg-green-500/30 break-all"
                    >
                      https://build.nvidia.com/qwen/qwen3-coder-480b-a35b-instruct ↗
                    </a>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/20">
                    <span className="text-xs font-bold text-blue-300">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-zinc-100">Generate API Key</h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Click <span className="font-mono text-zinc-300">"View Code"</span> at the top-right, then click <span className="font-mono text-zinc-300">"Generate API Key"</span>.
                    </p>
                    <p className="mt-2 text-xs text-blue-300/80 bg-blue-500/10 border border-blue-500/30 rounded px-2 py-1">
                      The code snippet will auto-populate with your new API key.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/20">
                    <span className="text-xs font-bold text-blue-300">5</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-zinc-100">Copy & Paste Your Key</h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Copy the generated API key from the code snippet and paste it into the field above.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setShowGuide(false)}
                  className="flex-1 rounded-lg border border-zinc-600 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-700/50"
                >
                  ← Back
                </button>
                <a
                  href="https://build.nvidia.com/qwen/qwen3-coder-480b-a35b-instruct"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-center text-sm font-semibold text-white transition hover:from-green-500 hover:to-green-600"
                >
                  Open QuestIDE Model ↗
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
