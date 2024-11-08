import * as React from 'react';
import { ChevronRight, Home } from 'lucide-react';
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

interface ChatHeaderProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export function ChatHeader({ isModalOpen, setIsModalOpen }: ChatHeaderProps) {
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
        <SaveProjectDialog isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        <Button>Publish</Button>
      </div>
    </div>
  );
}
