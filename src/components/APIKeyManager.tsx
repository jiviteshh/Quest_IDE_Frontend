"use client";

import { useState } from "react";
import { useAPIKey } from "@/src/hooks/useAPIKey";
import APIKeyTutorial from "./APIKeyTutorial";

export default function APIKeyManager() {
  const { apiKey, hasAPIKey, getMaskedKey, saveAPIKey, clearAPIKey } = useAPIKey();
  const [inputValue, setInputValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

  const handleSave = () => {
    if (!inputValue.trim()) {
      setFeedbackMessage("Please enter your API key");
      setFeedbackType("error");
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    saveAPIKey(inputValue);
    setInputValue("");
    setShowPassword(false);
    setFeedbackMessage("API key saved successfully!");
    setFeedbackType("success");
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to remove your API key?")) {
      clearAPIKey();
      setInputValue("");
      setFeedbackMessage("API key removed");
      setFeedbackType("success");
      setTimeout(() => setFeedbackMessage(null), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <>
      <APIKeyTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

      <div className="rounded-xl border border-zinc-700 bg-gradient-to-r from-zinc-900/50 to-zinc-800/30 p-4 backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              NVIDIA API Key
              {hasAPIKey && (
                <span className="ml-2 inline-flex items-center rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-300">
                  ✓ Connected
                </span>
              )}
            </label>
          </div>

          {/* Input Section */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  hasAPIKey
                    ? `Currently using: ${getMaskedKey()}`
                    : "Enter your NVIDIA API Key"
                }
                className="w-full rounded-lg border border-zinc-600 bg-zinc-950/80 px-3 py-2 pr-10 text-sm text-zinc-100 outline-none ring-blue-500 transition placeholder:text-zinc-500 focus:border-blue-500 focus:ring-2"
              />

              {/* Show/Hide Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-200"
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

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!inputValue.trim()}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setShowTutorial(true)}
                className="rounded-lg border border-zinc-600 bg-zinc-800/50 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-700/50"
                title="Get help setting up your API key"
              >
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Current Key Display */}
          {hasAPIKey && !inputValue && (
            <div className="flex items-center justify-between rounded-lg bg-blue-500/10 px-3 py-2">
              <span className="text-xs text-blue-300">
                Using key: <span className="font-mono font-semibold">{getMaskedKey()}</span>
              </span>
              <button
                onClick={handleClear}
                className="text-xs font-medium text-blue-300 transition hover:text-red-300"
              >
                Remove
              </button>
            </div>
          )}

          {/* Feedback Message */}
          {feedbackMessage && (
            <div
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                feedbackType === "success"
                  ? "border border-green-500/30 bg-green-500/10 text-green-300"
                  : "border border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {feedbackMessage}
            </div>
          )}

          {/* Info Text */}
          <p className="text-xs text-zinc-500">
            ℹ️ Your API key is stored locally and never sent to QuestIDE servers. Only direct NVIDIA API calls use your key.
          </p>
        </div>
      </div>
    </>
  );
}
