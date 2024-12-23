'use client';

import { create } from 'zustand';
import { Project } from '@/app/workspace/projects/types/project';
import {
  addProject,
  deleteProject,
  getAllProjects,
  getProject,
  updateProject,
} from '../services/db/projectsService';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: Error | null;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await getAllProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  fetchProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await getProject(id);
      if (project) {
        set({ currentProject: project, isLoading: false });
      }
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  createProject: async (projectData: Partial<Project>) => {
    set({ isLoading: true, error: null });
    try {
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

      await addProject(newProject);
      await get().fetchProjects();
      set({ isLoading: false });
      return newProject;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  updateProject: async (id: string, projectData: Partial<Project>) => {
    set({ isLoading: true, error: null });
    try {
      const existingProject = await getProject(id);
      if (!existingProject) {
        throw new Error('Project not found');
      }

      const updatedProject: Project = {
        ...existingProject,
        ...projectData,
        updatedAt: new Date().toISOString(),
        lastModifiedBy: 'current-user', // TODO: Get from auth
      };

      await updateProject(updatedProject);
      await get().fetchProjects();
      set({ isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteProject(id);
      await get().fetchProjects();
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
