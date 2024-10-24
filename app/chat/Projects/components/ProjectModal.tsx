import React from 'react';
import { IconEdit, IconSettings, IconUsers } from '@tabler/icons-react';
import { Button, Modal, Select, Switch, Tabs, Text, Textarea, TextInput } from '@mantine/core';
import { MockProject } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: MockProject | null;
  onSave: (project: MockProject) => void;
  onDelete: (id: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave,
  onDelete,
}) => {
  const [editedProject, setEditedProject] = React.useState<MockProject | null>(project);

  React.useEffect(() => {
    setEditedProject(project);
  }, [project]);

  if (!editedProject) return null;

  const handleSave = () => {
    onSave(editedProject);
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Project Details" size="xl">
      <Tabs defaultValue="info">
        <Tabs.List>
          <Tabs.Tab value="info" icon={<IconEdit size="0.8rem" />}>
            Project Info
          </Tabs.Tab>
          <Tabs.Tab value="pages" icon={<IconUsers size="0.8rem" />}>
            Pages
          </Tabs.Tab>
          <Tabs.Tab value="settings" icon={<IconSettings size="0.8rem" />}>
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="info" pt="xs">
          <TextInput
            label="Project Name"
            value={editedProject.name}
            onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
            mb="md"
          />
          <Textarea
            label="Project Description"
            value={editedProject.description}
            onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
            mb="md"
          />
          <Select
            label="Code Type"
            data={[
              { value: 'React', label: 'React' },
              { value: 'Vue', label: 'Vue' },
              { value: 'Angular', label: 'Angular' },
            ]}
            value={editedProject.codeType}
            onChange={(value) => setEditedProject({ ...editedProject, codeType: value || '' })}
            mb="md"
          />
          <Text size="sm" mb="md">
            Created by {editedProject.creator} on{' '}
            {new Date(editedProject.createdAt).toLocaleDateString()}
          </Text>
          <Text size="sm" mb="md">
            Pages: {editedProject.pagesCount} | Components: {editedProject.componentsCount}
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="pages" pt="xs">
          <Text>Page management functionality to be implemented.</Text>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="xs">
          <Switch
            label="Public Project"
            checked={editedProject.isPublic}
            onChange={(event) =>
              setEditedProject({ ...editedProject, isPublic: event.currentTarget.checked })
            }
            mb="md"
          />
          <Button color="red" onClick={() => onDelete(editedProject.id)} fullWidth mt="xl">
            Delete Project
          </Button>
        </Tabs.Panel>
      </Tabs>
      <Button onClick={handleSave} fullWidth mt="md">
        Save Changes
      </Button>
    </Modal>
  );
};
