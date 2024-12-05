'use client';

import { create } from 'zustand';
import { openChatDB } from '../services/db';
import { Component, Page, PageComponent } from '../services/db/schema';

interface PageState {
  pages: Page[];
  components: Component[];
  selectedPage: Page | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  fetchPages: (projectId: string) => Promise<void>;
  fetchComponents: () => Promise<void>;
  createPage: (projectId: string, page: Partial<Page>) => Promise<Page>;
  updatePage: (pageId: string, updates: Partial<Page>) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  addComponentToPage: (
    pageId: string,
    componentId: string,
    targetIndex?: number,
    config?: Record<string, any>
  ) => Promise<PageComponent>;
  removeComponentFromPage: (pageId: string, pageComponentId: string) => Promise<void>;
  reorderPageComponents: (pageId: string, componentIds: string[]) => Promise<void>;
  setSelectedPage: (page: Page | null) => void;
}

export const usePageStore = create<PageState>((set, get) => ({
  pages: [],
  components: [],
  selectedPage: null,
  isLoading: false,
  error: null,

  fetchPages: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      const pages = await db.getAllFromIndex('pages', 'by-project', projectId);
      set({ pages, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  fetchComponents: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      // 只获取已验证的组件
      const components = await db.getAllFromIndex('components', 'by-status', 'Done');
      set({ components, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  createPage: async (projectId: string, pageData: Partial<Page>) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      const newPage: Page = {
        id: crypto.randomUUID(),
        projectId,
        name: pageData.name || '新页面',
        description: pageData.description || '',
        type: pageData.type || 'page',
        lastUpdated: Date.now(),
        componentsCount: 0,
        components: [],
        ...pageData,
      };

      await db.add('pages', newPage);
      await get().fetchPages(projectId);
      set({ isLoading: false });
      return newPage;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  updatePage: async (pageId: string, updates: Partial<Page>) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      const page = await db.get('pages', pageId);
      if (!page) throw new Error('Page not found');

      const updatedPage = {
        ...page,
        ...updates,
        lastUpdated: Date.now(),
      };

      await db.put('pages', updatedPage);
      await get().fetchPages(page.projectId);
      if (get().selectedPage?.id === pageId) {
        set({ selectedPage: updatedPage });
      }
      set({ isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  deletePage: async (pageId: string) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      const page = await db.get('pages', pageId);
      if (!page) throw new Error('Page not found');

      await db.delete('pages', pageId);
      await get().fetchPages(page.projectId);
      if (get().selectedPage?.id === pageId) {
        set({ selectedPage: null });
      }
      set({ isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  addComponentToPage: async (
    pageId: string,
    componentId: string,
    targetIndex?: number,
    config?: Record<string, any>
  ) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      const page = await db.get('pages', pageId);
      if (!page) throw new Error('Page not found');

      const component = await db.get('components', componentId);
      if (!component) throw new Error('Component not found');

      // 创建新的组件引用
      const pageComponent: PageComponent = {
        id: crypto.randomUUID(),
        componentId,
        pageId,
        order: typeof targetIndex === 'number' ? targetIndex : page.components.length,
        config: config || {},
        addedAt: Date.now(),
      };

      // 获取现有组件列表的副本
      const updatedComponents = [...page.components];

      // 如果指定了目标位置，则插入到该位置
      if (typeof targetIndex === 'number') {
        updatedComponents.splice(targetIndex, 0, pageComponent);
        // 更新受影响组件的顺序
        updatedComponents.forEach((comp, index) => {
          comp.order = index;
        });
      } else {
        // 否则添加到末尾
        updatedComponents.push(pageComponent);
      }

      // 更新页面
      const updatedPage = {
        ...page,
        components: updatedComponents,
        componentsCount: updatedComponents.length,
        lastUpdated: Date.now(),
      };

      await db.put('pages', updatedPage);
      await get().fetchPages(page.projectId);
      if (get().selectedPage?.id === pageId) {
        set({ selectedPage: updatedPage });
      }
      set({ isLoading: false });
      return pageComponent;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  removeComponentFromPage: async (pageId: string, pageComponentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      const page = await db.get('pages', pageId);
      if (!page) throw new Error('Page not found');

      // 移除指定的页面组件
      const updatedComponents = page.components.filter((c) => c.id !== pageComponentId);

      // 重新计算顺序
      updatedComponents.forEach((component, index) => {
        component.order = index;
      });

      const updatedPage = {
        ...page,
        components: updatedComponents,
        componentsCount: updatedComponents.length,
        lastUpdated: Date.now(),
      };

      await db.put('pages', updatedPage);
      await get().fetchPages(page.projectId);
      if (get().selectedPage?.id === pageId) {
        set({ selectedPage: updatedPage });
      }
      set({ isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  reorderPageComponents: async (pageId: string, componentIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      const page = await db.get('pages', pageId);
      if (!page) throw new Error('Page not found');

      // 创建一个映射以快速查找组件
      const componentMap = new Map(page.components.map((c) => [c.id, c]));

      // 使用新的顺序重新组织组件，保持原有的组件实例
      const updatedComponents = componentIds.map((id, index) => {
        const component = componentMap.get(id);
        if (!component) {
          console.error(
            `Component ${id} not found in page, available components:`,
            Array.from(componentMap.keys())
          );
          throw new Error(`Component ${id} not found in page`);
        }
        return {
          ...component,
          order: index,
        };
      });

      // 确保所有原有组件都被包含
      const remainingComponents = page.components.filter((c) => !componentIds.includes(c.id));

      const updatedPage = {
        ...page,
        components: [
          ...updatedComponents,
          ...remainingComponents.map((c, i) => ({
            ...c,
            order: updatedComponents.length + i,
          })),
        ],
        lastUpdated: Date.now(),
      };

      await db.put('pages', updatedPage);
      await get().fetchPages(page.projectId);
      if (get().selectedPage?.id === pageId) {
        set({ selectedPage: updatedPage });
      }
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to reorder components:', error);
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  setSelectedPage: (page: Page | null) => {
    set({ selectedPage: page });
  },
}));
