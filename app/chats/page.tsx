'use client';

import { useChatStore } from '@/app/store/chatStore';
// import { useBackendCode, useFrontendCode, useTestCode } from '@/app/store/codeStore';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import * as React from 'react';
import { BackendContent } from './backend';
import { ChatHeader } from './components/ChatHeader';
import { SharedContextProvider, useSharedContext } from './contexts/SharedContext';
import { FrontendContent } from './frontend';
import { RequirementContent } from './requirement';
import { TestContent } from './test';
// import {
//   FRAMEWORK_OPTIONS,
// } from './components/FrameworkSelector';

function ChatsContent() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState('requirement');
  const { setRequirementMessages, setFrontendMessages, setActiveImage, setMarkdownContent } = useSharedContext();
  // const { setActiveTab: setFrontendActiveTab } = useFrontendCode();
  // const { setActiveTab: setBackendActiveTab } = useBackendCode();
  // const { setActiveTab: setTestActiveTab } = useTestCode();

  const getTopic = useChatStore((state) => state.getTopic);
  const currentTopic = useChatStore((state) => state.currentTopic);

  // TODO 反写数据 setMarkdownContent/setActiveImage/setBackendMessages/setTestMessages
  React.useEffect(() => {
    const fetchTopicData = async () => {
      if (currentTopic) {
        const topicData = await getTopic(currentTopic);
        console.error('%c  topicData', 'background-image:color:transparent;color:red;');
        console.error('🚀~ => ', topicData);
        console.error('🚀~ => ', currentTopic);
        if (topicData) {
          let { activeImage, markdownContent, requirementMessages, frontend, backend, test } = topicData
          console.error('%c frontend.frontendFramework ', 'background-image:color:transparent;color:red;');
          console.error('🚀~ => ', frontend.frontendFramework);
          setActiveImage(activeImage || '');
          setMarkdownContent(markdownContent || '');
          setRequirementMessages(requirementMessages || []);
          setFrontendMessages(frontend.frontendMessages || []);

          // setFrontendActiveTab(frontend.frontendFramework || '')
          // setBackendActiveTab(backend.frontendFramework || '')
          // setTestActiveTab(test.frontendFramework || '')
        }
      }
    };

    fetchTopicData();
  }, [currentTopic, getTopic, setRequirementMessages, setFrontendMessages]);

  // const handleClearMessages = React.useCallback(() => {
  //   switch (currentTab) {
  //     case 'requirement':
  //       setRequirementMessages([]);
  //       break;
  //     case 'frontend':
  //       setFrontendMessages([]);
  //       break;
  //     // Add other cases as needed
  //   }
  // }, [currentTab, setRequirementMessages, setFrontendMessages]);

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
