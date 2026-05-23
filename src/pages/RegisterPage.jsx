import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const passwordsMismatch = password.length > 0 && confirm.length > 0 && password !== confirm
  const canSubmit =
    fullName.trim() &&
    email.trim() &&
    password.length >= 1 &&
    confirm.length >= 1 &&
    !passwordsMismatch

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setError('')
    setSubmitting(true)
    try {
      await register(fullName.trim(), email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputBase =
    'w-full border rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 outline-none transition-colors'

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-page py-10 md:py-16 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-8">
          <div className="mb-6">
            <div className="text-brand-gold text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold mb-2">
              Get started
            </div>
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy leading-tight">
              Create your account
            </h1>
            <p className="text-sm text-brand-navy/60 mt-2">
              Join Kingdom Books for faster checkout and order tracking.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-[12px] font-semibold text-brand-navy mb-1.5"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ama Mensah"
                className={`${inputBase} border-brand-line focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20`}
              />
            </div>

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
                className={`${inputBase} border-brand-line focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20`}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[12px] font-semibold text-brand-navy mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={`${inputBase} border-brand-line focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20`}
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-[12px] font-semibold text-brand-navy mb-1.5"
              >
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                className={`${inputBase} ${
                  passwordsMismatch
                    ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                    : 'border-brand-line focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                }`}
              />
              {passwordsMismatch && (
                <p className="text-error text-[12px] mt-1.5">Passwords do not match.</p>
              )}
            </div>

            {error && (
              <p className="text-error text-[13px] -mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="w-full bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm h-11 rounded-xl mt-2 disabled:bg-brand-gold/50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[13px] text-brand-navy/65 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-gold font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
