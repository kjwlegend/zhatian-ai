'use client';

import { Draggable } from 'react-beautiful-dnd';
import { Component } from '@/app/services/db/schema';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ComponentItemProps {
  component: Component;
  instanceId: string;
  index: number;
  onClick: () => void;
}

export function ComponentItem({ component, instanceId, index, onClick }: ComponentItemProps) {
  const draggableId = instanceId;

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 cursor-pointer hover:border-primary transition-colors ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
          onClick={onClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{component.name}</h3>
              <div className="flex gap-1 mt-1">
                {component.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge>{component.codeFramework}</Badge>
          </div>
        </Card>
      )}
    </Draggable>
  );
}
