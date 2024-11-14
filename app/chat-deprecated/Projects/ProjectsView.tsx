import React, { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { ActionIcon, Grid, Group, Title } from '@mantine/core';
import { useChatStore } from '../../store/chatStore';
import { useProjectStore } from '../../store/projectStore';
import { CreateProjectModal } from './components/CreateProjectModal';
import { ProjectCard } from './components/ProjectCard';
import { ProjectModal } from './components/ProjectModal';
import { Project } from './types';

import './ProjectsView.scss';

const ProjectsView: React.FC = () => {
  const { projects, loadProjects, addProject, updateProject, deleteProject, setCurrentProject } =
    useProjectStore();
  const { setCurrentView } = useChatStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = (newProject: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => {
    addProject(newProject);
    setIsCreateModalOpen(false);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    updateProject(updatedProject);
    setIsEditModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    setIsEditModalOpen(false);
  };

  const handleEnterProject = (project: Project) => {
    setCurrentProject(project);
    setCurrentView('Pages');
  };

  return (
    <div className="projects-view">
      <Group position="apart" mb="xl">
        <Title order={2}>Projects</Title>
        <ActionIcon
          size="xl"
          radius="xl"
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan' }}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <IconPlus size={24} />
        </ActionIcon>
      </Group>

      <Grid>
        {projects.map((project) => (
          <Grid.Col key={project.id} span={4}>
            <ProjectCard
              project={project}
              onViewDetails={() => {
                setSelectedProject(project);
                setIsEditModalOpen(true);
              }}
              onEnterProject={() => handleEnterProject(project)}
            />
          </Grid.Col>
        ))}
      </Grid>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
      />

      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={selectedProject}
        onSave={handleUpdateProject}
        onDelete={handleDeleteProject}
      />
    </div>
  );
};

export default ProjectsView;
