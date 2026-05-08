import axios from "axios";
import type {
  ParsedProblem,
  RunCodeRequest,
  RunCodeResponse,
  SubmitCodeRequest,
  SubmitCodeResponse,
  SupportedLanguageApiItem,
} from "@/src/types/judge";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000,
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
    const response = await apiClient.post<SubmitCodeResponse>("/judge/submit", payload);
    console.log("[submitCode] raw response", response.data);
    const data = response.data;

    const mappedTestcases =
      data.testcases ??
      (data.results ?? []).map((result, index) => ({
        testcase: result.testcase,
        input: payload.testcases[index]?.input ?? "",
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
    const response = await apiClient.post<{ parsed_problem?: ParsedProblem } | ParsedProblem>(
      "/parse-problem",
      payload,
    );
    const data = response.data as { parsed_problem?: ParsedProblem } & ParsedProblem;
    return data.parsed_problem ?? data;
  } catch (error) {
    throw parseAxiosError(error, "Failed to parse problem.");
  }
}
