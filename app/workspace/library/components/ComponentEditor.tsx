'use client';

import { useState } from 'react';
import { MessageSquare, Package, Plus } from 'lucide-react';
import { Component } from '@/app/services/db/schema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ComponentEditorTabs } from './ComponentEditorTabs';

interface ComponentEditorProps {
  component: Component;
  onSave: (component: Component) => void;
}

export function ComponentEditor({ component, onSave }: ComponentEditorProps) {
  const [editedComponent, setEditedComponent] = useState<Component>(component);
  const [isWebpacking, setIsWebpacking] = useState(false);
  const { toast } = useToast();

  const handleWebpackFE = async () => {
    if (!editedComponent.code.frontend) {
      toast({
        title: 'Error',
        description: 'No frontend code available for webpack',
        variant: 'destructive',
      });
      return;
    }

    setIsWebpacking(true);
    try {
      const response = await fetch('/api/webpack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentName: editedComponent.name,
          frontendCode: editedComponent.code.frontend,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to webpack component');
      }

      // 检查响应类型
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/javascript')) {
        // 获取文件内容的 blob
        const blob = await response.blob();

        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${editedComponent.name}.js`;

        // 触发下载
        document.body.appendChild(a);
        a.click();

        // 清理
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: 'Success',
          description: 'Component webpack completed and downloaded successfully',
        });
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to webpack component',
        variant: 'destructive',
      });
    } finally {
      setIsWebpacking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(90vh-8rem)]">
      <div className="flex-1 overflow-y-auto px-6">
        <ComponentEditorTabs
          editedComponent={editedComponent}
          setEditedComponent={setEditedComponent}
        />
      </div>

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
          <Button variant="outline" onClick={handleWebpackFE} disabled={isWebpacking}>
            <Package className="w-4 h-4 mr-2" />
            {isWebpacking ? 'Building...' : 'Webpack FE'}
          </Button>
        </div>
      </div>
    </div>
  );
}
