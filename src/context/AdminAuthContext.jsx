import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { adminLogin, adminGetMe } from '../api/admin.js'
import { ADMIN_TOKEN_KEY } from '../api/client.js'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    adminGetMe()
      .then((u) => {
        if (u?.role === 'admin') {
          setUser(u)
        } else {
          localStorage.removeItem(ADMIN_TOKEN_KEY)
          setUser(null)
        }
      })
      .catch(() => {
        localStorage.removeItem(ADMIN_TOKEN_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user: u } = await adminLogin(email, password)
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
    let resolved = u
    if (!resolved?.role) {
      try {
        resolved = await adminGetMe()
      } catch {
        // fall through with the original user payload
      }
    }
    if (resolved?.role !== 'admin') {
      localStorage.removeItem(ADMIN_TOKEN_KEY)
      setUser(null)
      const err = new Error('You do not have admin access')
      err.code = 'NOT_ADMIN'
      throw err
    }
    setUser(resolved)
    return resolved
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  )

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>')
  return ctx
}
