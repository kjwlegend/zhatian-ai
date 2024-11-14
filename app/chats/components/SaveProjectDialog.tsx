import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SaveProjectDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function SaveProjectDialog({ isOpen, setIsOpen }: SaveProjectDialogProps) {
  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Saving project...');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Save to Draft</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Project</DialogTitle>
          <DialogDescription>Enter the details for your project draft.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-name" className="text-right">
                Name
              </Label>
              <Input id="project-name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-description" className="text-right">
                Description
              </Label>
              <Textarea id="project-description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-tags" className="text-right">
                Tags
              </Label>
              <Input
                id="project-tags"
                className="col-span-3"
                placeholder="Separate tags with commas"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Draft</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
