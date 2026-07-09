import { Table, Tag, Space, Button, Popconfirm, Tooltip, Typography } from 'antd'
import { Pencil, Check, Trash2, Calendar, Clock } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import type { Task } from '../types'

const { Text } = Typography

type Props = {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
}

const statusTag = (status: Task['status']) => {
  const getStatusConfig = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return { color: '#d97706', bg: '#fef3c7', text: 'PENDING' }
      case 'in_progress':
        return { color: '#0369a1', bg: '#e0f2fe', text: 'IN PROGRESS' }
      case 'completed':
        return { color: '#059669', bg: '#d1fae5', text: 'COMPLETED' }
      default:
        return { color: '#6b7280', bg: '#f9fafb', text: 'UNKNOWN' }
    }
  }

  const config = getStatusConfig(status)
  
  return (
    <Tag
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        fontWeight: '600',
        fontSize: 'var(--font-size-xs)',
        padding: 'var(--space-1) var(--space-2)'
      }}
    >
      {config.text}
    </Tag>
  )
}

const TaskTable: React.FC<Props> = ({ tasks, onEdit, onDelete, onComplete }) => {
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return dayjs(dueDate).isBefore(dayjs(), 'day')
  }

  const columns: ColumnsType<Task> = [
    {
      title: 'Task Details',
      key: 'task',
      width: '40%',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 'var(--space-1)' }}>
            <Text strong style={{ fontSize: 'var(--font-size-base)', color: '#1f2937' }}>
              {record.title}
            </Text>
          </div>
          {record.description && (
            <Text 
              type="secondary" 
              style={{ 
                fontSize: 'var(--font-size-sm)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: '1.4'
              }}
            >
              {record.description}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'In Progress', value: 'in_progress' },
        { text: 'Completed', value: 'completed' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => statusTag(status as Task['status']),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: '15%',
      sorter: (a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf()
      },
      render: (dueDate?: string) => {
        if (!dueDate) return <Text type="secondary" style={{ color: '#6b7280' }}>No due date</Text>
        
        const overdue = isOverdue(dueDate)
        return (
          <div className="flex items-center gap-1">
            <Calendar size={14} style={{ color: overdue ? '#dc2626' : '#6b7280' }} />
            <Text 
              style={{ 
                color: overdue ? '#dc2626' : '#1f2937',
                fontWeight: overdue ? '600' : '400'
              }}
            >
              {dayjs(dueDate).format('MMM DD, YYYY')}
            </Text>
          </div>
        )
      }
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
      render: (createdAt: string) => (
        <div className="flex items-center gap-1">
          <Clock size={14} style={{ color: '#6b7280' }} />
          <Text type="secondary" style={{ fontSize: 'var(--font-size-sm)', color: '#6b7280' }}>
            {dayjs(createdAt).format('MMM DD, YYYY')}
          </Text>
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit task">
            <Button
              size="small"
              icon={<Pencil size={14} />}
              onClick={() => onEdit(record)}
              style={{ borderRadius: 'var(--radius-sm)' }}
            />
          </Tooltip>
          {record.status !== 'completed' && (
            <Tooltip title="Mark as completed">
              <Button
                size="small"
                type="primary"
                icon={<Check size={14} />}
                onClick={() => onComplete(record._id)}
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete task">
            <Popconfirm
              title="Delete this task?"
              description="This action cannot be undone."
              onConfirm={() => onDelete(record._id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button
                size="small"
                danger
                icon={<Trash2 size={14} />}
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    },
  ]

  return (
    <div className="task-table-container">
      <Table 
        rowKey="_id" 
        columns={columns} 
        dataSource={tasks} 
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tasks`,
          pageSizeOptions: ['5', '10', '20', '50']
        }}
        scroll={{ x: 800 }}
        size="middle"
        style={{
          '--ant-table-header-bg': 'var(--bg-tertiary)',
          '--ant-table-row-hover-bg': 'var(--primary-50)',
        } as React.CSSProperties}
      />
    </div>
  )
}

export default TaskTable