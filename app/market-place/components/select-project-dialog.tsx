import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MarketComponent } from '../types';

interface SelectProjectDialogProps {
  component: MarketComponent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (projectId: string, pageId: string) => Promise<void>;
}

export function SelectProjectDialog({
  component,
  open,
  onOpenChange,
  onConfirm,
}: SelectProjectDialogProps) {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<string>('');

  // TODO: 获取项目列表和页面列表

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>选择目标项目</DialogTitle>
        </DialogHeader>
        {/* TODO: 添加项目和页面选择UI */}
      </DialogContent>
    </Dialog>
  );
}
