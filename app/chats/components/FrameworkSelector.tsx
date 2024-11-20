import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Framework {
  value: string;
  label: string;
  tabs: string[];
}
export const FRAMEWORK_OPTIONS = {
  frontend: [
    {
      value: 'react',
      label: 'React',
      tabs: [
        'component', // UI 组件
        'hook', // 自定义 Hook
        'style', // 样式
        'store', // 状态管理
      ],
    },
    {
      value: 'vue',
      label: 'Vue',
      tabs: [
        'component', // UI 组件
        'composition', // 组合式 API
        'store', // 状态管理
        'style', // 样式
      ],
    },
    {
      value: 'angular',
      label: 'Angular',
      tabs: [
        'component', // UI 组件
        'service', // 服务
        'module', // 模块
        'style', // 样式
      ],
    },
    {
      value: 'vanilla',
      label: 'Vanilla',
      tabs: [
        'html', // HTML 结构
        'script', // JavaScript 逻辑
        'style', // 样式
      ],
    },
    {
      value: 'baozun-ace',
      label: 'Baozun-Ace',
      tabs: [
        'panel', // 面板配置
        'vue', // Vue 组件
        'index', // 入口文件
        'style', // 样式
      ],
    },
  ],
  backend: [
    { value: 'node', label: 'Node.js', tabs: ['controller', 'model', 'service', 'route'] },
    { value: 'python', label: 'Python', tabs: ['view', 'model', 'serializer', 'service'] },
    { value: 'java', label: 'Java', tabs: ['controller', 'model', 'service', 'repository'] },
  ],
  test: [
    { value: 'jest', label: 'Jest', tabs: ['unit', 'integration'] },
    { value: 'cypress', label: 'Cypress', tabs: ['e2e', 'component'] },
    { value: 'playwright', label: 'Playwright', tabs: ['e2e', 'api'] },
  ],
} as const;

export function getLanguageByTab(tab: string): string {
  switch (tab) {
    case 'component':
      return 'tsx';
    case 'hook':
    case 'util':
    case 'service':
    case 'controller':
    case 'model':
    case 'repository':
    case 'route':
    case 'type':
    case 'module':
      return 'typescript';
    case 'style':
      return 'scss';
    case 'composition':
      return 'vue';
    case 'unit':
    case 'integration':
    case 'mock':
    case 'setup':
    case 'e2e':
    case 'command':
    case 'fixture':
    case 'config':
      return 'javascript';
    case 'view':
    case 'serializer':
      return 'python';
    case 'panel':
      return 'javascript';
    case 'vue':
      return 'vue';
    case 'index':
      return 'javascript';
    default:
      return 'typescript';
  }
}

interface FrameworkSelectorProps {
  type: keyof typeof FRAMEWORK_OPTIONS;
  value: string;
  onValueChange: (value: string) => void;
}

export function FrameworkSelector({ type, value, onValueChange }: FrameworkSelectorProps) {
  const options = FRAMEWORK_OPTIONS[type];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Framework" />
      </SelectTrigger>
      <SelectContent>
        {options.map((framework) => (
          <SelectItem key={framework.value} value={framework.value}>
            {framework.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
