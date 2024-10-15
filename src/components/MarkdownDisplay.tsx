import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  ClipboardIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useChatStore } from "../store/chatStore";

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
    <div className="w-1/2 flex flex-col h-full">
      <div className="bg-tech-dark-light p-4 flex justify-between items-center">
        <div>
          {(["html", "index", "panel", "scss"] as const).map((tab) => (
            <button
              key={tab}
              className={`mr-2 px-4 py-2 rounded ${
                activeTab === tab
                  ? "bg-tech-highlight text-tech-dark"
                  : "bg-tech-accent text-tech-text"
              } transition-colors`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="text-tech-text hover:text-tech-highlight transition-colors"
        >
          {copied ? (
            <ClipboardDocumentCheckIcon className="h-6 w-6" />
          ) : (
            <ClipboardIcon className="h-6 w-6" />
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-tech-dark-light">
        <div className="prose prose-invert max-w-none">
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
    </div>
  );
};

export default MarkdownDisplay;
