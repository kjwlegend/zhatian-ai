'use client';

import { useEffect } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CreateProjectDialog } from './components/CreateProjectDialog';
import { ProjectCard } from './components/ProjectCard';
import { useProjects } from './hooks/useProjects';

export default function ProjectsPage() {
  const {
    projects,
    isLoading,
    error,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    refreshProjects,
  } = useProjects();

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">项目管理</h1>
          <p className="text-muted-foreground mt-1">管理您的所有项目，创建新项目或编辑现有项目。</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新建项目
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">还没有项目</h3>
          <p className="text-muted-foreground mb-4">创建您的第一个项目开始工作吧</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新建项目
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={{
                ...project,
                pagesCount: project.pages.length,
                componentsCount: project.components.length,
              }}
              onDelete={handleDeleteProject}
              onEdit={handleEditProject}
            />
          ))}
        </div>
      )}

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
