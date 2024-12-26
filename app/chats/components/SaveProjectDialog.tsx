'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Component } from '@/app/services/db/schema';
import { useCodeStore } from '@/app/store/codeStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface SaveProjectDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (data: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>, saveAsNew?: boolean) => void;
  currentComponent?: Component | null;
}

const defaultComponent: Omit<Component, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  thumbnail: 'https://placehold.co/100x100',
  status: 'draft',
  tags: [],
  published: false,
  verified: false,
  description: '',
  designFile: '',
  code: {
    frontend: {},
    backend: {},
    test: {},
  },
  codeFramework: 'react',
  componentDoc: '',
  creator: 'system',
  version: '1.0.0',
  dependencies: [],
};

const AVAILABLE_TAGS = ['requirement', 'design', 'FE', 'BE', 'Test'] as const;

export function SaveProjectDialog({
  isOpen,
  setIsOpen,
  onSave,
  currentComponent,
}: SaveProjectDialogProps) {
  const { codeOutputs, componentDoc, designFile } = useCodeStore();
  const [componentData, setComponentData] = useState(defaultComponent);
  const [saveAsNew, setSaveAsNew] = useState(false);

  // 当对话框打开时，初始化组件数据
  useEffect(() => {
    if (isOpen) {
      if (currentComponent && !saveAsNew) {
        // 编辑现有组件时，使用现有组件数据
        setComponentData({
          name: currentComponent.name,
          description: currentComponent.description,
          thumbnail: currentComponent.thumbnail,
          status: currentComponent.status,
          tags: currentComponent.tags,
          published: currentComponent.published,
          verified: currentComponent.verified,
          designFile: currentComponent.designFile,
          code: {
            frontend: codeOutputs.frontend || currentComponent.code.frontend,
            backend: codeOutputs.backend || currentComponent.code.backend,
            test: codeOutputs.test || currentComponent.code.test,
          },
          codeFramework: currentComponent.codeFramework,
          componentDoc: componentDoc || currentComponent.componentDoc,
          creator: currentComponent.creator,
          version: currentComponent.version,
          dependencies: currentComponent.dependencies,
        });
      } else {
        // 新建组件或另存为时，使用默认值
        setComponentData({
          ...defaultComponent,
          name: saveAsNew ? `${currentComponent?.name || ''} Copy` : '',
          code: {
            frontend: codeOutputs.frontend,
            backend: codeOutputs.backend,
            test: codeOutputs.test,
          },
          componentDoc: componentDoc,
          designFile: designFile || '',
        });
      }
    }
  }, [isOpen, currentComponent, saveAsNew, codeOutputs, componentDoc, designFile]);

  const handleChange = (field: keyof Component, value: any) => {
    setComponentData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag: Component['tags'][number]) => {
    setComponentData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await onSave(componentData, saveAsNew);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save component:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentComponent ? '保存组件' : '新建组件'}</DialogTitle>
          <DialogDescription>
            Save your current code as a reusable component in the library.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            {/* Component Name */}
            <div className="grid gap-2">
              <Label htmlFor="component-name">Component Name</Label>
              <Input
                id="component-name"
                value={componentData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter component name"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={componentData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your component"
                rows={3}
              />
            </div>

            {/* Framework */}
            <div className="grid gap-2">
              <Label htmlFor="framework">Framework</Label>
              <Select
                value={componentData.codeFramework}
                onValueChange={(value) => handleChange('codeFramework', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={componentData.tags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status and Flags */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Label>Status</Label>
                <Select
                  value={componentData.status}
                  onValueChange={(value: Component['status']) => handleChange('status', value)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label>Published</Label>
                <Switch
                  checked={componentData.published}
                  onCheckedChange={(checked) => handleChange('published', checked)}
                />
              </div>
            </div>

            {/* 另存为选项 */}
            {currentComponent && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveAsNew"
                  checked={saveAsNew}
                  onCheckedChange={(checked) => setSaveAsNew(checked as boolean)}
                />
                <label htmlFor="saveAsNew" className="text-sm">
                  另存为新组件
                </label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {currentComponent ? (saveAsNew ? '另存为' : '保存') : '创建'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
