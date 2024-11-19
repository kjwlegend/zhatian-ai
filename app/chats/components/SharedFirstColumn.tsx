import * as React from 'react';
import { useCodeStore } from '@/app/store/codeStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUploader } from './ImageUploader';
import { MarkdownEditor } from './MarkdownEditor';

interface SharedFirstColumnProps {
  variant?: 'default' | 'requirement';
  showMarkdownEditor?: boolean;
}

export function SharedFirstColumn({
  variant = 'default',
  showMarkdownEditor = true,
}: SharedFirstColumnProps) {
  const { componentDoc, setComponentDoc, designFile, setDesignFile } = useCodeStore();

  // 如果是 requirement 页面，只显示 ImageUploader
  if (variant === 'requirement') {
    return (
      <div className="w-full h-full">
        <ImageUploader activeImage={designFile} setActiveImage={setDesignFile} />
      </div>
    );
  }

  // 默认显示带有标签页的版本
  return (
    <div className="w-full h-full">
      <Tabs defaultValue="image" className="w-full h-full">
        <TabsList>
          <TabsTrigger value="image">Image</TabsTrigger>
          {showMarkdownEditor && <TabsTrigger value="markdown">Markdown</TabsTrigger>}
        </TabsList>
        <TabsContent value="image">
          <ImageUploader activeImage={designFile} setActiveImage={setDesignFile} />
        </TabsContent>
        {showMarkdownEditor && (
          <TabsContent value="markdown" className="h-full">
            <MarkdownEditor content={componentDoc} onChange={setComponentDoc} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
