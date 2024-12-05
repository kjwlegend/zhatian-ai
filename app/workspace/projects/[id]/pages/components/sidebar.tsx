'use client';

import { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Component } from '@/app/services/db/schema';
import { usePageStore } from '@/app/store/pageStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  projectId: string;
}

export function Sidebar({ projectId }: SidebarProps) {
  const { components, fetchComponents, isLoading } = usePageStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const frameworks = Array.from(new Set(components.map((c) => c.codeFramework)));
  const allTags = Array.from(new Set(components.flatMap((c) => c.tags)));

  const filteredComponents = components.filter((component) => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every((tag) => component.tags.includes(tag as any));
    const matchesFramework = !selectedFramework || component.codeFramework === selectedFramework;
    return matchesSearch && matchesTags && matchesFramework;
  });

  return (
    <div className="w-80 border-r bg-background">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">组件库</h2>

        <div className="space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索组件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* 筛选器 */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  框架
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {frameworks.map((framework) => (
                  <DropdownMenuCheckboxItem
                    key={framework}
                    checked={selectedFramework === framework}
                    onCheckedChange={() =>
                      setSelectedFramework(selectedFramework === framework ? null : framework)
                    }
                  >
                    {framework}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  标签
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {allTags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked) => {
                      setSelectedTags(
                        checked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag)
                      );
                    }}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 已选择的标签 */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 组件列表 */}
        <ScrollArea className="h-[calc(100vh-12rem)] mt-4">
          <Droppable droppableId="sidebar" isDropDisabled={true}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {filteredComponents.map((component, index) => (
                  <Draggable
                    key={component.id}
                    draggableId={`sidebar-${component.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`mb-2 rounded-md border bg-card p-3 ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
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
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </ScrollArea>
      </div>
    </div>
  );
}
