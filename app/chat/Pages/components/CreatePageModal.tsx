import React from 'react';
import { Button, Modal, Select, TextInput } from '@mantine/core';
import { Page } from '../types';

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (page: Omit<Page, 'id' | 'lastUpdated' | 'componentsCount'>) => void;
}

export const CreatePageModal: React.FC<CreatePageModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [newPage, setNewPage] = React.useState({
    name: '',
    description: '',
    type: '',
  });

  const handleCreate = () => {
    onCreate(newPage);
    onClose();
    setNewPage({ name: '', description: '', type: '' });
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Create New Page" size="lg">
      <TextInput
        label="Page Name"
        placeholder="Enter page name"
        value={newPage.name}
        onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
        mb="md"
      />
      <TextInput
        label="Page Description"
        placeholder="Enter page description"
        value={newPage.description}
        onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
        mb="md"
      />
      <Select
        label="Page Type"
        placeholder="Select page type"
        data={[
          { value: 'static', label: 'Static' },
          { value: 'dynamic', label: 'Dynamic' },
        ]}
        value={newPage.type}
        onChange={(value) => setNewPage({ ...newPage, type: value || '' })}
        mb="md"
      />
      <Button onClick={handleCreate} fullWidth mt="md">
        Create Page
      </Button>
    </Modal>
  );
};
