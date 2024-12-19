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
  const clearAllCodeOutputs = useCodeStore((state) => state.clearAllCodeOutputs);

  const handleSaveComponent = async (
    componentData: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await addComponent(componentData);
    } catch (error) {
      console.error('Failed to save component:', error);
    }
  };

  const handleReset = () => {
    clearAllCodeOutputs();
  };

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <TabsList className="grid w-[ 00px] grid-cols-5">
        <TabsTrigger value="requirement">Requirement</TabsTrigger>
        <TabsTrigger value="frontend">FE</TabsTrigger>
        <TabsTrigger value="backend">BE</TabsTrigger>
        <TabsTrigger value="test">Test</TabsTrigger>
        <TabsTrigger value="cms">CMS</TabsTrigger>
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
          保存组件
        </Button>
        <CodePreview />

        {isModalOpen && (
          <SaveProjectDialog
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            onSave={handleSaveComponent}
          />
        )}
      </div>
    </div>
  );
}
