'use client';

import * as React from 'react';
import { BaseChatInterface } from './components/BaseChatInterface';
import { ClearChatButton } from './components/ClearChatButton';
import { ImageUploader } from './components/ImageUploader';
import { MarkdownEditor } from './components/MarkdownEditor';
import { REQUIREMENT_SYSTEM_PROMPT } from './constants/prompts';
import { useSharedContext } from './contexts/SharedContext';
import { useChatMessages } from './hooks/useChatMessages';
import { useRequirementParser } from './hooks/useRequirementParser';

export function RequirementContent() {
  const {
    activeImage,
    setActiveImage,
    markdownContent,
    setMarkdownContent,
    requirementMessages,
    setRequirementMessages,
  } = useSharedContext();

  const { parseContent } = useRequirementParser();

  const { messages, isLoading, handleSendMessage, clearMessages } = useChatMessages({
    systemPrompt: REQUIREMENT_SYSTEM_PROMPT,
    initialMessages: requirementMessages,
    onMessagesChange: (newMessages) => {
      setRequirementMessages(newMessages);
    },
    onResponse: (content) => {
      const parsedContent = parseContent(content);
      if (parsedContent) {
        setMarkdownContent(parsedContent);
      }
    },
  });

  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-3 overflow-hidden">
      <ImageUploader activeImage={activeImage} setActiveImage={setActiveImage} />
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
      <MarkdownEditor content={markdownContent} onChange={setMarkdownContent} />
    </div>
  );
}
