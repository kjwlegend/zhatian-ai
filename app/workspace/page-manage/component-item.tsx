'use client'

import { type Component } from './types'

interface ComponentItemProps {
  component: Component
  onClick: () => void
}

export function ComponentItem({ component, onClick }: ComponentItemProps) {
  return (
    <div
      className="cursor-move rounded-md border bg-background p-3"
      onClick={onClick}
    >
      <h3 className="text-sm font-medium">{component.name}</h3>
    </div>
  )
}

