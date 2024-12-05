'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useStructureGenerator } from '../../hooks/useStructureGenerator';

export function GenerateStructure() {
  const { isGenerating, structure, partialStructure, handleGenerateStructure, setStructure } =
    useStructureGenerator();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>方案结构生成</CardTitle>
        <div className="flex gap-2">
          {structure && (
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? '预览' : '编辑'}
            </Button>
          )}
          <Button onClick={handleGenerateStructure} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              '生成方案结构'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <ScrollArea className="h-full">
          {isGenerating && partialStructure ? (
            <div className="whitespace-pre-wrap font-mono text-sm">{partialStructure}</div>
          ) : isEditing ? (
            <Textarea
              value={structure}
              onChange={(e) => setStructure(e.target.value)}
              className="h-full min-h-[500px] font-mono"
              placeholder="方案结构将在这里生成..."
            />
          ) : (
            <div className="whitespace-pre-wrap font-mono text-sm">
              {structure || '点击"生成方案结构"按钮开始生成...'}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
