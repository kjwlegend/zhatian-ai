import { FRAMEWORK_OPTIONS } from '../components/FrameworkSelector';

export interface CodeOutput {
  [key: string]: string;
}

export interface ParsedResponse {
  code: CodeOutput;
  explanation?: string;
}

export type CodeType = 'frontend' | 'backend' | 'test' | 'cms';

export function useCodeParser() {
  const parseResponse = (content: string, framework: string, type: CodeType): ParsedResponse => {
    const codeBlocks: CodeOutput = {};
    const frameworkConfig = FRAMEWORK_OPTIONS[type].find((f) => f.value === framework);

    // Extract code blocks
    const codeRegex = /```(\w+)\n([\s\S]*?)```/g;
    let match;

    while ((match = codeRegex.exec(content)) !== null) {
      const [_, language, code] = match;
      const normalizedLang = language.toLowerCase();

      // Only store code blocks that are valid for the current framework
      if (frameworkConfig?.tabs.includes(normalizedLang as never)) {
        codeBlocks[normalizedLang] = code.trim();
      }
    }

    console.log('codeBlocks', codeBlocks);
    return {
      code: codeBlocks,
      explanation: content,
    };
  };

  return {
    parseResponse,
  };
}
