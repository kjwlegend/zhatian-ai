'use client'

import { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageColumn } from './page-column'
import { Sidebar } from './components/sidebar'
import { type Page, type Component } from './types'

const verifiedComponents: Component[] = [
  { id: 'comp1', name: 'Header', type: 'Layout' },
  { id: 'comp2', name: 'Footer', type: 'Layout' },
  { id: 'comp3', name: 'ProductCard', type: 'UI' },
  { id: 'comp4', name: 'ContactForm', type: 'Form' },
]

export default function WorkspaceLayout() {
  const [pages, setPages] = useState<Page[]>([])
  
  const addPage = () => {
    setPages([...pages, {
      id: `page-${Date.now()}`,
      title: `New Page ${pages.length + 1}`,
      components: []
    }])
  }

  const deletePage = (pageId: string) => {
    setPages(pages.filter(page => page.id !== pageId))
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      const pageId = source.droppableId
      const pageIndex = pages.findIndex(p => p.id === pageId)
      const newComponents = Array.from(pages[pageIndex].components)
      const [reorderedItem] = newComponents.splice(source.index, 1)
      newComponents.splice(destination.index, 0, reorderedItem)

      const newPages = [...pages]
      newPages[pageIndex] = { ...pages[pageIndex], components: newComponents }
      setPages(newPages)
    } else {
      // Moving from sidebar to a page
      if (source.droppableId === 'sidebar') {
        const component = verifiedComponents[source.index]
        const destinationPageIndex = pages.findIndex(p => p.id === destination.droppableId)
        
        const newPages = [...pages]
        newPages[destinationPageIndex].components.splice(
          destination.index,
          0,
          { ...component, id: `${component.id}-${Date.now()}` }
        )
        setPages(newPages)
      } else {
        // Moving between pages
        const sourcePageIndex = pages.findIndex(p => p.id === source.droppableId)
        const destPageIndex = pages.findIndex(p => p.id === destination.droppableId)
        
        const newPages = [...pages]
        const [movedComponent] = newPages[sourcePageIndex].components.splice(source.index, 1)
        newPages[destPageIndex].components.splice(destination.index, 0, movedComponent)
        setPages(newPages)
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex min-h-screen bg-background">
        <Sidebar components={verifiedComponents} />
        <div className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Project Workspace</h1>
            <Button onClick={addPage}>
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6">
            {pages.map(page => (
              <PageColumn
                key={page.id}
                page={page}
                onDelete={() => deletePage(page.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}

