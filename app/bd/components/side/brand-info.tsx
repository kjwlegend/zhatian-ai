'use client';

import { Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBdStore } from '../../store/useBdStore';

export function BrandInfo() {
  const {
    brandBasicInfo,
    brandNews,
    historicalProjects,
    isLoadingBasicInfo,
    isLoadingNews,
    isLoadingProjects,
  } = useBdStore();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>品牌基本介绍 - {brandBasicInfo?.name || '未选择品牌'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="background">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="background">背景</TabsTrigger>
            <TabsTrigger value="competitors">竞品分析</TabsTrigger>
            <TabsTrigger value="news">新闻</TabsTrigger>
            <TabsTrigger value="projects">历史项目</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(100vh-24rem)]">
            <TabsContent value="background">
              {isLoadingBasicInfo ? (
                <p className="text-sm text-gray-500">加载中...</p>
              ) : brandBasicInfo ? (
                <p className="text-sm">{brandBasicInfo.background}</p>
              ) : (
                <p className="text-sm text-gray-500">暂无背景信息</p>
              )}
            </TabsContent>

            <TabsContent value="competitors">
              {isLoadingBasicInfo ? (
                <p className="text-sm text-gray-500">加载中...</p>
              ) : brandBasicInfo?.competitors ? (
                <ul className="space-y-4">
                  {brandBasicInfo.competitors.map((competitor, index) => (
                    <li key={index} className="border-b pb-2">
                      <h3 className="font-semibold text-sm">{competitor.name}</h3>
                      <p className="text-xs">类型: {competitor.type}</p>
                      <p className="text-xs">产品类别: {competitor.categories.join(', ')}</p>
                      <p className="text-xs">优势: {competitor.strengths}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">暂无竞品信息</p>
              )}
            </TabsContent>

            <TabsContent value="news">
              {isLoadingNews ? (
                <p className="text-sm text-gray-500">加载中...</p>
              ) : brandNews ? (
                <ul className="space-y-2">
                  {brandNews.map((item) => (
                    <li key={item.id} className="border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-sm hover:text-blue-500 transition-colors"
                        >
                          {item.title}
                        </a>
                      </div>
                      <p className="text-xs text-gray-500 ml-6">{item.date}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">暂无新闻信息</p>
              )}
            </TabsContent>

            <TabsContent value="projects">
              {isLoadingProjects ? (
                <p className="text-sm text-gray-500">加载中...</p>
              ) : historicalProjects ? (
                <ul className="space-y-2">
                  {historicalProjects.map((project) => (
                    <li key={project.id} className="border-b pb-2">
                      <h3 className="font-semibold text-sm">{project.name}</h3>
                      <p className="text-xs">日期: {project.date}</p>
                      <p className="text-xs">结果: {project.result}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">暂无项目信息</p>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
