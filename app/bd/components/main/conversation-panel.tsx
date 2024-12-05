import { useEffect, useRef } from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConversation } from '../../hooks/useConversation';
import { useBdStore } from '../../store/useBdStore';
import { ReferenceList } from './reference-list';

// Markdown 样式组件
const MarkdownStyles = {
  p: (props: any) => <p className="mb-4 text-sm leading-relaxed" {...props} />,
  h1: (props: any) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
  h2: (props: any) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
  h3: (props: any) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
  li: (props: any) => <li className="text-sm leading-relaxed" {...props} />,
  code: (props: any) => (
    <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-100 rounded p-4 mb-4 overflow-x-auto font-mono text-sm" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-200 pl-4 mb-4 italic" {...props} />
  ),
  a: (props: any) => (
    <a className="text-blue-500 hover:text-blue-700 underline" target="_blank" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: any) => <td className="px-3 py-2 whitespace-nowrap text-sm" {...props} />,
  hr: (props: any) => <hr className="my-4 border-gray-200" {...props} />,
};

export function ConversationPanel() {
  const { conversation, userMessage, setUserMessage } = useBdStore();
  const { isLoading, handleSendMessage } = useConversation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表区域 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-sm transition-all
                  ${
                    message.role === 'user'
                      ? 'bg-blue-50 border border-blue-100'
                      : 'bg-gray-50 border border-gray-100'
                  }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownStyles}>
                  {message.content}
                </ReactMarkdown>
                {message.references && <ReferenceList references={message.references} />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 输入区域 - 固定在底部 */}
      <div className="flex gap-2 pt-4 border-t mt-4">
        <Input
          placeholder="输入您的问题..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          className="flex-grow"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? '发送中...' : '发送'}
        </Button>
      </div>
    </div>
  );
}
