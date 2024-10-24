import React from 'react';
import { CodeContent } from '../../services/db/schema';
import BaseMarkdownDisplay from '../components/BaseMarkdownDisplay';

interface FrontendMarkdownDisplayProps {
  currentTopic: string;
}

const FrontendMarkdownDisplay: React.FC<FrontendMarkdownDisplayProps> = ({ currentTopic }) => {
  const customTabs: (keyof CodeContent)[] = ['html', 'js', 'scss'];

  const customRender = (content: string, activeTab: keyof CodeContent) => {
    // 在这里添加前端特定的渲染逻辑
    // 如果没有特殊需求，可以返回 null 使用默认渲染
    return null;
  };

  return (
    <BaseMarkdownDisplay
      currentTopic={currentTopic}
      customTabs={customTabs}
      customRender={customRender}
    />
  );
};

export default FrontendMarkdownDisplay;
