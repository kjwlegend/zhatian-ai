import { useState, useEffect } from 'react';
import { Project } from '../types/project';

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of company website',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-03-15',
    members: [
      { id: '1', name: 'John Doe', avatar: 'https://github.com/shadcn.png' },
      { id: '2', name: 'Jane Smith', avatar: 'https://github.com/shadcn.png' },
    ],
    components: ['1', '2', '3'],
  },
  // Add more mock projects...
];

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchProjects = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProjects(mockProjects);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return { projects, loading };
} 