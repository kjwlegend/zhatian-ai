import { DBSchema } from 'idb';

export interface Project {
  id: string;
  name: string;
  creator: string;
  createdAt: number;
  codeType: string;
  lastUpdated: number;
}

export interface Page {
  id: string;
  projectId: string;
  name: string;
  lastUpdated: number;
  description: string;
  type: string;
  componentsCount: number;
}

export interface Component {
  id: string;
  pageId: string;
  name: string;
  type: string;
  content: string;
  lastUpdated: number;
}

export interface ChatMessage {
  id: string;
  topicId: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  image?: string;
}

export interface CodeContent {
  html: string;
  js: string;
  scss: string;
  panel: string;
}

export interface ChatTopic {
  id: string;
  viewId: string;
  title: string;
  lastUpdated: number;
}

export interface ChatView {
  id: string;
  name: string;
  lastUpdated: number;
}

export interface ChatDBSchema extends DBSchema {
  projects: {
    key: string;
    value: Project;
    indexes: { 'by-creator': string; 'by-last-updated': number };
  };
  pages: {
    key: string;
    value: Page;
    indexes: { 'by-project': string; 'by-last-updated': number };
  };
  components: {
    key: string;
    value: Component;
    indexes: { 'by-page': string; 'by-last-updated': number };
  };
  views: {
    key: string;
    value: ChatView;
    indexes: { 'by-last-updated': number };
  };
  topics: {
    key: string;
    value: ChatTopic;
    indexes: { 'by-view': string; 'by-last-updated': number };
  };
  messages: {
    key: string;
    value: ChatMessage;
    indexes: { 'by-topic': string };
  };
  code: {
    key: string;
    value: {
      topicId: string;
      codeType: keyof CodeContent;
      content: string;
      lastUpdated: number;
    };
    indexes: { 'by-topic': string };
  };
}
