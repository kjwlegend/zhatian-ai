'use client';

import * as React from 'react';
import { GripVertical } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

interface ResizableLayoutProps {
  firstColumn: React.ReactNode;
  secondColumn: React.ReactNode;
  thirdColumn: React.ReactNode;
}

export function ResizableLayout({ firstColumn, secondColumn, thirdColumn }: ResizableLayoutProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full rounded-lg border">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="px-4">
        <div className="h-full">{firstColumn}</div>
      </ResizablePanel>

      <ResizableHandle>
        <div className="h-full w-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </ResizableHandle>

      <ResizablePanel defaultSize={40} minSize={30} maxSize={60} className="px-4">
        <div className="h-full">{secondColumn}</div>
      </ResizablePanel>

      <ResizableHandle>
        <div className="h-full w-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </ResizableHandle>

      <ResizablePanel defaultSize={40} minSize={30} maxSize={60} className="px-4">
        <div className="h-full">{thirdColumn}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
