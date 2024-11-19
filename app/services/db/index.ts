import { openDB } from 'idb';
import { ChatDBSchema } from './schema';

const DB_NAME = 'chat-db';
const DB_VERSION = 1;

export const openChatDB = async () => {
  return openDB<ChatDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      // Projects store
      if (!db.objectStoreNames.contains('projects')) {
        const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
        projectStore.createIndex('by-creator', 'creator');
        projectStore.createIndex('by-last-updated', 'lastUpdated');
      }

      // Pages store
      if (!db.objectStoreNames.contains('pages')) {
        const pageStore = db.createObjectStore('pages', { keyPath: 'id' });
        pageStore.createIndex('by-project', 'projectId');
        pageStore.createIndex('by-last-updated', 'lastUpdated');
      }

      // Components store
      if (!db.objectStoreNames.contains('components')) {
        const componentStore = db.createObjectStore('components', { keyPath: 'id' });
        componentStore.createIndex('by-creator', 'creator');
        componentStore.createIndex('by-framework', 'codeFramework');
        componentStore.createIndex('by-status', 'status');
        componentStore.createIndex('by-tags', 'tags', { multiEntry: true });
        componentStore.createIndex('by-last-updated', 'updatedAt');
      }

      // Views store
      if (!db.objectStoreNames.contains('views')) {
        const viewStore = db.createObjectStore('views', { keyPath: 'id' });
        viewStore.createIndex('by-last-updated', 'lastUpdated');
      }

      // Topics store
      if (!db.objectStoreNames.contains('topics')) {
        const topicStore = db.createObjectStore('topics', { keyPath: 'id' });
        topicStore.createIndex('by-view', 'viewId');
        topicStore.createIndex('by-last-updated', 'lastUpdated');
      }

      // Messages store
      if (!db.objectStoreNames.contains('messages')) {
        const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
        messageStore.createIndex('by-topic', 'topicId');
      }
    },
  });
};

export const db = openChatDB();

export * from './viewsService';
export * from './topicsService';
export * from './messagesService';
export * from './projectsService';
export * from './pagesService';
export * from './componentsService';
