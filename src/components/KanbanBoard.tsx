import { useMemo } from 'react'
import { Button, Typography, Spin, Popconfirm, Tooltip, Empty } from 'antd'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Hourglass, RefreshCw, CheckCircle2, Pencil, Check, Trash2, Calendar, Clock } from 'lucide-react'
import type { DropResult } from '@hello-pangea/dnd'
import type { Task, TaskStatus } from '../types'
import dayjs from 'dayjs'

type Props = {
  tasks: Task[]
  loading?: boolean
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
  onReorder: (updates: { id: string; status: TaskStatus; order: number }[]) => void
}

const columns: { key: TaskStatus; title: string; color: string; icon: React.ReactNode }[] = [
  { key: 'pending', title: 'Pending', color: 'var(--warning-600)', icon: <Hourglass size={18} /> },
  { key: 'in_progress', title: 'In Progress', color: 'var(--primary-600)', icon: <RefreshCw size={18} /> },
  { key: 'completed', title: 'Completed', color: 'var(--success-600)', icon: <CheckCircle2 size={18} /> },
]

const KanbanBoard: React.FC<Props> = ({ tasks, loading, onEdit, onDelete, onComplete, onReorder }) => {
  const grouped = useMemo(() => {
    const g: Record<TaskStatus, Task[]> = { pending: [], in_progress: [], completed: [] }
    tasks.forEach((t) => g[t.status].push(t))
    ;(Object.keys(g) as TaskStatus[]).forEach((k) => g[k].sort((a, b) => a.order - b.order))
    return g
  }, [tasks])

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    // No destination or dropped in same position
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const srcCol = source.droppableId as TaskStatus
    const destCol = destination.droppableId as TaskStatus

    // Create copies of task arrays
    const srcTasks = Array.from(grouped[srcCol])
    const destTasks = srcCol === destCol ? srcTasks : Array.from(grouped[destCol])

    // Find and remove task from source
    const taskIndex = srcTasks.findIndex((t) => t._id === draggableId)
    if (taskIndex === -1) return

    const [movedTask] = srcTasks.splice(taskIndex, 1)

    // Insert into destination at the correct position
    if (srcCol === destCol) {
      // Same column reorder
      srcTasks.splice(destination.index, 0, movedTask)
    } else {
      // Different column - update status
      destTasks.splice(destination.index, 0, { ...movedTask, status: destCol })
    }

    // Build updates array with new orders
    const updates: { id: string; status: TaskStatus; order: number }[] = []

    if (srcCol === destCol) {
      // Only update the source column
      srcTasks.forEach((task, index) => {
        updates.push({ id: task._id, status: srcCol, order: index })
      })
    } else {
      // Update both source and destination columns
      srcTasks.forEach((task, index) => {
        updates.push({ id: task._id, status: srcCol, order: index })
      })
      destTasks.forEach((task, index) => {
        updates.push({ id: task._id, status: destCol, order: index })
      })
    }

    onReorder(updates)
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending': return '#d97706'
      case 'in_progress': return '#0369a1'
      case 'completed': return '#059669'
      default: return '#6b7280'
    }
  }

  const getStatusBg = (status: TaskStatus) => {
    switch (status) {
      case 'pending': return '#fef3c7'
      case 'in_progress': return '#e0f2fe'
      case 'completed': return '#d1fae5'
      default: return '#f9fafb'
    }
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return dayjs(dueDate).isBefore(dayjs(), 'day')
  }

  return (
    <Spin spinning={!!loading}>
      <div className="kanban-container">
        <DragDropContext onDragEnd={handleDragEnd}>
          {columns.map((col) => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className="kanban-column"
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? '#e0f2fe' : '#f9fafb',
                    borderColor: snapshot.isDraggingOver ? '#7dd3fc' : '#e5e7eb',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div className="kanban-column-header">
                    <div className="flex items-center gap-2">
                      <span style={{ display: 'inline-flex', color: getStatusColor(col.key as TaskStatus) }}>{col.icon}</span>
                      <h3 className="kanban-column-title">{col.title}</h3>
                    </div>
                    <div 
                      className="kanban-column-count"
                      style={{ 
                        backgroundColor: getStatusBg(col.key as TaskStatus),
                        color: getStatusColor(col.key as TaskStatus)
                      }}
                    >
                      {grouped[col.key].length}
                    </div>
                  </div>

                  <div style={{ minHeight: '400px' }}>
                    {grouped[col.key].length === 0 ? (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <span style={{ color: '#6b7280', fontSize: 'var(--font-size-sm)' }}>
                            No tasks in this column
                          </span>
                        }
                        style={{ margin: 'var(--space-8) 0' }}
                      />
                    ) : (
                      grouped[col.key].map((task, index) => (
                        <Draggable draggableId={task._id} index={index} key={task._id}>
                          {(prov, snapshot) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className="kanban-task"
                              style={{
                                ...prov.draggableProps.style,
                                transform: snapshot.isDragging
                                  ? `${prov.draggableProps.style?.transform || ''} rotate(5deg)`.trim()
                                  : prov.draggableProps.style?.transform,
                                boxShadow: snapshot.isDragging ? 'var(--shadow-xl)' : 'var(--shadow-sm)',
                                opacity: snapshot.isDragging ? 0.9 : 1,
                              }}
                            >
                              <div className="kanban-task-header">
                                <Typography.Text 
                                  strong 
                                  className="kanban-task-title"
                                  style={{ 
                                    color: '#1f2937',
                                    fontSize: 'var(--font-size-sm)',
                                    lineHeight: '1.4'
                                  }}
                                >
                                  {task.title}
                                </Typography.Text>
                                <div className="kanban-task-actions">
                                  <Tooltip title="Edit task">
                                    <Button
                                      size="small"
                                      icon={<Pencil size={13} />}
                                      onClick={() => onEdit(task)}
                                      style={{ borderRadius: 'var(--radius-sm)' }}
                                    />
                                  </Tooltip>
                                  {task.status !== 'completed' && (
                                    <Tooltip title="Mark as completed">
                                      <Button
                                        size="small"
                                        type="primary"
                                        icon={<Check size={13} />}
                                        onClick={() => onComplete(task._id)}
                                        style={{ borderRadius: 'var(--radius-sm)' }}
                                      />
                                    </Tooltip>
                                  )}
                                  <Tooltip title="Delete task">
                                    <Popconfirm
                                      title="Delete this task?"
                                      description="This action cannot be undone."
                                      onConfirm={() => onDelete(task._id)}
                                      okText="Delete"
                                      cancelText="Cancel"
                                    >
                                      <Button
                                        size="small"
                                        danger
                                        icon={<Trash2 size={13} />}
                                        style={{ borderRadius: 'var(--radius-sm)' }}
                                      />
                                    </Popconfirm>
                                  </Tooltip>
                                </div>
                              </div>

                              {task.description && (
                                <div className="kanban-task-description">
                                  <Typography.Text 
                                    type="secondary"
                                    style={{ 
                                      fontSize: 'var(--font-size-xs)',
                                      lineHeight: '1.4',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    {task.description}
                                  </Typography.Text>
                                </div>
                              )}

                              <div className="kanban-task-footer">
                                <div className="flex items-center gap-2">
                                  <span 
                                    className="kanban-task-status"
                                    style={{
                                      backgroundColor: getStatusBg(task.status),
                                      color: getStatusColor(task.status)
                                    }}
                                  >
                                    {task.status.replace('_', ' ').toUpperCase()}
                                  </span>
                                  
                                  {task.dueDate && (
                                    <Tooltip title={`Due: ${dayjs(task.dueDate).format('MMM DD, YYYY')}`}>
                                      <div 
                                        className="flex items-center gap-1"
                                        style={{ 
                                          color: isOverdue(task.dueDate) ? '#dc2626' : '#6b7280',
                                          fontSize: 'var(--font-size-xs)'
                                        }}
                                      >
                                        <Calendar size={12} />
                                        <span>{dayjs(task.dueDate).format('MMM DD')}</span>
                                      </div>
                                    </Tooltip>
                                  )}
                                </div>

                                <div className="flex items-center gap-1" style={{ color: '#6b7280', fontSize: 'var(--font-size-xs)' }}>
                                  <Clock size={12} />
                                  <span>{dayjs(task.createdAt).format('MMM DD')}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </Spin>
  )
}

export default KanbanBoard