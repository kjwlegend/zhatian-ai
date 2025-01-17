'use client';

import * as React from 'react';
import { Check, Copy, Edit2, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '@/app/store/chatStore';
import { useCodeStore } from '@/app/store/codeStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BaseChatInterface } from './components/BaseChatInterface';
import { ClearChatButton } from './components/ClearChatButton';
import { ResizableLayout } from './components/ResizableLayout';
import { JIRA_GENERATION_PROMPT } from './constants/prompts';
import { JIRA_QUICK_PROMPTS } from './constants/quickPrompts';
import { useChatMessages } from './hooks/useChatMessages';

export function JiraContent() {
  const { jiraMessages, setJiraMessages } = useChatStore();
  const { jiraContent, setJiraContent } = useCodeStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [editableContent, setEditableContent] = React.useState('');

  React.useEffect(() => {
    setEditableContent(jiraContent);
  }, [jiraContent]);

  const { messages, handleSendMessage, clearMessages } = useChatMessages({
    systemPrompt: JIRA_GENERATION_PROMPT,
    initialMessages: jiraMessages,
    onMessagesChange: React.useCallback(
      (newMessages: any) => {
        setJiraMessages(newMessages);
      },
      [setJiraMessages]
    ),
    onResponse: React.useCallback(
      (response: string) => {
        setJiraContent(response);
      },
      [setJiraContent]
    ),
  });

  const handleClearAll = React.useCallback(() => {
    clearMessages();
    setJiraContent('');
    setEditableContent('');
  }, [clearMessages, setJiraContent]);

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(jiraContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [jiraContent]);

  const handleToggleEdit = React.useCallback(() => {
    if (isEditing) {
      setJiraContent(editableContent);
    }
    setIsEditing(!isEditing);
  }, [isEditing, editableContent, setJiraContent]);

  const chatColumn = (
    <BaseChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      quickPrompts={JIRA_QUICK_PROMPTS}
      headerContent={
        <div className="flex items-center gap-2">
          <ClearChatButton onClear={handleClearAll} tabName="JIRA" />
        </div>
      }
    />
  );

  const previewColumn = (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center justify-between p-2 border-b dark:border-gray-700">
        <div className="text-sm font-medium">JIRA Content</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleToggleEdit} className="h-8 px-2">
            {isEditing ? <Eye className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2"
            disabled={!jiraContent}
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isEditing ? (
          <Textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            className="w-full h-full min-h-[500px] font-mono"
          />
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-4" {...props} />,
                h2: ({ node, ...props }) => (
                  <h2 className="text-lg font-semibold mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-base font-medium mb-2" {...props} />
                ),
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
              }}
            >
              {jiraContent || '等待生成JIRA卡片内容...'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full p-4">
      <ResizableLayout firstColumn={chatColumn} secondColumn={previewColumn} />
    </div>
  );
}
