import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSettings, updateSettings } from '../../api/admin.js'

/* ── Shared styles ──────────────────────────────────────────────────────── */

const inputClass =
  'w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors'
const labelClass =
  'block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5'

const FORM_KEYS = [
  'free_delivery_threshold',
  'standard_delivery_fee',
  'pickup_address',
  'pickup_gps_code',
  'pickup_hours',
  'pickup_description',
  'pickup_phone',
]

/* ── Small icons ────────────────────────────────────────────────────────── */

function IconTruck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 5v4h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function IconStore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  )
}

function IconExternalLink() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

/* ── Live preview component ─────────────────────────────────────────────── */

function DeliveryPreview({ form, tab, onTabChange }) {
  const threshold = Number(form.free_delivery_threshold) || 50
  const fee = Number(form.standard_delivery_fee) || 15
  const address = form.pickup_address || 'Main Store, Accra, Ghana'
  const gps = form.pickup_gps_code || 'GA-044-0059'
  const hours = form.pickup_hours || 'Mon – Fri: 8:00am – 5:00pm  ·  Sat: 9:00am – 2:00pm'
  const description = form.pickup_description || 'Pick up at our main store counter.'
  const phone = form.pickup_phone || '+233 20 000 0000'

  return (
    <div className="sticky top-8">
      {/* Preview header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50">
          Checkout preview — Step 1
        </div>
        <div className="flex rounded-lg border border-brand-line overflow-hidden text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => onTabChange('home')}
            className={`px-3 py-1.5 transition-colors ${
              tab === 'home'
                ? 'bg-brand-navy text-white'
                : 'bg-white text-brand-navy/60 hover:text-brand-navy'
            }`}
          >
            Home delivery
          </button>
          <button
            type="button"
            onClick={() => onTabChange('pickup')}
            className={`px-3 py-1.5 transition-colors border-l border-brand-line ${
              tab === 'pickup'
                ? 'bg-brand-navy text-white'
                : 'bg-white text-brand-navy/60 hover:text-brand-navy'
            }`}
          >
            Store pickup
          </button>
        </div>
      </div>

      {/* Preview card */}
      <div className="bg-white rounded-2xl border border-brand-line shadow-sm overflow-hidden">
        {/* Simulate the checkout page header */}
        <div className="bg-brand-page border-b border-brand-line px-5 py-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold mb-0.5">
            Secure Checkout
          </div>
          <div className="font-serif text-lg text-brand-navy">Complete your order</div>

          {/* Step bar */}
          <div className="flex items-center mt-3 gap-1">
            {['Delivery', 'Payment', 'Confirm'].map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 ${
                    i === 0 ? 'bg-white border-brand-gold text-brand-gold' : 'bg-white border-brand-line text-brand-navy/30'
                  }`}>
                    {i + 1}
                  </div>
                  <div className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${
                    i === 0 ? 'text-brand-navy' : 'text-brand-navy/30'
                  }`}>{s}</div>
                </div>
                {i < 2 && <div className="flex-1 h-0.5 mx-1.5 -mt-4 bg-brand-line" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="font-serif text-base text-brand-navy mb-1">Delivery details</div>
          <div className="text-[11px] text-brand-navy/55 mb-4">How would you like to receive your order?</div>

          {/* Delivery type cards */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <div className={`flex flex-col items-center gap-1.5 rounded-xl border-[1.5px] p-3 text-center ${
              tab === 'home'
                ? 'border-brand-gold bg-brand-gold-soft text-brand-navy shadow-sm'
                : 'border-brand-line bg-white text-brand-navy/50'
            }`}>
              <span className={tab === 'home' ? 'text-brand-gold' : 'text-brand-navy/30'}>
                <IconTruck />
              </span>
              <span className="font-semibold text-[11px] leading-tight">
                Home / Community
                <br />
                <span className="font-normal text-[10px]">Delivered to your door</span>
              </span>
              {tab === 'home' && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold">Selected</span>
              )}
            </div>

            <div className={`flex flex-col items-center gap-1.5 rounded-xl border-[1.5px] p-3 text-center ${
              tab === 'pickup'
                ? 'border-brand-gold bg-brand-gold-soft text-brand-navy shadow-sm'
                : 'border-brand-line bg-white text-brand-navy/50'
            }`}>
              <span className={tab === 'pickup' ? 'text-brand-gold' : 'text-brand-navy/30'}>
                <IconStore />
              </span>
              <span className="font-semibold text-[11px] leading-tight">
                Pickup at Store
                <br />
                <span className="font-normal text-[10px]">Free — collect in person</span>
              </span>
              {tab === 'pickup' && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold">Selected</span>
              )}
            </div>
          </div>

          {/* Home delivery detail */}
          {tab === 'home' && (
            <div className="space-y-3">
              {/* Stub contact inputs */}
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/40 mb-1">
                Contact information
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-9 rounded-lg border border-brand-line bg-brand-page" />
                <div className="h-9 rounded-lg border border-brand-line bg-brand-page" />
              </div>
              <div className="h-9 rounded-lg border border-brand-line bg-brand-page" />

              {/* Address stubs */}
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/40 mt-3 mb-1">
                Delivery address
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-9 rounded-lg border border-brand-line bg-brand-page" />
                <div className="h-9 rounded-lg border border-brand-line bg-brand-page" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-9 rounded-lg border border-brand-line bg-brand-page" />
                <div className="h-9 rounded-lg border border-brand-line bg-brand-page" />
              </div>
              <div className="h-9 rounded-lg border border-brand-line bg-brand-page" />

              {/* Fee badge */}
              <div className="rounded-xl bg-brand-page border border-brand-line px-3 py-2.5 text-[11px] text-brand-navy/65 mt-1">
                Delivery fee:{' '}
                <span className="font-semibold text-brand-navy">GH₵ {fee.toFixed(2)}</span>.{' '}
                Free on orders above{' '}
                <span className="font-semibold text-brand-navy">GH₵{threshold}</span>.
              </div>
            </div>
          )}

          {/* Store pickup detail */}
          {tab === 'pickup' && (
            <div className="rounded-xl border border-brand-gold/30 bg-brand-gold-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-brand-gold/20 flex items-center gap-2.5">
                <span className="text-brand-gold"><IconStore /></span>
                <div>
                  <div className="font-bold text-[12px] text-brand-navy">Kingdom Books &amp; Stationery</div>
                  <div className="text-[10px] text-brand-gold font-semibold uppercase tracking-wide mt-0.5">
                    Pickup point
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 space-y-2.5">
                <div className="flex items-start gap-2 text-[11px] text-brand-navy/80">
                  <span className="mt-0.5 shrink-0 text-brand-gold"><IconMapPin /></span>
                  <div>
                    <div className="font-semibold text-brand-navy">{address}</div>
                    <div className="text-[10px] text-brand-navy/55 mt-0.5 font-mono">GPS: {gps}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-brand-navy/70">
                  <span className="shrink-0 text-brand-gold"><IconClock /></span>
                  {hours}
                </div>
                {phone && (
                  <div className="flex items-center gap-2 text-[11px] text-brand-navy/70">
                    <span className="shrink-0 text-brand-gold"><IconPhone /></span>
                    {phone}
                  </div>
                )}
                <p className="text-[10px] text-brand-navy/55 leading-relaxed pt-2 border-t border-brand-gold/20">
                  {description}
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-gold">
                  View on Google Maps <IconExternalLink />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-brand-navy/40 mt-3 text-center">
        This is how customers see the checkout delivery step.
      </p>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────────────────── */

function AdminDeliveryPage() {
  const [form, setForm] = useState({
    free_delivery_threshold: '',
    standard_delivery_fee: '',
    pickup_address: '',
    pickup_gps_code: '',
    pickup_hours: '',
    pickup_description: '',
    pickup_phone: '',
  })
  const [previewTab, setPreviewTab] = useState('home')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getSettings()
      .then((s) => {
        if (cancelled) return
        setForm({
          free_delivery_threshold: s.free_delivery_threshold || '50',
          standard_delivery_fee: s.standard_delivery_fee || '15',
          pickup_address: s.pickup_address || '',
          pickup_gps_code: s.pickup_gps_code || '',
          pickup_hours: s.pickup_hours || '',
          pickup_description: s.pickup_description || '',
          pickup_phone: s.pickup_phone || '',
        })
      })
      .catch((err) => {
        if (!cancelled)
          setLoadError(err?.response?.data?.error || 'Failed to load settings.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    setSaving(true)
    try {
      const payload = {}
      for (const k of FORM_KEYS) payload[k] = form[k]
      await updateSettings(payload)
      setStatus({ kind: 'success', message: 'Delivery settings saved.' })
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err?.response?.data?.error || 'Failed to save.',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-brand-navy">Delivery &amp; Pickup</h1>
          <p className="text-sm text-brand-navy/60 mt-1">
            Configure delivery fees and store pickup details shown at checkout.
          </p>
        </div>
        <button
          type="submit"
          form="delivery-form"
          disabled={saving}
          className="shrink-0 bg-brand-gold hover:bg-[#b7830a] disabled:opacity-60 transition-colors text-white font-bold text-sm px-6 h-11 rounded-xl"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {loadError && (
        <div className="bg-error-bg text-error border border-error/20 rounded-xl p-4 text-sm mb-5">
          {loadError}
        </div>
      )}

      {status && (
        <div className={`rounded-xl p-4 text-sm mb-5 border ${
          status.kind === 'success'
            ? 'bg-success-bg text-success border-success/20'
            : 'bg-error-bg text-error border-error/20'
        }`}>
          {status.message}
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex flex-col xl:flex-row gap-6">

        {/* ── Left: Form ──────────────────────────────────────────────── */}
        <div className="w-full xl:w-[520px] shrink-0 space-y-5">
          <form id="delivery-form" onSubmit={handleSubmit} className="space-y-5">

            {/* Delivery Fees */}
            <section className="bg-white border border-brand-line rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-serif text-xl text-brand-navy">Delivery Fees</h2>
                  <p className="text-[13px] text-brand-navy/60 mt-1">
                    Applies to home / community delivery. Store pickup is always free.
                  </p>
                </div>
                <Link
                  to="/admin/settings"
                  className="shrink-0 flex items-center gap-1 text-[11px] text-brand-navy/50 hover:text-brand-gold transition-colors font-semibold"
                >
                  Also in Settings <IconExternalLink />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Free delivery threshold (GH₵)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    className={inputClass}
                    value={form.free_delivery_threshold}
                    onChange={(e) => set('free_delivery_threshold', e.target.value)}
                  />
                  <p className="text-[11px] text-brand-navy/50 mt-1.5">
                    Orders at or above this amount get free delivery.
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Standard delivery fee (GH₵)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    className={inputClass}
                    value={form.standard_delivery_fee}
                    onChange={(e) => set('standard_delivery_fee', e.target.value)}
                  />
                  <p className="text-[11px] text-brand-navy/50 mt-1.5">
                    Charged when order is below the threshold.
                  </p>
                </div>
              </div>
            </section>

            {/* Store Pickup Point */}
            <section className="bg-white border border-brand-line rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="font-serif text-xl text-brand-navy">Store Pickup Point</h2>
                <p className="text-[13px] text-brand-navy/60 mt-1">
                  Shown on the checkout pickup card, the contact page, and order confirmations.
                  Leave blank to use the built-in default.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Store address</label>
                  <input
                    className={inputClass}
                    placeholder="Main Store, Accra, Ghana"
                    value={form.pickup_address}
                    onChange={(e) => set('pickup_address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Ghana Post GPS code</label>
                    <input
                      className={`${inputClass} font-mono tracking-wider`}
                      placeholder="GA-044-0059"
                      value={form.pickup_gps_code}
                      onChange={(e) =>
                        set('pickup_gps_code', e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone number</label>
                    <input
                      type="tel"
                      className={inputClass}
                      placeholder="+233 20 000 0000"
                      value={form.pickup_phone}
                      onChange={(e) => set('pickup_phone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Opening hours</label>
                  <input
                    className={inputClass}
                    placeholder="Mon – Fri: 8:00am – 5:00pm  ·  Sat: 9:00am – 2:00pm"
                    value={form.pickup_hours}
                    onChange={(e) => set('pickup_hours', e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Pickup instructions</label>
                  <textarea
                    rows={3}
                    className={`${inputClass} h-auto py-3 resize-y`}
                    placeholder="Pick up at our main store counter. Your order will be ready within 2 hours of payment confirmation."
                    value={form.pickup_description}
                    onChange={(e) => set('pickup_description', e.target.value)}
                  />
                  <p className="text-[11px] text-brand-navy/50 mt-1.5">
                    Shown on the pickup card below the address and hours.
                  </p>
                </div>
              </div>
            </section>

            {/* Mobile save + status */}
            <div className="xl:hidden flex items-center justify-between gap-4">
              {status && (
                <p className={`text-[13px] ${status.kind === 'success' ? 'text-success' : 'text-error'}`}>
                  {status.message}
                </p>
              )}
              <button
                type="submit"
                disabled={saving}
                className="ml-auto bg-brand-gold hover:bg-[#b7830a] disabled:opacity-60 transition-colors text-white font-bold text-sm px-6 h-11 rounded-xl"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Right: Live preview ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0 hidden xl:block">
          <DeliveryPreview form={form} tab={previewTab} onTabChange={setPreviewTab} />
        </div>
      </div>
    </div>
  )
}

export default AdminDeliveryPage
