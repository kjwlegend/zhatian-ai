'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const currentVersion = {
  version: '0.1',
  date: '2023-12-24',
  updates: [
    '初始版本上线',
    '基础AI对话功能',
    '本地数据存储',
    '基于图片的BRD文档生成',
    '基于图片的前端代码生成',
    '根据前端代码及架构生成后端代码',
    '根据前端代码及架构生成测试用例',
    'BD 助手',
  ],
};

const nextVersion = {
  version: '0.2',
  expectedDate: '2024-01-15',
  plannedFeatures: ['用户系统', '云端数据同步', '高级AI模型集成', '组件库完善', '组件市场'],
};

const versionHistory = [
  {
    version: '0.1',
    date: '2023-12-24',
    updates: ['初始版本上线', '基础AI对话功能', '本地数据存储'],
  },
  // 可以继续添加更多历史版本
];

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');

    if (lastVisit !== today) {
      setIsOpen(true);
      localStorage.setItem('lastVisit', today);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">欢迎使用炸天AI</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">智能对话，无限可能</h2>
            <p className="text-sm text-muted-foreground">您的AI助手，为您提供全方位的智能支持</p>
          </div>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">当前版本</TabsTrigger>
              <TabsTrigger value="next">下个版本预告</TabsTrigger>
              <TabsTrigger value="history">历史更新</TabsTrigger>
            </TabsList>
            <TabsContent value="current">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  当前版本：<Badge variant="secondary">v{currentVersion.version}</Badge>
                </h3>
                <p className="text-sm text-muted-foreground">更新日期：{currentVersion.date}</p>
                <p className="font-medium">版本更新内容：</p>
                <ul className="list-disc list-inside text-sm">
                  {currentVersion.updates.map((update, index) => (
                    <li key={index}>{update}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="next">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  下个版本：<Badge variant="outline">v{nextVersion.version}</Badge>
                </h3>
                <p className="text-sm text-muted-foreground">
                  预计发布日期：{nextVersion.expectedDate}
                </p>
                <p className="font-medium">计划功能：</p>
                <ul className="list-disc list-inside text-sm">
                  {nextVersion.plannedFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="history">
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {versionHistory.map((version, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h4 className="font-medium">
                      版本 {version.version}{' '}
                      <span className="text-sm text-muted-foreground">({version.date})</span>
                    </h4>
                    <ul className="list-disc list-inside text-sm">
                      {version.updates.map((update, updateIndex) => (
                        <li key={updateIndex}>{update}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <div className="text-sm text-muted-foreground">
            <p>
              注意：当前版本不包含登录注册功能，所有数据都保存在浏览器本地。切换设备或浏览器后，内容将无法保留。
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
