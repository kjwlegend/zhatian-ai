import React, { useState } from 'react';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { Droppable } from 'react-beautiful-dnd';
import { ActionIcon, Box, Button, Group, Text, Title } from '@mantine/core';
import { Component, Page } from '../../../services/db/schema';
import { useProjectStore } from '../../../store/projectStore';
import { AddComponentModal } from './AddComponentModal';
import { ComponentItem } from './ComponentItem';

interface PageColumnProps {
  page: Page;
  components: Component[];
  onDeletePage: () => void;
}

export const PageColumn: React.FC<PageColumnProps> = ({ page, components, onDeletePage }) => {
  const { deletePage, addComponent } = useProjectStore();
  const [isAddComponentModalOpen, setIsAddComponentModalOpen] = useState(false);

  const handleDeletePage = () => {
    deletePage(page.id);
  };

  const handleAddComponent = (componentData: Omit<Component, 'id' | 'lastUpdated'>) => {
    addComponent({ ...componentData, pageId: page.id });
    setIsAddComponentModalOpen(false);
  };

  return (
    <Box className="page-column">
      <Group justify="space-between" mb="md">
        <Title order={3}>{page.name}</Title>
        <ActionIcon color="red" onClick={onDeletePage}>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
      <Box className="page-actions">
        <Button
          leftSection={<IconPlus size={14} />}
          onClick={() => setIsAddComponentModalOpen(true)}
          fullWidth
          variant="light"
        >
          Add Component
        </Button>
      </Box>
      <Droppable droppableId={page.id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="components-list">
            {components.map((component, index) => (
              <ComponentItem key={component.id} component={component} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <AddComponentModal
        isOpen={isAddComponentModalOpen}
        onClose={() => setIsAddComponentModalOpen(false)}
        onAddComponent={handleAddComponent}
      />
    </Box>
  );
};
