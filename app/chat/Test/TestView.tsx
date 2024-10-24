import React from 'react';
import ChatInterface from '../ChatInterface/ChatInterface';
import MarkdownDisplay from '../MarkdownDisplay/MarkdownDisplay';

import './TestView.scss';

const TestView: React.FC = () => {
  const [currentTopic, setCurrentTopic] = React.useState<string>('');

  return (
    <div className="test-view">
      <ChatInterface currentTopic={currentTopic} />
      <MarkdownDisplay currentTopic={currentTopic} />
    </div>
  );
};

export default TestView;
