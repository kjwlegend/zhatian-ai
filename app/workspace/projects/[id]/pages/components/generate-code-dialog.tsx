'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Component, Page } from '@/app/services/db/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GenerateCodeDialogProps {
  page: Page;
  components: Map<string, Component>;
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CMS_FRAMEWORKS = [{ value: 'wordpress', label: 'WordPress' }];

export function GenerateCodeDialog({
  page,
  components,
  projectName,
  open,
  onOpenChange,
}: GenerateCodeDialogProps) {
  const [selectedFramework, setSelectedFramework] = useState<string>('wordpress');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // TODO: 调用 LLM 服务生成代码
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 模拟 API 调用
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {projectName} &gt; {page.name}
          </DialogTitle>
          <DialogDescription>为当前页面生成 CMS 代码</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4 flex-1 min-h-0">
          {/* 左侧：组件列表 */}
          <div className="space-y-4 flex flex-col min-h-0">
            <h3 className="font-medium">页面组件</h3>
            <ScrollArea className="flex-1">
              <div className="space-y-3 pr-4">
                {page.components.map((pageComponent) => {
                  const component = components.get(pageComponent.componentId);
                  if (!component) return null;

                  return (
                    <Card key={pageComponent.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* 左侧缩略图 */}
                          <div className="w-24 h-24 flex-shrink-0">
                            <img
                              src={component.thumbnail}
                              alt={component.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          {/* 右侧信息 */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-base mb-1 truncate">
                              {component.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {component.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {component.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* 右侧：生成选项 */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">生成选项</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">CMS 框架</label>
                <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择 CMS 框架" />
                  </SelectTrigger>
                  <SelectContent>
                    {CMS_FRAMEWORKS.map((framework) => (
                      <SelectItem key={framework.value} value={framework.value}>
                        {framework.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isGenerating ? '生成中...' : '生成代码'}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
