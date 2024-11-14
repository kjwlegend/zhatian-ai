import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCodeStore } from '@/app/store/codeStore';
import { ImageUploader } from './ImageUploader';
import { MarkdownEditor } from './MarkdownEditor';

export function SharedFirstColumn() {
  const { componentDoc, setComponentDoc, designFile, setDesignFile } = useCodeStore();

  return (
    <div className="w-full h-full">
      <Tabs defaultValue="image" className="w-full h-full">
        <TabsList>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="image">
          <ImageUploader 
            activeImage={designFile} 
            setActiveImage={setDesignFile} 
          />
        </TabsContent>
        <TabsContent value="markdown" className="h-full">
          <MarkdownEditor 
            content={componentDoc} 
            onChange={setComponentDoc} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
