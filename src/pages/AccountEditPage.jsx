import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function AccountEditPage() {
  const { user, loading, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) setName(user.name || '')
  }, [user])

  if (loading) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  async function onSubmit(e) {
    e.preventDefault()
    if (!name.trim() || name.trim() === user.name) return
    setStatus(null)
    setSaving(true)
    try {
      await updateProfile({ name: name.trim() })
      setStatus({ kind: 'success', message: 'Profile updated.' })
      setTimeout(() => navigate('/account'), 800)
    } catch (err) {
      setStatus({ kind: 'error', message: err?.response?.data?.error || 'Failed to save.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)] py-6 md:py-10 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <Link to="/account" className="text-[13px] text-brand-navy/60 hover:text-brand-navy inline-flex items-center gap-1 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back to account
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-8">
          <h1 className="font-serif text-2xl text-brand-navy mb-1">Edit Profile</h1>
          <p className="text-[13px] text-brand-navy/60 mb-6">Update your display name.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={255}
                className="w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border border-brand-line bg-brand-page/60 rounded-xl px-4 h-11 text-sm text-brand-navy/60 cursor-not-allowed"
              />
              <p className="text-[11px] text-brand-navy/50 mt-1.5">
                Email changes require a separate verification flow. Contact support if your email needs updating.
              </p>
            </div>

            {status && (
              <p className={`text-[13px] ${status.kind === 'error' ? 'text-error' : 'text-success'}`}>{status.message}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Link to="/account" className="flex-1 py-2.5 rounded-xl border border-brand-line text-[14px] font-semibold text-brand-navy text-center hover:bg-brand-page transition-colors">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || !name.trim() || name.trim() === user.name}
                className="flex-1 py-2.5 rounded-xl bg-brand-gold hover:bg-[#b7830a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white text-[14px] font-bold"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AccountEditPage
