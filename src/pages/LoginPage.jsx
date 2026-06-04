import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useBrand } from '../context/BrandContext.jsx'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const brand = useBrand()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const suspended = params.get('suspended') === '1'

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-page py-10 md:py-16 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-8">
          <div className="mb-6">
            <div className="text-brand-gold text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold mb-2">
              Welcome back
            </div>
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy leading-tight">
              {brand.loginHeading}
            </h1>
            <p className="text-sm text-brand-navy/60 mt-2">
              Continue your shopping where you left off.
            </p>
          </div>

          {suspended && (
            <div className="bg-error-bg text-error border border-error/20 rounded-xl p-3 mb-4 text-[13px]">
              Your session ended because this account has been suspended. Please contact support if you think this is a mistake.
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[12px] font-semibold text-brand-navy mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-[12px] font-semibold text-brand-navy"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[12px] text-brand-gold font-semibold hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="text-error text-[13px] -mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm h-11 rounded-xl mt-2 disabled:bg-brand-gold/50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[13px] text-brand-navy/65 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-gold font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
