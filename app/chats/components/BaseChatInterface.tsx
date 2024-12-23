import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChatInterface } from './ChatInterface';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface BaseChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string, attachments: string[]) => void;
  headerContent?: React.ReactNode;
}

export function BaseChatInterface({
  messages,
  onSendMessage,
  headerContent,
}: BaseChatInterfaceProps) {
  return (
    <Card className="w-full h-full">
      <CardContent className="p-4 h-full flex flex-col">
        {headerContent && <div className="flex-shrink-0 mb-4">{headerContent}</div>}
        <div className="flex-1 min-h-0">
          <ChatInterface messages={messages} onSendMessage={onSendMessage} />
        </div>
      </CardContent>
    </Card>
  );
}
