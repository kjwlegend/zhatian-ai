import React, { useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { IconPlus, IconTrash } from '@tabler/icons-react';
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
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!columnRef.current) return;

    const cleanup = dropTargetForElements({
      element: columnRef.current,
      getIsSticky: () => true,
      getData: () => ({ pageId: page.id }),
      onDragEnter: () => {
        console.log('Drag entered page:', page.id);
      },
      onDragLeave: () => {
        console.log('Drag left page:', page.id);
      },
    });

    return cleanup;
  }, [page.id]);

  const handleDeletePage = () => {
    deletePage(page.id);
  };

  const handleAddComponent = (componentData: Omit<Component, 'id' | 'lastUpdated'>) => {
    addComponent({ ...componentData, pageId: page.id });
    setIsAddComponentModalOpen(false);
  };

  return (
    <Box ref={columnRef} className="page-column">
      <Group justify="space-between" mb="md">
        <Title order={4}>{page.name}</Title>
        <ActionIcon color="red" variant="subtle" onClick={onDeletePage}>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
      <Text size="sm" color="dimmed" mb="md">
        {page.description}
      </Text>
      <Box className="page-actions">
        <Button
          leftSection={<IconPlus size={14} />}
          onClick={() => setIsAddComponentModalOpen(true)}
          fullWidth
          variant="light"
          color="blue"
        >
          Add Component
        </Button>
      </Box>
      <div className="components-list">
        {components.map((component, index) => (
          <ComponentItem key={component.id} component={component} index={index} pageId={page.id} />
        ))}
      </div>
      <AddComponentModal
        isOpen={isAddComponentModalOpen}
        onClose={() => setIsAddComponentModalOpen(false)}
        onAddComponent={handleAddComponent}
      />
    </Box>
  );
};
