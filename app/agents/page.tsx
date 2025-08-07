'use client';

import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const projects = [
  {
    id: 'gucci',
    name: 'Gucci',
    status: 'WIP',
    description: '正在开发中的 Gucci 项目助手',
    disabled: true,
  },
  {
    id: 'valentino',
    name: 'Valentino',
    status: '试用中',
    description: '处于试用阶段的 Valentino 项目助手',
    disabled: false,
  },
];

export default function AgentsPage() {
  const router = useRouter();

  const handleProjectClick = (projectId: string) => {
    router.push(`/agents/${projectId}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">项目助手</h1>
          <p className="text-muted-foreground mt-1">选择要访问的项目助手</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`${project.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-primary'} transition-colors`}
            onClick={() => !project.disabled && handleProjectClick(project.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {project.name}
                <span className="text-sm font-normal text-muted-foreground">
                  ({project.status})
                </span>
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
