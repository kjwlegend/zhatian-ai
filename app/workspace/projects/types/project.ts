export type ProjectStatus = 'active' | 'archived' | 'completed';
export type Platform = 'website' | 'wechat' | 'app';

export interface ProjectMember {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  status: ProjectStatus;
  platforms: Platform[];
  createdAt: string;
  updatedAt: string;
  members: ProjectMember[];
  components: string[]; // Component IDs
  pages: string[]; // Page IDs
  creator: string;
  lastModifiedBy: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  platforms: Platform[];
  pagesCount: number;
  componentsCount: number;
  thumbnail?: string;
  updatedAt: string;
}
