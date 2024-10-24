import { IDBPDatabase, openDB } from 'idb';
import { ChatDBSchema } from './schema';

let db: IDBPDatabase<ChatDBSchema> | null = null;

export async function initDB(): Promise<IDBPDatabase<ChatDBSchema>> {
  if (db) return db;

  db = await openDB<ChatDBSchema>('ChatDB', 3, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (oldVersion < 1) {
        const topicStore = db.createObjectStore('topics', { keyPath: 'id' });
        topicStore.createIndex('by-view', 'viewId');
        topicStore.createIndex('by-last-updated', 'lastUpdated');

        const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
        messageStore.createIndex('by-topic', 'topicId');

        const codeStore = db.createObjectStore('code', { keyPath: ['topicId', 'codeType'] });
        codeStore.createIndex('by-topic', 'topicId');
      }

      if (oldVersion < 2) {
        const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
        projectStore.createIndex('by-last-updated', 'lastUpdated');

        const pageStore = db.createObjectStore('pages', { keyPath: 'id' });
        pageStore.createIndex('by-project', 'projectId');
        pageStore.createIndex('by-last-updated', 'lastUpdated');

        const componentStore = db.createObjectStore('components', { keyPath: 'id' });
        componentStore.createIndex('by-page', 'pageId');
        componentStore.createIndex('by-last-updated', 'lastUpdated');
      }

      if (oldVersion < 3) {
        const viewStore = db.createObjectStore('views', { keyPath: 'id' });
        viewStore.createIndex('by-last-updated', 'lastUpdated');
      }
    },
  });

  return db;
}

export * from './viewsService';
export * from './topicsService';
export * from './messagesService';
export * from './codeService';
export * from './projectsService';
export * from './pagesService';
export * from './componentsService';
