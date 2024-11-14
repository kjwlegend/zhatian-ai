'use client';

import Image from 'next/image';
import { Component } from '@/app/services/db/schema';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface ComponentEditorTabsProps {
  editedComponent: Component;
  setEditedComponent: React.Dispatch<React.SetStateAction<Component>>;
}

export function ComponentEditorTabs({
  editedComponent,
  setEditedComponent,
}: ComponentEditorTabsProps) {
  const handleChange = (field: keyof Component, value: any) => {
    setEditedComponent((prev) => ({ ...prev, [field]: value }));
  };

  const handleCodeChange = (
    section: 'frontend' | 'backend' | 'test',
    language: string,
    value: string
  ) => {
    setEditedComponent((prev) => ({
      ...prev,
      code: {
        ...prev.code,
        [section]: {
          ...prev.code[section],
          [language]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <div className="w-1/3">
          <Image
            src={editedComponent.thumbnail}
            alt={editedComponent.name}
            width={300}
            height={200}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="w-2/3 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Component ID</label>
              <Input value={editedComponent.id} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Component Name</label>
              <Input
                value={editedComponent.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              value={editedComponent.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Code Framework</label>
              <Input
                value={editedComponent.codeFramework}
                onChange={(e) => handleChange('codeFramework', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Design File</label>
              <Input
                value={editedComponent.designFile}
                onChange={(e) => handleChange('designFile', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {['requirement', 'design', 'FE', 'BE', 'Test'].map((tag) => (
                <Badge
                  key={tag}
                  variant={editedComponent.tags.includes(tag as any) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    if (editedComponent.tags.includes(tag as any)) {
                      handleChange(
                        'tags',
                        editedComponent.tags.filter((t) => t !== tag)
                      );
                    } else {
                      handleChange('tags', [...editedComponent.tags, tag]);
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select
                value={editedComponent.status}
                onValueChange={(value) => handleChange('status', value)}
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
              <label className="text-sm font-medium text-gray-700">Published</label>
              <Switch
                checked={editedComponent.published}
                onCheckedChange={(checked) => handleChange('published', checked)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Verified</label>
              <Switch
                checked={editedComponent.verified}
                onCheckedChange={(checked) => handleChange('verified', checked)}
              />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="documentation" className="mt-6">
        <TabsList>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="documentation">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Component Documentation
            </label>
            <Textarea
              value={editedComponent.componentDoc}
              onChange={(e) => handleChange('componentDoc', e.target.value)}
              rows={20}
              className="font-mono"
            />
          </div>
        </TabsContent>

        <TabsContent value="code">
          <Tabs defaultValue="frontend">
            <TabsList>
              <TabsTrigger value="frontend">Frontend</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
            </TabsList>

            <TabsContent value="frontend">
              {Object.entries(editedComponent.code.frontend).map(([lang, code]) => (
                <div key={lang} className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">{lang}</label>
                  <Textarea
                    value={code}
                    onChange={(e) => handleCodeChange('frontend', lang, e.target.value)}
                    rows={10}
                    className="font-mono"
                  />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="backend">
              {Object.entries(editedComponent.code.backend).map(([lang, code]) => (
                <div key={lang} className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">{lang}</label>
                  <Textarea
                    value={code as string}
                    onChange={(e) => handleCodeChange('backend', lang, e.target.value)}
                    rows={10}
                    className="font-mono"
                  />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="test">
              {Object.entries(editedComponent.code.test).map(([lang, code]) => (
                <div key={lang} className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">{lang}</label>
                  <Textarea
                    value={code}
                    onChange={(e) => handleCodeChange('test', lang, e.target.value)}
                    rows={10}
                    className="font-mono"
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
