import { format } from 'date-fns';
import {
  CircleDot,
  Code,
  FileCode,
  GitBranch,
  MessageSquare,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { MarketComponent } from '../types';

interface ComponentDialogProps {
  component: MarketComponent;
  onStartChat?: () => void;
  onAddToProject?: () => void;
}

export function ComponentDialog({ component, onStartChat, onAddToProject }: ComponentDialogProps) {
  const statusColor = {
    draft: 'text-yellow-500',
    Done: 'text-green-500',
  };

  return (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DialogTitle>{component.name}</DialogTitle>
            {component.verified && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-blue-500/10 text-blue-500"
              >
                <ShieldCheck className="h-3 w-3" />
                <span className="text-xs">已认证</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn('flex items-center gap-1', statusColor[component.status])}
            >
              <CircleDot className="h-3 w-3" />
              {component.status}
            </Badge>
            <Badge variant="secondary">v{component.version}</Badge>
          </div>
        </div>
      </DialogHeader>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="code">代码</TabsTrigger>
          <TabsTrigger value="docs">文档</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={component.designFile ? component.designFile : 'https://placehold.co/600x400'}
              alt={`${component.name} 预览`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">描述</h4>
              <p className="text-sm text-muted-foreground">{component.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">技术栈</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>{component.codeFramework}</Badge>
                  {component.dependencies?.map((dep) => (
                    <Badge key={dep} variant="outline">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">标签</h4>
                <div className="flex flex-wrap gap-2">
                  {component.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">创建者</p>
                <p className="font-medium">{component.creator}</p>
              </div>
              <div>
                <p className="text-muted-foreground">最后更新</p>
                <p className="font-medium">{format(component.updatedAt, 'yyyy-MM-dd')}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                前端代码
              </h4>
              <div className="text-sm text-muted-foreground">
                {Object.keys(component.code.frontend).length} 个文件
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                后端代码
              </h4>
              <div className="text-sm text-muted-foreground">
                {Object.keys(component.code.backend).length} 个文件
              </div>
            </div>
          </div>
          {component.dependencies && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                依赖项
              </h4>
              <div className="flex flex-wrap gap-2">
                {component.dependencies.map((dep) => (
                  <Badge key={dep} variant="outline">
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {component.componentDoc}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 mt-4">
        <Button variant="outline" className="flex items-center gap-2" onClick={onStartChat}>
          <MessageSquare className="w-4 h-4" />
          开始对话
        </Button>
        <Button className="flex items-center gap-2" onClick={onAddToProject}>
          <Plus className="w-4 h-4" />
          添加到项目
        </Button>
      </div>
    </DialogContent>
  );
}
