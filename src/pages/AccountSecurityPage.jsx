import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Modal from '../components/Modal.jsx'

function AccountSecurityPage() {
  const { user, loading, changePassword, closeAccount } = useAuth()
  const navigate = useNavigate()
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' })
  const [pwStatus, setPwStatus] = useState(null)
  const [pwSaving, setPwSaving] = useState(false)
  const [closeOpen, setCloseOpen] = useState(false)
  const [closeConfirm, setCloseConfirm] = useState('')
  const [closeError, setCloseError] = useState('')
  const [closing, setClosing] = useState(false)

  if (loading) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  async function onChangePassword(e) {
    e.preventDefault()
    setPwStatus(null)
    if (pwForm.new_password.length < 8) {
      return setPwStatus({ kind: 'error', message: 'New password must be at least 8 characters.' })
    }
    if (pwForm.new_password !== pwForm.confirm) {
      return setPwStatus({ kind: 'error', message: 'Passwords do not match.' })
    }
    setPwSaving(true)
    try {
      await changePassword(pwForm.current_password, pwForm.new_password)
      setPwForm({ current_password: '', new_password: '', confirm: '' })
      setPwStatus({ kind: 'success', message: 'Password updated.' })
    } catch (err) {
      setPwStatus({ kind: 'error', message: err?.response?.data?.error || 'Failed to change password.' })
    } finally {
      setPwSaving(false)
    }
  }

  async function onCloseAccount() {
    setCloseError('')
    setClosing(true)
    try {
      await closeAccount()
      navigate('/', { replace: true })
    } catch (err) {
      setCloseError(err?.response?.data?.error || 'Could not close your account. Please try again.')
      setClosing(false)
    }
  }

  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)] py-6 md:py-10 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <Link to="/account" className="text-[13px] text-brand-navy/60 hover:text-brand-navy inline-flex items-center gap-1 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back to account
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-8 mb-4">
          <h1 className="font-serif text-2xl text-brand-navy mb-1">Account &amp; Security</h1>
          <p className="text-[13px] text-brand-navy/60 mb-6">Change your password.</p>

          <form onSubmit={onChangePassword} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5">Current password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={pwForm.current_password}
                onChange={(e) => setPwForm((f) => ({ ...f, current_password: e.target.value }))}
                required
                className="w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5">New password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={pwForm.new_password}
                onChange={(e) => setPwForm((f) => ({ ...f, new_password: e.target.value }))}
                required
                minLength={8}
                className="w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
              />
              <p className="text-[11px] text-brand-navy/50 mt-1">At least 8 characters.</p>
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5">Confirm new password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                required
                className="w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
              />
            </div>

            {pwStatus && (
              <p className={`text-[13px] ${pwStatus.kind === 'error' ? 'text-error' : 'text-success'}`}>{pwStatus.message}</p>
            )}

            <button
              type="submit"
              disabled={pwSaving}
              className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-[#b7830a] disabled:opacity-50 transition-colors text-white text-[14px] font-bold"
            >
              {pwSaving ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-error/20 p-6 md:p-8">
          <h2 className="font-serif text-lg text-error mb-1">Danger Zone</h2>
          <p className="text-[13px] text-brand-navy/60 mb-4">Close your account permanently. Active orders must be delivered or cancelled first.</p>
          <button
            type="button"
            onClick={() => { setCloseConfirm(''); setCloseError(''); setCloseOpen(true) }}
            className="w-full py-2.5 rounded-xl border-2 border-error/40 text-error font-bold text-[14px] hover:bg-error-bg transition-colors"
          >
            Close my account
          </button>
        </div>
      </div>

      <Modal open={closeOpen} onClose={() => !closing && setCloseOpen(false)} title="Close Account" size="sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-error-bg border border-error/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-error shrink-0 mt-0.5">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[13px] text-error leading-relaxed">
              This permanently deletes your account, saved cart, and wishlist. Your past orders are kept for our records. This cannot be undone.
            </p>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">
              Type <span className="font-mono text-error">close</span> to confirm
            </label>
            <input
              type="text"
              value={closeConfirm}
              onChange={(e) => setCloseConfirm(e.target.value)}
              placeholder="close"
              className="w-full border border-brand-line rounded-xl px-4 py-2.5 text-[14px] text-brand-navy outline-none focus:border-error focus:ring-2 focus:ring-error/20"
            />
          </div>
          {closeError && <p className="text-[13px] text-error">{closeError}</p>}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setCloseOpen(false)}
              disabled={closing}
              className="flex-1 py-2.5 rounded-xl border border-brand-line text-[14px] font-semibold text-brand-navy hover:bg-brand-page transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onCloseAccount}
              disabled={closeConfirm.toLowerCase() !== 'close' || closing}
              className="flex-1 py-2.5 rounded-xl bg-error text-white text-[14px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              {closing ? 'Closing…' : 'Close Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AccountSecurityPage
