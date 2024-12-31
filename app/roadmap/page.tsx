'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ContactHeader } from './components/contact-header';
import { TaskCard } from './components/task-card';
import { ViewToggle } from './components/view-toggle';
import { sampleTasks } from './data/sample-tasks';
import { Column, QuarterlyColumn, Task, ViewMode } from './types/roadmap';

export default function Roadmap() {
  const [view, setView] = useState<ViewMode>('overall');

  const sortedTasks = sampleTasks.sort((a: Task, b: Task) => b.count - a.count);

  const overallColumns: Column[] = useMemo(
    () => [
      {
        id: 'review',
        title: 'In Review',
        count: sortedTasks.filter((t) => t.status === 'review').length,
        tasks: sortedTasks.filter((t) => t.status === 'review'),
      },
      {
        id: 'planned',
        title: 'Planned',
        count: sortedTasks.filter((t) => t.status === 'planned').length,
        tasks: sortedTasks.filter((t) => t.status === 'planned'),
      },
      {
        id: 'progress',
        title: 'In Progress',
        count: sortedTasks.filter((t) => t.status === 'progress').length,
        tasks: sortedTasks.filter((t) => t.status === 'progress'),
      },
      {
        id: 'completed',
        title: 'Completed',
        count: sortedTasks.filter((t) => t.status === 'completed').length,
        tasks: sortedTasks.filter((t) => t.status === 'completed'),
      },
    ],
    []
  );

  const quarterlyColumns: QuarterlyColumn[] = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const quarters = [
      `${currentYear}-Q1`,
      `${currentYear}-Q2`,
      `${currentYear}-Q3`,
      `${currentYear}-Q4`,
    ];

    return quarters.map((quarter) => {
      const [year, q] = quarter.split('-');
      const startDate = new Date(parseInt(year), (parseInt(q.slice(1)) - 1) * 3, 1);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);

      const tasksInQuarter = sortedTasks.filter((task) => {
        const targetDate = new Date(task.targetDate);
        return targetDate >= startDate && targetDate <= endDate;
      });

      return {
        id: quarter,
        title: quarter,
        count: tasksInQuarter.length,
        tasks: tasksInQuarter,
        quarter,
      };
    });
  }, []);

  const columns = view === 'overall' ? overallColumns : quarterlyColumns;

  return (
    <div className="container mx-auto p-6">
      <ContactHeader />

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">开发计划</h1>
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex">
          {columns.map((column) => (
            <div key={column.id} className="flex-none w-80 p-4 border-r last:border-r-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">{column.title}</h2>
                <Badge variant="secondary" className="rounded-full">
                  {column.count}
                </Badge>
              </div>
              <div className="space-y-4">
                {column.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
