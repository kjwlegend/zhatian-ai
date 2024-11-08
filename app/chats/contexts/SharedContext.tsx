import React, { createContext, useContext, useState } from 'react';

interface SharedContextType {
  activeImage: string | null;
  setActiveImage: (image: string | null) => void;
  markdownContent: string;
  setMarkdownContent: (content: string) => void;
}

const SharedContext = createContext<SharedContextType | undefined>(undefined);

export function SharedProvider({
  children,
  initialMarkdown,
}: {
  children: React.ReactNode;
  initialMarkdown: string;
}) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState(initialMarkdown);

  return (
    <SharedContext.Provider
      value={{
        activeImage,
        setActiveImage,
        markdownContent,
        setMarkdownContent,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
}

export function useSharedContext() {
  const context = useContext(SharedContext);
  if (context === undefined) {
    throw new Error('useSharedContext must be used within a SharedProvider');
  }
  return context;
}
