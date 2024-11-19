'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Component } from '@/app/services/db/schema';
import { useCodeStore } from '@/app/store/codeStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  onSave: (component: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
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

export function SaveProjectDialog({ isOpen, setIsOpen, onSave }: SaveProjectDialogProps) {
  const { codeOutputs, componentDoc, designFile } = useCodeStore();
  const [componentData, setComponentData] = useState(defaultComponent);

  // 当对话框打开时，更新组件数据
  useEffect(() => {
    if (isOpen) {
      setComponentData({
        ...defaultComponent,
        code: {
          frontend: codeOutputs.frontend,
          backend: codeOutputs.backend,
          test: codeOutputs.test,
        },
        componentDoc: componentDoc,
        designFile: designFile || '',
      });
    }
  }, [isOpen, codeOutputs, componentDoc, designFile]);

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
      await onSave(componentData);
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
          <DialogTitle>Save as Component</DialogTitle>
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Component</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
