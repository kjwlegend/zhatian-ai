import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSharedContext } from '../contexts/SharedContext';
import { ImageUploader } from './ImageUploader';
import { MarkdownEditor } from './MarkdownEditor';

export function SharedFirstColumn() {
  const { activeImage, setActiveImage, markdownContent, setMarkdownContent } = useSharedContext();

  return (
    <div className="w-full h-full">
      <Tabs defaultValue="image" className="w-full h-full">
        <TabsList>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="image">
          <ImageUploader activeImage={activeImage} setActiveImage={setActiveImage} />
        </TabsContent>
        <TabsContent value="markdown" className="h-full">
          <MarkdownEditor content={markdownContent} onChange={setMarkdownContent} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
