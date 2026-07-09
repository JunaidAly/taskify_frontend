export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export type Task = {
  _id: string
  title: string
  description?: string
  dueDate?: string
  status: TaskStatus
  order: number
  createdAt: string
  updatedAt: string
}

export type TaskInput = {
  title: string
  description?: string
  dueDate?: string
  status?: TaskStatus
}