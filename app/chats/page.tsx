'use client';

import * as React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BackendContent } from './backend';
import { ChatHeader } from './components/ChatHeader';
import { SharedContextProvider } from './contexts/SharedContext';
import { FrontendContent } from './frontend';
import { RequirementContent } from './requirement';
import { TestContent } from './test';

function ChatsContent() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState('requirement');

  const handleTabChange = React.useCallback((value: string) => {
    setCurrentTab(value);
  }, []);

  return (
    <Tabs
      defaultValue="requirement"
      className="h-screen flex flex-col"
      onValueChange={handleTabChange}
    >
      <ChatHeader isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <div className="flex-1 overflow-hidden">
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
