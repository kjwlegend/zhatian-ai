'use client'

import { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Search } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { type Component } from '../types'

interface SidebarProps {
  components: Component[]
}

function DraggableComponent({ component, index }: { component: Component; index: number }) {
  return (
    <Draggable draggableId={component.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 rounded-md border bg-card p-2 text-sm ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          {component.name}
        </div>
      )}
    </Draggable>
  )
}

export function Sidebar({ components }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredComponents = components.filter((component) =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-64 border-r bg-background">
      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Verified Components</h2>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <Droppable droppableId="sidebar" isDropDisabled={true}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {filteredComponents.map((component, index) => (
                  <DraggableComponent key={component.id} component={component} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </ScrollArea>
      </div>
    </div>
  )
}

