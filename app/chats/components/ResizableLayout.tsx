'use client';

import * as React from 'react';
import { GripVertical } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

interface ResizableLayoutProps {
  firstColumn?: React.ReactNode;
  secondColumn?: React.ReactNode;
  thirdColumn?: React.ReactNode;
}

export function ResizableLayout({ firstColumn, secondColumn, thirdColumn }: ResizableLayoutProps) {
  // 计算实际列数
  const columnCount = [firstColumn, secondColumn, thirdColumn].filter(Boolean).length;

  // 根据列数计算默认尺寸
  const getColumnSizes = () => {
    switch (columnCount) {
      case 1:
        return [100];
      case 2:
        return [40, 60];
      default:
        return [20, 40, 40];
    }
  };

  const defaultSizes = getColumnSizes();

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full rounded-lg border">
      {/* 第一列 */}
      {firstColumn && (
        <ResizablePanel
          defaultSize={defaultSizes[0]}
          minSize={columnCount === 1 ? 100 : 15}
          maxSize={columnCount === 1 ? 100 : 30}
          className="px-4"
        >
          <div className="h-full">{firstColumn}</div>
        </ResizablePanel>
      )}

      {/* 第二列（如果存在）*/}
      {secondColumn && (
        <>
          <ResizableHandle>
            <div className="h-full w-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          </ResizableHandle>
          <ResizablePanel
            defaultSize={defaultSizes[1]}
            minSize={30}
            maxSize={columnCount === 2 ? 70 : 60}
            className="px-4"
          >
            <div className="h-full">{secondColumn}</div>
          </ResizablePanel>
        </>
      )}

      {/* 第三列（如果存在）*/}
      {thirdColumn && (
        <>
          <ResizableHandle>
            <div className="h-full w-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          </ResizableHandle>
          <ResizablePanel defaultSize={defaultSizes[2]} minSize={30} maxSize={60} className="px-4">
            <div className="h-full">{thirdColumn}</div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
