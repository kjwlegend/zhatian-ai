'use client';

import * as React from 'react';
import { useChatStore } from '@/app/store/chatStore';
import { useCodeStore } from '@/app/store/codeStore';
import { BaseChatInterface } from './components/BaseChatInterface';
import { ClearChatButton } from './components/ClearChatButton';
import { MarkdownEditor } from './components/MarkdownEditor';
import { ResizableLayout } from './components/ResizableLayout';
import { SharedFirstColumn } from './components/SharedFirstColumn';
import { REQUIREMENT_SYSTEM_PROMPT } from './constants/prompts';
import { useChatMessages } from './hooks/useChatMessages';
import { useRequirementParser } from './hooks/useRequirementParser';

export function RequirementContent() {
  const setRequirementMessages = useChatStore((state) => state.setRequirementMessages);
  const requirementMessages = useChatStore((state) => state.requirementMessages);
  const { componentDoc, setComponentDoc } = useCodeStore();
  const { parseContent } = useRequirementParser();

  const { messages, isLoading, handleSendMessage, clearMessages } = useChatMessages({
    systemPrompt: REQUIREMENT_SYSTEM_PROMPT,
    initialMessages: requirementMessages,
    onMessagesChange: React.useCallback(
      (newMessages: any) => {
        setRequirementMessages(newMessages);
      },
      [setRequirementMessages]
    ),
    onResponse: React.useCallback(
      (content: any) => {
        const parsedContent = parseContent(content);
        if (parsedContent) {
          setComponentDoc(parsedContent);
        }
      },
      [parseContent, setComponentDoc]
    ),
  });

  const firstColumn = <SharedFirstColumn variant="requirement" />;

  const secondColumn = (
    <BaseChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      headerContent={
        <div className="flex items-center gap-2">
          <ClearChatButton onClear={clearMessages} tabName="Requirement" />
        </div>
      }
    />
  );

  const thirdColumn = <MarkdownEditor content={componentDoc} onChange={setComponentDoc} />;

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
