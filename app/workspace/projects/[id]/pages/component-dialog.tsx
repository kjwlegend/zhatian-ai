'use client';

import { type Component } from '@/app/services/db/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ComponentDialogProps {
  component: Component | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComponentDialog({ component, open, onOpenChange }: ComponentDialogProps) {
  if (!component) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{component.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <strong>基本信息</strong>
            <div className="mt-2 space-y-2">
              <p>
                <strong>ID:</strong> {component.id}
              </p>
              <p>
                <strong>名称:</strong> {component.name}
              </p>
              <p>
                <strong>状态:</strong> {component.status}
              </p>
              <p>
                <strong>版本:</strong> {component.version}
              </p>
              <p>
                <strong>创建者:</strong> {component.creator}
              </p>
              <p>
                <strong>创建时间:</strong> {new Date(component.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>更新时间:</strong> {new Date(component.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <strong>标签</strong>
            <div className="mt-2 flex gap-2 flex-wrap">
              {component.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <strong>描述</strong>
            <p className="mt-2">{component.description}</p>
          </div>

          <div>
            <strong>状态</strong>
            <div className="mt-2 space-y-2">
              <p>
                <strong>已发布:</strong> {component.published ? '是' : '否'}
              </p>
              <p>
                <strong>已验证:</strong> {component.verified ? '是' : '否'}
              </p>
            </div>
          </div>

          {component.dependencies && component.dependencies.length > 0 && (
            <div>
              <strong>依赖</strong>
              <div className="mt-2">
                {component.dependencies.map((dep) => (
                  <div key={dep}>{dep}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
