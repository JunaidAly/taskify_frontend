import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Task, TaskInput, TaskStatus } from '../types'

export type TaskFilters = { status?: TaskStatus; dueFrom?: string; dueTo?: string }

const fetchTasks = async (filters: TaskFilters): Promise<Task[]> => {
  const params: Record<string, string> = {}
  if (filters.status) params.status = filters.status
  if (filters.dueFrom) params.dueFrom = filters.dueFrom
  if (filters.dueTo) params.dueTo = filters.dueTo
  const { data } = await api.get('/tasks', { params })
  return data.tasks as Task[]
}

export const useTasks = (filters: TaskFilters) => {
  return useQuery({ queryKey: ['tasks', filters], queryFn: () => fetchTasks(filters) })
}

export const useCreateTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TaskInput) => {
      const { data } = await api.post('/tasks', payload)
      return data.task as Task
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export const useUpdateTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<TaskInput> }) => {
      const { data } = await api.put(`/tasks/${id}`, payload)
      return data.task as Task
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export const useDeleteTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export const useCompleteTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/tasks/${id}/complete`)
      return data.task as Task
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

type ReorderUpdate = { id: string; status: TaskStatus; order: number }
export const useReorderTasks = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (updates: ReorderUpdate[]) => {
      const { data } = await api.patch('/tasks/reorder', { updates })
      return data.tasks as Task[]
    },
    onMutate: async (updates) => {
      await qc.cancelQueries({ queryKey: ['tasks'] })
      const previous = qc.getQueriesData({ queryKey: ['tasks'] })
      // Optimistically update every cached tasks query
      previous.forEach(([key, data]) => {
        const list = (data as Task[] | undefined)?.slice()
        if (!list) return
        const byId = new Map(list.map((t) => [t._id, { ...t }]))
        updates.forEach((u) => {
          const t = byId.get(u.id)
          if (t) {
            t.status = u.status
            t.order = u.order
          }
        })
        qc.setQueryData(key as any, Array.from(byId.values()))
      })
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      // Rollback if needed
      if (ctx?.previous) {
        ctx.previous.forEach(([key, data]) => {
          qc.setQueryData(key as any, data as any)
        })
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}