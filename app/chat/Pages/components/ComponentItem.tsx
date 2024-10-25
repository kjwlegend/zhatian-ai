import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Box, Text } from '@mantine/core';
import { Component } from '../../../services/db/schema';

interface ComponentItemProps {
  component: Component;
  index: number;
}

export const ComponentItem: React.FC<ComponentItemProps> = ({ component, index }) => {
  return (
    <Draggable draggableId={component.id} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="component-item"
        >
          <Text>{component.name}</Text>
          <Text size="sm" color="dimmed">
            {component.type}
          </Text>
        </Box>
      )}
    </Draggable>
  );
};
