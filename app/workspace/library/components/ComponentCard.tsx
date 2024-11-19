import { Download, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Component } from '@/app/services/db/schema';
import { ComponentEditor } from '../components/ComponentEditor';

interface ComponentCardProps {
  component: Component;
  onDelete: (id: string) => void;
  onExport: (component: Component) => void;
  onSave: (component: Component) => Promise<void>;
  onSelect: (component: Component | null) => void;
  selectedComponent: Component | null;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

export function ComponentCard({
  component,
  onDelete,
  onExport,
  onSave,
  onSelect,
  selectedComponent,
  isEditing = false,
  onEditingChange,
}: ComponentCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <img
          src={component.thumbnail}
          alt={component.name}
          className="w-full h-32 object-cover mb-2"
        />
        <h2 className="text-lg font-semibold">{component.name}</h2>
        <div className="flex flex-wrap gap-1 my-2">
          {component.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Badge variant={component.status === 'Done' ? 'default' : 'secondary'}>
            {component.status}
          </Badge>
          <Badge variant={component.published ? 'default' : 'secondary'}>
            {component.published ? 'Published' : 'Unpublished'}
          </Badge>
          <Badge variant={component.verified ? 'default' : 'secondary'}>
            {component.verified ? 'Verified' : 'Unverified'}
          </Badge>
        </div>
        <div className="mt-2 text-sm text-gray-600">Framework: {component.codeFramework}</div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog open={isEditing} onOpenChange={onEditingChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => onSelect(component)}>
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle>Edit {component.name}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              {selectedComponent && (
                <ComponentEditor 
                  component={selectedComponent} 
                  onSave={(updatedComponent) => {
                    onSave(updatedComponent);
                    onEditingChange?.(false);
                  }} 
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the component
                "{component.name}" and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(component.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button variant="outline" size="sm" onClick={() => onExport(component)}>
          <Download className="w-4 h-4 mr-1" /> Export
        </Button>
      </CardFooter>
    </Card>
  );
}
