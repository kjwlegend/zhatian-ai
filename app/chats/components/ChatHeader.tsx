import { useSharedContext } from '@/app/chats/contexts/SharedContext';
import { useChatStore } from '@/app/store/chatStore';
import { useBackendCode, useFrontendCode, useTestCode } from '@/app/store/codeStore';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Home } from 'lucide-react';
import * as React from 'react';
import { SaveProjectDialog } from './SaveProjectDialog';

interface ChatHeaderProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export function ChatHeader({ isModalOpen, setIsModalOpen }: ChatHeaderProps) {
  const addTopic = useChatStore((state) => state.addTopic);
  const { activeImage, markdownContent, requirementMessages, frontendMessages, backendMessages, testMessages } = useSharedContext();
  const { selectedFramework: frontendFramework } = useFrontendCode();
  const { selectedFramework: backendFramework } = useBackendCode();
  const { selectedFramework: testFramework } = useTestCode();
  const [currentTab, setCurrentTab] = React.useState('requirement');

  const handlePublish = async () => {
    const topicId = Date.now().toString();
    const title = 'Current Project';
    const topicData = {
      id: topicId,
      title,
      type: currentTab,
      activeImage,
      markdownContent,
      requirementMessages,
      frontend: {
        frontendMessages,
        frontendFramework
      },
      backend: {
        backendMessages,
        backendFramework
      },
      test: {
        testMessages,
        testFramework
      },
      lastUpdated: Date.now()
    };
    await addTopic(topicData);
    console.log('Project published:', topicData);
  };

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Current Project</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TabsList className="grid w-[400px] grid-cols-4">
        <TabsTrigger value="requirement" onClick={() => setCurrentTab('requirement')}>Requirement</TabsTrigger>
        <TabsTrigger value="frontend" onClick={() => setCurrentTab('frontend')}>FE</TabsTrigger>
        <TabsTrigger value="backend" onClick={() => setCurrentTab('backend')}>BE</TabsTrigger>
        <TabsTrigger value="test" onClick={() => setCurrentTab('test')}>Test</TabsTrigger>
      </TabsList>
      <div className="flex gap-2">
        <SaveProjectDialog isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        <Button onClick={handlePublish}>Publish</Button>
      </div>
    </div>
  );
}
