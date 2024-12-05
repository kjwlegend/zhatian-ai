import { useRef } from 'react';
import { toast } from 'sonner';
import { bdService } from '../services/bdService';
import { Message, useBdStore } from '../store/useBdStore';

export const useBidRequirements = () => {
  const {
    bidRequirements,
    setBidRequirements,
    setCurrentTab,
    addMessage,
    conversation,
    brandBasicInfo,
    setConversation,
  } = useBdStore();

  // 使用 ref 来存储临时消息 ID
  const tempMessageIdRef = useRef<number | null>(null);

  const handleSubmit = async () => {
    // 检查所有字段是否都已填写
    if (!bidRequirements.background || !bidRequirements.scope || !bidRequirements.direction) {
      return;
    }

    // 构建用户消息内容
    const messageContent = `
我们有一个新的投标需求:

背景:
${bidRequirements.background}

需求范围:
${bidRequirements.scope}

投标方向:
${bidRequirements.direction}

请根据以上信息，为我们提供初步的投标策略建议。
    `.trim();

    try {
      // 创建新的会话数组，包含用户消息
      const userMsg: Message = {
        role: 'user',
        content: messageContent,
      };

      // 创建一个临时的 AI 响应消息
      const tempMessage: Message = {
        role: 'assistant',
        content: '',
      };

      // 创建新的会话数组，包含用户消息和临时 AI 消息
      const newConversation = [...conversation, userMsg, tempMessage];
      setConversation(newConversation);

      // 设置临时消息的索引
      tempMessageIdRef.current = newConversation.length - 1;

      // 切换到对话 tab
      setCurrentTab('conversation');

      // 获取 AI 回复
      const response = await bdService.sendMessage(
        messageContent,
        conversation,
        brandBasicInfo,
        bidRequirements,
        (content) => {
          // 实时更新对话列表中的临时消息
          if (tempMessageIdRef.current !== null) {
            const updatedConversation = [...newConversation];
            updatedConversation[tempMessageIdRef.current] = {
              ...tempMessage,
              content: content,
            };
            setConversation(updatedConversation);
          }
        }
      );

      // 更新最终消息
      if (tempMessageIdRef.current !== null) {
        const finalConversation = [...newConversation];
        finalConversation[tempMessageIdRef.current] = response;
        setConversation(finalConversation);
      }
    } catch (error) {
      console.error('获取 AI 回复失败:', error);
      toast.error('获取 AI 回复失败，请稍后重试');

      // 发生错误时只保留用户消息，移除临时消息
      if (tempMessageIdRef.current !== null) {
        const userMsg: Message = {
          role: 'user',
          content: messageContent,
        };
        const errorConversation = [...conversation, userMsg];
        setConversation(errorConversation);
      }

      // 添加错误消息
      addMessage({
        role: 'assistant',
        content: '抱歉，处理您的需求时发生错误。请稍后重试。',
      });
    } finally {
      tempMessageIdRef.current = null;
    }
  };

  return {
    bidRequirements,
    setBidRequirements,
    handleSubmit,
  };
};
