import { useState } from 'react'
import { Modal, Upload, Select, Typography, Space, message } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { FileUp, UploadCloud } from 'lucide-react'
import type { TaskStatus } from '../types'

const { Text, Title } = Typography
const { Dragger } = Upload

type Props = {
  open: boolean
  onClose: () => void
  onImport: (file: File, status: TaskStatus) => Promise<void>
  loading?: boolean
}

const ImportTasksModal: React.FC<Props> = ({ open, onClose, onImport, loading }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [status, setStatus] = useState<TaskStatus>('pending')

  const reset = () => {
    setFileList([])
    setStatus('pending')
  }

  const handleImport = async () => {
    const file = fileList[0]?.originFileObj as File | undefined
    if (!file) {
      message.warning('Please select a file first')
      return
    }
    await onImport(file, status)
    reset()
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  const uploadProps: UploadProps = {
    accept: '.pdf,.doc,.docx,.txt',
    maxCount: 1,
    fileList,
    beforeUpload: (file) => {
      setFileList([{ uid: file.uid, name: file.name, originFileObj: file } as UploadFile])
      return false
    },
    onRemove: () => setFileList([]),
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={handleImport}
      confirmLoading={loading}
      title={
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: 'var(--primary-100)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileUp size={20} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
              Import Tasks from Document
            </Title>
            <Text type="secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
              Each line in the file becomes a task
            </Text>
          </div>
        </div>
      }
      okText="Import Tasks"
      cancelText="Cancel"
      width={520}
      okButtonProps={{ style: { borderRadius: 'var(--radius-md)', fontWeight: 600 } }}
      cancelButtonProps={{ style: { borderRadius: 'var(--radius-md)' } }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
        <Dragger {...uploadProps} style={{ borderRadius: 'var(--radius-md)' }}>
          <p className="ant-upload-drag-icon" style={{ display: 'flex', justifyContent: 'center' }}>
            <UploadCloud size={32} style={{ color: 'var(--primary-600)' }} />
          </p>
          <p>Click or drag a PDF, Word (.doc/.docx), or text file here</p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
            Each non-empty line becomes a separate task (max 200 tasks per import)
          </p>
        </Dragger>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
            Add tasks to
          </Text>
          <Select<TaskStatus>
            value={status}
            onChange={setStatus}
            style={{ width: '100%' }}
            options={[
              { label: 'Pending', value: 'pending' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Completed', value: 'completed' },
            ]}
          />
        </div>
      </Space>
    </Modal>
  )
}

export default ImportTasksModal
