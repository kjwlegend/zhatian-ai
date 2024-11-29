'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { type Page } from './types'

interface EditPageDialogProps {
  page: Page
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPageDialog({ page, open, onOpenChange }: EditPageDialogProps) {
  const [title, setTitle] = useState(page.title)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle page update logic here
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Page</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Page Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

