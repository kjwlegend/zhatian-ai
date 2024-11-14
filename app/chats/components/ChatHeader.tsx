import { ChevronRight, Home, Save } from 'lucide-react';
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
import { SaveProjectDialog } from './SaveProjectDialog';
import { useComponentStore } from '@/app/store/componentStore';
import { Component } from '@/app/services/db/schema';

interface ChatHeaderProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export function ChatHeader({ isModalOpen, setIsModalOpen }: ChatHeaderProps) {
  const addComponent = useComponentStore((state) => state.addComponent);

  const handleSaveComponent = async (componentData: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addComponent(componentData);
    } catch (error) {
      console.error('Failed to save component:', error);
    }
  };

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Current Project</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <TabsList className="grid w-[400px] grid-cols-4">
        <TabsTrigger value="requirement">Requirement</TabsTrigger>
        <TabsTrigger value="frontend">FE</TabsTrigger>
        <TabsTrigger value="backend">BE</TabsTrigger>
        <TabsTrigger value="test">Test</TabsTrigger>
      </TabsList>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Component
        </Button>
        {isModalOpen && (
          <SaveProjectDialog
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            onSave={handleSaveComponent}
          />
        )}
        <Button>Publish</Button>
      </div>
    </div>
  );
}
