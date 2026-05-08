"use client";

import { useState } from "react";
import MonacoEditor from "@/src/components/MonacoEditor";

const starterCode = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Monaco"));
`;

export default function Home() {
  const [language, setLanguage] = useState("typescript");
  const [code, setCode] = useState(starterCode);

  return (
    <main className="min-h-screen w-full bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
            Developer Editor
          </h1>

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            Language
            <select
              className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-zinc-100 outline-none ring-zinc-500 transition focus:ring-2"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="json">JSON</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
            </select>
          </label>
        </div>

        <MonacoEditor language={language} value={code} onChange={setCode} />
      </section>
    </main>
  );
}
