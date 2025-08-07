'use client';

import { useCallback, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CodeDisplay } from '@/app/codes/components/CodeDisplay';
import { WORDPRESS_PROMPT } from '@/app/codes/constants/prompts';
import { useChatMessages } from '@/app/codes/hooks/useChatMessages';
import { useCodeParser } from '@/app/codes/hooks/useCodeParser';
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

// CMS 框架配置
const CMS_FRAMEWORKS = [
  { value: 'wordpress', label: 'WordPress' },
  { value: 'drupal', label: 'Drupal' },
  { value: 'joomla', label: 'Joomla' },
  { value: 'shopify', label: 'Shopify' },
] as const;

type CMSFramework = (typeof CMS_FRAMEWORKS)[number]['value'];

export function GenerateCodeDialog({
  page,
  components,
  projectName,
  open,
  onOpenChange,
}: GenerateCodeDialogProps) {
  const [selectedFramework, setSelectedFramework] = useState<CMSFramework>('wordpress');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const { parseResponse } = useCodeParser();

  // 准备组件描述，包括设计文件的引用
  const prepareComponentsDescription = useCallback(() => {
    return page.components
      .map((pageComponent, index) => {
        const component = components.get(pageComponent.componentId);
        if (!component) return null;
        const imageReference = component.designFile ? `[设计文件 ${index + 1}]` : '无设计文件';
        return `
组件: ${component.name}
描述: ${component.description}
设计文件: ${imageReference}
顺序: ${pageComponent.order}
配置: ${JSON.stringify(pageComponent.config, null, 2)}
        `;
      })
      .filter(Boolean)
      .join('\n\n');
  }, [page.components, components]);

  // 准备组件的设计文件
  const prepareDesignFiles = useCallback(() => {
    return page.components
      .map((pageComponent) => {
        const component = components.get(pageComponent.componentId);
        return component?.designFile;
      })
      .filter(Boolean) as string[];
  }, [page.components, components]);

  // 使用 useChatMessages hook 处理消息
  const { handleSendMessage } = useChatMessages({
    systemPrompt: WORDPRESS_PROMPT, // TODO: 根据不同的 CMS 框架使用不同的 prompt
    initialMessages: [],
    onResponse: useCallback(
      (content: string) => {
        const parsed = parseResponse(content, selectedFramework, 'cms');
        if (parsed.code.html) {
          setGeneratedCode(parsed.code.html);
        }
      },
      [selectedFramework]
    ),
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const componentsDescription = prepareComponentsDescription();
      const designFiles = prepareDesignFiles();

      // 构建发送给 LLM 的消息
      const message = `请为页面 "${page.name}" 生成 ${selectedFramework.toUpperCase()} 区块代码。

目标页面描述：
${page.description}

页面组件信息：
${componentsDescription}

要求：
1. 使用 ${selectedFramework.toUpperCase()} 区块标记语法
2. 所有图片使用 picsum.photos 作为占位图
3. 确保移动端良好显示
4. 包含完整的属性配置
5. 请参考提供的设计文件生成对应的区块结构`;

      // 发送消息和设计文件
      await handleSendMessage(message, designFiles);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 获取组件的展示图片
  const getComponentImage = (component: Component) => {
    if (component.designFile) {
      return component.designFile;
    }
    return component.thumbnail || 'https://placehold.co/100x100';
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
                          <div className="w-24 h-24 flex-shrink-0">
                            <img
                              src={getComponentImage(component)}
                              alt={component.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
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

          {/* 右侧：生成选项和代码展示 */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">生成选项</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">CMS 框架</label>
                <Select
                  value={selectedFramework}
                  onValueChange={(value: CMSFramework) => setSelectedFramework(value)}
                >
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

            {/* 代码展示区域 */}
            {generatedCode && (
              <div className="mt-4">
                <CodeDisplay
                  code={generatedCode}
                  language="html"
                  onCopy={handleCopy}
                  isCopied={isCopied}
                />
              </div>
            )}
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
