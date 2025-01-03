export interface TestCaseOutput {
  content: string;
  explanation?: string;
}

export function useTestCaseParser() {
  const parseTestCaseResponse = (response: string): TestCaseOutput => {
    // 匹配任意代码块
    const contentRegex = /```([\s\S]*?)```/;
    const match = response.match(contentRegex);

    if (!match) {
      // 如果没有找到代码块，返回原始内容
      return {
        content: response,
        explanation: response,
      };
    }

    const [_, content] = match;

    // 提取代码块之外的解释文本
    const explanation = response
      .replace(match[0], '') // 移除代码块
      .trim();

    return {
      content: content.replace('markdown', '').trim(),
      explanation: explanation || undefined,
    };
  };

  return {
    parseTestCaseResponse,
  };
}
