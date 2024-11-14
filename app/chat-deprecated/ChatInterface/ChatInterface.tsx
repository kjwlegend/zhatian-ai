'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Flex, ScrollArea } from '@mantine/core';
import { ChatMessage, CodeContent } from '../../services/db/schema';
import { chatWithOpenAI } from '../../services/openai';
import { useChatStore } from '../../store/chatStore';
import UserInput from '../UserInput/UserInput';

import './ChatInterface.scss';

interface ChatInterfaceProps {
  currentTopic: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentTopic }) => {
  const { addMessage, updateMessage, getTopicMessages, updateTopicCode } = useChatStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const loadMessages = async () => {
      const loadedMessages = await getTopicMessages(currentTopic);
      setMessages(loadedMessages);
    };
    loadMessages();
  }, [currentTopic, getTopicMessages]);

  const systemPrompt =
    'You are a helpful AI assistant. When providing code examples, please wrap them in triple backticks and use the following format: ```html for general code, ```index for index code, ```panel for panel.js code, and ```scss for SCSS code.';

  const handleSubmit = useCallback(
    async (input: string, image?: File) => {
      setIsLoading(true);
      try {
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          topicId: currentTopic,
          content: input,
          isUser: true,
          timestamp: Date.now(),
          image: image ? URL.createObjectURL(image) : undefined,
        };
        console.log('userMessage', userMessage);
        await addMessage(currentTopic, userMessage);

        const botMessageId = (Date.now() + 1).toString();
        const initialBotMessage: ChatMessage = {
          id: botMessageId,
          topicId: currentTopic,
          content: '',
          isUser: false,
          timestamp: Date.now(),
        };
        await addMessage(currentTopic, initialBotMessage);

        const history = messages.slice(-6).map((msg) => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content,
        }));

        await chatWithOpenAI(
          input,
          history,
          systemPrompt,
          async (partialResponse) => {
            await updateMessage(currentTopic, botMessageId, {
              id: botMessageId,
              topicId: currentTopic,
              content: partialResponse.text,
              isUser: false,
              timestamp: Date.now(),
            });

            // 遍历每个代码块，如果有内容就更新
            Object.entries(partialResponse.code).forEach(([codeType, codeContent]) => {
              if (codeContent !== '') {
                updateTopicCode(currentTopic, codeType as keyof CodeContent, codeContent);
              }
            });
          },
          image
        ); // Pass the image parameter here

        const updatedMessages = await getTopicMessages(currentTopic);
        setMessages(updatedMessages);
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        const errorMessage = 'An error occurred while processing your request. Please try again.';
        const errorChatMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          topicId: currentTopic,
          content: errorMessage,
          isUser: false,
          timestamp: Date.now(),
        };
        await addMessage(currentTopic, errorChatMessage);
        const updatedMessages = await getTopicMessages(currentTopic);
        setMessages(updatedMessages);
      } finally {
        setIsLoading(false);
      }
    },
    [currentTopic, addMessage, updateMessage, getTopicMessages, updateTopicCode, messages]
  );

  return (
    <Flex className="chat-interface-wrapper">
      <Flex direction="column">
        <ScrollArea className="chat-interface__messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-interface__message ${
                message.isUser ? 'chat-interface__message--user' : 'chat-interface__message--bot'
              }`}
            >
              {message.isUser ? (
                <p>{message.content}</p>
              ) : (
                <ReactMarkdown
                  className="chat-interface__markdown"
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <pre className="code-block">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    img: ({ node, ...props }) => (
                      <img {...props} className="chat-interface__image" />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
              {message.image && (
                <img
                  src={message.image}
                  alt="Uploaded content"
                  className="chat-interface__uploaded-image"
                />
              )}
            </div>
          ))}
        </ScrollArea>
        <Box p="md">
          <UserInput onSubmit={handleSubmit} isLoading={isLoading} />
        </Box>
      </Flex>
    </Flex>
  );
};

export default ChatInterface;
