import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MarketComponent } from '../types';

export function useComponentActions() {
  const router = useRouter();
  const [loading, setLoading] = useState<{
    chatLoading: boolean;
    addLoading: boolean;
  }>({
    chatLoading: false,
    addLoading: false,
  });

  // 开始对话
  const handleStartChat = async (component: MarketComponent) => {
    // try {
    //   setLoading((prev) => ({ ...prev, chatLoading: true }));
    //   // 创建新的对话主题
    //   const topicId = await createChatTopic({
    //     title: `关于组件 ${component.name} 的对话`,
    //     type: 'component',
    //     componentId: component.id,
    //   });
    //   // 导航到对话页面
    //   router.push(`/chats/${topicId}`);
    // } catch (error) {
    //   console.error('Failed to start chat:', error);
    //   // 可以添加错误提示
    // } finally {
    //   setLoading((prev) => ({ ...prev, chatLoading: false }));
    // }
  };

  // 添加到项目
  const handleAddToProject = async (component: MarketComponent) => {
    try {
      setLoading((prev) => ({ ...prev, addLoading: true }));

      // TODO: 实现添加到项目的逻辑
      // 1. 打开项目选择对话框
      // 2. 选择目标项目和页面
      // 3. 添加组件到页面
    } catch (error) {
      console.error('Failed to add to project:', error);
      // 可以添加错误提示
    } finally {
      setLoading((prev) => ({ ...prev, addLoading: false }));
    }
  };

  return {
    loading,
    handleStartChat,
    handleAddToProject,
  };
}
