'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseChatInterface } from './components/BaseChatInterface';
import { CodeDisplay } from './components/CodeDisplay';
import { FrameworkSelector } from './components/FrameworkSelector';
import { SharedFirstColumn } from './components/SharedFirstColumn';

const mockChatMessages = [
  { role: 'user', content: 'Can you create a login form?' },
  { role: 'assistant', content: "I'll create a basic login form for you." },
];

const mockCodeOutput = {
  html: '<form>\n  <input type="text" placeholder="Username" />\n  <input type="password" placeholder="Password" />\n  <button type="submit">Login</button>\n</form>',
  style:
    '.form-input {\n  margin-bottom: 10px;\n}\n\n.form-button {\n  background-color: #007bff;\n  color: white;\n}',
  js: 'document.querySelector("form").addEventListener("submit", (e) => {\n  e.preventDefault();\n  // Handle form submission\n});',
};

export function FrontendContent() {
  const [selectedFramework, setSelectedFramework] = React.useState('React');
  const [chatMessages, setChatMessages] = React.useState(mockChatMessages);
  const [codeOutput, setCodeOutput] = React.useState(mockCodeOutput);
  const [activeCodeTab, setActiveCodeTab] = React.useState('html');
  const [copiedStates, setCopiedStates] = React.useState({ html: false, style: false, js: false });

  const handleSendMessage = (message: string) => {
    setChatMessages([...chatMessages, { role: 'user', content: message }]);
    // TODO: Add frontend-specific API call logic
  };

  const handleCopyCode = (type: keyof typeof codeOutput) => {
    navigator.clipboard.writeText(codeOutput[type]);
    setCopiedStates({ ...copiedStates, [type]: true });
    setTimeout(() => setCopiedStates({ ...copiedStates, [type]: false }), 2000);
  };

  return (
    <div className="grid h-full gap-4 p-4 md:grid-cols-3 overflow-hidden">
      <SharedFirstColumn />

      <BaseChatInterface
        messages={chatMessages as any}
        onSendMessage={handleSendMessage}
        headerContent={
          <FrameworkSelector value={selectedFramework} onValueChange={setSelectedFramework} />
        }
      />

      <div className="w-full">
        <Tabs
          value={activeCodeTab}
          onValueChange={setActiveCodeTab}
          className="h-full flex flex-col"
        >
          <TabsList>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="js">JS</TabsTrigger>
          </TabsList>
          {Object.entries(codeOutput).map(([type, code]) => (
            <TabsContent
              key={type}
              value={type}
              className="flex-grow overflow-y-auto h-full bg-red-500"
            >
              <CodeDisplay
                code={code}
                language={type === 'style' ? 'css' : type}
                onCopy={() => handleCopyCode(type as keyof typeof codeOutput)}
                isCopied={copiedStates[type as keyof typeof codeOutput]}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
