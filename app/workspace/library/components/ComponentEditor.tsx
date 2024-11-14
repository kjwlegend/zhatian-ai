'use client';

import { useState } from 'react';
import { MessageSquare, Package, Plus } from 'lucide-react';
import { Component } from '@/app/services/db/schema';
import { Button } from '@/components/ui/button';
import { ComponentEditorTabs } from './ComponentEditorTabs';

interface ComponentEditorProps {
  component: Component;
  onSave: (component: Component) => void;
}

export function ComponentEditor({ component, onSave }: ComponentEditorProps) {
  const [editedComponent, setEditedComponent] = useState<Component>(component);

  return (
    <div className="flex flex-col h-[calc(90vh-8rem)]">
      {/* 主要内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto px-6">
        <ComponentEditorTabs
          editedComponent={editedComponent}
          setEditedComponent={setEditedComponent}
        />
      </div>

      {/* 固定在底部的按钮组 */}
      <div className="flex justify-between items-center px-6 py-4 border-t bg-background">
        <Button onClick={() => onSave(editedComponent)}>Save Changes</Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Chat
          </Button>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add to Project
          </Button>
          <Button variant="outline">
            <Package className="w-4 h-4 mr-2" />
            Webpack FE
          </Button>
        </div>
      </div>
    </div>
  );
}
