import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface ChatMessage {
  id: string
  content: string
  image?: string
  isUser: boolean
  code?: {
    html: string
    index: string
    panel: string
    scss: string
  }
}

interface ChatState {
  currentTopic: any
  topics: Record<string, ChatMessage[]>
  topicCode: Record<
    string,
    {
      html: string
      index: string
      panel: string
      scss: string
    }
  >
  addMessage: (topicId: string, message: ChatMessage) => void
  updateMessage: (
    topicId: string,
    messageId: string,
    updatedMessage: ChatMessage
  ) => void
  getTopicMessages: (topicId: string) => ChatMessage[]
  addTopic: (topicId: string, title: string) => void
  updateTopicTitle: (topicId: string, newTitle: string) => void
  deleteTopic: (topicId: string) => void
  getTopicCode: (topicId: string, codeType: keyof ChatMessage['code']) => string
  updateTopicCode: (
    topicId: string,
    newCode: {
      html?: string
      index?: string
      panel?: string
      scss?: string
    }
  ) => void
}

export const ChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      currentTopic: null,
      topics: {},
      topicCode: {},
      addMessage: (topicId, message) =>
        set((state) => ({
          topics: {
            ...state.topics,
            [topicId]: [...(state.topics[topicId] || []), message],
          },
        })),
      updateMessage: (topicId, messageId, updatedMessage) =>
        set((state) => ({
          topics: {
            ...state.topics,
            [topicId]: state.topics[topicId].map((msg) =>
              msg.id === messageId ? updatedMessage : msg
            ),
          },
        })),
      getTopicMessages: (topicId) => get().topics[topicId] || [],
      addTopic: (topicId, title) =>
        set((state) => ({
          topics: {
            ...state.topics,
            [topicId]: [{ id: topicId, content: title, isUser: false }],
          },
          topicCode: {
            ...state.topicCode,
            [topicId]: { html: '', index: '', panel: '', scss: '' },
          },
          currentTopic: topicId,
        })),
      updateTopicTitle: (topicId, newTitle) =>
        set((state) => ({
          topics: {
            ...state.topics,
            [topicId]: [
              { id: topicId, content: newTitle, isUser: false },
              ...state.topics[topicId].slice(1),
            ],
          },
        })),
      deleteTopic: (topicId) =>
        set((state) => {
          const { [topicId]: _, ...restTopics } = state.topics
          const { [topicId]: __, ...restTopicCode } = state.topicCode
          return { 
            topics: restTopics, 
            topicCode: restTopicCode,
            currentTopic: state.currentTopic === topicId ? null : state.currentTopic
          }
        }),
      getTopicCode: (topicId, codeType) => {
        return get().topicCode[topicId]?.[codeType] || ''
      },
      updateTopicCode: (topicId, newCode) =>
        set((state) => ({
          topicCode: {
            ...state.topicCode,
            [topicId]: {
              html: newCode.html ?? state.topicCode[topicId]?.html ?? '',
              index: newCode.index ?? state.topicCode[topicId]?.index ?? '',
              panel: newCode.panel ?? state.topicCode[topicId]?.panel ?? '',
              scss: newCode.scss ?? state.topicCode[topicId]?.scss ?? '',
            },
          },
        })),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// 如果你之前使用的是 useChatStore，你可以保留它作为一个别名
export const useChatStore = ChatStore
