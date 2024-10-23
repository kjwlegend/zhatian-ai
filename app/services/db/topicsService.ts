import { initDB } from './index';
import { ChatTopic } from './schema';

export async function getTopic(id: string): Promise<ChatTopic | undefined> {
  const db = await initDB();
  return db.get('topics', id);
}

export async function addTopic(topic: ChatTopic): Promise<void> {
  const db = await initDB();
  await db.put('topics', topic);
}

export async function updateTopic(topic: ChatTopic): Promise<void> {
  const db = await initDB();
  await db.put('topics', topic);
}

export async function deleteTopic(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('topics', id);
}

export async function getViewTopics(viewId: string): Promise<ChatTopic[]> {
  const db = await initDB();
  return db.getAllFromIndex('topics', 'by-view', viewId);
}

export async function getAllTopics(): Promise<ChatTopic[]> {
  const db = await initDB();
  return db.getAll('topics');
}
