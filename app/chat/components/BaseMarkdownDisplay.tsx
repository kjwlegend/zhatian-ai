'use client';

import React, { useEffect, useState } from 'react';
import { IconClipboard, IconClipboardCheck } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeContent } from '../../services/db/schema';
import { useChatStore } from '../../store/chatStore';

import '../MarkdownDisplay/MarkdownDisplay.scss';

interface BaseMarkdownDisplayProps {
  currentTopic: string;
  customTabs?: (keyof CodeContent)[];
  customRender?: (content: string, activeTab: keyof CodeContent) => React.ReactNode;
  shouldRefresh?: boolean;
}

const BaseMarkdownDisplay: React.FC<BaseMarkdownDisplayProps> = ({
  currentTopic,
  customTabs = ['html', 'js', 'scss'],
  customRender,
  shouldRefresh = false,
}) => {
  const [activeTab, setActiveTab] = useState<keyof CodeContent>(customTabs[0]);
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState('');
  const getTopicCode = useChatStore((state) => state.getTopicCode);

  useEffect(() => {
    const loadCode = async () => {
      if (currentTopic) {
        const code = await getTopicCode(currentTopic, activeTab);
        setContent(code);
      } else {
        setContent('');
      }
    };
    loadCode();
  }, [currentTopic, activeTab, getTopicCode, shouldRefresh]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="markdown-display">
      <div className="markdown-display__header">
        <div className="markdown-display__tabs">
          {customTabs.map((tab) => (
            <button
              key={tab}
              className={`markdown-display__tab ${
                activeTab === tab ? 'markdown-display__tab--active' : ''
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={handleCopy} className="markdown-display__copy-button">
          {copied ? (
            <IconClipboardCheck className="markdown-display__icon" />
          ) : (
            <IconClipboard className="markdown-display__icon" />
          )}
        </button>
      </div>
      <div className="markdown-display__content">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus as any}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {`\`\`\`${activeTab}\n${content}\n\`\`\``}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default BaseMarkdownDisplay;
