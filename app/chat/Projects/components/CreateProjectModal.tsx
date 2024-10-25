import React from 'react';
import { Button, Modal, Select, Textarea, TextInput } from '@mantine/core';
import { MockProject } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    project: Omit<MockProject, 'id' | 'createdAt' | 'pagesCount' | 'componentsCount'>
  ) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [newProject, setNewProject] = React.useState({
    name: '',
    description: '',
    codeType: '',
    isPublic: false,
  });

  const handleCreate = () => {
    onCreate({
      ...newProject,
      creator: 'Current User',
    });
    onClose();
    setNewProject({ name: '', description: '', codeType: '', isPublic: false });
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Create New Project" size="lg">
      <TextInput
        label="Project Name"
        placeholder="Enter project name"
        value={newProject.name}
        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
        mb="md"
      />
      <Textarea
        label="Project Description"
        placeholder="Enter project description"
        value={newProject.description}
        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        mb="md"
      />
      <Select
        label="Code Type"
        placeholder="Select code type"
        data={[
          { value: 'React', label: 'React' },
          { value: 'Vue', label: 'Vue' },
          { value: 'Angular', label: 'Angular' },
        ]}
        value={newProject.codeType}
        onChange={(value) => setNewProject({ ...newProject, codeType: value || '' })}
        mb="md"
      />
      <Button onClick={handleCreate} fullWidth mt="md">
        Create Project
      </Button>
    </Modal>
  );
};
