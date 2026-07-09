import { useState } from 'react'
import { Form, Input, Button, Typography, message, Space, Divider } from 'antd'
import { Link } from 'react-router-dom'
import { User, Lock, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const { Title, Text } = Typography

const Login: React.FC = () => {
  const { login } = useAuth()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      await login(values.email, values.password)
      message.success('Welcome back! You have been logged in successfully.')
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <User size={48} style={{ color: 'var(--primary-600)' }} />
          </div>
          <Title level={2} className="auth-title">
            Welcome Back
          </Title>
          <Text className="auth-subtitle">
            Sign in to your account to continue managing your tasks
          </Text>
        </div>

        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          className="auth-form"
          size="large"
        >
          <Form.Item 
            name="email" 
            label={<span style={{ color: '#1f2937', fontWeight: '600' }}>Email Address</span>}
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          > 
            <Input 
              prefix={<Mail size={16} style={{ color: '#6b7280' }} />}
              placeholder="Enter your email address"
              style={{ 
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
            />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            label={<span style={{ color: '#1f2937', fontWeight: '600' }}>Password</span>}
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          > 
            <Input.Password 
              prefix={<Lock size={16} style={{ color: '#6b7280' }} />}
              placeholder="Enter your password"
              style={{ 
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                borderColor: '#d1d5db'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 'var(--space-6)' }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                height: '48px',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                fontSize: 'var(--font-size-base)'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: 'var(--space-6) 0' }}>
          <Text style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
            New to Task Manager?
          </Text>
        </Divider>

        <div className="auth-link">
          <Space>
            <Text style={{ color: 'var(--text-secondary)' }}>
              Don't have an account?
            </Text>
            <Link to="/register" style={{ fontWeight: '600' }}>
              Create Account
            </Link>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default Login