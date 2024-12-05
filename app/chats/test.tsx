'use client';

import * as React from 'react';
import { useChatStore } from '@/app/store/chatStore';
import { useTestCode } from '@/app/store/codeStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseChatInterface } from './components/BaseChatInterface';
import { ClearChatButton } from './components/ClearChatButton';
import { CodeDisplay } from './components/CodeDisplay';
import {
  FRAMEWORK_OPTIONS,
  FrameworkSelector,
  getLanguageByTab,
} from './components/FrameworkSelector';
import { SharedFirstColumn } from './components/SharedFirstColumn';
import { getTestPrompt } from './constants/prompts';
import { useChatMessages } from './hooks/useChatMessages';
import { useCodeParser } from './hooks/useCodeParser';

export function TestContent() {
  const { testMessages, setTestMessages } = useChatStore();
  const {
    selectedFramework,
    setSelectedFramework,
    codeOutput,
    updateCodeOutput,
    clearCodeOutput,
    activeTab,
    setActiveTab,
  } = useTestCode();

  const { parseResponse } = useCodeParser();
  const [copiedStates, setCopiedStates] = React.useState<Record<string, boolean>>({});

  const { messages, isLoading, handleSendMessage, clearMessages } = useChatMessages({
    systemPrompt: getTestPrompt(selectedFramework),
    initialMessages: testMessages,
    onMessagesChange: React.useCallback(
      (newMessages: any) => {
        setTestMessages(newMessages);
      },
      [setTestMessages]
    ),
    onResponse: React.useCallback(
      (content: string) => {
        const parsed = parseResponse(content, selectedFramework, 'test');
        if (Object.keys(parsed.code).length > 0) {
          updateCodeOutput(parsed.code);
        }
      },
      [parseResponse, selectedFramework, updateCodeOutput]
    ),
  });

  const handleFrameworkChange = React.useCallback(
    (value: string) => {
      setSelectedFramework(value);
    },
    [setSelectedFramework]
  );

  const handleClearAll = React.useCallback(() => {
    clearMessages();
    clearCodeOutput();
  }, [clearMessages, clearCodeOutput]);

  const handleCopyCode = React.useCallback(
    (type: string) => {
      navigator.clipboard.writeText(codeOutput[type] || '');
      setCopiedStates((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => setCopiedStates((prev) => ({ ...prev, [type]: false })), 2000);
    },
    [codeOutput]
  );

  const frameworkConfig = FRAMEWORK_OPTIONS.test.find((f) => f.value === selectedFramework)!;

  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-3 overflow-hidden">
      <SharedFirstColumn />

      <BaseChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        headerContent={
          <div className="flex items-center gap-2">
            <FrameworkSelector
              type="test"
              value={selectedFramework}
              onValueChange={handleFrameworkChange}
            />
            <ClearChatButton onClear={handleClearAll} tabName="Test" />
          </div>
        }
      />

      <div className="w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList>
            {frameworkConfig.tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
          {frameworkConfig.tabs.map((tab) => (
            <TabsContent key={tab} value={tab} className="flex-grow overflow-y-auto h-full">
              <CodeDisplay
                code={codeOutput[tab] || '// No code generated yet'}
                language={getLanguageByTab(tab)}
                onCopy={() => handleCopyCode(tab)}
                isCopied={copiedStates[tab]}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
