import React, { useEffect, useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import TestChatInterface from './TestChatInterface';
import TestMarkdownDisplay from './TestMarkdownDisplay';

import './TestView.scss';

const TestView: React.FC = () => {
  const { currentTopic, addTopic, setCurrentTopic, getViewTopics } = useChatStore();
  const [codeUpdate, setCodeUpdate] = useState({ type: '', content: '' });
  const [shouldRefreshMarkdown, setShouldRefreshMarkdown] = useState(false);
  const [topics, setTopics] = useState<ChatTopic[]>([]);

  useEffect(() => {
    const loadTopics = async () => {
      const loadedTopics = await getViewTopics('Tests');
      setTopics(loadedTopics);
    };
    loadTopics();
  }, [getViewTopics, currentTopic]);

  const handleCodeUpdate = (codeType: string, code: string) => {
    setCodeUpdate({ type: codeType, content: code });
  };

  const handleMessageComplete = () => {
    setShouldRefreshMarkdown((prev) => !prev);
  };

  const handleCreateTopic = async () => {
    const newTopicId = await addTopic('Tests', 'New Test Topic');
    setCurrentTopic(newTopicId);
    const updatedTopics = await getViewTopics('Tests');
    setTopics(updatedTopics);
  };

  const handleSelectTopic = () => {
    // Implement topic selection logic here
    // This could open a modal with a list of topics to choose from
  };

  return (
    <div className="test-view">
      <TestChatInterface
        currentView="Tests"
        currentTopic={currentTopic}
        onCodeUpdate={handleCodeUpdate}
        onMessageComplete={handleMessageComplete}
        onCreateTopic={handleCreateTopic}
        onSelectTopic={handleSelectTopic}
      />
      <TestMarkdownDisplay
        currentTopic={currentTopic}
        codeUpdate={codeUpdate}
        shouldRefresh={shouldRefreshMarkdown}
      />
    </div>
  );
};

export default TestView;
