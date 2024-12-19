'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';
import { Component } from '@/app/services/db/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ComponentItemProps {
  component: Component;
  instanceId: string;
  index: number;
  onClick: () => void;
  onDelete: () => void;
}

export function ComponentItem({
  component,
  instanceId,
  index,
  onClick,
  onDelete,
}: ComponentItemProps) {
  const [isHovered, setIsHovered] = useState(false);
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative">
            <div className="pr-8">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-medium truncate">{component.name}</h3>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {component.codeFramework}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {component.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div
              className={`absolute -top-1 -right-1 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 rounded-full hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </Draggable>
  );
}
