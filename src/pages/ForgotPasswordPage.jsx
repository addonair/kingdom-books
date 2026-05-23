import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth.js'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setError('')
    setSubmitting(true)
    try {
      await forgotPassword(email.trim())
      setSent(true)
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
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif text-xl md:text-2xl text-brand-navy mb-2">Check your inbox</h2>
              <p className="text-sm text-brand-navy/65 mb-6">
                If <span className="font-semibold text-brand-navy">{email}</span> is linked to an account,
                we've sent password reset instructions. Check your spam folder if you don't see it.
              </p>
              <Link
                to="/login"
                className="text-sm text-brand-gold font-semibold hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="text-brand-gold text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold mb-2">
                  Account recovery
                </div>
                <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy leading-tight">
                  Forgot your password?
                </h1>
                <p className="text-sm text-brand-navy/60 mt-2">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

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
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
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
                  {submitting ? 'Sending…' : 'Send reset link'}
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

export default ForgotPasswordPage
