'use client';

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
}));
