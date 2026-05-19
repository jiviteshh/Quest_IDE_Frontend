import axios from "axios";
import type {
  ParsedProblem,
  RunCodeRequest,
  RunCodeResponse,
  SubmitCodeRequest,
  SubmitCodeResponse,
  SupportedLanguageApiItem,
} from "@/src/types/judge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://16.112.68.119:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000,
});

/**
 * Request interceptor: Automatically attach user's NVIDIA API key to all requests
 * If the user has provided their own API key via the APIKeyManager component,
 * it will be sent in the x-user-api-key header.
 */
apiClient.interceptors.request.use((config) => {
  // Get API key from localStorage if it exists
  const apiKey = typeof window !== "undefined" 
    ? localStorage.getItem("questide_nvidia_api_key") 
    : null;
  
  if (apiKey) {
    config.headers["x-user-api-key"] = apiKey;
  }
  
  return config;
});

function parseAxiosError(error: unknown, fallbackMessage: string): Error {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: string } | undefined;
    return new Error(data?.detail ?? error.message ?? fallbackMessage);
  }
  return new Error(fallbackMessage);
}

export async function runCode(payload: RunCodeRequest) {
  try {
    console.log("[runCode] ========== DEBUG ==========");
    console.log("[runCode] language_id:", payload.language_id);
    console.log("[runCode] stdin:", JSON.stringify(payload.stdin));
    console.log("[runCode] stdin length:", payload.stdin?.length ?? 0);
    console.log("[runCode] source_code length:", payload.source_code?.length ?? 0);
    console.log("[runCode] ============================");
    const response = await apiClient.post<RunCodeResponse>("/judge/run-code", payload);
    console.log("[runCode] raw response", response.data);
    const normalized: RunCodeResponse = {
      stdout: response.data.stdout ?? "",
      stderr: response.data.stderr ?? "",
      compile_output: response.data.compile_output ?? "",
      exit_code: response.data.exit_code ?? null,
      language: response.data.language ?? "",
      version: response.data.version ?? "",
      time: response.data.time ?? null,
      wall_time: response.data.wall_time ?? null,
      memory: response.data.memory ?? null,
      message: response.data.message ?? response.data.status?.description ?? "",
      signal: response.data.signal ?? null,
      status: response.data.status,
    };
    console.log("[runCode] normalized response", normalized);
    return normalized;
  } catch (error) {
    throw parseAxiosError(error, "Run request failed.");
  }
}

export async function submitCode(payload: SubmitCodeRequest) {
  try {
    const normalizedPayload: SubmitCodeRequest = {
      ...payload,
      testcases: payload.testcases.map((tc) => ({
        id: tc.id,
        display_input: tc.display_input ?? tc.stdin,
        display_output: tc.display_output ?? tc.expected_output,
        stdin: tc.stdin ?? "",
        expected_output: tc.expected_output ?? "",
        is_hidden: tc.is_hidden ?? false,
      })),
    };
    console.log("[submitCode] ========== DEBUG ==========");
    console.log("[submitCode] language_id:", normalizedPayload.language_id);
    console.log("[submitCode] testcase count:", normalizedPayload.testcases.length);
    normalizedPayload.testcases.forEach((tc, i) => {
      console.log(`[submitCode] TC ${i + 1} stdin:`, JSON.stringify(tc.stdin));
      console.log(`[submitCode] TC ${i + 1} stdin length:`, tc.stdin?.length ?? 0);
      console.log(`[submitCode] TC ${i + 1} expected:`, JSON.stringify(tc.expected_output));
      console.log(`[submitCode] TC ${i + 1} is_hidden:`, tc.is_hidden);
    });
    console.log("[submitCode] ============================");
    const response = await apiClient.post<SubmitCodeResponse>("/judge/submit", normalizedPayload);
    console.log("[submitCode] raw response", response.data);
    const data = response.data;

    const mappedTestcases =
      data.testcases ??
      (data.results ?? []).map((result, index) => ({
        testcase: result.testcase,
        input: payload.testcases[index]?.display_input ?? payload.testcases[index]?.stdin ?? "",
        expected_output: result.expected_output ?? payload.testcases[index]?.expected_output ?? "",
        actual_output: result.stdout ?? "",
        passed: result.status === "Passed",
        status: result.status,
        stderr: result.stderr,
        stdout: result.stdout,
        is_hidden: result.is_hidden ?? false,
        execution_time_ms: result.execution_time_ms ?? null,
        memory_kb: result.memory_kb ?? null,
      }));

    const normalized = {
      ...data,
      passed_count: data.passed_count ?? data.passed_testcases ?? 0,
      total_count: data.total_count ?? data.total_testcases ?? mappedTestcases.length,
      testcases: mappedTestcases,
    } as SubmitCodeResponse;
    console.log("[submitCode] normalized response", normalized);
    return normalized;
  } catch (error) {
    throw parseAxiosError(error, "Submit request failed.");
  }
}

export async function getSupportedLanguages() {
  const response = await apiClient.get<
    SupportedLanguageApiItem[] | { languages?: Record<string, { name?: string }> | Record<number, { name?: string }> }
  >(
    "/judge/supported-languages",
  );
  const data = response.data;
  if (Array.isArray(data)) return data;
  const languageMap = data.languages ?? {};
  return Object.entries(languageMap).map(([id, value]) => ({
    id: Number(id),
    name: value?.name ?? "",
  }));
}

export async function parseProblem(payload: { problem_text: string }) {
  try {
    // LLM parsing is slow — give it up to 2 minutes
    const response = await apiClient.post<{ parsed_problem?: ParsedProblem } | ParsedProblem>(
      "/parse-problem",
      payload,
      { timeout: 120_000 },
    );
    const data = response.data as { parsed_problem?: ParsedProblem } & ParsedProblem;
    return data.parsed_problem ?? data;
  } catch (error) {
    throw parseAxiosError(error, "Failed to parse problem. The AI may be slow — try again.");
  }
}
