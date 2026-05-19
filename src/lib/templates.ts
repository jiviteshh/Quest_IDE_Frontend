import type { MonacoLanguage } from "@/src/types/judge";

export const LANGUAGE_TEMPLATES: Record<MonacoLanguage, string> = {
  python: `def solve():
    print("Hello World")

if __name__ == "__main__":
    solve()
`,
  java: `public class Main {
    public static void main(String[] args) {
        
    }
}
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    
    return 0;
}
`,
};

export const LANGUAGE_GUIDANCE: Record<MonacoLanguage, string> = {
  python: "Python scripts can run directly.",
  java: "Java requires a full executable program with `public class Main` and `main` method.",
  cpp: "C++ requires a full executable program with `int main()`.",
};

