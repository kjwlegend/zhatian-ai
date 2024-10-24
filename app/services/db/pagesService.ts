import { initDB } from './index';
import { Page } from './schema';

export async function getPage(id: string): Promise<Page | undefined> {
  const db = await initDB();
  return db.get('pages', id);
}

export async function addPage(page: Page): Promise<void> {
  const db = await initDB();
  await db.put('pages', page);
}

export async function updatePage(page: Page): Promise<void> {
  const db = await initDB();
  await db.put('pages', page);
}

export async function deletePage(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('pages', id);
}

export async function getProjectPages(projectId: string): Promise<Page[]> {
  const db = await initDB();
  return db.getAllFromIndex('pages', 'by-project', projectId);
}
