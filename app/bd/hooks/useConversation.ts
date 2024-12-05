import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { bdService } from '../services/bdService';
import { Message, useBdStore } from '../store/useBdStore';

export const useConversation = () => {
  const {
    addMessage,
    userMessage,
    setUserMessage,
    conversation,
    brandBasicInfo,
    bidRequirements,
    setConversation,
  } = useBdStore();

  const [isLoading, setIsLoading] = useState(false);
  const [partialResponse, setPartialResponse] = useState('');

  // 使用 ref 来存储临时消息 ID
  const tempMessageIdRef = useRef<number | null>(null);

  // 清理函数
  useEffect(() => {
    return () => {
      setPartialResponse('');
      tempMessageIdRef.current = null;
    };
  }, []);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    try {
      setIsLoading(true);

      // 添加用户消息
      const userMsg: Message = {
        role: 'user',
        content: userMessage,
      };
      addMessage(userMsg);

      // 创建一个临时的 AI 响应消息
      const tempMessage: Message = {
        role: 'assistant',
        content: '',
      };

      // 添加临时消息并获取其索引
      addMessage(tempMessage);
      tempMessageIdRef.current = conversation.length;

      // 获取 AI 回复
      const response = await bdService.sendMessage(
        userMessage,
        conversation,
        brandBasicInfo,
        bidRequirements,
        (content) => {
          // 更新部分响应
          setPartialResponse(content);

          // 实时更新对话列表中的临时消息
          if (tempMessageIdRef.current !== null) {
            const newConversation = [...conversation];
            newConversation[tempMessageIdRef.current] = {
              ...tempMessage,
              content: content,
            };
            setConversation(newConversation);
          }
        }
      );

      // 更新最终消息
      if (tempMessageIdRef.current !== null) {
        const newConversation = [...conversation];
        newConversation[tempMessageIdRef.current] = response;
        setConversation(newConversation);
      }

      setUserMessage('');
      setPartialResponse('');
    } catch (error: unknown) {
      console.error('发送消息失败:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('发送消息失败，请稍后重试');
      }

      // 发生错误时移除临时消息
      if (tempMessageIdRef.current !== null) {
        const newConversation = conversation.filter(
          (_, index) => index !== tempMessageIdRef.current
        );
        setConversation(newConversation);
      }
    } finally {
      setIsLoading(false);
      tempMessageIdRef.current = null;
    }
  };

  return {
    isLoading,
    partialResponse,
    handleSendMessage,
  };
};
