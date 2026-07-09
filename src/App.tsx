import { Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { useAuth } from './context/AuthContext'
import './App.css'

// Custom Ant Design theme
const theme = {
  token: {
    colorPrimary: '#0284c7',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#0284c7',
    borderRadius: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    fontSize: 14,
    colorText: '#1f2937',
    colorTextSecondary: '#6b7280',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#e5e7eb',
    colorBorderSecondary: '#f3f4f6',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    boxShadowSecondary: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  },
  components: {
    Layout: {
      headerBg: '#0284c7',
      headerHeight: 64,
      bodyBg: '#f9fafb',
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
    Button: {
      borderRadius: 8,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 8,
    },
    Select: {
      borderRadius: 8,
    },
    Modal: {
      borderRadius: 12,
    },
    Tabs: {
      borderRadius: 8,
    },
  },
}

function App() {
  const { token } = useAuth()
  
  return (
    <ConfigProvider theme={theme}>
      <AntdApp>
        <div className="app-layout">
          <Routes>
            <Route path="/" element={token ? <Navigate to="/app" replace /> : <Landing />} />
            <Route path="/login" element={token ? <Navigate to="/app" replace /> : <Login />} />
            <Route path="/register" element={token ? <Navigate to="/app" replace /> : <Register />} />
            <Route path="/app" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
