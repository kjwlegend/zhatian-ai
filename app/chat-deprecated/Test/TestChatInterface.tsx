import React from 'react';
import { Button } from '@mantine/core';
import { ChatMessage } from '../../services/db/schema';
import BaseChatInterface from '../components/BaseChatInterface';

interface TestChatInterfaceProps {
  currentView: string;
  currentTopic: string;
  onCodeUpdate: (codeType: string, code: string) => void;
  onMessageComplete: () => void;
  onCreateTopic: () => void;
  onSelectTopic: () => void;
}

const TestChatInterface: React.FC<TestChatInterfaceProps> = ({
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
        Test Action
      </Button>
    );
  };

  const breadcrumbs = [
    { title: 'Tests', href: '/tests' },
    { title: currentTopic, href: `/tests/${currentTopic}` },
  ];

  return (
    <BaseChatInterface
      currentView={currentView}
      currentTopic={currentTopic}
      customRender={customRender}
      onCodeUpdate={onCodeUpdate}
      onMessageComplete={onMessageComplete}
      breadcrumbs={breadcrumbs}
      systemPromptKey="TEST"
      onCreateTopic={onCreateTopic}
      onSelectTopic={onSelectTopic}
    />
  );
};

export default TestChatInterface;
