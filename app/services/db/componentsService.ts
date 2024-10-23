import { initDB } from './index';
import { Component } from './schema';

export async function getComponent(id: string): Promise<Component | undefined> {
  const db = await initDB();
  return db.get('components', id);
}

export async function addComponent(component: Component): Promise<void> {
  const db = await initDB();
  await db.put('components', component);
}

export async function updateComponent(component: Component): Promise<void> {
  const db = await initDB();
  await db.put('components', component);
}

export async function deleteComponent(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('components', id);
}

export async function getPageComponents(pageId: string): Promise<Component[]> {
  const db = await initDB();
  return db.getAllFromIndex('components', 'by-page', pageId);
}
