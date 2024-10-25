import React, { useEffect, useRef } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Box, Group, Text } from '@mantine/core';
import { Component } from '../../../services/db/schema';

interface ComponentItemProps {
  component: Component;
  index: number;
  pageId: string;
}

export const ComponentItem: React.FC<ComponentItemProps> = ({ component, index, pageId }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current) return;

    const cleanup = draggable({
      element: itemRef.current,
      getInitialData: () => ({
        componentId: component.id,
        pageId: pageId,
        index: index,
      }),
    });

    return cleanup;
  }, [component.id, pageId, index]);

  return (
    <Box ref={itemRef} className="component-item">
      <Group justify="apart">
        <Text fw={500}>{component.name}</Text>
        <Text size="xs" c="dimmed">
          {component.type}
        </Text>
      </Group>
    </Box>
  );
};
