import { db } from './index';
import { Component } from './schema';

export async function getComponent(id: string): Promise<Component | undefined> {
  const database = await db;
  return database.get('components', id);
}

export async function addComponent(
  component: Omit<Component, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Component> {
  const database = await db;
  const now = Date.now();
  const newComponent: Component = {
    ...component,
    id: `comp_${now}`,
    createdAt: now,
    updatedAt: now,
    version: '1.0.0',
  };

  await database.put('components', newComponent);
  return newComponent;
}

export async function updateComponent(id: string, updates: Partial<Component>): Promise<Component> {
  const database = await db;
  const component = await getComponent(id);

  if (!component) {
    throw new Error(`Component with id ${id} not found`);
  }

  const updatedComponent: Component = {
    ...component,
    ...updates,
    updatedAt: Date.now(),
  };

  await database.put('components', updatedComponent);
  return updatedComponent;
}

export async function deleteComponent(id: string): Promise<void> {
  const database = await db;
  await database.delete('components', id);
}

export async function getAllComponents(options?: {
  status?: Component['status'];
  framework?: string;
  tags?: Component['tags'];
  published?: boolean;
  creator?: string;
}): Promise<Component[]> {
  const database = await db;
  let components = await database.getAll('components');

  if (options) {
    const { status, framework, tags, published, creator } = options;

    return components.filter(
      (comp) =>
        (!status || comp.status === status) &&
        (!framework || comp.codeFramework === framework) &&
        (!tags || tags.every((tag) => comp.tags.includes(tag))) &&
        (published === undefined || comp.published === published) &&
        (!creator || comp.creator === creator)
    );
  }

  return components;
}

export async function getComponentsByFramework(framework: string): Promise<Component[]> {
  const database = await db;
  return database.getAllFromIndex('components', 'by-framework', framework);
}

export async function getComponentsByTags(tags: Component['tags']): Promise<Component[]> {
  const database = await db;
  const allComponents = await database.getAll('components');
  return allComponents.filter((comp) => tags.every((tag) => comp.tags.includes(tag)));
}

export async function createComponentVersion(
  componentId: string,
  version: string
): Promise<Component> {
  const component = await getComponent(componentId);
  if (!component) {
    throw new Error(`Component not found: ${componentId}`);
  }

  const newVersion: Component = {
    ...component,
    id: `${componentId}_${version}`,
    version,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await addComponent(newVersion);
  return newVersion;
}

export async function bulkAddComponents(
  components: Array<Omit<Component, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Component[]> {
  const addedComponents = await Promise.all(components.map((component) => addComponent(component)));
  return addedComponents;
}

export async function bulkDeleteComponents(ids: string[]): Promise<void> {
  const database = await db;
  const tx = database.transaction('components', 'readwrite');
  await Promise.all(ids.map((id) => tx.store.delete(id)));
  await tx.done;
}
