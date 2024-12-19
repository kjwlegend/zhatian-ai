'use client';

import { useState } from 'react';
import { Edit, FileCode, MoreVertical, Trash } from 'lucide-react';
import { Droppable } from 'react-beautiful-dnd';
import { Component, Page } from '@/app/services/db/schema';
import { usePageStore } from '@/app/store/pageStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ComponentItem } from './component-item';
import { GenerateCodeDialog } from './components/generate-code-dialog';

interface PageColumnProps {
  page: Page;
  components: Map<string, Component>;
  projectName: string;
  onEdit: () => void;
  onComponentSelect: (component: Component | null) => void;
}

export function PageColumn({
  page,
  components,
  projectName,
  onEdit,
  onComponentSelect,
}: PageColumnProps) {
  const { deletePage, removeComponentFromPage } = usePageStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGenerateCodeDialogOpen, setIsGenerateCodeDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deletePage(page.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  const handleComponentDelete = async (componentId: string) => {
    try {
      await removeComponentFromPage(page.id, componentId);
    } catch (error) {
      console.error('Failed to remove component:', error);
    }
  };

  return (
    <>
      <div className="w-80 shrink-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{page.name}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsGenerateCodeDialogOpen(true)}>
                <FileCode className="mr-2 h-4 w-4" />
                生成代码
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Droppable droppableId={page.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[200px] rounded-lg border-2 p-4 ${
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
                    .map((pageComponent, index) => {
                      const component = components.get(pageComponent.componentId);
                      if (!component) return null;

                      return (
                        <ComponentItem
                          key={pageComponent.id}
                          instanceId={pageComponent.id}
                          component={component}
                          index={index}
                          onClick={() => onComponentSelect(component)}
                          onDelete={() => handleComponentDelete(pageComponent.id)}
                        />
                      );
                    })}
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除页面</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除页面 "{page.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <GenerateCodeDialog
        page={page}
        components={components}
        projectName={projectName}
        open={isGenerateCodeDialogOpen}
        onOpenChange={setIsGenerateCodeDialogOpen}
      />
    </>
  );
}
