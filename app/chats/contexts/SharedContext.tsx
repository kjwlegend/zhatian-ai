import React, { createContext, useContext, useState } from 'react';
import { Message } from '../hooks/useChatMessages';

interface SharedContextType {
  activeImage: string | null;
  setActiveImage: (image: string | null) => void;
  markdownContent: string;
  setMarkdownContent: (content: string) => void;
  requirementMessages: Message[];
  setRequirementMessages: (messages: Message[]) => void;
  frontendMessages: Message[];
  setFrontendMessages: (messages: Message[]) => void;
  backendMessages: Message[];
  setBackendMessages: (messages: Message[]) => void;
  testMessages: Message[];
  setTestMessages: (messages: Message[]) => void;
}

const SharedContext = createContext<SharedContextType | undefined>(undefined);

export function SharedContextProvider({
  children,
  initialMarkdown = '',
}: {
  children: React.ReactNode;
  initialMarkdown?: string;
}) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState(initialMarkdown);
  const [requirementMessages, setRequirementMessages] = useState<Message[]>([]);
  const [frontendMessages, setFrontendMessages] = useState<Message[]>([]);
  const [backendMessages, setBackendMessages] = useState<Message[]>([]);
  const [testMessages, setTestMessages] = useState<Message[]>([]);

  return (
    <SharedContext.Provider
      value={{
        activeImage,
        setActiveImage,
        markdownContent,
        setMarkdownContent,
        requirementMessages,
        setRequirementMessages,
        frontendMessages,
        setFrontendMessages,
        backendMessages,
        setBackendMessages,
        testMessages,
        setTestMessages,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
}

export function useSharedContext() {
  const context = useContext(SharedContext);
  if (!context) {
    throw new Error('useSharedContext must be used within SharedContextProvider');
  }
  return context;
}
