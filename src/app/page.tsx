/**
 * Landing page with:
 * - Modal-based API Key onboarding (shown on first visit)
 * - Problem input form
 * - Recent workspaces section
 *
 * Existing parse flow is UNCHANGED.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingHero from "@/src/components/LandingHero";
import ProblemInputForm from "@/src/components/ProblemInputForm";
import GeneratingModal from "@/src/components/GeneratingModal";
import RecentWorkspaces from "@/src/components/RecentWorkspaces";
import HomepageFooter from "@/src/components/HomepageFooter";
import APIKeyOnboardingModal from "@/src/components/APIKeyOnboardingModal";
import { parseProblem } from "@/src/lib/api";
import { saveParsedProblem, saveStoredProblem } from "@/src/lib/problem-storage";
import { useAPIKey } from "@/src/hooks/useAPIKey";
import type { RecentWorkspace } from "@/src/lib/workspace-storage";

export default function LandingPage() {
  const router = useRouter();
  const { hasAPIKey, isLoaded } = useAPIKey();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAPIModal, setShowAPIModal] = useState(false);

  // Show API key modal on first visit if no key exists
  useEffect(() => {
    if (isLoaded && !hasAPIKey) {
      setShowAPIModal(true);
    }
  }, [isLoaded, hasAPIKey]);

  async function handleParseProblem(problemText: string) {
    setIsGenerating(true);
    try {
      const parsed = await parseProblem({ problem_text: problemText });
      console.log("[handleParseProblem] title:", parsed.title);
      console.log("[handleParseProblem] testcases:", parsed.testcases?.length ?? 0);
      saveParsedProblem(parsed);
      router.push("/workspace");
    } catch (error) {
      setIsGenerating(false);
      throw error; // Let the form handle the error display
    }
  }

  function handleRecentSelect(workspace: RecentWorkspace) {
    // The problem is already in localStorage — just navigate
    if (!workspace.problem) return;
    saveStoredProblem(workspace.problem);
    router.push("/workspace");
  }

  return (
    <>
      <GeneratingModal isOpen={isGenerating} />
      <APIKeyOnboardingModal isOpen={showAPIModal} onClose={() => setShowAPIModal(false)} />
      <main className="min-h-0 flex-1 overflow-auto bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 px-4 py-6 text-zinc-100 md:px-6 md:py-7">
        <section className="mx-auto w-full max-w-4xl pb-6">
          <LandingHero
            title="Bring Any Coding Problem Into an AI-Native IDE"
            subtitle="Can't find the exact problem on any platform? Paste it into QuestIDE and turn it into a complete interactive workspace with execution, AI guidance, and testcase validation."
          />
          <ProblemInputForm 
            onSubmit={handleParseProblem}
            onAPIKeyClick={() => setShowAPIModal(true)}
          />
          <RecentWorkspaces onSelect={handleRecentSelect} />
          <HomepageFooter />
        </section>
      </main>
    </>
  );
}
