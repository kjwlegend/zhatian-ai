import { db } from './index';
import { ChatTopic } from './schema';

export async function getTopic(id: string): Promise<ChatTopic | undefined> {
  const database = await db;
  return database.get('topics', id);
}

export async function addTopic(topic: ChatTopic): Promise<void> {
  const database = await db;
  await database.put('topics', topic);
}

export async function updateTopic(topic: ChatTopic): Promise<void> {
  const database = await db;
  await database.put('topics', topic);
}

export async function deleteTopic(id: string): Promise<void> {
  const database = await db;
  await database.delete('topics', id);
}

export async function getViewTopics(viewId: string): Promise<ChatTopic[]> {
  const database = await db;
  return database.getAllFromIndex('topics', 'by-view', viewId);
}

export async function getAllTopics(): Promise<ChatTopic[]> {
  const database = await db;
  return database.getAll('topics');
}
