import { initDB } from './index';
import { CodeContent } from './schema';

export async function getCode(
  topicId: string,
  codeType: keyof CodeContent
): Promise<string | undefined> {
  const db = await initDB();
  const result = await db.get('code', [topicId, codeType]);
  return result?.content;
}

export async function updateCode(
  topicId: string,
  codeType: keyof CodeContent,
  content: string
): Promise<void> {
  const db = await initDB();
  await db.put('code', { topicId, codeType, content, lastUpdated: Date.now() });
}

export async function getTopicCode(topicId: string): Promise<Partial<CodeContent>> {
  const db = await initDB();
  const codeEntries = await db.getAllFromIndex('code', 'by-topic', topicId);
  return Object.fromEntries(codeEntries.map((entry) => [entry.codeType, entry.content]));
}
