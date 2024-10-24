import { initDB } from './index';
import { ChatMessage } from './schema';

export async function getMessage(id: string): Promise<ChatMessage | undefined> {
  const db = await initDB();
  return db.get('messages', id);
}

export async function addMessage(message: ChatMessage): Promise<void> {
  const db = await initDB();
  await db.put('messages', message);
}

export async function updateMessage(message: ChatMessage): Promise<void> {
  const db = await initDB();
  await db.put('messages', message);
}

export async function deleteMessage(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('messages', id);
}

export async function getTopicMessages(topicId: string): Promise<ChatMessage[]> {
  const db = await initDB();
  return db.getAllFromIndex('messages', 'by-topic', topicId);
}
