'use client';

import * as React from 'react';
import { useChatStore } from '@/app/store/chatStore';
import { useFrontendCode } from '@/app/store/codeStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseChatInterface } from './components/BaseChatInterface';
import { ClearChatButton } from './components/ClearChatButton';
import { CodeDisplay } from './components/CodeDisplay';
import {
  FRAMEWORK_OPTIONS,
  FrameworkSelector,
  getLanguageByTab,
} from './components/FrameworkSelector';
import { ResizableLayout } from './components/ResizableLayout';
import { SharedFirstColumn } from './components/SharedFirstColumn';
import { getFrontendPrompt } from './constants/prompts';
import { FRONTEND_QUICK_PROMPTS } from './constants/quickPrompts';
import { Message, useChatMessages } from './hooks/useChatMessages';
import { useCodeParser } from './hooks/useCodeParser';

export function FrontendContent() {
  const { frontendMessages, setFrontendMessages } = useChatStore();
  const {
    selectedFramework,
    setSelectedFramework,
    codeOutput,
    updateCodeOutput,
    clearCodeOutput,
    activeTab,
    setActiveTab,
  } = useFrontendCode();

  const { parseResponse } = useCodeParser();
  const [copiedStates, setCopiedStates] = React.useState<Record<string, boolean>>({});

  const { messages, isLoading, handleSendMessage, clearMessages } = useChatMessages({
    systemPrompt: getFrontendPrompt(selectedFramework),
    initialMessages: frontendMessages,
    onMessagesChange: React.useCallback(
      (newMessages: Message[]) => {
        setFrontendMessages(newMessages);
      },
      [setFrontendMessages]
    ),
    onResponse: React.useCallback(
      (content: string) => {
        const parsed = parseResponse(content, selectedFramework, 'frontend');
        if (Object.keys(parsed.code).length > 0) {
          updateCodeOutput(parsed.code);
        }
      },
      [parseResponse, selectedFramework, updateCodeOutput]
    ),
    api: selectedFramework === 'baozun-ace' ? 'dify' : 'openai',
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

  const frameworkConfig = FRAMEWORK_OPTIONS.frontend.find((f) => f.value === selectedFramework)!;

  const firstColumn = <SharedFirstColumn />;

  const secondColumn = (
    <BaseChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      quickPrompts={FRONTEND_QUICK_PROMPTS}
      headerContent={
        <div className="flex items-center gap-2">
          <FrameworkSelector
            type="frontend"
            value={selectedFramework}
            onValueChange={handleFrameworkChange}
          />
          <ClearChatButton onClear={handleClearAll} tabName="Frontend" />
        </div>
      }
    />
  );

  const thirdColumn = (
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
  );

  return (
    <div className="h-full p-4">
      <ResizableLayout
        firstColumn={firstColumn}
        secondColumn={secondColumn}
        thirdColumn={thirdColumn}
      />
    </div>
  );
}
