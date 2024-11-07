import React from 'react';
import { Button } from '@mantine/core';
import { ChatMessage } from '../../services/db/schema';
import BaseChatInterface from '../components/BaseChatInterface';

interface FrontendChatInterfaceProps {
  currentView: string;
  currentTopic: string;
  onCodeUpdate: (codeType: string, code: string) => void;
  onMessageComplete: () => void;
  onCreateTopic: () => void;
  onSelectTopic: () => void;
}

const FrontendChatInterface: React.FC<FrontendChatInterfaceProps> = ({
  currentView,
  currentTopic,
  onCodeUpdate,
  onMessageComplete,
  onCreateTopic,
  onSelectTopic,
}) => {
  const customRender = () => {
    return (
      <Button variant="outline" size="sm">
        Custom Action
      </Button>
    );
  };

  const breadcrumbs = [
    { title: 'Frontend', href: '/frontend' },
    { title: currentTopic, href: `/frontend/${currentTopic}` },
  ];

  return (
    <BaseChatInterface
      currentView={currentView}
      currentTopic={currentTopic}
      customRender={customRender}
      onCodeUpdate={onCodeUpdate}
      onMessageComplete={onMessageComplete}
      breadcrumbs={breadcrumbs}
      systemPromptKey="FRONTEND"
      onCreateTopic={onCreateTopic}
      onSelectTopic={onSelectTopic}
    />
  );
};

export default FrontendChatInterface;
