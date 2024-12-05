'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type Component } from './types'

interface ComponentDialogProps {
  component: Component | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComponentDialog({ component, open, onOpenChange }: ComponentDialogProps) {
  if (!component) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{component.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p><strong>Type:</strong> {component.type}</p>
          <p><strong>ID:</strong> {component.id}</p>
          {/* Add more component details here */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

