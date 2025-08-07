import * as React from 'react';
import { Check, Copy, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

interface QuickPrompt {
  title: string;
  content: string;
}

const DEFAULT_QUICK_PROMPTS: QuickPrompt[] = [
  {
    title: '新功能',
    content: '请帮我生成一个新功能的JIRA卡片，功能是实现用户登录系统，包含邮箱和密码登录方式。',
  },
  {
    title: 'Bug修复',
    content: '请帮我生成一个Bug修复的JIRA卡片，问题是用户在移动端无法正常提交表单。',
  },
  {
    title: '性能优化',
    content: '请帮我生成一个性能优化的JIRA卡片，需要优化首页加载速度，当前加载时间超过3秒。',
  },
  {
    title: 'UI改进',
    content: '请帮我生成一个UI改进的JIRA卡片，需要更新导航栏的样式，使其符合新的设计规范。',
  },
];

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string, attachments: string[]) => void;
  quickPrompts?: QuickPrompt[];
}

export function ChatInterface({
  messages,
  onSendMessage,
  quickPrompts = DEFAULT_QUICK_PROMPTS,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = React.useRef(messages.length);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue, []);
      setInputValue('');
    }
  };

  const handleQuickPrompt = (content: string) => {
    onSendMessage(content, []);
  };

  const handleCopy = (index: number) => {
    const message = messages[index].content;
    navigator.clipboard.writeText(message).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  React.useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, scrollToBottom]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 relative max-h-200">
        <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="space-y-4 p-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">快速开始</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt.content)}
                      className="p-4 text-left bg-gray-50 dark:bg-gray-700 rounded-lg 
                        hover:bg-gray-100 dark:hover:bg-gray-600 
                        transition-colors duration-200
                        group relative"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {prompt.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {prompt.content}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'rounded-lg p-3 text-sm',
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 overflow-hidden">
                      {message.isLoading ? (
                        <div className="animate-pulse">...</div>
                      ) : (
                        <ReactMarkdown
                          className={cn(
                            'prose prose-sm max-w-none',
                            message.role === 'user' ? 'prose-invert' : 'prose-stone'
                          )}
                          components={{
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }: React.ComponentPropsWithoutRef<'code'> & {
                              inline?: boolean;
                              node?: any;
                            }) {
                              return (
                                <code
                                  className={cn(
                                    'rounded px-1.5 py-0.5',
                                    message.role === 'user'
                                      ? 'bg-primary-foreground/20 text-primary-foreground'
                                      : '',
                                    className
                                  )}
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                            ul({ children }) {
                              return <ul className="list-disc pl-4 my-2">{children}</ul>;
                            },
                            ol({ children }) {
                              return <ol className="list-decimal pl-4 my-2">{children}</ol>;
                            },
                            h1({ children }) {
                              return <h1 className="text-lg font-bold my-2">{children}</h1>;
                            },
                            h2({ children }) {
                              return <h2 className="text-base font-semibold my-2">{children}</h2>;
                            },
                            p({ children }) {
                              return <p className="my-1">{children}</p>;
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    {message.role === 'assistant' && !message.isLoading && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(index)}
                        className="ml-2 h-6 w-6 flex-shrink-0"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 h-[120px] p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] resize-none"
          />
          <Button onClick={handleSendMessage} size="icon" className="h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
