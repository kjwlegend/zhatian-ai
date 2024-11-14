'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Anchor, Box, Breadcrumbs, Button, Flex, ScrollArea, Text } from '@mantine/core';
import { SYSTEM_PROMPTS } from '../../config/prompts';
import { ChatMessage, ChatTopic } from '../../services/db/schema';
import { chatWithOpenAI } from '../../services/openai';
import { useChatStore } from '../../store/chatStore';
import UserInput from '../UserInput/UserInput';

import '../ChatInterface/ChatInterface.scss';

interface BaseChatInterfaceProps {
  currentView: string;
  currentTopic: string;
  customRender?: () => React.ReactNode;
  onCodeUpdate?: (codeType: string, code: string) => void;
  onMessageComplete?: () => void;
  breadcrumbs?: { title: string; href: string }[];
  systemPromptKey: keyof typeof SYSTEM_PROMPTS;
  onCreateTopic: () => void;
  onSelectTopic: () => void;
}

const BaseChatInterface: React.FC<BaseChatInterfaceProps> = ({
  currentView,
  currentTopic,
  customRender,
  onCodeUpdate,
  onMessageComplete,
  breadcrumbs = [],
  systemPromptKey,
  onCreateTopic,
  onSelectTopic,
}) => {
  const { addMessage, updateMessage, getTopicMessages, updateTopicCode, getViewTopics } =
    useChatStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [topics, setTopics] = useState<ChatTopic[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTopics = async () => {
      const loadedTopics = await getViewTopics(currentView);
      setTopics(loadedTopics);
    };
    loadTopics();
  }, [currentView, getViewTopics]);

  useEffect(() => {
    const loadMessages = async () => {
      if (currentTopic) {
        const loadedMessages = await getTopicMessages(currentTopic);
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
    };
    loadMessages();
  }, [currentTopic, getTopicMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const systemPrompt = SYSTEM_PROMPTS[systemPromptKey];

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
        setMessages((prev) => [...prev, userMessage]);

        const botMessageId = (Date.now() + 1).toString();
        const initialBotMessage: ChatMessage = {
          id: botMessageId,
          topicId: currentTopic,
          content: '',
          isUser: false,
          timestamp: Date.now(),
        };
        await addMessage(currentTopic, initialBotMessage);
        setMessages((prev) => [...prev, initialBotMessage]);

        const history = messages.slice(-6).map((msg) => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content,
        }));

        let fullResponse = '';
        await chatWithOpenAI(
          input,
          history,
          systemPrompt,
          async (partialResponse) => {
            fullResponse = partialResponse.text; // 使用 = 而不是 +=
            await updateMessage(currentTopic, botMessageId, {
              id: botMessageId,
              topicId: currentTopic,
              content: fullResponse,
              isUser: false,
              timestamp: Date.now(),
            });
            setMessages((prev) =>
              prev.map((msg) => (msg.id === botMessageId ? { ...msg, content: fullResponse } : msg))
            );

            const newCode = Object.entries(partialResponse.code).reduce(
              (acc, [key, value]) => {
                if (value !== '') {
                  acc[key as keyof typeof acc] = value;
                }
                return acc;
              },
              {} as Record<keyof typeof partialResponse.code, string>
            );
            if (Object.keys(newCode).length > 0) {
              for (const [codeType, code] of Object.entries(newCode)) {
                await updateTopicCode(currentTopic, codeType as keyof typeof newCode, code);
                if (onCodeUpdate) {
                  onCodeUpdate(codeType, code);
                }
              }
            }
          },
          image
        );

        // Call onMessageComplete after the bot's message is complete
        if (onMessageComplete) {
          onMessageComplete();
        }
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
        setMessages((prev) => [...prev, errorChatMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentTopic,
      addMessage,
      updateMessage,
      getTopicMessages,
      updateTopicCode,
      messages,
      onCodeUpdate,
      onMessageComplete,
    ]
  );

  if (!currentTopic) {
    return (
      <Flex direction="column" align="center" justify="center" style={{ height: '100%' }}>
        {topics.length === 0 ? (
          <Box>
            <Text>No topics available. Create a new topic to start chatting.</Text>
            <Button onClick={onCreateTopic} mt="md">
              Create New Topic
            </Button>
          </Box>
        ) : (
          <Box>
            <Text>Please select a topic to start chatting.</Text>
            <Button onClick={onSelectTopic} mt="md">
              Select Topic
            </Button>
          </Box>
        )}
      </Flex>
    );
  }

  return (
    <Flex className="chat-interface" direction="column" style={{ height: '100%' }}>
      <Box className="chat-interface__header" p="md">
        <Flex justify="space-between" align="center">
          <Breadcrumbs>
            {breadcrumbs.map((item, index) => (
              <Anchor href={item.href} key={index}>
                {item.title}
              </Anchor>
            ))}
          </Breadcrumbs>
          {customRender && customRender()}
        </Flex>
      </Box>
      <ScrollArea style={{ flex: 1 }} className="chat-interface__messages">
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
                  img: ({ node, ...props }) => <img {...props} className="chat-interface__image" />,
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
        <div ref={messagesEndRef} />
      </ScrollArea>
      <Box p="md">
        <UserInput onSubmit={handleSubmit} isLoading={isLoading} />
      </Box>
    </Flex>
  );
};

export default BaseChatInterface;
