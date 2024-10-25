import React from 'react';
import { Button } from '@mantine/core';
import { ChatMessage } from '../../services/db/schema';
import BaseChatInterface from '../components/BaseChatInterface';

interface BackendChatInterfaceProps {
  currentView: string;
  currentTopic: string;
  onCodeUpdate: (codeType: string, code: string) => void;
  onMessageComplete: () => void;
  onCreateTopic: () => void;
  onSelectTopic: () => void;
}

const BackendChatInterface: React.FC<BackendChatInterfaceProps> = ({
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
        Backend Action
      </Button>
    );
  };

  const breadcrumbs = [
    { title: 'Backend', href: '/backend' },
    { title: currentTopic, href: `/backend/${currentTopic}` },
  ];

  return (
    <BaseChatInterface
      currentView={currentView}
      currentTopic={currentTopic}
      customRender={customRender}
      onCodeUpdate={onCodeUpdate}
      onMessageComplete={onMessageComplete}
      breadcrumbs={breadcrumbs}
      systemPromptKey="BACKEND"
      onCreateTopic={onCreateTopic}
      onSelectTopic={onSelectTopic}
    />
  );
};

export default BackendChatInterface;
