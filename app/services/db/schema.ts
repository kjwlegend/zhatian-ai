import { DBSchema } from 'idb';
import { Message } from '@/app/codes/hooks/useChatMessages';
import {
  Platform,
  Project,
  ProjectMember,
  ProjectStatus,
} from '@/app/workspace/projects/types/project';

export interface Page {
  id: string;
  projectId: string;
  name: string;
  lastUpdated: number;
  description: string;
  type: string;
  componentsCount: number;
  components: PageComponent[];
}

export interface ComponentReference {
  componentId: string;
  projectId?: string;
  pageId?: string;
  addedAt: number;
  addedBy: string;
  config?: Record<string, any>;
}

export interface Component {
  id: string;
  name: string;
  thumbnail: string;
  status: 'draft' | 'Done';
  tags: ('requirement' | 'design' | 'FE' | 'BE' | 'Test')[];
  published: boolean;
  verified: boolean;
  description: string;
  designFile: string;
  testCases?: string;
  code: {
    frontend: Record<string, string>;
    backend: Record<string, string>;
    test: Record<string, string>;
  };
  codeFramework: string;
  componentDoc: string;
  createdAt: number;
  updatedAt: number;
  creator: string;
  version: string;
  dependencies?: string[];
}

export interface ChatMessage {
  id: string;
  topicId: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  image?: string;
}

export interface ChatTopic {
  id: string;
  viewId?: string;
  title: string;
  type: string;
  lastUpdated: number;
  activeImage: string | null;
  markdownContent: string | null;
  requirementMessages: Message[];
  frontend: {
    frontendMessages: Message[];
    frontendFramework: string | null;
  };
  backend: {
    backendMessages: Message[];
    backendFramework: string | null;
  };
  test: {
    testMessages: Message[];
    testFramework: string | null;
  };
  cms: {
    cmsMessages: Message[];
    cmsFramework: string | null;
  };
}

export interface ChatView {
  id: string;
  name: string;
  lastUpdated: number;
}

export interface PageComponent {
  id: string;
  componentId: string;
  pageId: string;
  order: number;
  config?: Record<string, any>;
  addedAt: number;
}

export interface ChatDBSchema extends DBSchema {
  projects: {
    key: string;
    value: Project;
    indexes: {
      'by-creator': string;
      'by-status': string;
      'by-last-updated': string;
    };
  };
  pages: {
    key: string;
    value: Page;
    indexes: { 'by-project': string; 'by-last-updated': number };
  };
  components: {
    key: string;
    value: Component;
    indexes: {
      'by-creator': string;
      'by-framework': string;
      'by-status': string;
      'by-tags': string[];
      'by-last-updated': number;
    };
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
}
