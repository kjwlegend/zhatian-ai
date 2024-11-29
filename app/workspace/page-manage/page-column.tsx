'use client'

import { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { MoreVertical, Edit, Trash, FileCode, Copy, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ComponentItem } from './component-item'
import { EditPageDialog } from './edit-page-dialog'
import { ComponentDialog } from './component-dialog'
import { type Page, type Component } from './types'

interface PageColumnProps {
  page: Page
  onDelete: () => void
}

export function PageColumn({ page, onDelete }: PageColumnProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)

  const copyComponent = (component: Component) => {
    // Implement copy logic here
  }

  const deleteComponent = (componentId: string) => {
    // Implement delete logic here
  }

  return (
    <>
      <Droppable droppableId={page.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`w-80 shrink-0 rounded-lg border bg-card p-4 ${
              snapshot.isDraggingOver ? 'border-primary' : 'border-border'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{page.title}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileCode className="mr-2 h-4 w-4" />
                    Generate CMS
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              {page.components.map((component, index) => (
                <Draggable key={component.id} draggableId={component.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`group relative ${snapshot.isDragging ? 'z-10' : ''}`}
                    >
                      <ComponentItem
                        component={component}
                        onClick={() => setSelectedComponent(component)}
                      />
                      <div className="absolute right-1 top-1 hidden space-x-1 group-hover:flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyComponent(component)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteComponent(component.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this page? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditPageDialog
        page={page}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <ComponentDialog
        component={selectedComponent}
        open={!!selectedComponent}
        onOpenChange={(open) => !open && setSelectedComponent(null)}
      />
    </>
  )
}

