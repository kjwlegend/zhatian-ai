import React, { useEffect, useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import FrontendChatInterface from './FrontendChatInterface';
import FrontendMarkdownDisplay from './FrontendMarkdownDisplay';

import './FrontendView.scss';

const FrontendView: React.FC = () => {
  const { currentTopic, addTopic, setCurrentTopic, getViewTopics } = useChatStore();
  const [codeUpdate, setCodeUpdate] = useState({ type: '', content: '' });
  const [shouldRefreshMarkdown, setShouldRefreshMarkdown] = useState(false);
  const [topics, setTopics] = useState<ChatTopic[]>([]);

  useEffect(() => {
    const loadTopics = async () => {
      const loadedTopics = await getViewTopics('Frontend');
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
    const newTopicId = await addTopic('Frontend', 'New Frontend Topic');
    setCurrentTopic(newTopicId);
    const updatedTopics = await getViewTopics('Frontend');
    setTopics(updatedTopics);
  };

  const handleSelectTopic = () => {
    // Implement topic selection logic here
    // This could open a modal with a list of topics to choose from
  };

  return (
    <div className="frontend-view">
      <FrontendChatInterface
        currentView="Frontend"
        currentTopic={currentTopic}
        onCodeUpdate={handleCodeUpdate}
        onMessageComplete={handleMessageComplete}
        onCreateTopic={handleCreateTopic}
        onSelectTopic={handleSelectTopic}
      />
      <FrontendMarkdownDisplay
        currentTopic={currentTopic}
        codeUpdate={codeUpdate}
        shouldRefresh={shouldRefreshMarkdown}
      />
    </div>
  );
};

export default FrontendView;
