import { useCallback, useEffect, useState } from 'react';
import { chatWithDify } from '@/app/services/dify';
import { chatWithOpenAI } from '@/app/services/openai';
import { useCodeStore } from '@/app/store/codeStore';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

interface UseChatMessagesProps {
  systemPrompt: string;
  initialMessages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
  onResponse?: (response: string) => void;
  api?: 'openai' | 'dify';
}

export function useChatMessages({
  systemPrompt,
  initialMessages = [],
  onMessagesChange,
  onResponse,
  api = 'openai',
}: UseChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { designFile, componentDoc } = useCodeStore();
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  const clearMessages = useCallback(() => {
    setMessages([]);
    onMessagesChange?.([]);
    setConversationId(undefined);
  }, [onMessagesChange]);

  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);

  const handleSendMessage = useCallback(
    async (message: string, attachments?: string[]) => {
      try {
        setIsLoading(true);
        let imageFile: string[] | undefined;
        if (attachments && attachments.length > 0) {
          imageFile = attachments;
        } else if (designFile) {
          imageFile = [designFile];
        }

        const userMessage: Message = {
          role: 'user',
          content: imageFile ? `${message}\n[Image attached]` : message,
        };
        setMessages((prev) => [...prev, userMessage]);

        const loadingMessage: Message = {
          role: 'assistant',
          content: '',
          isLoading: true,
        };
        setMessages((prev) => [...prev, loadingMessage]);

        const history = messages.slice(-6).map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        if (api === 'dify') {
          const inputs = {
            designFile: designFile,
            componentDoc: componentDoc,
          };
          await chatWithDify(
            message,
            inputs,
            (partialResponse) => {
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                  lastMessage.content = partialResponse;
                  lastMessage.isLoading = false;
                }
                return newMessages;
              });
              onResponse?.(partialResponse);
            },
            (content, conversationId) => {
              setConversationId(conversationId);
            },
            conversationId,
            imageFile
          );
        } else {
          await chatWithOpenAI(
            message,
            history,
            componentDoc,
            systemPrompt,
            (partialResponse) => {
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                  lastMessage.content = partialResponse;
                  lastMessage.isLoading = false;
                }
                return newMessages;
              });
              onResponse?.(partialResponse);
            },
            imageFile
          );
        }
      } catch (error) {
        console.error('Error in handleSendMessage:', error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'I apologize, but I encountered an error. Please try again.',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, systemPrompt, onResponse, designFile]
  );

  return {
    messages,
    isLoading,
    handleSendMessage,
    clearMessages,
  };
}
