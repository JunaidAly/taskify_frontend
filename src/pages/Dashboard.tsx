import { useMemo, useState } from 'react'
import { Layout, Tabs, Button, Typography, Select, DatePicker, message, Card, Statistic, Row, Col, Avatar, Dropdown } from 'antd'
import { ClipboardList, Hourglass, Rocket, CheckCircle2, LayoutGrid, Table2, Plus, LogOut, User, Filter, Calendar, Settings, FileUp } from 'lucide-react'
import type { Dayjs } from 'dayjs'
import { useAuth } from '../context/AuthContext'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useCompleteTask, useReorderTasks, useImportTasks } from '../hooks/useTasks'
import type { Task, TaskStatus } from '../types'
import TaskModal from '../components/TaskModal'
import TaskTable from '../components/TaskTable'
import KanbanBoard from '../components/KanbanBoard'
import ImportTasksModal from '../components/ImportTasksModal'

const { Header, Content } = Layout
const { Title, Text } = Typography

type Range = [Dayjs | null, Dayjs | null] | null
type FiltersState = { status?: TaskStatus; range?: Range }

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [filters, setFilters] = useState<FiltersState>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [importOpen, setImportOpen] = useState(false)

  const queryFilters = useMemo(() => ({
    status: filters.status,
    dueFrom: filters.range?.[0]?.toISOString(),
    dueTo: filters.range?.[1]?.toISOString(),
  }), [filters])

  const { data: tasks = [], isLoading } = useTasks(queryFilters)
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const completeTask = useCompleteTask()
  const reorderTasks = useReorderTasks()
  const importTasks = useImportTasks()

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length
    const pending = tasks.filter(t => t.status === 'pending').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const completed = tasks.filter(t => t.status === 'completed').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { total, pending, inProgress, completed, completionRate }
  }, [tasks])

  const onAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const onEdit = (task: Task) => {
    setEditing(task)
    setModalOpen(true)
  }

  const onSubmit = async (payload: { title: string; description?: string; dueDate?: string; status?: TaskStatus }) => {
    try {
      if (editing) {
        await updateTask.mutateAsync({ id: editing._id, payload })
        message.success('Task updated successfully!')
      } else {
        await createTask.mutateAsync(payload)
        message.success('Task created successfully!')
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Action failed. Please try again.')
    }
  }

  const onDelete = async (id: string) => {
    try {
      await deleteTask.mutateAsync(id)
      message.success('Task deleted successfully!')
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Delete failed. Please try again.')
    }
  }

  const onComplete = async (id: string) => {
    try {
      await completeTask.mutateAsync(id)
      message.success('Task marked as completed!')
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Complete failed. Please try again.')
    }
  }

  const onReorder = async (updates: { id: string; status: TaskStatus; order: number }[]) => {
    try {
      await reorderTasks.mutateAsync(updates)
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Reorder failed. Please try again.')
    }
  }

  const onImport = async (file: File, status: TaskStatus) => {
    try {
      const result = await importTasks.mutateAsync({ file, status })
      message.success(`Imported ${result.count} task${result.count === 1 ? '' : 's'} from document!`)
      setImportOpen(false)
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Import failed. Please try again.')
    }
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <User size={14} />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <Settings size={14} />,
      label: 'Settings',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogOut size={14} />,
      label: 'Logout',
      onClick: logout,
    },
  ]

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="dashboard-header">
          <div className="flex items-center gap-4">
            <Title level={2} className="dashboard-title">
              <span className="flex items-center gap-2">
                <ClipboardList size={26} />
                Task Manager
              </span>
            </Title>
          </div>

          <div className="dashboard-user">
            <Text className="dashboard-user-text">
              Welcome back, <strong>{user?.name}</strong>
            </Text>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Avatar
                size="large"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  cursor: 'pointer',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
                icon={<User size={20} style={{ color: '#ffffff' }} />}
              />
            </Dropdown>
          </div>
        </div>
      </Header>

      <Content className="app-content">
        <div className="dashboard-content">
          {/* Statistics Cards */}
          <Row gutter={[20, 20]} style={{ marginBottom: 'var(--space-8)' }}>
            <Col xs={24} sm={12} md={6}>
              <Card className="dashboard-stats-card fade-in" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
                <Statistic
                  title="Total Tasks"
                  value={taskStats.total}
                  valueStyle={{ color: '#0284c7', fontSize: '32px', fontWeight: '700' }}
                  prefix={<ClipboardList size={28} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="dashboard-stats-card fade-in" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
                <Statistic
                  title="Pending"
                  value={taskStats.pending}
                  valueStyle={{ color: '#f59e0b', fontSize: '32px', fontWeight: '700' }}
                  prefix={<Hourglass size={28} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="dashboard-stats-card fade-in" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
                <Statistic
                  title="In Progress"
                  value={taskStats.inProgress}
                  valueStyle={{ color: '#0284c7', fontSize: '32px', fontWeight: '700' }}
                  prefix={<Rocket size={28} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="dashboard-stats-card fade-in" style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
                <Statistic
                  title="Completed"
                  value={taskStats.completed}
                  valueStyle={{ color: '#22c55e', fontSize: '32px', fontWeight: '700' }}
                  prefix={<CheckCircle2 size={28} />}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters and Actions */}
          <Card className="dashboard-filters fade-in">
            <div className="flex flex-wrap items-center gap-4" style={{ width: '100%' }}>
          <div className="flex items-center gap-2" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
            <Filter size={16} style={{ color: '#6b7280' }} />
            <Text strong style={{ color: '#1f2937' }}>Filters:</Text>
          </div>

              <Select
                allowClear
                placeholder="Filter by status"
                value={filters.status}
                onChange={(v) => setFilters((f) => ({ ...f, status: v as TaskStatus | undefined }))}
                options={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Completed', value: 'completed' },
                ]}
                style={{ minWidth: 180, flexShrink: 0 }}
              />

              <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                <Calendar size={16} style={{ color: '#6b7280' }} />
                <DatePicker.RangePicker
                  value={filters.range ?? null}
                  onChange={(v) => setFilters((f) => ({ ...f, range: v }))}
                  placeholder={['Start date', 'End date']}
                />
              </div>

              <div className="flex items-center gap-3 flex-wrap" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <Button
                  icon={<FileUp size={16} />}
                  onClick={() => setImportOpen(true)}
                  size="large"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    height: '40px',
                    paddingLeft: 'var(--space-6)',
                    paddingRight: 'var(--space-6)'
                  }}
                >
                  Import Document
                </Button>
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={onAdd}
                  size="large"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    height: '40px',
                    paddingLeft: 'var(--space-6)',
                    paddingRight: 'var(--space-6)'
                  }}
                >
                  Add New Task
                </Button>
              </div>
            </div>
          </Card>

          {/* Main Content Tabs */}
          <Card className="dashboard-tabs fade-in">
            <Tabs 
              defaultActiveKey="kanban" 
              size="large"
              items={[
                {
                  key: 'kanban',
                  label: (
                    <span className="flex items-center gap-2" style={{ fontWeight: '500' }}>
                      <LayoutGrid size={16} />
                      Kanban Board
                    </span>
                  ),
                  children: (
                    <KanbanBoard
                      tasks={tasks}
                      loading={isLoading}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onComplete={onComplete}
                      onReorder={onReorder}
                    />
                  ),
                },
                {
                  key: 'table',
                  label: (
                    <span className="flex items-center gap-2" style={{ fontWeight: '500' }}>
                      <Table2 size={16} />
                      Table View
                    </span>
                  ),
                  children: (
                    <TaskTable
                      tasks={tasks}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onComplete={onComplete}
                    />
                  ),
                },
              ]} 
            />
          </Card>

          <TaskModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            initial={editing}
            onSubmit={onSubmit}
          />

          <ImportTasksModal
            open={importOpen}
            onClose={() => setImportOpen(false)}
            onImport={onImport}
            loading={importTasks.isPending}
          />
        </div>
      </Content>
    </Layout>
  )
}

export default Dashboard