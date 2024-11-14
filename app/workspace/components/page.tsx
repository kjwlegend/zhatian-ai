'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Download, Edit, MessageSquare, Package, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

type CodeType = {
  [key: string]: string;
};

type Component = {
  id: string;
  name: string;
  thumbnail: string;
  status: 'draft' | 'Done';
  tags: ('requirement' | 'design' | 'FE' | 'BE' | 'Test')[];
  published: boolean;
  verified: boolean;
  description: string;
  designFile: string;
  feCode: CodeType;
  beCode: CodeType;
  testCode: CodeType;
  codeFramework: string;
  relatedProjects: string[];
  componentDoc: string;
};

const mockComponents: Component[] = [
  {
    id: '1',
    name: 'Button Component',
    thumbnail: '/placeholder.svg?height=100&width=100',
    status: 'Done',
    tags: ['FE', 'design'],
    published: true,
    verified: true,
    description: 'A reusable button component with various styles',
    designFile: 'button-design.fig',
    feCode: {
      jsx: 'const Button = ({ children, ...props }) => <button {...props}>{children}</button>',
      css: '.button { /* styles */ }',
    },
    beCode: {},
    testCode: {
      jest: 'test("Button renders", () => { render(<Button>Click me</Button>); expect(screen.getByText("Click me")).toBeInTheDocument(); });',
    },
    codeFramework: 'react',
    relatedProjects: ['Project A', 'Project B'],
    componentDoc: '# Button Component\n\nThis is a reusable button component...',
  },
  // Add more mock components as needed
];

export default function ComponentLibraryManagement() {
  const [components, setComponents] = useState<Component[]>(mockComponents);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);

  const handleDelete = (componentId: string) => {
    setComponents(components.filter((c) => c.id !== componentId));
  };

  const handleExport = (component: Component) => {
    // Implement export logic
    console.log('Exporting component:', component.name);
  };

  const handleSave = (updatedComponent: Component) => {
    setComponents(components.map((c) => (c.id === updatedComponent.id ? updatedComponent : c)));
    setSelectedComponent(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Component Library Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {components.map((component) => (
          <Card key={component.id}>
            <CardContent className="p-4">
              <img
                src={component.thumbnail}
                alt={component.name}
                className="w-full h-32 object-cover mb-2"
              />
              <h2 className="text-lg font-semibold">{component.name}</h2>
              <div className="flex flex-wrap gap-1 my-2">
                {component.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={component.status === 'Done' ? 'default' : 'secondary'}>
                  {component.status}
                </Badge>
                <Badge variant={component.published ? 'success' : 'destructive'}>
                  {component.published ? 'Published' : 'Unpublished'}
                </Badge>
                <Badge variant={component.verified ? 'success' : 'destructive'}>
                  {component.verified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-gray-600">Framework: {component.codeFramework}</div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedComponent(component)}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Edit {component.name}</DialogTitle>
                  </DialogHeader>
                  {selectedComponent && (
                    <ComponentEditor component={selectedComponent} onSave={handleSave} />
                  )}
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => handleDelete(component.id)}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport(component)}>
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ComponentEditor({
  component,
  onSave,
}: {
  component: Component;
  onSave: (component: Component) => void;
}) {
  const [editedComponent, setEditedComponent] = useState<Component>(component);
  const [showFullImage, setShowFullImage] = useState(false);

  const handleChange = (field: keyof Component, value: any) => {
    setEditedComponent((prev) => ({ ...prev, [field]: value }));
  };

  const handleCodeChange = (
    codeType: 'feCode' | 'beCode' | 'testCode',
    language: string,
    value: string
  ) => {
    setEditedComponent((prev) => ({
      ...prev,
      [codeType]: {
        ...prev[codeType],
        [language]: value,
      },
    }));
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/4 relative">
          <Image
            src={editedComponent.thumbnail}
            alt={editedComponent.name}
            width={600}
            height={400}
            className="w-full h-auto object-cover cursor-pointer"
            onClick={() => setShowFullImage(true)}
          />
          {showFullImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowFullImage(false)}
            >
              <Image
                src={editedComponent.thumbnail}
                alt={editedComponent.name}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>
        <div className="w-full md:w-1/4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Component ID</label>
            <Input value={editedComponent.id} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Component Name</label>
            <Input
              value={editedComponent.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select
                value={editedComponent.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Published</label>
              <Switch
                checked={editedComponent.published}
                onCheckedChange={(checked) => handleChange('published', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Verified</label>
              <Switch
                checked={editedComponent.verified}
                onCheckedChange={(checked) => handleChange('verified', checked)}
              />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={editedComponent.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="flex flex-wrap gap-2">
                {['requirement', 'design', 'FE', 'BE', 'Test'].map((tag) => (
                  <Badge
                    key={tag}
                    variant={editedComponent.tags.includes(tag as any) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      if (editedComponent.tags.includes(tag as any)) {
                        handleChange(
                          'tags',
                          editedComponent.tags.filter((t) => t !== tag)
                        );
                      } else {
                        handleChange('tags', [...editedComponent.tags, tag]);
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Code Framework</label>
              <Input
                value={editedComponent.codeFramework}
                onChange={(e) => handleChange('codeFramework', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Design File</label>
              <Input
                value={editedComponent.designFile}
                onChange={(e) => handleChange('designFile', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Related Projects</label>
              <Textarea
                value={editedComponent.relatedProjects.join(', ')}
                onChange={(e) => handleChange('relatedProjects', e.target.value.split(', '))}
                rows={2}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code">
          <Tabs defaultValue="fe">
            <TabsList>
              <TabsTrigger value="fe">Frontend</TabsTrigger>
              <TabsTrigger value="be">Backend</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
            </TabsList>

            <TabsContent value="fe">
              {Object.entries(editedComponent.feCode).map(([lang, code]) => (
                <div key={lang} className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">{lang}</label>
                  <Textarea
                    value={code}
                    onChange={(e) => handleCodeChange('feCode', lang, e.target.value)}
                    rows={10}
                  />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="be">
              {Object.entries(editedComponent.beCode).map(([lang, code]) => (
                <div key={lang} className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">{lang}</label>
                  <Textarea
                    value={code}
                    onChange={(e) => handleCodeChange('beCode', lang, e.target.value)}
                    rows={10}
                  />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="test">
              {Object.entries(editedComponent.testCode).map(([lang, code]) => (
                <div key={lang} className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">{lang}</label>
                  <Textarea
                    value={code}
                    onChange={(e) => handleCodeChange('testCode', lang, e.target.value)}
                    rows={10}
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="docs">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Component Documentation
            </label>
            <Textarea
              value={editedComponent.componentDoc}
              onChange={(e) => handleChange('componentDoc', e.target.value)}
              rows={20}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button onClick={() => onSave(editedComponent)}>Save Changes</Button>
        <Button variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          Start Chat
        </Button>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add to Project
        </Button>
        <Button variant="outline">
          <Package className="w-4 h-4 mr-2" />
          Webpack FE
        </Button>
      </div>
    </div>
  );
}
