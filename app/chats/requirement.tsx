'use client';

import * as React from 'react';
import { ChatInterface } from './components/ChatInterface';
import { ImageUploader } from './components/ImageUploader';
import { MarkdownEditor } from './components/MarkdownEditor';
import { useSharedContext } from './contexts/SharedContext';

const mockMessages = [
  { role: 'user' as const, content: 'Can you help me design a login page?' },
  {
    role: 'assistant' as const,
    content:
      "I'd be happy to help you design a login page. Let's break it down into the key components and best practices. Here's a general outline for a good login page:",
  },
  {
    role: 'user' as const,
    content: 'That sounds great. Can you provide more details on the form fields?',
  },
  {
    role: 'assistant' as const,
    content:
      "Of course! Let's dive into the details of the form fields for the login page. Here are the key elements you should include:",
  },
];

export function RequirementContent() {
  const [chatMessages, setChatMessages] = React.useState(mockMessages);
  const { activeImage, setActiveImage, markdownContent, setMarkdownContent } = useSharedContext();

  const handleSendMessage = (message: string) => {
    setChatMessages([...chatMessages, { role: 'user' as const, content: message }]);
    // TODO: Add requirement-specific API call logic
  };

  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-3 overflow-hidden">
      <ImageUploader activeImage={activeImage} setActiveImage={setActiveImage} />
      <ChatInterface messages={chatMessages as any} onSendMessage={handleSendMessage} />
      <MarkdownEditor content={markdownContent} onChange={setMarkdownContent} />
    </div>
  );
}
