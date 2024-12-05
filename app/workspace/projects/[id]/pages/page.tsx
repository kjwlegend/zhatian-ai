'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Component } from '@/app/services/db/schema';
import { usePageStore } from '@/app/store/pageStore';
import { Button } from '@/components/ui/button';
import { ComponentDialog } from './component-dialog';
import { CreatePageDialog } from './components/create-page-dialog';
import { EditPageDialog } from './components/edit-page-dialog';
import { Sidebar } from './components/sidebar';
import { PageColumn } from './page-column';

export default function PagesPage({ params }: { params: { id: string } }) {
  const {
    pages,
    components,
    isLoading,
    error,
    fetchPages,
    fetchComponents,
    createPage,
    updatePage,
    addComponentToPage,
    removeComponentFromPage,
    reorderPageComponents,
  } = usePageStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<{ id: string; open: boolean }>({
    id: '',
    open: false,
  });
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [projectName, setProjectName] = useState('项目');

  useEffect(() => {
    fetchPages(params.id);
    fetchComponents();
  }, [params.id]);

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const db = await openChatDB();
        const project = await db.get('projects', params.id);
        if (project) {
          setProjectName(project.name);
        }
      } catch (error) {
        console.error('Failed to fetch project name:', error);
      }
    };

    fetchProjectName();
  }, [params.id]);

  const handleCreatePage = async (data: { name: string; description: string; type: string }) => {
    await createPage(params.id, data);
  };

  const handleUpdatePage = async (
    pageId: string,
    data: { name: string; description: string; type: string }
  ) => {
    await updatePage(pageId, data);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    try {
      // 从侧边栏拖动到页面 - 创建新组件实例
      if (source.droppableId === 'sidebar') {
        const componentId = result.draggableId.replace('sidebar-', '');
        await addComponentToPage(destination.droppableId, componentId, destination.index);
        return;
      }

      // 在同一页面内重新排序
      if (source.droppableId === destination.droppableId) {
        const page = pages.find((p) => p.id === source.droppableId);
        if (!page) return;

        const newComponents = Array.from(page.components);
        const [movedComponent] = newComponents.splice(source.index, 1);
        newComponents.splice(destination.index, 0, movedComponent);

        await reorderPageComponents(
          page.id,
          newComponents.map((c) => c.id)
        );
        return;
      }

      // 在不同页面之间移动组件
      if (source.droppableId !== destination.droppableId) {
        const sourcePage = pages.find((p) => p.id === source.droppableId);
        const destPage = pages.find((p) => p.id === destination.droppableId);

        if (!sourcePage || !destPage) return;

        // 获取要移动的组件
        const movedComponent = sourcePage.components[source.index];

        // 先添加到目标页面
        await addComponentToPage(
          destination.droppableId,
          movedComponent.componentId,
          destination.index,
          movedComponent.config // 保持原有配置
        );

        // 然后从源页面删除
        await removeComponentFromPage(source.droppableId, movedComponent.id);
      }
    } catch (error) {
      console.error('Failed to handle drag and drop:', error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex">
        <Sidebar projectId={params.id} />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">页面管理</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新建页面
            </Button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6">
            {pages.map((page) => (
              <PageColumn
                key={page.id}
                page={page}
                components={new Map(components.map((c) => [c.id, c]))}
                projectName={projectName}
                onEdit={() => setEditingPage({ id: page.id, open: true })}
                onComponentSelect={setSelectedComponent}
              />
            ))}
          </div>

          <CreatePageDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSubmit={handleCreatePage}
          />

          {pages.map((page) => (
            <EditPageDialog
              key={page.id}
              page={page}
              open={editingPage.id === page.id && editingPage.open}
              onOpenChange={(open) => setEditingPage({ id: page.id, open })}
              onSubmit={handleUpdatePage}
            />
          ))}

          <ComponentDialog
            component={selectedComponent}
            open={!!selectedComponent}
            onOpenChange={(open) => !open && setSelectedComponent(null)}
          />
        </div>
      </div>
    </DragDropContext>
  );
}
