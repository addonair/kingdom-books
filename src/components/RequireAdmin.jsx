import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

function RequireAdmin() {
  const { user, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-page flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />
  if (user.role !== 'admin') {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ error: 'You do not have admin access' }}
      />
    )
  }

  return <Outlet />
}

export default RequireAdmin
