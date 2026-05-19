import axios from "axios";
import type { RunCodeResponse, SubmitCodeResponse } from "@/src/types/judge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://16.112.68.119:8000";

const aiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000,
});

/**
 * Request interceptor: Automatically attach user's NVIDIA API key to all AI requests
 * If the user has provided their own API key via the APIKeyManager component,
 * it will be sent in the x-user-api-key header.
 */
aiClient.interceptors.request.use((config) => {
  // Get API key from localStorage if it exists
  const apiKey = typeof window !== "undefined" 
    ? localStorage.getItem("questide_nvidia_api_key") 
    : null;
  
  if (apiKey) {
    config.headers["x-user-api-key"] = apiKey;
  }
  
  return config;
});

export type AIAction =
  | "chat"
  | "hint"
  | "explain_approach"
  | "optimize"
  | "find_bug"
  | "complexity_analysis"
  | "explain_solution"
  | "generate_testcases";

export type FailedTestcaseContext = {
  input: string;
  expected_output: string;
  actual_output: string;
};

export type AIContextPayload = {
  problem_title?: string;
  problem_description?: string;
  user_code?: string;
  language?: string;
  last_verdict?: string | null;
  failed_testcase?: FailedTestcaseContext | null;
  latest_run_result?: RunCodeResponse | null;
  latest_run_suite_result?: SubmitCodeResponse | null;
  latest_submit_result?: SubmitCodeResponse | null;
  execution_metadata?: Record<string, string | number | boolean | null>;
};

export type AIRequest = {
  action: AIAction;
  query?: string;
  problem_description: string;
  user_code: string;
  language: string;
  failed_testcase?: FailedTestcaseContext | null;
  last_verdict?: string | null;
  context?: AIContextPayload;
};

export type AIResponse = {
  content: string;
  action: AIAction;
  error?: string | null;
};

export async function requestAIAssist(payload: AIRequest): Promise<AIResponse> {
  try {
    const response = await aiClient.post<AIResponse>("/ai/assist", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as { detail?: string } | undefined;
      return {
        content: "",
        action: payload.action,
        error: data?.detail ?? error.message ?? "AI request failed.",
      };
    }
    return {
      content: "",
      action: payload.action,
      error: "AI request failed. Please try again.",
    };
  }
}
