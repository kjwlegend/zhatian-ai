import React, { useEffect, useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import BackendChatInterface from './BackendChatInterface';
import BackendMarkdownDisplay from './BackendMarkdownDisplay';

import './BackendView.scss';

const BackendView: React.FC = () => {
  const { currentTopic, addTopic, setCurrentTopic, getViewTopics } = useChatStore();
  const [codeUpdate, setCodeUpdate] = useState({ type: '', content: '' });
  const [shouldRefreshMarkdown, setShouldRefreshMarkdown] = useState(false);
  const [topics, setTopics] = useState<ChatTopic[]>([]);

  useEffect(() => {
    const loadTopics = async () => {
      const loadedTopics = await getViewTopics('Backend');
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
    const newTopicId = await addTopic('Backend', 'New Backend Topic');
    setCurrentTopic(newTopicId);
    const updatedTopics = await getViewTopics('Backend');
    setTopics(updatedTopics);
  };

  const handleSelectTopic = () => {
    // Implement topic selection logic here
    // This could open a modal with a list of topics to choose from
  };

  return (
    <div className="backend-view">
      <BackendChatInterface
        currentView="Backend"
        currentTopic={currentTopic}
        onCodeUpdate={handleCodeUpdate}
        onMessageComplete={handleMessageComplete}
        onCreateTopic={handleCreateTopic}
        onSelectTopic={handleSelectTopic}
      />
      <BackendMarkdownDisplay
        currentTopic={currentTopic}
        codeUpdate={codeUpdate}
        shouldRefresh={shouldRefreshMarkdown}
      />
    </div>
  );
};

export default BackendView;
