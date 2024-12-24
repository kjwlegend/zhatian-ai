'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Upload } from 'lucide-react';
import { WelcomeDialog } from '@/app/components/welcomeDialog';
import { Component } from '@/app/services/db/schema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ComponentCard } from './components/ComponentCard';
import { useComponents } from './hooks/useComponents';

export default function LibraryPage() {
  const {
    components,
    selectedComponent,
    setSelectedComponent,
    handleDelete,
    handleExport,
    handleSave,
    handleCreate,
    loading,
    error,
    loadComponents,
  } = useComponents();

  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      await loadComponents();
    };
    load();
  }, []);

  const handleCreateClick = async () => {
    try {
      const newComponent = await handleCreate();
      setEditingComponentId(newComponent.id);
    } catch (err) {
      console.error('Failed to create component:', err);
    }
  };

  const handleUpload = () => {
    // TODO: 上传组件
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">组件库</h1>
        <div className="flex gap-2">
          <Button onClick={handleCreateClick}>
            <Plus className="w-4 h-4 mr-2" />
            添加组件
          </Button>
          <Button variant="outline" onClick={handleUpload}>
            <Upload className="w-4 h-4 mr-2" />
            上传组件
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {components.map((component: Component) => (
          <ComponentCard
            key={component.id}
            component={component}
            onDelete={handleDelete}
            onExport={handleExport}
            onSave={handleSave}
            onSelect={setSelectedComponent}
            selectedComponent={selectedComponent}
            isEditing={editingComponentId === component.id}
            onEditingChange={(isEditing) => {
              setEditingComponentId(isEditing ? component.id : null);
            }}
          />
        ))}
      </div>
      <WelcomeDialog />
    </div>
  );
}
