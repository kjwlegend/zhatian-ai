import React, { useEffect, useState } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { IconPlus } from '@tabler/icons-react';
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

  useEffect(() => {
    const cleanup = monitorForElements({
      onDragStart: (source) => {
        console.log('Drag started:', source);
      },
      onDrop: async ({ source, location }) => {
        console.log('Drop event:', source, location);
        const destination = location.current.dropTargets[0];
        if (!destination) {
          console.log('No valid drop destination');
          return;
        }

        const sourcePageId = source.data.pageId as string;
        const destPageId = destination.data.pageId as string;
        const componentId = source.data.componentId as string;

        console.log('sourcePageId', sourcePageId);
        console.log('destPageId', destPageId);
        console.log('componentId', componentId);

        if (!sourcePageId || !destPageId || !componentId) {
          console.log('Missing required data for drag and drop');
          return;
        }

        if (sourcePageId === destPageId) {
          console.log('Source and destination are the same');
          return;
        }

        const draggedComponent = components[sourcePageId]?.find((comp) => comp.id === componentId);
        if (!draggedComponent) {
          console.log('Dragged component not found');
          return;
        }

        const destinationIndex = components[destPageId]?.length || 0;

        try {
          await moveComponent(componentId, sourcePageId, destPageId, destinationIndex);
          console.log('Component moved successfully');
          await updateComponent({ ...draggedComponent, pageId: destPageId });
          console.log('Component updated successfully');
        } catch (error) {
          console.error('Error during drag and drop:', error);
        }
      },
    });

    return cleanup;
  }, [components, moveComponent, updateComponent]);

  const handleCreatePage = async (newPage: Omit<Page, 'id' | 'lastUpdated'>) => {
    await addPage({ ...newPage, projectId });
    setIsCreateModalOpen(false);
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

      <CreatePageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePage}
      />
    </div>
  );
};

export default PagesView;
