export type MonacoLanguage = "python" | "java" | "cpp";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type SupportedLanguageApiItem = {
  id?: number;
  language_id?: number;
  name?: string;
  language?: string;
  slug?: string;
};

export type LanguageOption = {
  id: number;
  label: string;
  monacoLanguage: MonacoLanguage;
  starterCode: string;
};

export type RunCodeRequest = {
  source_code: string;
  language_id: number;
  stdin: string;
};

export type RunCodeResponse = {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  exit_code?: number | null;
  time?: string | null;
  wall_time?: string | null;
  memory?: number | null;
  message?: string | null;
  signal?: string | null;
  language?: string | null;
  version?: string | null;
  status?: {
    id?: string;
    description?: string;
  };
};

export type RunVerdict =
  | "Accepted"
  | "Wrong Answer"
  | "Runtime Error"
  | "Compilation Error"
  | "Time Limit Exceeded"
  | "Internal Error";

export type SubmitCodeRequest = {
  source_code: string;
  language_id: number;
  testcases: SubmissionTestcase[];
};

export type SubmissionTestcase = {
  input: string;
  expected_output: string;
  is_hidden?: boolean;
};

export type TestcaseResult = {
  testcase?: number;
  input: string;
  expected_output: string;
  actual_output: string;
  passed: boolean;
  status?: string;
  stderr?: string;
  stdout?: string;
  is_hidden?: boolean;
  execution_time_ms?: number | null;
  memory_kb?: number | null;
};

export type SubmitCodeResponse = {
  verdict: string;
  passed_count?: number;
  total_count?: number;
  passed_testcases?: number;
  total_testcases?: number;
  testcases?: TestcaseResult[];
  results?: Array<{
    testcase: number;
    status: "Passed" | "Failed" | "Skipped";
    stdout: string;
    stderr: string;
    expected_output?: string | null;
    is_hidden?: boolean;
    execution_time_ms?: number | null;
    memory_kb?: number | null;
  }>;
  language?: string;
  version?: string;
};

export type ProblemExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type ParsedProblem = {
  title: string;
  difficulty?: Difficulty | string;
  description?: string;
  constraints?: string[];
  examples?: ProblemExample[];
  starter_code?: string | Partial<Record<MonacoLanguage, string>>;
};
