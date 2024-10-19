'use client'
import React, { useState, useCallback } from "react";
import { Box, Flex, ScrollArea } from "@mantine/core";
import UserInput from "../UserInput/UserInput";
import MarkdownDisplay from "../MarkdownDisplay/MarkdownDisplay";
import { chatWithOpenAI } from "../../services/openai";
import { useChatStore, ChatMessage } from "../../store/chatStore";
import ReactMarkdown from "react-markdown";
import "./ChatInterface.scss";

interface ChatInterfaceProps {
  currentTopic: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentTopic }) => {
  const { addMessage, updateMessage, getTopicMessages, updateTopicCode } =
    useChatStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const systemPrompt =
    "You are a helpful AI assistant. When providing code examples, please wrap them in triple backticks and use the following format: ```html for general code, ```index for index code, ```panel for panel.js code, and ```scss for SCSS code.";

  const handleSubmit = useCallback(
    async (input: string, image?: File) => {
      setIsLoading(true);
      try {
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          content: input,
          isUser: true,
        };
        addMessage(currentTopic, userMessage);

        const botMessageId = (Date.now() + 1).toString();
        const initialBotMessage: ChatMessage = {
          id: botMessageId,
          content: "",
          isUser: false,
          code: {
            html: "",
            index: "",
            panel: "",
            scss: "",
          },
        };
        addMessage(currentTopic, initialBotMessage);

        const history = getTopicMessages(currentTopic)
          .slice(-6)
          .map((msg) => ({
            role: msg.isUser ? "user" : "assistant",
            content: msg.content,
          }));

        await chatWithOpenAI(
          input,
          history,
          systemPrompt,
          (partialResponse) => {
            updateMessage(currentTopic, botMessageId, {
              id: botMessageId,
              content: partialResponse.text,
              isUser: false,
              code: partialResponse.code,
            });
            const newCode = Object.entries(partialResponse.code).reduce(
              (acc, [key, value]) => {
                if (value !== '') {
                  acc[key as keyof typeof acc] = value as string;
                }
                return acc;
              },
              {} as Record<keyof ChatMessage["code"], string>
            );
            if (Object.keys(newCode).length > 0) {
              updateTopicCode(currentTopic, newCode);
            }
          }
        );
      } catch (error) {
        console.error("Error in handleSubmit:", error);
        const errorMessage =
          "An error occurred while processing your request. Please try again.";
        const errorChatMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: errorMessage,
          isUser: false,
        };
        addMessage(currentTopic, errorChatMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentTopic, addMessage, updateMessage, getTopicMessages, updateTopicCode]
  );

  const chatHistory = getTopicMessages(currentTopic);

  return (
    <Flex className="chat-interface">
      <Flex direction="column" className="chat-interface__left">
        <ScrollArea className="chat-interface__messages">
          {chatHistory.map((message) => (
            <div
              key={message.id}
              className={`chat-interface__message ${
                message.isUser ? "chat-interface__message--user" : "chat-interface__message--bot"
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
      <Box className="chat-interface__right">
        <MarkdownDisplay currentTopic={currentTopic} />
      </Box>
    </Flex>
  );
};

export default ChatInterface;
