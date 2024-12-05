'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Laptop, LogIn, Pencil, Smartphone, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Platform, ProjectSummary } from '../types/project';

interface ProjectCardProps {
  project: ProjectSummary;
  onDelete: (id: string) => Promise<void>;
  onEdit: (
    id: string,
    data: { name: string; description: string; platforms: Platform[] }
  ) => Promise<void>;
}

export function ProjectCard({ project, onDelete, onEdit }: ProjectCardProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [editForm, setEditForm] = useState({
    name: project.name,
    description: project.description,
    platforms: project.platforms,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (deleteConfirmation === project.name) {
      setIsSubmitting(true);
      try {
        await onDelete(project.id);
        setIsDeleteDialogOpen(false);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEdit = async () => {
    setIsSubmitting(true);
    try {
      await onEdit(project.id, editForm);
      setIsEditDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnterProject = () => {
    router.push(`/workspace/projects/${project.id}/pages`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {project.platforms.includes('website') && (
              <Badge variant="secondary">
                <Globe className="mr-1 h-3 w-3" />
                Web
              </Badge>
            )}
            {project.platforms.includes('wechat') && (
              <Badge variant="secondary">
                <Smartphone className="mr-1 h-3 w-3" />
                小程序
              </Badge>
            )}
            {project.platforms.includes('app') && (
              <Badge variant="secondary">
                <Laptop className="mr-1 h-3 w-3" />
                App
              </Badge>
            )}
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">{project.pagesCount}</span> 页面
            </div>
            <div>
              <span className="font-medium">{project.componentsCount}</span> 组件
            </div>
            <div>更新于 {new Date(project.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            编辑
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            删除
          </Button>
        </div>
        <Button onClick={handleEnterProject}>
          <LogIn className="mr-2 h-4 w-4" />
          进入项目
        </Button>
      </CardFooter>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑项目</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">项目名称</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">项目描述</Label>
              <Input
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '保存修改'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除项目</DialogTitle>
            <DialogDescription>
              此操作无法撤销。请输入项目名称 <span className="font-medium">{project.name}</span>{' '}
              确认删除。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="confirmation">确认项目名称</Label>
              <Input
                id="confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="输入项目名称"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteConfirmation !== project.name || isSubmitting}
            >
              {isSubmitting ? '删除中...' : '删除项目'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
