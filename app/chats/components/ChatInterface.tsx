import * as React from 'react';
import { Check, Copy, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export function ChatInterface({ messages, onSendMessage }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

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
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto">
          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-lg p-3 text-sm',
                  message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                <div className="flex justify-between items-start">
                  <div>{message.content}</div>
                  {message.role === 'assistant' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(index)}
                      className="ml-2 h-6 w-6"
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
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 h-[120px] p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="min-h-[80px]"
          />
          <Button onClick={handleSendMessage} size="icon" className="h-10 w-10">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
