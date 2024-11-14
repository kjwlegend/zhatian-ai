'use client';

import * as React from 'react';
import { useChatStore } from '@/app/store/chatStore';
import { useCodeStore } from '@/app/store/codeStore';
import { BaseChatInterface } from './components/BaseChatInterface';
import { ClearChatButton } from './components/ClearChatButton';
import { SharedFirstColumn } from './components/SharedFirstColumn';
import { REQUIREMENT_SYSTEM_PROMPT } from './constants/prompts';
import { useChatMessages } from './hooks/useChatMessages';
import { useRequirementParser } from './hooks/useRequirementParser';

export function RequirementContent() {
  const setRequirementMessages = useChatStore((state) => state.setRequirementMessages);
  const requirementMessages = useChatStore((state) => state.requirementMessages);
  const { setComponentDoc } = useCodeStore();
  const { parseContent } = useRequirementParser();

  const { messages, isLoading, handleSendMessage, clearMessages } = useChatMessages({
    systemPrompt: REQUIREMENT_SYSTEM_PROMPT,
    initialMessages: requirementMessages,
    onMessagesChange: React.useCallback((newMessages) => {
      setRequirementMessages(newMessages);
    }, [setRequirementMessages]),
    onResponse: React.useCallback((content) => {
      const parsedContent = parseContent(content);
      if (parsedContent) {
        setComponentDoc(parsedContent);
      }
    }, [parseContent, setComponentDoc]),
  });

  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-3 overflow-hidden">
      <SharedFirstColumn />
      <div className="w-full h-full">
        <BaseChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          headerContent={
            <div className="flex items-center gap-2">
              <ClearChatButton onClear={clearMessages} tabName="Requirement" />
            </div>
          }
        />
      </div>
    </div>
  );
}
