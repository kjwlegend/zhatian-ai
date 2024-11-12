import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';

interface CodeDisplayProps {
  code: string;
  language: string;
  onCopy: () => void;
  isCopied: boolean;
}

export function CodeDisplay({ code, language, onCopy, isCopied }: CodeDisplayProps) {
  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
        <SyntaxHighlighter language={language} style={vs} customStyle={{ margin: 0 }} PreTag="div">
          {code}
        </SyntaxHighlighter>
      </div>
      <Button onClick={onCopy} className="absolute top-2 right-2" size="sm">
        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
