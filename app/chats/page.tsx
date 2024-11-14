'use client';

import * as React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BackendContent } from './backend';
import { ChatHeader } from './components/ChatHeader';
import { SharedContextProvider, useSharedContext } from './contexts/SharedContext';
import { FrontendContent } from './frontend';
import { RequirementContent } from './requirement';
import { TestContent } from './test';

function ChatsContent() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState('requirement');
  const { setRequirementMessages, setFrontendMessages } = useSharedContext();

  const handleClearMessages = React.useCallback(() => {
    switch (currentTab) {
      case 'requirement':
        setRequirementMessages([]);
        break;
      case 'frontend':
        setFrontendMessages([]);
        break;
      // Add other cases as needed
    }
  }, [currentTab, setRequirementMessages, setFrontendMessages]);

  return (
    <Tabs
      defaultValue="requirement"
      className="h-screen flex flex-col"
      onValueChange={setCurrentTab}
    >
      <ChatHeader isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <div className="flex-1 overflow-hidden ">
        <TabsContent value="requirement" className="h-full">
          <RequirementContent />
        </TabsContent>
        <TabsContent value="frontend" className="h-full">
          <FrontendContent />
        </TabsContent>
        <TabsContent value="backend" className="h-full">
          <BackendContent />
        </TabsContent>
        <TabsContent value="test" className="h-full">
          <TestContent />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default function ChatsPage() {
  return (
    <SharedContextProvider>
      <ChatsContent />
    </SharedContextProvider>
  );
}
