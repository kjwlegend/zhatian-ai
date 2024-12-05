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

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export function ChatInterface({ messages, onSendMessage }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = React.useRef(messages.length);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
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
            {messages.map((message, index) => (
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
                          // 自定义代码块样式
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
                          // 自定义列表样式
                          ul({ children }) {
                            return <ul className="list-disc pl-4 my-2">{children}</ul>;
                          },
                          ol({ children }) {
                            return <ol className="list-decimal pl-4 my-2">{children}</ol>;
                          },
                          // 自定义标题样式
                          h1({ children }) {
                            return <h1 className="text-lg font-bold my-2">{children}</h1>;
                          },
                          h2({ children }) {
                            return <h2 className="text-base font-semibold my-2">{children}</h2>;
                          },
                          // 自定义段落样式
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
            ))}
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
