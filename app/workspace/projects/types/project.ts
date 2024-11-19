export type Project = {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: string;
  updatedAt: string;
  members: {
    id: string;
    name: string;
    avatar: string;
  }[];
  components: string[]; // Component IDs
}; 