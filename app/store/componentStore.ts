'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as componentsService from '@/app/services/db/componentsService';
import { Component } from '@/app/services/db/schema';

interface ComponentState {
  components: Component[];
  selectedComponent: Component | null;
  loading: boolean;
  error: Error | null;

  // Actions
  loadComponents: () => Promise<void>;
  addComponent: (
    component: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<Component>;
  updateComponent: (id: string, updates: Partial<Component>) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
  setSelectedComponent: (component: Component | null) => void;

  // Filtered queries
  getComponentsByFramework: (framework: string) => Promise<void>;
  getComponentsByTags: (tags: Component['tags']) => Promise<void>;
  filterComponents: (options: {
    status?: Component['status'];
    framework?: string;
    tags?: Component['tags'];
    published?: boolean;
    creator?: string;
  }) => Promise<void>;
}

export const useComponentStore = create<ComponentState>()(
  persist(
    (set, get) => ({
      components: [],
      selectedComponent: null,
      loading: false,
      error: null,

      loadComponents: async () => {
        if (get().loading) return;

        try {
          set({ loading: true, error: null });
          const data = await componentsService.getAllComponents();
          set({ components: data });
        } catch (err) {
          set({ error: err instanceof Error ? err : new Error('Failed to load components') });
        } finally {
          set({ loading: false });
        }
      },

      addComponent: async (componentData) => {
        try {
          set({ loading: true, error: null });
          const newComponent = await componentsService.addComponent(componentData);
          set((state) => ({
            components: [newComponent, ...state.components],
            selectedComponent: newComponent,
          }));
          return newComponent;
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to add component');
          set({ error });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      updateComponent: async (id, updates) => {
        try {
          set({ loading: true, error: null });
          const updatedComponent = await componentsService.updateComponent(id, updates);
          set((state) => ({
            components: state.components.map((c) => (c.id === id ? updatedComponent : c)),
            selectedComponent:
              state.selectedComponent?.id === id ? updatedComponent : state.selectedComponent,
          }));
        } catch (err) {
          set({ error: err instanceof Error ? err : new Error('Failed to update component') });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      deleteComponent: async (id) => {
        try {
          set({ loading: true, error: null });
          await componentsService.deleteComponent(id);
          set((state) => ({
            components: state.components.filter((c) => c.id !== id),
            selectedComponent: state.selectedComponent?.id === id ? null : state.selectedComponent,
          }));
        } catch (err) {
          set({ error: err instanceof Error ? err : new Error('Failed to delete component') });
        } finally {
          set({ loading: false });
        }
      },

      setSelectedComponent: (component) => {
        set({ selectedComponent: component });
      },

      getComponentsByFramework: async (framework) => {
        try {
          set({ loading: true, error: null });
          const data = await componentsService.getComponentsByFramework(framework);
          set({ components: data });
        } catch (err) {
          set({ error: err instanceof Error ? err : new Error('Failed to load components') });
        } finally {
          set({ loading: false });
        }
      },

      getComponentsByTags: async (tags) => {
        try {
          set({ loading: true, error: null });
          const data = await componentsService.getComponentsByTags(tags);
          set({ components: data });
        } catch (err) {
          set({ error: err instanceof Error ? err : new Error('Failed to load components') });
        } finally {
          set({ loading: false });
        }
      },

      filterComponents: async (options) => {
        try {
          set({ loading: true, error: null });
          const data = await componentsService.getAllComponents(options);
          set({ components: data });
        } catch (err) {
          set({ error: err instanceof Error ? err : new Error('Failed to filter components') });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'component-storage',
    }
  )
);
