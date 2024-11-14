import { db } from './index';
import { ChatMessage } from './schema';

export async function getMessage(id: string): Promise<ChatMessage | undefined> {
  const database = await db;
  return database.get('messages', id);
}

export async function addMessage(message: ChatMessage): Promise<void> {
  const database = await db;
  await database.put('messages', message);
}

export async function updateMessage(message: ChatMessage): Promise<void> {
  const database = await db;
  await database.put('messages', message);
}

export async function deleteMessage(id: string): Promise<void> {
  const database = await db;
  await database.delete('messages', id);
}

export async function getTopicMessages(topicId: string): Promise<ChatMessage[]> {
  const database = await db;
  return database.getAllFromIndex('messages', 'by-topic', topicId);
}
