"use client";

import { useCallback, useMemo, useState } from "react";
import { getSupportedLanguages, runCode, submitCode } from "@/src/lib/api";
import { verdictFromRunResult, verdictFromSubmissionResult } from "@/src/lib/execution-status";
import { FALLBACK_LANGUAGES, mapSupportedLanguages } from "@/src/lib/languages";
import { LANGUAGE_TEMPLATES } from "@/src/lib/templates";
import type {
  LanguageOption,
  MonacoLanguage,
  RunCodeResponse,
  RunVerdict,
  SubmissionTestcase,
  SubmitCodeResponse,
} from "@/src/types/judge";

export function useCodingWorkspace() {
  const [languages, setLanguages] = useState<LanguageOption[]>(FALLBACK_LANGUAGES);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number>(FALLBACK_LANGUAGES[0].id);
  const [codeByLanguage, setCodeByLanguage] = useState<Record<number, string>>(
    Object.fromEntries(FALLBACK_LANGUAGES.map((language) => [language.id, language.starterCode])),
  );
  const [stdin, setStdin] = useState("");
  const [executionResult, setExecutionResult] = useState<RunCodeResponse | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmitCodeResponse | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict, setVerdict] = useState<RunVerdict | null>(null);

  const selectedLanguage = useMemo(
    () => languages.find((language) => language.id === selectedLanguageId) ?? languages[0],
    [languages, selectedLanguageId],
  );

  const sourceCode = codeByLanguage[selectedLanguageId] ?? selectedLanguage?.starterCode ?? "";

  const changeLanguage = useCallback((nextLanguageId: number) => {
    setSelectedLanguageId(nextLanguageId);
    setCodeByLanguage((current) => {
      const existing = current[nextLanguageId] ?? "";
      if (existing.trim()) return current;
      const option = languages.find((language) => language.id === nextLanguageId);
      if (!option) return current;
      return {
        ...current,
        [nextLanguageId]: LANGUAGE_TEMPLATES[option.monacoLanguage] ?? option.starterCode,
      };
    });
  }, [languages]);

  const loadLanguages = useCallback(async () => {
    try {
      const response = await getSupportedLanguages();
      const mapped = mapSupportedLanguages(response);
      setLanguages(mapped);
      setSelectedLanguageId((current) => (mapped.some((language) => language.id === current) ? current : mapped[0].id));
      setCodeByLanguage((current) => {
        const next = { ...current };
        for (const language of mapped) {
          if (!next[language.id]) next[language.id] = language.starterCode;
        }
        return next;
      });
    } catch {
      setLanguages(FALLBACK_LANGUAGES);
    }
  }, []);

  const updateCode = useCallback((value: string) => {
    setCodeByLanguage((current) => ({ ...current, [selectedLanguageId]: value }));
  }, [selectedLanguageId]);

  const executeRunCode = useCallback(async () => {
    setRunError(null);
    setVerdict(null);
    setIsRunning(true);
    try {
      const result = await runCode({
        source_code: sourceCode,
        language_id: selectedLanguageId,
        stdin,
      });
      const normalizedVerdict = verdictFromRunResult(result);
      setExecutionResult(result);
      setVerdict(normalizedVerdict);
      console.log("[workspace] run normalized", { result, verdict: normalizedVerdict });
    } catch (error) {
      setExecutionResult(null);
      setVerdict("Internal Error");
      setRunError(error instanceof Error ? error.message : "Run request failed. Check backend connectivity and try again.");
    } finally {
      setIsRunning(false);
    }
  }, [selectedLanguageId, sourceCode, stdin]);

  const executeSubmitCode = useCallback(async (testcases: SubmissionTestcase[]) => {
    if (!testcases.length) {
      setSubmitError("No testcases available. Parse a problem with examples first.");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const result = await submitCode({
        source_code: sourceCode,
        language_id: selectedLanguageId,
        testcases,
      });
      setSubmissionResult(result);
      console.log("[workspace] submit normalized", { result, verdict: verdictFromSubmissionResult(result) });
    } catch (error) {
      setSubmissionResult(null);
      setSubmitError(error instanceof Error ? error.message : "Submit request failed. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedLanguageId, sourceCode]);

  const applyStarterCode = useCallback(
    (starterCodeByLanguage: Partial<Record<MonacoLanguage, string>>) => {
      if (!starterCodeByLanguage) return;
      setCodeByLanguage((current) => {
        const next = { ...current };
        for (const language of languages) {
          const starter = starterCodeByLanguage[language.monacoLanguage];
          if (starter?.trim()) {
            next[language.id] = starter;
          }
        }
        return next;
      });
    },
    [languages],
  );

  return {
    languages,
    selectedLanguage,
    selectedLanguageId,
    setSelectedLanguageId: changeLanguage,
    sourceCode,
    updateCode,
    stdin,
    setStdin,
    runResult: executionResult,
    submission: submissionResult,
    runError,
    submitError,
    isRunning,
    isSubmitting,
    runVerdict: verdict,
    loadLanguages,
    executeRunCode,
    executeSubmitCode,
    applyStarterCode,
  };
}
