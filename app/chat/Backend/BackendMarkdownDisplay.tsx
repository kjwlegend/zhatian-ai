import React from 'react';
import { CodeContent } from '../../services/db/schema';
import BaseMarkdownDisplay from '../components/BaseMarkdownDisplay';

interface BackendMarkdownDisplayProps {
  currentTopic: string;
  codeUpdate: { type: string; content: string };
  shouldRefresh: boolean;
}

const BackendMarkdownDisplay: React.FC<BackendMarkdownDisplayProps> = ({
  currentTopic,
  codeUpdate,
  shouldRefresh,
}) => {
  const customTabs: (keyof CodeContent)[] = ['python', 'javascript', 'sql'];

  const customRender = (content: string, activeTab: keyof CodeContent) => {
    // 在这里添加后端特定的渲染逻辑
    // 如果没有特殊需求，可以返回 null 使用默认渲染
    return null;
  };

  return (
    <BaseMarkdownDisplay
      currentTopic={currentTopic}
      customTabs={customTabs}
      customRender={customRender}
      shouldRefresh={shouldRefresh}
    />
  );
};

export default BackendMarkdownDisplay;
