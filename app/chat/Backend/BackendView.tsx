import React from 'react';
import ChatInterface from '../ChatInterface/ChatInterface';
import MarkdownDisplay from '../MarkdownDisplay/MarkdownDisplay';

import './BackendView.scss';

const BackendView: React.FC = () => {
  const [currentTopic, setCurrentTopic] = React.useState<string>('');

  return (
    <div className="backend-view">
      <ChatInterface currentTopic={currentTopic} />
      <MarkdownDisplay currentTopic={currentTopic} />
    </div>
  );
};

export default BackendView;
