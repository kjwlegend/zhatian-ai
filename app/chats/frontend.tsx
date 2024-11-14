'use client';

import * as React from 'react';
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
import { SharedFirstColumn } from './components/SharedFirstColumn';
import { getFrontendPrompt } from './constants/prompts';
import { useSharedContext } from './contexts/SharedContext';
import { useChatMessages } from './hooks/useChatMessages';
import { useCodeParser } from './hooks/useCodeParser';

const mockChatMessages = [
  { role: 'user', content: 'Can you create a login form?' },
  { role: 'assistant', content: "I'll create a basic login form for you." },
];

const mockCodeOutput = {
  html: '<form>\n  <input type="text" placeholder="Username" />\n  <input type="password" placeholder="Password" />\n  <button type="submit">Login</button>\n</form>',
  style:
    '.form-input {\n  margin-bottom: 10px;\n}\n\n.form-button {\n  background-color: #007bff;\n  color: white;\n}',
  js: 'document.querySelector("form").addEventListener("submit", (e) => {\n  e.preventDefault();\n  // Handle form submission\n});',
};

export function FrontendContent() {
  const {
    activeImage,
    setActiveImage,
    markdownContent,
    setMarkdownContent,
    frontendMessages,
    setFrontendMessages,
  } = useSharedContext();

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

  const { messages, isLoading, handleSendMessage, clearMessages } = useChatMessages({
    systemPrompt: getFrontendPrompt(selectedFramework),
    initialMessages: frontendMessages,
    onMessagesChange: (newMessages) => {
      setFrontendMessages(newMessages);
    },
    onResponse: (content) => {
      console.log('content', content);
      const parsed = parseResponse(content, selectedFramework, 'frontend');

      // Update code output if there are code blocks
      if (Object.keys(parsed.code).length > 0) {
        updateCodeOutput(parsed.code);
      }
    },
  });

  const frameworkConfig = FRAMEWORK_OPTIONS.frontend.find((f) => f.value === selectedFramework)!;
  const [copiedStates, setCopiedStates] = React.useState<Record<string, boolean>>({});

  const handleFrameworkChange = (value: string) => {
    setSelectedFramework(value);
  };

  const handleClearAll = () => {
    clearMessages();
    clearCodeOutput();
  };

  const handleCopyCode = (type: string) => {
    navigator.clipboard.writeText(codeOutput[type] || '');
    setCopiedStates({ ...copiedStates, [type]: true });
    setTimeout(() => setCopiedStates({ ...copiedStates, [type]: false }), 2000);
  };

  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-3 overflow-hidden">
      <SharedFirstColumn />

      <BaseChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
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
