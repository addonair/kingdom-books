import { useEffect, useState } from 'react'
import {
  getSettings,
  updateSettings,
  changeAdminPassword,
} from '../../api/admin.js'

const inputClass =
  'w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors'
const labelClass =
  'block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5'

const STORE_KEYS = ['store_name', 'store_email', 'store_phone', 'store_address']
const DELIVERY_KEYS = ['free_delivery_threshold', 'standard_delivery_fee']

function SectionCard({ title, description, children }) {
  return (
    <section className="bg-white border border-brand-line rounded-2xl p-6">
      <div className="mb-5">
        <h2 className="font-serif text-xl text-brand-navy">{title}</h2>
        {description && (
          <p className="text-[13px] text-brand-navy/60 mt-1">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

function StatusLine({ status }) {
  if (!status) return null
  const cls =
    status.kind === 'error'
      ? 'text-error'
      : status.kind === 'success'
      ? 'text-success'
      : 'text-brand-navy/60'
  return <p className={`text-[13px] mt-3 ${cls}`}>{status.message}</p>
}

function AdminSettingsPage() {
  const [storeForm, setStoreForm] = useState({
    store_name: '',
    store_email: '',
    store_phone: '',
    store_address: '',
  })
  const [deliveryForm, setDeliveryForm] = useState({
    free_delivery_threshold: '',
    standard_delivery_fee: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [storeStatus, setStoreStatus] = useState(null)
  const [deliveryStatus, setDeliveryStatus] = useState(null)
  const [passwordStatus, setPasswordStatus] = useState(null)
  const [storeSaving, setStoreSaving] = useState(false)
  const [deliverySaving, setDeliverySaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getSettings()
      .then((s) => {
        if (cancelled) return
        setStoreForm({
          store_name: s.store_name || '',
          store_email: s.store_email || '',
          store_phone: s.store_phone || '',
          store_address: s.store_address || '',
        })
        setDeliveryForm({
          free_delivery_threshold: s.free_delivery_threshold || '',
          standard_delivery_fee: s.standard_delivery_fee || '',
        })
      })
      .catch((err) => {
        if (!cancelled)
          setLoadError(err?.response?.data?.error || 'Failed to load settings.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleStoreSubmit(e) {
    e.preventDefault()
    setStoreStatus(null)
    setStoreSaving(true)
    try {
      const payload = {}
      for (const k of STORE_KEYS) payload[k] = storeForm[k]
      await updateSettings(payload)
      setStoreStatus({ kind: 'success', message: 'Store info saved.' })
    } catch (err) {
      setStoreStatus({
        kind: 'error',
        message: err?.response?.data?.error || 'Failed to save.',
      })
    } finally {
      setStoreSaving(false)
    }
  }

  async function handleDeliverySubmit(e) {
    e.preventDefault()
    setDeliveryStatus(null)
    setDeliverySaving(true)
    try {
      const payload = {}
      for (const k of DELIVERY_KEYS) payload[k] = deliveryForm[k]
      await updateSettings(payload)
      setDeliveryStatus({ kind: 'success', message: 'Delivery settings saved.' })
    } catch (err) {
      setDeliveryStatus({
        kind: 'error',
        message: err?.response?.data?.error || 'Failed to save.',
      })
    } finally {
      setDeliverySaving(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setPasswordStatus(null)
    if (!passwordForm.current_password || !passwordForm.new_password) {
      return setPasswordStatus({
        kind: 'error',
        message: 'Both password fields are required.',
      })
    }
    if (passwordForm.new_password.length < 6) {
      return setPasswordStatus({
        kind: 'error',
        message: 'New password must be at least 6 characters.',
      })
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      return setPasswordStatus({
        kind: 'error',
        message: 'New password and confirmation do not match.',
      })
    }
    setPasswordSaving(true)
    try {
      await changeAdminPassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      })
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
      setPasswordStatus({ kind: 'success', message: 'Password updated.' })
    } catch (err) {
      setPasswordStatus({
        kind: 'error',
        message: err?.response?.data?.error || 'Failed to change password.',
      })
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-brand-navy">Settings</h1>
        <p className="text-sm text-brand-navy/60 mt-1">
          Configure store-wide preferences and your admin account.
        </p>
      </div>

      {loadError && (
        <div className="bg-error-bg text-error border border-error/20 rounded-xl p-4 text-sm mb-4">
          {loadError}
        </div>
      )}

      <div className="space-y-5">
        <SectionCard
          title="Store Info"
          description="Public contact details shown around the store."
        >
          <form onSubmit={handleStoreSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Store name</label>
                <input
                  className={inputClass}
                  value={storeForm.store_name}
                  onChange={(e) =>
                    setStoreForm((f) => ({ ...f, store_name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  value={storeForm.store_email}
                  onChange={(e) =>
                    setStoreForm((f) => ({ ...f, store_email: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                value={storeForm.store_phone}
                onChange={(e) =>
                  setStoreForm((f) => ({ ...f, store_phone: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <textarea
                rows={3}
                className={`${inputClass} h-auto py-3 resize-y`}
                value={storeForm.store_address}
                onChange={(e) =>
                  setStoreForm((f) => ({ ...f, store_address: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center justify-end gap-4">
              <StatusLine status={storeStatus} />
              <button
                type="submit"
                disabled={storeSaving}
                className="bg-brand-gold hover:bg-[#b7830a] disabled:opacity-60 transition-colors text-white font-bold text-sm px-5 h-10 rounded-xl"
              >
                {storeSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Delivery Settings"
          description="Used to compute checkout shipping fees."
        >
          <form onSubmit={handleDeliverySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Free delivery threshold (GH₵)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className={inputClass}
                  value={deliveryForm.free_delivery_threshold}
                  onChange={(e) =>
                    setDeliveryForm((f) => ({
                      ...f,
                      free_delivery_threshold: e.target.value,
                    }))
                  }
                />
                <p className="text-[11px] text-brand-navy/50 mt-1">
                  Orders at or above this amount ship free.
                </p>
              </div>
              <div>
                <label className={labelClass}>Standard delivery fee (GH₵)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className={inputClass}
                  value={deliveryForm.standard_delivery_fee}
                  onChange={(e) =>
                    setDeliveryForm((f) => ({
                      ...f,
                      standard_delivery_fee: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <StatusLine status={deliveryStatus} />
              <button
                type="submit"
                disabled={deliverySaving}
                className="bg-brand-gold hover:bg-[#b7830a] disabled:opacity-60 transition-colors text-white font-bold text-sm px-5 h-10 rounded-xl"
              >
                {deliverySaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Account Settings"
          description="Change the password for your admin account."
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Current password</label>
              <input
                type="password"
                autoComplete="current-password"
                className={inputClass}
                value={passwordForm.current_password}
                onChange={(e) =>
                  setPasswordForm((f) => ({ ...f, current_password: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>New password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                  value={passwordForm.new_password}
                  onChange={(e) =>
                    setPasswordForm((f) => ({ ...f, new_password: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Confirm new password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                  value={passwordForm.confirm_password}
                  onChange={(e) =>
                    setPasswordForm((f) => ({
                      ...f,
                      confirm_password: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <StatusLine status={passwordStatus} />
              <button
                type="submit"
                disabled={passwordSaving}
                className="bg-brand-navy hover:bg-brand-navy-deep disabled:opacity-60 transition-colors text-white font-bold text-sm px-5 h-10 rounded-xl"
              >
                {passwordSaving ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  )
}

export default AdminSettingsPage
