import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as dbService from '../services/db';
import {
  ChatMessage,
  ChatTopic,
  ChatView,
  CodeContent,
  Component,
  Page,
  Project,
} from '../services/db/schema';

interface ChatStore {
  currentView: string;
  currentTopic: string;
  topicCode: Record<
    string,
    {
      html: string
      index: string
      panel: string
      scss: string
      js: string
    }
  >
  initializeDB: () => Promise<void>;
  addMessage: (topicId: string, message: ChatMessage) => Promise<void>;
  updateMessage: (topicId: string, messageId: string, updatedMessage: ChatMessage) => Promise<void>;
  getTopicMessages: (topicId: string) => Promise<ChatMessage[]>;
  addTopic: (topicData: ChatTopic) => Promise<string>;
  updateTopicTitle: (topicId: string, newTitle: string) => Promise<void>;
  deleteTopic: (viewId: string, topicId: string) => Promise<void>;
  getViewTopics: (viewId: string) => Promise<ChatTopic[]>;
  getTopicCode: (topicId: string, codeType: keyof CodeContent) => Promise<string>;
  updateTopicCode: (topicId: string, codeType: keyof CodeContent, code: string) => Promise<void>;
  // getLocalTopicCode: (topicId: string, codeType: keyof CodeContent) => string
  // updateLocalTopicCode: (
  //   topicId: string,
  //   newCode: {
  //     html?: string
  //     index?: string
  //     panel?: string
  //     scss?: string
  //     js?: string
  //   }
  // ) => void
  setCurrentView: (viewId: string) => void;
  setCurrentTopic: (topicId: string) => void;

  // 项目相关方法
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getAllProjects: () => Promise<Project[]>;

  // 页面相关方法
  addPage: (page: Page) => Promise<void>;
  updatePage: (page: Page) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  getProjectPages: (projectId: string) => Promise<Page[]>;

  // 组件相关方法
  addComponent: (component: Component) => Promise<void>;
  updateComponent: (component: Component) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
  getPageComponents: (pageId: string) => Promise<Component[]>;

  getAllViews: () => Promise<ChatView[]>;

  customTabs: string[];
  setCustomTabs: (tabs: string[]) => void;
  addCustomTab: (tab: string) => void;
  removeCustomTab: (tab: string) => void;

  updateTopic: (topicId: string, updatedData: Partial<ChatTopic>) => Promise<void>;
  getTopic: (topicId: string, field?: keyof ChatTopic) => Promise<any>;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      currentView: '',
      currentTopic: '',
      topicCode: {},

      initializeDB: async () => {
        await dbService.initDB();
        await dbService.initializeViews();
      },

      addMessage: async (topicId, message) => {
        await dbService.addMessage(message);
      },

      updateMessage: async (topicId, messageId, updatedMessage) => {
        await dbService.updateMessage(updatedMessage);
      },

      getTopicMessages: async (topicId) => {
        return await dbService.getTopicMessages(topicId);
      },

      // 项目内容 =================================== start
      addProject: async (project) => {
        await dbService.addProject(project);
      },
      updateProject: async (project) => {
        await dbService.updateProject(project);
      },
      deleteProject: async (id) => {
        await dbService.deleteProject(id);
      },
      getAllProjects: async () => {
        return await dbService.getAllProjects();
      },
      // 项目内容 =================================== end

      // 组件内容 =================================== start
      addTopic: async (topicData) => {
        const { id, title, type, activeImage, markdownContent, requirementMessages, frontend, backend, test } = topicData;
        const newTopic: ChatTopic = {
          id,
          title,
          type,
          activeImage,
          markdownContent,
          requirementMessages,
          frontend,
          backend,
          test,
          lastUpdated: Date.now(),
        };
        set({ currentTopic: id });
        await dbService.addTopic(newTopic);
        const { currentTopic } = get();
        console.error('%c  currentTopic', 'background-image:color:transparent;color:red;');
        console.error('🚀~ => ', currentTopic);
        return id
      },

      updateTopic: async (topicId, updatedData) => {
        const topic = await dbService.getTopic(topicId);
        if (topic) {
          const updatedTopic = { ...topic, ...updatedData, lastUpdated: Date.now() };
          // const updatedTopic = Object.assign({}, topic, updatedData, { lastUpdated: Date.now() });
          await dbService.updateTopic(updatedTopic);
        }
      },

      getTopic: async (topicId, field) => {
        const topic = await dbService.getTopic(topicId);
        if (topic) {
          return field ? topic[field] : topic;
        }
        return null;
      },

      deleteTopic: async (topicId) => {
        await dbService.deleteTopic(topicId);
      },


      updateTopicTitle: async (topicId, newTitle) => {
        const topic = await dbService.getTopic(topicId);
        if (topic) {
          topic.title = newTitle;
          topic.lastUpdated = Date.now();
          await dbService.updateTopic(topic);
        }
      },
      getViewTopics: async (viewId) => {
        return await dbService.getViewTopics(viewId);
      },
      getTopicCode: async (topicId, codeType) => {
        const code = await dbService.getCode(topicId, codeType);
        return code || '';
      },
      updateTopicCode: async (topicId, codeType, code) => {
        await dbService.updateCode(topicId, codeType, code);
      },
      // 组件内容 =================================== end

      setCurrentView: (viewId) => set({ currentView: viewId }),
      setCurrentTopic: (topicId) => set({ currentTopic: topicId }),

      addPage: async (page) => {
        await dbService.addPage(page);
      },
      updatePage: async (page) => {
        await dbService.updatePage(page);
      },
      deletePage: async (id) => {
        await dbService.deletePage(id);
      },
      getProjectPages: async (projectId) => {
        return await dbService.getProjectPages(projectId);
      },
      customTabs: ['html', 'js', 'scss'],
      setCustomTabs: (tabs) => set({ customTabs: tabs }),
      addCustomTab: (tab) => set((state) => ({ customTabs: [...state.customTabs, tab] })),
      removeCustomTab: (tab) => set((state) => ({ customTabs: state.customTabs.filter(t => t !== tab) })),

      addComponent: async (component) => {
        await dbService.addComponent(component);
      },
      updateComponent: async (component) => {
        await dbService.updateComponent(component);
      },
      deleteComponent: async (id) => {
        await dbService.deleteComponent(id);
      },
      getPageComponents: async (pageId) => {
        return await dbService.getPageComponents(pageId);
      },
      getAllViews: async () => {
        return await dbService.getAllViews();
      },

    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
