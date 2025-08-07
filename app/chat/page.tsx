'use client';

import * as React from 'react';
import { BaseChatInterface } from '../codes/components/BaseChatInterface';
import { chatWithDify } from '../services/dify';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [conversationId, setConversationId] = React.useState<string>();

  const handleSendMessage = async (message: string, attachments: string[]) => {
    // 添加用户消息
    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    // 添加一个加载中的助手消息
    setMessages((prev) => [...prev, { role: 'assistant', content: '', isLoading: true }]);

    try {
      let fullContent = '';

      await chatWithDify(
        message,
        {},
        (content: string) => {
          fullContent = content;
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = content;
              lastMessage.isLoading = true;
            }
            return newMessages;
          });
        },
        (content: string, newConversationId: string) => {
          setConversationId(newConversationId);
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = content;
              lastMessage.isLoading = false;
            }
            return newMessages;
          });
        },
        conversationId
      );
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.content = '抱歉，发生了一些错误。请稍后重试。';
          lastMessage.isLoading = false;
        }
        return newMessages;
      });
    }
  };

  return (
    <div className="container mx-auto p-4 h-screen">
      <iframe
        src="http://38.207.178.31/chatbot/IuUg2qkHMItUwaTE"
        allow="microphone"
        frameBorder={0}
      ></iframe>
      <BaseChatInterface messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}
