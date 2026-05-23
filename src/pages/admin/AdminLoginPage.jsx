import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error)
      window.history.replaceState({}, '')
    }
  }, [location.state])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      if (err.code === 'NOT_ADMIN') {
        setError(err.message)
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy-deep flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-serif text-3xl md:text-4xl text-white">
            Kingdom <span className="text-brand-gold">Books</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-white/50 mt-2">
            Admin Portal
          </div>
        </div>

        <div className="bg-brand-navy rounded-2xl shadow-xl border border-white/10 p-6 md:p-8">
          <div className="mb-6">
            <h1 className="font-serif text-2xl text-white leading-tight">
              Staff Sign In
            </h1>
            <p className="text-sm text-white/60 mt-2">
              Authorized personnel only.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[12px] font-semibold text-white/80 mb-1.5"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-brand-navy-deep border border-white/15 rounded-xl px-4 h-11 text-sm text-white placeholder:text-white/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-[12px] font-semibold text-white/80 mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-navy-deep border border-white/15 rounded-xl px-4 h-11 text-sm text-white placeholder:text-white/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="text-error text-[13px] -mt-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm h-11 rounded-xl mt-2 disabled:bg-brand-gold/50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-white/40 mt-6">
          Kingdom Books Admin · Staff Dashboard
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage
