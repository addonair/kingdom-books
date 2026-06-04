import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getPreferences, updatePreferences } from '../api/auth.js'

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-brand-gold' : 'bg-brand-line'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
        } self-center`}
      />
    </button>
  )
}

function NotificationPreferencesPage() {
  const { user, loading } = useAuth()
  const [prefs, setPrefs] = useState({ notify_order_updates: true, notify_promotions: false })
  const [prefsLoading, setPrefsLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingKey, setSavingKey] = useState(null)
  const [savedAt, setSavedAt] = useState(0)

  useEffect(() => {
    if (!user) return
    setPrefsLoading(true)
    getPreferences()
      .then((p) => p && setPrefs(p))
      .catch((err) => setError(err?.response?.data?.error || 'Could not load preferences.'))
      .finally(() => setPrefsLoading(false))
  }, [user])

  async function setPref(key, value) {
    setError('')
    setSavingKey(key)
    const prev = prefs
    setPrefs((p) => ({ ...p, [key]: value }))
    try {
      const result = await updatePreferences({ [key]: value })
      if (result) setPrefs(result)
      setSavedAt(Date.now())
    } catch (err) {
      setPrefs(prev)
      setError(err?.response?.data?.error || 'Could not update preference.')
    } finally {
      setSavingKey(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)] py-6 md:py-10 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <Link to="/account" className="text-[13px] text-brand-navy/60 hover:text-brand-navy inline-flex items-center gap-1 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back to account
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-8">
          <h1 className="font-serif text-2xl text-brand-navy mb-1">Notification Preferences</h1>
          <p className="text-[13px] text-brand-navy/60 mb-5">Choose which emails you want from us.</p>

          {prefsLoading && (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
            </div>
          )}

          {!prefsLoading && (
            <div className="space-y-1 divide-y divide-brand-line">
              <div className="flex items-center justify-between py-4">
                <div className="pr-4">
                  <p className="text-[14px] font-bold text-brand-navy">Order status emails</p>
                  <p className="text-[12px] text-brand-navy/60 mt-0.5">Order placed, confirmed, packaged, out for delivery, delivered, and cancelled updates.</p>
                </div>
                <Toggle
                  checked={prefs.notify_order_updates}
                  onChange={(v) => setPref('notify_order_updates', v)}
                  disabled={savingKey === 'notify_order_updates'}
                />
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="pr-4">
                  <p className="text-[14px] font-bold text-brand-navy">Promotional emails</p>
                  <p className="text-[12px] text-brand-navy/60 mt-0.5">Occasional offers, new arrivals, and seasonal updates.</p>
                </div>
                <Toggle
                  checked={prefs.notify_promotions}
                  onChange={(v) => setPref('notify_promotions', v)}
                  disabled={savingKey === 'notify_promotions'}
                />
              </div>
              <div className="flex items-center justify-between py-4 opacity-70">
                <div className="pr-4">
                  <p className="text-[14px] font-bold text-brand-navy">Account &amp; security emails</p>
                  <p className="text-[12px] text-brand-navy/60 mt-0.5">Password reset, password changed, account closure. Always on for your security.</p>
                </div>
                <Toggle checked={true} onChange={() => {}} disabled={true} />
              </div>
            </div>
          )}

          {error && <p className="text-error text-[13px] mt-3">{error}</p>}
          {!error && savedAt > 0 && (
            <p className="text-success text-[12px] mt-3">Saved.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationPreferencesPage
