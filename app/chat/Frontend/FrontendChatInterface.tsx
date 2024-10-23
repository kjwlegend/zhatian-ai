import React from 'react';
import { ChatMessage } from '../../services/db/schema';
import BaseChatInterface from '../components/BaseChatInterface';

interface FrontendChatInterfaceProps {
  currentTopic: string;
}

const FrontendChatInterface: React.FC<FrontendChatInterfaceProps> = ({ currentTopic }) => {
  const customRender = (message: ChatMessage) => {
    // 在这里添加前端特定的渲染逻辑
    // 如果没有特殊需求，可以返回 null 使用默认渲染
    return null;
  };

  return <BaseChatInterface currentTopic={currentTopic} customRender={customRender} />;
};

export default FrontendChatInterface;
