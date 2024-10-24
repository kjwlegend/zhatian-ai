import { initDB } from './index';
import { ChatView } from './schema';

const DEFAULT_VIEWS: ChatView[] = [
  { id: 'docs', name: 'Documentation', lastUpdated: Date.now() },
  { id: 'frontend', name: 'Frontend', lastUpdated: Date.now() },
  { id: 'backend', name: 'Backend', lastUpdated: Date.now() },
  { id: 'test', name: 'Test', lastUpdated: Date.now() },
];

export async function initializeViews(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('views', 'readwrite');
  const viewStore = tx.objectStore('views');

  for (const view of DEFAULT_VIEWS) {
    await viewStore.put(view);
  }

  await tx.done;
}

export async function getView(id: string): Promise<ChatView | undefined> {
  const db = await initDB();
  return db.get('views', id);
}

export async function getAllViews(): Promise<ChatView[]> {
  const db = await initDB();
  return db.getAll('views');
}

// We don't need add, update, or delete methods for views anymore
// since they are predefined and should not change.
