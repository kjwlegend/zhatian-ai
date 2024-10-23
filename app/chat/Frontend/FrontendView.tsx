import React from 'react';
import { useChatStore } from '../../store/chatStore';
import FrontendChatInterface from './FrontendChatInterface';
import FrontendMarkdownDisplay from './FrontendMarkdownDisplay';

import './FrontendView.scss';

const FrontendView: React.FC = () => {
  const { currentTopic } = useChatStore();

  return (
    <div className="frontend-view">
      <FrontendChatInterface currentTopic={currentTopic} />
      <FrontendMarkdownDisplay currentTopic={currentTopic} />
    </div>
  );
};

export default FrontendView;
