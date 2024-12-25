export interface Task {
  id: string
  title: string
  labels: string[]
  createdDate: string
  targetDate: string
  count: number
  status: 'review' | 'planned' | 'progress' | 'completed'
}

export interface Column {
  id: string
  title: string
  count: number
  tasks: Task[]
}

export type ViewMode = 'overall' | 'quarterly'

export interface QuarterlyColumn extends Column {
  quarter: string
}

