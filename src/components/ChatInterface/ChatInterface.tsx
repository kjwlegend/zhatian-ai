import React, { useState, useCallback } from "react";
import { Box, Flex, ScrollArea, Paper, Text } from "@mantine/core";
import UserInput from "../UserInput/UserInput";
import MarkdownDisplay from "../MarkdownDisplay/MarkdownDisplay";
import { chatWithOpenAI } from "../../services/openai";
import { useChatStore, ChatMessage } from "../../store/chatStore";
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
    <Flex direction="row" style={{ height: "100%" }}>
      <Flex direction="column" style={{ flex: 1, overflow: "hidden" }}>
        <ScrollArea style={{ flex: 1 }}>
          <Box p="md">
            {chatHistory.map((message) => (
              <Paper
                key={message.id}
                p="sm"
                mb="sm"
                radius="md"
                style={{
                  maxWidth: "75%",
                  marginLeft: message.isUser ? "auto" : 0,
                  marginRight: message.isUser ? 0 : "auto",
                  backgroundColor: message.isUser
                    ? "var(--mantine-color-blue-5)"
                    : "var(--mantine-color-gray-1)",
                }}
              >
                {message.isUser ? (
                  <Text>{message.content}</Text>
                ) : (
                  <ReactMarkdown
                    components={{
                      img: ({ node, ...props }) => (
                        <img
                          {...props}
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
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
                    style={{
                      marginTop: "0.5rem",
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "0.25rem",
                    }}
                  />
                )}
              </Paper>
            ))}
          </Box>
        </ScrollArea>
        <Box p="md">
          <UserInput onSubmit={handleSubmit} isLoading={isLoading} />
        </Box>
      </Flex>
      <Box style={{ width: "50%", overflow: "hidden" }}>
        <MarkdownDisplay currentTopic={currentTopic} />
      </Box>
    </Flex>
  );
};

export default ChatInterface;
