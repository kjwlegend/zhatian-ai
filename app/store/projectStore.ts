import { create } from 'zustand';
import * as dbService from '../services/db';
import { Component, Page, Project } from '../services/db/schema';

interface ProjectStore {
  currentProject: Project | null;
  projects: Project[];
  pages: Page[];
  components: { [pageId: string]: Component[] };

  // Project actions
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;

  // Page actions
  loadPages: (projectId: string) => Promise<void>;
  addPage: (page: Omit<Page, 'id' | 'lastUpdated'>) => Promise<void>;
  updatePage: (page: Page) => Promise<void>;
  deletePage: (id: string) => Promise<void>;

  // Component actions
  loadComponents: (pageIds: string[]) => Promise<void>;
  addComponent: (component: Omit<Component, 'id' | 'lastUpdated'>) => Promise<void>;
  updateComponent: (component: Component) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
  moveComponent: (
    componentId: string,
    sourcePageId: string,
    targetPageId: string,
    newIndex: number
  ) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  projects: [],
  pages: [],
  components: {},

  loadProjects: async () => {
    const projects = await dbService.getAllProjects();
    set({ projects });
  },

  addProject: async (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };
    await dbService.addProject(newProject);
    set((state) => ({ projects: [...state.projects, newProject] }));
  },

  updateProject: async (project) => {
    await dbService.updateProject(project);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
      currentProject: state.currentProject?.id === project.id ? project : state.currentProject,
    }));
  },

  deleteProject: async (id) => {
    await dbService.deleteProject(id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  loadPages: async (projectId) => {
    const pages = await dbService.getProjectPages(projectId);
    set({ pages });
  },

  addPage: async (pageData) => {
    const newPage: Page = {
      ...pageData,
      id: Date.now().toString(),
      lastUpdated: Date.now(),
    };
    await dbService.addPage(newPage);
    set((state) => ({ pages: [...state.pages, newPage] }));
    console.log('newPage', newPage, 'allpages', get().pages);
  },

  updatePage: async (page) => {
    await dbService.updatePage(page);
    set((state) => ({
      pages: state.pages.map((p) => (p.id === page.id ? page : p)),
    }));
  },

  deletePage: async (id) => {
    await dbService.deletePage(id);
    set((state) => ({
      pages: state.pages.filter((p) => p.id !== id),
    }));
  },

  loadComponents: async (pageIds) => {
    const componentsMap: Record<string, Component[]> = {};
    console.log('pageIds', pageIds);
    for (const pageId of pageIds) {
      const pageComponents = await dbService.getPageComponents(pageId);
      componentsMap[pageId] = pageComponents;
      console.log('pageComponents', pageComponents);
    }
    set({ components: componentsMap });
  },

  addComponent: async (componentData) => {
    const newComponent: Component = {
      ...componentData,
      id: Date.now().toString(),
      lastUpdated: Date.now(),
    };
    await dbService.addComponent(newComponent);
    set((state) => ({
      components: {
        ...state.components,
        [newComponent.pageId]: [...(state.components[newComponent.pageId] || []), newComponent],
      },
    }));
  },

  updateComponent: async (component) => {
    await dbService.updateComponent(component);
    set((state) => ({
      components: {
        ...state.components,
        [component.pageId]: state.components[component.pageId].map((c) =>
          c.id === component.id ? component : c
        ),
      },
    }));
  },

  deleteComponent: async (id) => {
    const component = await dbService.getComponent(id);
    if (component) {
      await dbService.deleteComponent(id);
      set((state) => ({
        components: {
          ...state.components,
          [component.pageId]: state.components[component.pageId].filter((c) => c.id !== id),
        },
      }));
    }
  },

  moveComponent: async (componentId, sourcePageId, targetPageId, newIndex) => {
    const component = await dbService.getComponent(componentId);
    console.log('component', component);
    if (component) {
      const updatedComponent = { ...component, pageId: targetPageId };
      await dbService.updateComponent(updatedComponent);

      console.log('updatedComponent', updatedComponent);

      set((state) => {
        const newSourceComponents = state.components[sourcePageId].filter(
          (c) => c.id !== componentId
        );
        const newTargetComponents = [...(state.components[targetPageId] || [])];
        newTargetComponents.splice(newIndex, 0, updatedComponent);

        return {
          components: {
            ...state.components,
            [sourcePageId]: newSourceComponents,
            [targetPageId]: newTargetComponents,
          },
        };
      });
    }
  },
}));
