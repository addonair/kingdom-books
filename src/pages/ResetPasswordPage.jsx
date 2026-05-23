import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../api/auth.js'

function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-brand-page py-10 md:py-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-error-bg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="font-serif text-xl md:text-2xl text-brand-navy mb-2">Invalid link</h2>
            <p className="text-sm text-brand-navy/65 mb-6">
              This password reset link is missing or malformed.
            </p>
            <Link to="/forgot-password" className="text-sm text-brand-gold font-semibold hover:underline">
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await resetPassword(token, password)
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-page py-10 md:py-16 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif text-xl md:text-2xl text-brand-navy mb-2">Password updated!</h2>
              <p className="text-sm text-brand-navy/65 mb-6">
                Your password has been changed. Redirecting you to sign in…
              </p>
              <Link to="/login" className="text-sm text-brand-gold font-semibold hover:underline">
                Sign in now
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="text-brand-gold text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold mb-2">
                  Account recovery
                </div>
                <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy leading-tight">
                  Set a new password
                </h1>
                <p className="text-sm text-brand-navy/60 mt-2">
                  Choose a strong password with at least 8 characters.
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-[12px] font-semibold text-brand-navy">
                      New password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-[12px] text-brand-muted hover:text-brand-navy transition-colors"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="confirm" className="block text-[12px] font-semibold text-brand-navy mb-1.5">
                    Confirm password
                  </label>
                  <input
                    id="confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
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
                  {submitting ? 'Saving…' : 'Save new password'}
                </button>
              </form>

              <p className="text-center text-[13px] text-brand-navy/65 mt-6">
                Remembered it?{' '}
                <Link to="/login" className="text-brand-gold font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
