import React, { useState, useCallback } from "react";
import UserInput from "./UserInput";
import MarkdownDisplay from "./MarkdownDisplay";
import { chatWithOpenAI } from "../services/openai";
import { useChatStore, ChatMessage } from "../store/chatStore";
import ReactMarkdown from "react-markdown";

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
            // 只更新有内容的代码部分
            const newCode = Object.entries(partialResponse.code).reduce(
              (acc, [key, value]) => {
                if (value !== "") {
                  acc[key as keyof typeof acc] = value;
                }
                return acc;
              },
              {} as Partial<ChatMessage["code"]>
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
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 overflow-auto p-4 border-r border-tech-accent">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`mb-4 p-3 rounded-lg ${
                  message.isUser
                    ? "bg-tech-accent text-tech-text ml-auto"
                    : "bg-tech-dark-light text-tech-text"
                } max-w-3/4 ${message.isUser ? "ml-1/4" : "mr-1/4"}`}
              >
                {message.isUser ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown className="prose prose-invert max-w-none">
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>
          <UserInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        <MarkdownDisplay currentTopic={currentTopic} />
      </div>
    </div>
  );
};

export default ChatInterface;
