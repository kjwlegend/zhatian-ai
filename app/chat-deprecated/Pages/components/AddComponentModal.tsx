import React, { useState } from 'react';
import { Button, Modal, Select, TextInput } from '@mantine/core';
import { Component } from '../../../services/db/schema';

interface AddComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComponent: (component: Omit<Component, 'id' | 'lastUpdated'>) => void;
}

export const AddComponentModal: React.FC<AddComponentModalProps> = ({
  isOpen,
  onClose,
  onAddComponent,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<string | null>(null);

  const handleSubmit = () => {
    if (name && type) {
      onAddComponent({
        name,
        type,
        content: '',
        pageId: '', // This will be set in the parent component
      });
      setName('');
      setType(null);
      onClose();
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Add New Component">
      <TextInput
        label="Component Name"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        required
      />
      <Select
        label="Component Type"
        data={[
          { value: 'text', label: 'Text' },
          { value: 'image', label: 'Image' },
          { value: 'button', label: 'Button' },
        ]}
        value={type}
        onChange={(value: string | null) => setType(value)}
        required
      />
      <Button onClick={handleSubmit} fullWidth mt="md">
        Add Component
      </Button>
    </Modal>
  );
};
