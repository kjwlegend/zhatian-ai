import { Component } from '@/app/services/db/schema';
import { useComponentStore } from '@/app/store/componentStore';

// 创建新组件的默认值
const defaultNewComponent: Omit<Component, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'New Component',
  thumbnail: 'https://placehold.co/100x100',
  status: 'draft',
  tags: [],
  published: false,
  verified: false,
  description: '',
  designFile: '',
  code: {
    frontend: {},
    backend: {},
    test: {},
  },
  codeFramework: 'react',
  componentDoc: '',
  creator: 'system',
  version: '1.0.0',
  dependencies: [],
};

export function useComponents() {
  const {
    components,
    selectedComponent,
    loading,
    error,
    addComponent,
    updateComponent,
    deleteComponent,
    setSelectedComponent,
    loadComponents,
  } = useComponentStore();

  const handleExport = (component: Component) => {
    console.log('Exporting component:', component.name);
  };

  return {
    components,
    selectedComponent,
    setSelectedComponent,
    handleDelete: deleteComponent,
    handleExport,
    handleSave: async (component: Component) => {
      await updateComponent(component.id, component);
    },
    handleCreate: () => addComponent(defaultNewComponent),
    loading,
    error,
    loadComponents,
  };
}
