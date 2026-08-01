import { Modal, Form, Input, DatePicker, Select, Typography, Space, Divider } from 'antd'
import { CheckSquare, Calendar, Flag, FileText } from 'lucide-react'
import dayjs, { type Dayjs } from 'dayjs'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import type { Task, TaskInput, TaskStatus } from '../types'

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
}

const { Title, Text } = Typography

type Props = {
  open: boolean
  onClose: () => void
  initial?: Task | null
  onSubmit: (payload: TaskInput) => Promise<void>
}

const statusOptions: { label: string; value: TaskStatus; color: string }[] = [
  { label: 'Pending', value: 'pending', color: 'var(--warning-600)' },
  { label: 'In Progress', value: 'in_progress', color: 'var(--primary-600)' },
  { label: 'Completed', value: 'completed', color: 'var(--success-600)' },
]

type TaskFormValues = {
  title: string
  description?: string
  dueDate?: Dayjs
  status?: TaskStatus
}

const TaskModal: React.FC<Props> = ({ open, onClose, initial, onSubmit }) => {
  const [form] = Form.useForm<TaskFormValues>()
  const isEditing = !!initial

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const payload: TaskInput = {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
        status: values.status,
      }
      await onSubmit(payload)
      form.resetFields()
      onClose()
    } catch (error) {
      // Form validation errors are handled by Ant Design
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal 
      open={open} 
      onCancel={handleCancel} 
      onOk={handleOk}
      title={
        <div className="flex items-center gap-3">
          <div 
            style={{ 
              backgroundColor: 'var(--primary-100)', 
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckSquare size={20} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </Title>
            <Text type="secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
              {isEditing ? 'Update your task details' : 'Add a new task to your board'}
            </Text>
          </div>
        </div>
      }
      width={600}
      okText={isEditing ? 'Update Task' : 'Create Task'}
      cancelText="Cancel"
      okButtonProps={{
        size: 'large',
        style: { 
          borderRadius: 'var(--radius-md)',
          fontWeight: '600',
          height: '40px',
          paddingLeft: 'var(--space-6)',
          paddingRight: 'var(--space-6)'
        }
      }}
      cancelButtonProps={{
        size: 'large',
        style: { 
          borderRadius: 'var(--radius-md)',
          height: '40px',
          paddingLeft: 'var(--space-6)',
          paddingRight: 'var(--space-6)'
        }
      }}
      className="task-modal"
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        initialValues={{
          title: initial?.title || '',
          description: initial?.description || '',
          dueDate: initial?.dueDate ? dayjs(initial.dueDate) : undefined,
          status: initial?.status || 'pending',
        }}
        style={{ marginTop: 'var(--space-6)' }}
      >
        <Form.Item 
          name="title" 
          label={
            <div className="flex items-center gap-2">
              <CheckSquare size={16} style={{ color: 'var(--text-tertiary)' }} />
              <Text strong style={{ color: 'var(--text-primary)' }}>Task Title</Text>
            </div>
          }
          rules={[
            { required: true, message: 'Please enter a task title' },
            { min: 3, message: 'Title must be at least 3 characters' },
            { max: 100, message: 'Title must be less than 100 characters' }
          ]}
        > 
          <Input 
            placeholder="Enter a descriptive title for your task"
            style={{ borderRadius: 'var(--radius-md)' }}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <div className="flex items-center gap-2">
              <FileText size={16} style={{ color: 'var(--text-tertiary)' }} />
              <Text strong style={{ color: 'var(--text-primary)' }}>Description</Text>
              <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>(Optional)</Text>
            </div>
          }
          getValueFromEvent={(content: string) => content}
          rules={[{ max: 5000, message: 'Description is too long' }]}
        >
          <ReactQuill
            theme="snow"
            placeholder="Add more details about your task..."
            modules={quillModules}
            style={{ borderRadius: 'var(--radius-md)' }}
          />
        </Form.Item>

        <Space.Compact style={{ width: '100%' }}>
          <Form.Item 
            name="dueDate" 
            label={
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: 'var(--text-tertiary)' }} />
                <Text strong style={{ color: 'var(--text-primary)' }}>Due Date</Text>
                <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>(Optional)</Text>
              </div>
            }
            style={{ flex: 1, marginRight: 'var(--space-2)' }}
          > 
            <DatePicker 
              style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              size="large"
              placeholder="Select due date"
              format="MMM DD, YYYY"
            />
          </Form.Item>

          <Form.Item 
            name="status" 
            label={
              <div className="flex items-center gap-2">
                <Flag size={16} style={{ color: 'var(--text-tertiary)' }} />
                <Text strong style={{ color: 'var(--text-primary)' }}>Status</Text>
              </div>
            }
            style={{ flex: 1, marginLeft: 'var(--space-2)' }}
          > 
            <Select 
              options={statusOptions.map(option => ({
                ...option,
                label: (
                  <div className="flex items-center gap-2">
                    <div 
                      style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: option.color 
                      }} 
                    />
                    {option.label}
                  </div>
                )
              }))}
              style={{ borderRadius: 'var(--radius-md)' }}
              size="large"
              placeholder="Select status"
            />
          </Form.Item>
        </Space.Compact>

        {isEditing && (
          <>
            <Divider style={{ margin: 'var(--space-6) 0' }} />
            <div style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              border: '1px solid var(--border-primary)'
            }}>
              <Text type="secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                <strong>Created:</strong> {dayjs(initial?.createdAt).format('MMM DD, YYYY [at] h:mm A')}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                <strong>Last updated:</strong> {dayjs(initial?.updatedAt).format('MMM DD, YYYY [at] h:mm A')}
              </Text>
            </div>
          </>
        )}
      </Form>
    </Modal>
  )
}

export default TaskModal