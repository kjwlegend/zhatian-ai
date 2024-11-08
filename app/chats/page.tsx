'use client';

import * as React from 'react';
import { Check, ChevronRight, Copy, Home, Send, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ChatMessage } from '../services/db/schema';
import { ChatHeader } from './components/ChatHeader';
import { ChatInterface } from './components/ChatInterface';
import { CodeDisplay } from './components/CodeDisplay';
import { FrameworkSelector } from './components/FrameworkSelector';
import { ImageUploader } from './components/ImageUploader';
import { MarkdownEditor } from './components/MarkdownEditor';
import { SharedProvider, useSharedContext } from './contexts/SharedContext';
import { FrontendContent } from './frontend';
import { RequirementContent } from './requirement';

const mockMessages = [
  { role: 'user', content: 'Can you help me design a login page?' },
  {
    role: 'assistant',
    content:
      "I'd be happy to help you design a login page. Let's break it down into the key components and best practices. Here's a general outline for a good login page:",
  },
  { role: 'user', content: 'That sounds great. Can you provide more details on the form fields?' },
  {
    role: 'assistant',
    content:
      "Of course! Let's dive into the details of the form fields for the login page. Here are the key elements you should include:",
  },
];

const initialMarkdown = `
# Login Page Design

## Form Fields

1. **Username or Email Field**
   - Label: "Username or Email"
   - Input type: text or email
   - Placeholder: "Enter your username or email"

2. **Password Field**
   - Label: "Password"
   - Input type: password
   - Placeholder: "Enter your password"
   - Show/Hide password toggle (optional)

3. **Remember Me Checkbox**
   - Label: "Remember me"
   - Input type: checkbox

## Buttons

1. **Login Button**
   - Text: "Log In" or "Sign In"
   - Full width
   - Clear call-to-action styling

2. **Forgot Password Link**
   - Text: "Forgot Password?"
   - Positioned below the login button

## Additional Elements

- Social Login Options (if applicable)
- Sign Up Link (for new users)
- Error message display area
`;

const mockCodeOutput = {
  html: '<form>\n  <input type="text" placeholder="Username" />\n  <input type="password" placeholder="Password" />\n  <button type="submit">Login</button>\n</form>',
  style:
    '.form-input {\n  margin-bottom: 10px;\n}\n\n.form-button {\n  background-color: #007bff;\n  color: white;\n}',
  js: 'document.querySelector("form").addEventListener("submit", (e) => {\n  e.preventDefault();\n  // Handle form submission\n});',
};

export default function Component() {
  const [activeImage, setActiveImage] = React.useState<string | null>(null);
  const [chatMessages, setChatMessages] = React.useState(mockMessages);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [codeOutput, setCodeOutput] = React.useState(mockCodeOutput);
  const [activeCodeTab, setActiveCodeTab] = React.useState('html');
  const [copiedStates, setCopiedStates] = React.useState({ html: false, style: false, js: false });

  return (
    <SharedProvider initialMarkdown={initialMarkdown}>
      <div className="flex flex-col h-screen overflow-scroll">
        <Tabs defaultValue="requirement" className="flex-1 flex flex-col overflow-hidden">
          <ChatHeader isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

          <div className="flex-1 overflow-hidden">
            <TabsContent value="requirement" className="h-full overflow-auto">
              <RequirementContent />
            </TabsContent>

            <TabsContent value="frontend" className="h-full p-4">
              <FrontendContent />
            </TabsContent>

            <TabsContent value="backend" className="h-full p-4">
              <div className="text-center text-muted-foreground">Backend development content</div>
            </TabsContent>

            <TabsContent value="test" className="h-full p-4">
              <div className="text-center text-muted-foreground">Testing content</div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </SharedProvider>
  );
}
