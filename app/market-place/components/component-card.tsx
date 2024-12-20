import { CircleDot, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { MarketComponent } from '../types';
import { ComponentDialog } from './component-dialog';

interface ComponentCardProps {
  component: MarketComponent;
  onStartChat?: () => void;
  onAddToProject?: () => void;
}

export function ComponentCard({ component, onStartChat, onAddToProject }: ComponentCardProps) {
  const statusColor = {
    draft: 'text-yellow-500',
    Done: 'text-green-500',
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group flex flex-col h-full cursor-pointer hover:shadow-md transition-all border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-4 p-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold leading-none tracking-tight">{component.name}</h3>
                {component.verified && <ShieldCheck className="h-4 w-4 text-blue-500" />}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{component.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
                {component.codeFramework}
              </Badge>
              <Badge
                variant="outline"
                className={cn('flex items-center gap-1', statusColor[component.status])}
              >
                <CircleDot className="h-3 w-3" />
                <span className="text-xs capitalize">{component.status}</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
              <img
                src={component.designFile ? component.designFile : 'https://placehold.co/600x400'}
                alt={`${component.name} 预览`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{component.creator}</span>
                <span>·</span>
                <span>{(component.usage || 0).toLocaleString()} 使用</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {component.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {component.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{component.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <ComponentDialog
        component={component}
        onStartChat={onStartChat}
        onAddToProject={onAddToProject}
      />
    </Dialog>
  );
}
