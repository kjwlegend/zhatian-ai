'use client';

import * as React from 'react';
import { Check, ChevronRight, Copy, Home, Send, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

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

export default function Component() {
  const [activeImage, setActiveImage] = React.useState<string | null>(null);
  const [chatMessages, setChatMessages] = React.useState(mockMessages);
  const [inputValue, setInputValue] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [markdownContent, setMarkdownContent] = React.useState(initialMarkdown);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setActiveImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    multiple: false,
  });

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setChatMessages([...chatMessages, { role: 'user', content: inputValue }]);
      setInputValue('');
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would typically handle the saving logic
    console.log('Saving project...');
    setIsModalOpen(false);
  };

  const handleCopy = (index: number) => {
    const message = chatMessages[index].content;
    navigator.clipboard.writeText(message).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Tabs defaultValue="requirement" className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Current Project</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TabsList className="grid w-[400px] grid-cols-4">
            <TabsTrigger value="requirement">Requirement</TabsTrigger>
            <TabsTrigger value="frontend">FE</TabsTrigger>
            <TabsTrigger value="backend">BE</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Save to Draft</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Save Project</DialogTitle>
                  <DialogDescription>Enter the details for your project draft.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="project-name" className="text-right">
                        Name
                      </Label>
                      <Input id="project-name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="project-description" className="text-right">
                        Description
                      </Label>
                      <Textarea id="project-description" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="project-tags" className="text-right">
                        Tags
                      </Label>
                      <Input
                        id="project-tags"
                        className="col-span-3"
                        placeholder="Separate tags with commas"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Draft</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button>Publish</Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="requirement" className="h-full overflow-auto">
            <div className="grid h-full gap-4 p-4 md:grid-cols-3 overflow-hidden">
              {/* Left Panel - Drag & Drop */}
              <Card className="flex flex-col overflow-hidden">
                <CardContent className="flex-1 p-4 overflow-auto">
                  <div
                    {...getRootProps()}
                    className={cn(
                      'flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center',
                      isDragActive && 'border-primary bg-muted'
                    )}
                  >
                    <input {...getInputProps()} />
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt="Uploaded content"
                        className="max-h-full w-full object-contain"
                      />
                    ) : (
                      <>
                        <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                        <p className="mb-2 text-sm font-medium">Drag & drop to display an image</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Middle Panel - Chat Interface */}
              <Card className="flex flex-col overflow-hidden">
                <CardContent className="flex flex-1 flex-col gap-4 p-4 overflow-auto">
                  <div className="flex-1 space-y-4 overflow-auto">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          'rounded-lg p-3 text-sm',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
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
                </CardContent>
              </Card>

              {/* Right Panel - Editable Output */}
              <Card className="flex flex-col overflow-hidden">
                <CardContent className="flex-1 p-4 overflow-auto">
                  <div className="h-full overflow-auto rounded-lg border p-4">
                    <Textarea
                      value={markdownContent}
                      onChange={(e) => setMarkdownContent(e.target.value)}
                      className="min-h-full w-full resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="frontend" className="h-full p-4">
            <div className="text-center text-muted-foreground">Frontend development content</div>
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
  );
}
