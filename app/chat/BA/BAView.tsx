import React, { useEffect, useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import BAChatInterface from './BAChatInterface';
import BAMarkdownDisplay from './BAMarkdownDisplay';

import './BAView.scss';

const BAView: React.FC = () => {
  const { currentTopic, addTopic, setCurrentTopic, getViewTopics } = useChatStore();
  const [codeUpdate, setCodeUpdate] = useState({ type: '', content: '' });
  const [shouldRefreshMarkdown, setShouldRefreshMarkdown] = useState(false);
  const [topics, setTopics] = useState<ChatTopic[]>([]);

  useEffect(() => {
    const loadTopics = async () => {
      const loadedTopics = await getViewTopics('BA');
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
    const newTopicId = await addTopic('BA', 'New BA Topic');
    setCurrentTopic(newTopicId);
    const updatedTopics = await getViewTopics('BA');
    setTopics(updatedTopics);
  };

  const handleSelectTopic = () => {
    // Implement topic selection logic here
    // This could open a modal with a list of topics to choose from
  };

  return (
    <div className="ba-view">
      <BAChatInterface
        currentView="BA"
        currentTopic={currentTopic}
        onCodeUpdate={handleCodeUpdate}
        onMessageComplete={handleMessageComplete}
        onCreateTopic={handleCreateTopic}
        onSelectTopic={handleSelectTopic}
      />
      <BAMarkdownDisplay
        currentTopic={currentTopic}
        codeUpdate={codeUpdate}
        shouldRefresh={shouldRefreshMarkdown}
      />
    </div>
  );
};

export default BAView;
