import React from 'react';
import { Button } from '@mantine/core';
import { ChatMessage } from '../../services/db/schema';
import BaseChatInterface from '../components/BaseChatInterface';

interface BAChatInterfaceProps {
  currentView: string;
  currentTopic: string;
  onCodeUpdate: (codeType: string, code: string) => void;
  onMessageComplete: () => void;
  onCreateTopic: () => void;
  onSelectTopic: () => void;
}

const BAChatInterface: React.FC<BAChatInterfaceProps> = ({
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
        BA Action
      </Button>
    );
  };

  const breadcrumbs = [
    { title: 'Business Analysis', href: '/ba' },
    { title: currentTopic, href: `/ba/${currentTopic}` },
  ];

  return (
    <BaseChatInterface
      currentView={currentView}
      currentTopic={currentTopic}
      customRender={customRender}
      onCodeUpdate={onCodeUpdate}
      onMessageComplete={onMessageComplete}
      breadcrumbs={breadcrumbs}
      systemPromptKey="BA"
      onCreateTopic={onCreateTopic}
      onSelectTopic={onSelectTopic}
    />
  );
};

export default BAChatInterface;
