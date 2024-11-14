import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex-1 p-4 overflow-auto">
        <div className="h-full overflow-auto rounded-lg border p-4">
          <Textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-full w-full resize-none"
          />
        </div>
      </div>
    </div>
  );
}
