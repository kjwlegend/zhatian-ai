import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/app/chats/hooks/useChatMessages';

interface ChatState {
  // 消息相关
  requirementMessages: Message[];
  frontendMessages: Message[];
  backendMessages: Message[];
  testMessages: Message[];
  cmsMessages: Message[];

  // Framework 选择
  frontendFramework: string | null;
  backendFramework: string | null;
  testFramework: string | null;

  // Actions
  setRequirementMessages: (messages: Message[]) => void;
  setFrontendMessages: (messages: Message[]) => void;
  setBackendMessages: (messages: Message[]) => void;
  setTestMessages: (messages: Message[]) => void;
  setCmsMessages: (messages: Message[]) => void;

  setFrontendFramework: (framework: string | null) => void;
  setBackendFramework: (framework: string | null) => void;
  setTestFramework: (framework: string | null) => void;

  // 重置所有状态
  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      // 初始状态
      requirementMessages: [],
      frontendMessages: [],
      backendMessages: [],
      testMessages: [],
      cmsMessages: [],
      frontendFramework: null,
      backendFramework: null,
      testFramework: null,

      // Actions
      setRequirementMessages: (messages) => 
        set({ requirementMessages: messages }),
      
      setFrontendMessages: (messages) => 
        set({ frontendMessages: messages }),
      
      setBackendMessages: (messages) => 
        set({ backendMessages: messages }),
      
      setTestMessages: (messages) => 
        set({ testMessages: messages }),
      
      setCmsMessages: (messages) => 
        set({ cmsMessages: messages }),

      setFrontendFramework: (framework) => 
        set({ frontendFramework: framework }),
      
      setBackendFramework: (framework) => 
        set({ backendFramework: framework }),
      
      setTestFramework: (framework) => 
        set({ testFramework: framework }),

      // 重置
      reset: () => set({
        requirementMessages: [],
        frontendMessages: [],
        backendMessages: [],
        testMessages: [],
        cmsMessages: [],
        frontendFramework: null,
        backendFramework: null,
        testFramework: null,
      }),
    }),
    {
      name: 'chat-state',
    }
  )
);
