'use client';

import { create } from 'zustand';
import { Project, ProjectSummary } from '@/app/workspace/projects/types/project';
import { openChatDB } from '../services/db';

interface ProjectState {
  projects: ProjectSummary[];
  currentProject: Project | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (project: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      const projects = await db.getAll('projects');
      set({
        projects: projects.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          status: p.status,
          platforms: p.platforms,
          pagesCount: p.pages.length,
          componentsCount: p.components.length,
          thumbnail: p.thumbnail,
          updatedAt: p.updatedAt,
        })),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      const project = await db.get('projects', id);
      if (project) {
        set({ currentProject: project, isLoading: false });
      } else {
        throw new Error('Project not found');
      }
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  createProject: async (projectData: Partial<Project>) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: projectData.name || 'New Project',
        description: projectData.description || '',
        status: projectData.status || 'active',
        platforms: projectData.platforms || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: projectData.members || [],
        components: projectData.components || [],
        pages: projectData.pages || [],
        creator: 'current-user', // TODO: Get from auth
        lastModifiedBy: 'current-user',
        ...projectData,
      };

      await db.add('projects', newProject);
      await get().fetchProjects();
      set({ isLoading: false });
      return newProject;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      const project = await db.get('projects', id);
      if (!project) throw new Error('Project not found');

      const updatedProject = {
        ...project,
        ...updates,
        updatedAt: new Date().toISOString(),
        lastModifiedBy: 'current-user', // TODO: Get from auth
      };

      await db.put('projects', updatedProject);
      await get().fetchProjects();
      if (get().currentProject?.id === id) {
        set({ currentProject: updatedProject });
      }
      set({ isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const db = await openChatDB();
      await db.delete('projects', id);
      await get().fetchProjects();
      if (get().currentProject?.id === id) {
        set({ currentProject: null });
      }
      set({ isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },
}));
