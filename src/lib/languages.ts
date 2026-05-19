import type { LanguageOption, SupportedLanguageApiItem } from "@/src/types/judge";
import { LANGUAGE_TEMPLATES } from "@/src/lib/templates";

const DEFAULT_LANGUAGE_IDS = {
  Python: 71,
  Java: 62,
  "C++": 54,
} as const;

const STARTER_CODE = LANGUAGE_TEMPLATES;

const ALLOWED = ["python", "java", "c++"] as const;

function normalizeName(item: SupportedLanguageApiItem): string {
  return (item.name ?? item.language ?? item.slug ?? "").trim().toLowerCase();
}

function toLanguageOption(name: string, id: number): LanguageOption | null {
  if (name === "python") {
    return { id, label: "Python", monacoLanguage: "python", starterCode: STARTER_CODE.python };
  }
  if (name === "java") {
    return { id, label: "Java", monacoLanguage: "java", starterCode: STARTER_CODE.java };
  }
  if (name === "c++") {
    return { id, label: "C++", monacoLanguage: "cpp", starterCode: STARTER_CODE.cpp };
  }
  return null;
}

export const FALLBACK_LANGUAGES: LanguageOption[] = [
  { id: DEFAULT_LANGUAGE_IDS.Python, label: "Python", monacoLanguage: "python", starterCode: STARTER_CODE.python },
  { id: DEFAULT_LANGUAGE_IDS.Java, label: "Java", monacoLanguage: "java", starterCode: STARTER_CODE.java },
  { id: DEFAULT_LANGUAGE_IDS["C++"], label: "C++", monacoLanguage: "cpp", starterCode: STARTER_CODE.cpp },
];

export function mapSupportedLanguages(apiItems: SupportedLanguageApiItem[]): LanguageOption[] {
  const mapped = apiItems
    .map((item) => {
      const name = normalizeName(item);
      if (!ALLOWED.includes(name as (typeof ALLOWED)[number])) return null;
      const id = item.id ?? item.language_id;
      if (!id) return null;
      return toLanguageOption(name, id);
    })
    .filter((item): item is LanguageOption => Boolean(item));

  if (mapped.length === 0) return FALLBACK_LANGUAGES;

  const order = new Map([["Python", 0], ["Java", 1], ["C++", 2]]);
  return mapped.sort((a, b) => (order.get(a.label) ?? 99) - (order.get(b.label) ?? 99));
}
