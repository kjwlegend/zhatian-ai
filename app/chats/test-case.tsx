'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '@/app/store/chatStore';
import { useCodeStore, useTestCode } from '@/app/store/codeStore';
import { BaseChatInterface } from './components/BaseChatInterface';
import { ClearChatButton } from './components/ClearChatButton';
import { FrameworkSelector } from './components/FrameworkSelector';
import { ResizableLayout } from './components/ResizableLayout';
import { SharedFirstColumn } from './components/SharedFirstColumn';
import { TEST_CASE_GENERATION_PROMPT } from './constants/prompts';
import { useChatMessages } from './hooks/useChatMessages';
import { useTestCaseParser } from './hooks/useTestCaseParser';

export function TestCaseContent() {
  const { testCaseMessages, setTestCaseMessages } = useChatStore();
  const { parseTestCaseResponse } = useTestCaseParser();
  const { testCases, setTestCases } = useCodeStore();
  // const [testCases, setTestCases] = React.useState<string>('');

  const { messages, handleSendMessage, clearMessages } = useChatMessages({
    systemPrompt: TEST_CASE_GENERATION_PROMPT,
    initialMessages: testCaseMessages,
    onMessagesChange: React.useCallback(
      (newMessages: any) => {
        setTestCaseMessages(newMessages);
      },
      [setTestCaseMessages]
    ),
    onResponse: React.useCallback((response: string) => {
      const { content } = parseTestCaseResponse(response);
      setTestCases(content);
    }, []),
  });

  const handleClearAll = React.useCallback(() => {
    clearMessages();
    setTestCases('');
  }, [clearMessages]);

  // const firstColumn = <SharedFirstColumn />;

  const secondColumn = (
    <BaseChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      headerContent={
        <div className="flex items-center gap-2">
          {/* <FrameworkSelector
            type="test"
            value={selectedFramework}
            onValueChange={handleFrameworkChange}
          /> */}
          <ClearChatButton onClear={handleClearAll} tabName="Test Cases" />
        </div>
      }
    />
  );

  const thirdColumn = (
    <div className="w-full h-full overflow-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            table: ({ node, ...props }) => (
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                {...props}
              />
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 dark:text-gray-300"
                {...props}
              />
            ),
          }}
        >
          {testCases || '等待生成测试用例...'}
        </ReactMarkdown>
      </div>
    </div>
  );

  return (
    <div className="h-full p-4">
      <ResizableLayout
        firstColumn={secondColumn}
        secondColumn={thirdColumn}
        // thirdColumn={thirdColumn}
      />
    </div>
  );
}
