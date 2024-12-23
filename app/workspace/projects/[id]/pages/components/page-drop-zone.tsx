'use client';

import { X } from 'lucide-react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Component, Page, PageComponent } from '@/app/services/db/schema';
import { usePageStore } from '@/app/store/pageStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PageDropZoneProps {
  page: Page;
  components: Map<string, Component>;
}

export function PageDropZone({ page, components }: PageDropZoneProps) {
  const { removeComponentFromPage } = usePageStore();

  const handleRemoveComponent = async (componentId: string) => {
    try {
      await removeComponentFromPage(page.id, componentId);
    } catch (error) {
      console.error('Failed to remove component:', error);
    }
  };

  return (
    <Droppable droppableId={page.id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[200px] p-4 rounded-lg border-2 ${
            snapshot.isDraggingOver ? 'border-primary bg-primary/5' : 'border-dashed'
          }`}
        >
          {page.components.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              将组件拖放到此处
            </div>
          ) : (
            <div className="space-y-2">
              {page.components
                .sort((a, b) => a.order - b.order)
                .map((pageComponent: PageComponent, index) => {
                  const component = components.get(pageComponent.componentId);
                  if (!component) return null;

                  return (
                    <Draggable key={pageComponent.id} draggableId={pageComponent.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 ${snapshot.isDragging ? 'shadow-lg' : ''}`}
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveComponent(pageComponent.componentId)}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  );
                })}
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
