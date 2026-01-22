import React from 'react'
import dynamic from 'next/dynamic'

// 1. 引用新路径：blog-manager
const AdminComponent = dynamic(
  () => import('../components/blog-manager/AdminDashboard'),
  { 
    ssr: false,
    loading: () => <p style={{color:'#fff', padding:20}}>正在加载后台组件...</p>
  }
)

// 2. 简单的错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("后台组件崩溃:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: 'red', background: '#222', height: '100vh' }}>
          <h2>后台组件发生了错误</h2>
          <pre>{this.state.error?.toString()}</pre>
          <p>请截图发给技术支持。</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminPage = () => {
  return (
    <div id="admin-container" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#303030', overflow: 'auto' }}>
      <ErrorBoundary>
        <AdminComponent />
      </ErrorBoundary>
    </div>
  )
}

export default AdminPage