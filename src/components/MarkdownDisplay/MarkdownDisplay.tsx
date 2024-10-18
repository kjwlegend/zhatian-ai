import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  ClipboardIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useChatStore } from "../../store/chatStore";
import "./MarkdownDisplay.scss";

interface MarkdownDisplayProps {
  currentTopic: string;
}

const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ currentTopic }) => {
  const [activeTab, setActiveTab] = useState<
    "html" | "index" | "panel" | "scss"
  >("html");
  const [copied, setCopied] = useState(false);
  const getTopicCode = useChatStore((state) => state.getTopicCode);

  const handleCopy = () => {
    const content = getTopicCode(currentTopic, activeTab);
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const content = getTopicCode(currentTopic, activeTab);

  return (
    <div className="markdown-display">
      <div className="markdown-display__header">
        <div className="markdown-display__tabs">
          {(["html", "index", "panel", "scss"] as const).map((tab) => (
            <button
              key={tab}
              className={`markdown-display__tab ${
                activeTab === tab ? "markdown-display__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={handleCopy} className="markdown-display__copy-button">
          {copied ? (
            <ClipboardDocumentCheckIcon className="markdown-display__icon" />
          ) : (
            <ClipboardIcon className="markdown-display__icon" />
          )}
        </button>
      </div>
      <div className="markdown-display__content">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
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

export default MarkdownDisplay;
