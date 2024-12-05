import { useState } from 'react';
import { useProjectStore } from '@/app/store/projectStore';
import { Platform, Project } from '../types/project';

export function useProjects() {
  const { projects, isLoading, error, fetchProjects, createProject, updateProject, deleteProject } =
    useProjectStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateProject = async (data: {
    name: string;
    description: string;
    platforms: Platform[];
  }) => {
    try {
      await createProject(data);
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleEditProject = async (id: string, data: Partial<Project>) => {
    try {
      await updateProject(id, data);
      setIsEditDialogOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setIsEditDialogOpen(true);
  };

  return {
    projects,
    isLoading,
    error,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingProject,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    openEditDialog,
    refreshProjects: fetchProjects,
  };
}
