import * as React from 'react';
import { Check, Copy, Eye } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { StackBlitzService } from '@/app/services/stackBlitzService';
import { useFrontendCode } from '@/app/store/codeStore';
import { Button } from '@/components/ui/button';

export function CodePreview() {
  const { selectedFramework, codeOutput } = useFrontendCode();

  const handlePreview = async () => {
    try {
      const files = getPreviewFiles();
      const framework = getFrameworkType();
      console.log('files', files);
      console.log('framework', framework);
      await StackBlitzService.openProject(files, framework);
    } catch (error) {
      console.error('Preview failed:', error);
      // 可以添加一个 toast 提示
    }
  };

  const getPreviewFiles = () => {
    if (selectedFramework === 'vue') {
      return {
        template: { content: codeOutput.component || '' },
        script: { content: codeOutput.composition || '' },
        style: { content: codeOutput.style || '' },
      };
    }

    if (selectedFramework === 'baozun-ace') {
      return {
        script: { content: codeOutput.panel || '' },
        template: { content: codeOutput.vue || '' },
        style: { content: codeOutput.style || '' },
      };
    }
    // React 相关框架
    return {
      script: {
        content: `
${codeOutput.component || ''}
${codeOutput.hook || ''}
${codeOutput.store || ''}
        `,
        language: 'typescript',
      },
      style: {
        content: codeOutput.style || '',
        language: 'scss',
      },
    };
  };

  const getFrameworkType = (): 'vue' | 'react' | 'ace' => {
    if (selectedFramework === 'vue') return 'vue';
    if (selectedFramework === 'baozun-ace') return 'ace';
    return 'react';
  };

  return (
    <Button onClick={handlePreview} size="sm">
      <Eye className="h-4 w-4" /> 组件预览
    </Button>
  );
}
