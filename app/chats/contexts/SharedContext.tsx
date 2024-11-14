import React, { createContext, useContext } from 'react';

interface SharedContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentTopic: string;
  setCurrentTopic: (topic: string) => void;
}

const SharedContext = createContext<SharedContextType | null>(null);

export function SharedContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentView, setCurrentView] = React.useState('');
  const [currentTopic, setCurrentTopic] = React.useState('');

  return (
    <SharedContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentTopic,
        setCurrentTopic,
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
