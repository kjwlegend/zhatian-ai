'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechGenerator } from '../../hooks/useSpeechGenerator';

export function SpeechGenerator() {
  const {
    speech,
    isGenerating,
    partialSpeech,
    handleGenerateChineseSpeech,
    handleGenerateEnglishSpeech,
    setSpeech,
  } = useSpeechGenerator();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chinese' | 'english'>('chinese');

  const handleContentChange = (content: string) => {
    setSpeech({
      ...speech,
      [activeTab]: content,
    });
  };

  const handleGenerate = () => {
    if (activeTab === 'chinese') {
      handleGenerateChineseSpeech();
    } else {
      handleGenerateEnglishSpeech();
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>演讲稿生成</CardTitle>
        <div className="flex gap-2">
          {speech[activeTab] && (
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? '预览' : '编辑'}
            </Button>
          )}
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              `生成${activeTab === 'chinese' ? '中文' : '英文'}演讲稿`
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'chinese' | 'english')}
          className="h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chinese">中文版本</TabsTrigger>
            <TabsTrigger value="english">English Version</TabsTrigger>
          </TabsList>
          <div className="flex-1 mt-4">
            <ScrollArea className="h-full">
              {isGenerating && partialSpeech[activeTab] ? (
                <div className="whitespace-pre-wrap font-mono text-sm">
                  {partialSpeech[activeTab]}
                </div>
              ) : isEditing ? (
                <Textarea
                  value={speech[activeTab]}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="h-full min-h-[500px] font-mono"
                  placeholder={`${
                    activeTab === 'chinese'
                      ? '演讲稿将在这里生成...'
                      : 'Speech will be generated here...'
                  }`}
                />
              ) : (
                <div className="whitespace-pre-wrap font-mono text-sm">
                  {speech[activeTab] ||
                    (activeTab === 'chinese'
                      ? '点击"生成中文演讲稿"按钮开始生成...'
                      : 'Click "Generate English Speech" button to start...')}
                </div>
              )}
            </ScrollArea>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
