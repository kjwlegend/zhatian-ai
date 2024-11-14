import { useCallback, useEffect, useState } from 'react';
import { chatWithOpenAI } from '@/app/services/openai';
import { useSharedContext } from '../contexts/SharedContext';

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
}

export function useChatMessages({
  systemPrompt,
  initialMessages = [],
  onMessagesChange,
  onResponse,
}: UseChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { activeImage } = useSharedContext();

  const clearMessages = useCallback(() => {
    setMessages([]);
    onMessagesChange?.([]);
  }, [onMessagesChange]);

  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      try {
        setIsLoading(true);

        let imageFile: File | undefined;
        if (activeImage) {
          const response = await fetch(activeImage);
          const blob = await response.blob();
          imageFile = new File([blob], 'image.png', { type: blob.type });
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

        await chatWithOpenAI(
          message,
          history,
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
    [messages, systemPrompt, onResponse, activeImage]
  );

  return {
    messages,
    isLoading,
    handleSendMessage,
    clearMessages,
  };
}
