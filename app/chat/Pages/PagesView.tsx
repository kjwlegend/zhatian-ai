import React, { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Anchor, Box, Breadcrumbs, Button, Group, ScrollArea, Text, Title } from '@mantine/core';
import { Component, Page } from '../../services/db/schema';
import { useProjectStore } from '../../store/projectStore';
import { CreatePageModal } from './components/CreatePageModal';
import { PageColumn } from './components/PageColumn';

import './PagesView.scss';

interface PagesViewProps {
  projectId: string;
}

const PagesView: React.FC<PagesViewProps> = ({ projectId }) => {
  const {
    currentProject,
    pages,
    components,
    loadPages,
    loadComponents,
    addPage,
    updatePage,
    deletePage,
    updateComponent,
    moveComponent,
  } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (projectId) {
        setIsLoading(true);
        setError(null);
        try {
          await loadPages(projectId);
          const loadedPages = useProjectStore.getState().pages;
          if (loadedPages.length > 0) {
            const pageIds = loadedPages.map((page) => page.id);
            await loadComponents(pageIds);
          }
          setIsLoading(false);
        } catch (err) {
          setError('Failed to load pages or components');
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [projectId, loadPages, loadComponents]);

  const handleCreatePage = async (newPage: Omit<Page, 'id' | 'lastUpdated'>) => {
    await addPage({ ...newPage, projectId });
    setIsCreateModalOpen(false);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // If there's no destination, we don't need to do anything
    if (!destination) return;

    // If the source and destination are the same, we don't need to do anything
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    const sourcePageId = source.droppableId;
    const destPageId = destination.droppableId;

    // Get the component that was dragged
    const draggedComponent = components[sourcePageId].find((comp) => comp.id === draggableId);

    if (!draggedComponent) {
      console.error('Dragged component not found');
      return;
    }

    // Remove the component from the source page
    const newSourceComponents = components[sourcePageId].filter((comp) => comp.id !== draggableId);

    // Add the component to the destination page
    const newDestComponents = Array.from(components[destPageId] || []);
    newDestComponents.splice(destination.index, 0, { ...draggedComponent, pageId: destPageId });

    // Update the store
    await moveComponent(draggableId, sourcePageId, destPageId, destination.index);

    // Update the component's page ID
    await updateComponent({ ...draggedComponent, pageId: destPageId });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="pages-view">
      <Group justify="space-between" mb="xl">
        <div>
          <Breadcrumbs>
            <Anchor href="/chat/projects">Projects</Anchor>
            <Anchor>{currentProject?.name}</Anchor>
            <Anchor>Pages</Anchor>
          </Breadcrumbs>
          <Title order={2} mt="xs">
            Pages
          </Title>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Group gap="xs">
            <IconPlus size={14} />
            <span>Add Page</span>
          </Group>
        </Button>
      </Group>

      <DragDropContext onDragEnd={handleDragEnd}>
        <ScrollArea className="pages-scroll-area">
          <div className="pages-container">
            {pages.length === 0 ? (
              <Text>No pages found. Create a new page to get started.</Text>
            ) : (
              pages.map((page) => (
                <PageColumn
                  key={page.id}
                  page={page}
                  components={components[page.id] || []}
                  onDeletePage={() => deletePage(page.id)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </DragDropContext>

      <CreatePageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePage}
      />
    </div>
  );
};

export default PagesView;
