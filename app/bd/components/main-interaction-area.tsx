'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBdStore } from '../store/useBdStore';
import { BidRequirements } from './main/bid-requirements';
import { ConversationPanel } from './main/conversation-panel';
import { GenerateStructure } from './main/generate-structure';
import { SpeechGenerator } from './main/speech-generator';

export function MainInteractionArea() {
  const { currentTab, setCurrentTab } = useBdStore();

  return (
    <Card className="h-[calc(100vh-2rem)] flex flex-col">
      <CardHeader>
        <CardTitle>主交互区域</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requirements">需求</TabsTrigger>
            <TabsTrigger value="conversation">深度对话</TabsTrigger>
            <TabsTrigger value="structure">方案结构</TabsTrigger>
            <TabsTrigger value="speech">演讲稿</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="requirements" className="h-full overflow-auto">
              <BidRequirements />
            </TabsContent>
            <TabsContent value="conversation" className="h-full overflow-auto">
              <ConversationPanel />
            </TabsContent>
            <TabsContent value="structure" className="h-full overflow-auto">
              <GenerateStructure />
            </TabsContent>
            <TabsContent value="speech" className="h-full overflow-auto">
              <SpeechGenerator />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
