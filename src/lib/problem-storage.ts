import type { MonacoLanguage, ParsedProblem, ParsedTestcase } from "@/src/types/judge";

const STORAGE_KEY = "ai-coding-platform:parsed-problem";

export type StoredProblem = {
  title: string;
  difficulty: string;
  description: string;
  constraints: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;
  testcases: ParsedTestcase[];
  publicTestcases: ParsedTestcase[];
  hiddenTestcases: ParsedTestcase[];
  starterCodeByLanguage: Partial<Record<MonacoLanguage, string>>;
  raw: ParsedProblem;
};

function normalizeStarterCode(starterCode?: ParsedProblem["starter_code"]) {
  if (!starterCode) return {};
  if (typeof starterCode === "string") {
    return { python: starterCode, java: starterCode, cpp: starterCode };
  }
  return starterCode;
}

export function toStoredProblem(problem: ParsedProblem): StoredProblem {
  const testcases = problem.testcases ?? [];
  const publicTestcases = testcases.filter((tc) => !tc.is_hidden);
  const hiddenTestcases = testcases.filter((tc) => tc.is_hidden);

  return {
    title: problem.title ?? "Untitled Problem",
    difficulty: String(problem.difficulty ?? "Medium"),
    description: problem.description ?? "",
    constraints: problem.constraints ?? [],
    examples: problem.examples ?? [],
    testcases,
    publicTestcases,
    hiddenTestcases,
    starterCodeByLanguage: normalizeStarterCode(problem.starter_code),
    raw: problem,
  };
}

export function saveParsedProblem(problem: ParsedProblem) {
  if (typeof window === "undefined") return;
  const payload = toStoredProblem(problem);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function saveStoredProblem(problem: StoredProblem) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(problem));
}

export function getParsedProblem(): StoredProblem | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredProblem;
  } catch {
    return null;
  }
}

export function clearParsedProblem() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
