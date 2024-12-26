import { ChevronRight, Home, RotateCcw, Save } from 'lucide-react';
import { Component } from '@/app/services/db/schema';
import { useCodeStore } from '@/app/store/codeStore';
import { useComponentStore } from '@/app/store/componentStore';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodePreview } from './CodePreview';
import { SaveProjectDialog } from './SaveProjectDialog';

interface ChatHeaderProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export function ChatHeader({ isModalOpen, setIsModalOpen }: ChatHeaderProps) {
  const addComponent = useComponentStore((state) => state.addComponent);
  const updateComponent = useComponentStore((state) => state.updateComponent);
  const currentComponent = useComponentStore((state) => state.selectedComponent);
  const clearAllCodeOutputs = useCodeStore((state) => state.clearAllCodeOutputs);

  // 面包屑导航显示组件信息
  const renderBreadcrumb = () => {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            {currentComponent ? (
              <BreadcrumbPage>
                {currentComponent.name} ({currentComponent.id})
              </BreadcrumbPage>
            ) : (
              <BreadcrumbPage>新组件</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  const handleSaveComponent = async (
    componentData: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>,
    saveAsNew: boolean = false
  ) => {
    try {
      if (!saveAsNew && currentComponent) {
        // 更新现有组件
        await updateComponent(currentComponent.id, componentData);
      } else {
        // 新建组件或另存为
        await addComponent(componentData);
      }
    } catch (error) {
      console.error('Failed to save component:', error);
    }
  };

  const handleReset = () => {
    clearAllCodeOutputs();
  };

  return (
    <div className="flex flex-col gap-2 border-b px-4 py-2">
      <div className="flex items-center justify-between">
        {renderBreadcrumb()}
        <TabsList className="grid w-[500px] grid-cols-5">
          <TabsTrigger value="requirement">需求</TabsTrigger>
          <TabsTrigger value="frontend">前端</TabsTrigger>
          <TabsTrigger value="backend">后端</TabsTrigger>
          <TabsTrigger value="test">测试脚本</TabsTrigger>
          <TabsTrigger value="test-case">测试用例</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            重置代码
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {currentComponent ? '保存' : '保存组件'}
          </Button>
          <CodePreview />
        </div>
      </div>

      {isModalOpen && (
        <SaveProjectDialog
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onSave={handleSaveComponent}
          currentComponent={currentComponent}
        />
      )}
    </div>
  );
}
