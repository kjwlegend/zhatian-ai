import { db } from './index';
import { Page } from './schema';

export async function getPage(id: string): Promise<Page | undefined> {
  const database = await db;
  return database.get('pages', id);
}

export async function addPage(page: Page): Promise<void> {
  const database = await db;
  await database.put('pages', page);
}

export async function updatePage(page: Page): Promise<void> {
  const database = await db;
  await database.put('pages', page);
}

export async function deletePage(id: string): Promise<void> {
  const database = await db;
  await database.delete('pages', id);
}

export async function getProjectPages(projectId: string): Promise<Page[]> {
  const database = await db;
  return database.getAllFromIndex('pages', 'by-project', projectId);
}
