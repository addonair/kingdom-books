import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { createOrder } from '../api/orders.js'
import { initializePayment } from '../api/payment.js'
import { applyPromoCode } from '../api/promotions.js'
import { useBrand } from '../context/BrandContext.jsx'

const providers = [
  {
    id: 'mtn',
    name: 'MTN MoMo',
    tagline: 'Mobile Money',
    bg: '#FFCC00',
    fg: '#001a36',
    accent: '#001a36',
  },
  {
    id: 'vodafone',
    name: 'Vodafone Cash',
    tagline: 'Mobile Money',
    bg: '#E60000',
    fg: '#ffffff',
    accent: '#ffffff',
  },
  {
    id: 'airteltigo',
    name: 'AirtelTigo Money',
    tagline: 'Mobile Money',
    bg: '#0C5BA8',
    fg: '#ffffff',
    accent: '#ffffff',
  },
]

const steps = [
  { id: 1, label: 'Delivery' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Confirm' },
]

function ProgressBar({ current }) {
  return (
    <div className="max-w-2xl mx-auto mb-8 md:mb-10">
      <div className="flex items-center">
        {steps.map((s, i) => {
          const done = current > s.id
          const active = current === s.id
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                    done
                      ? 'bg-brand-gold border-brand-gold text-white'
                      : active
                        ? 'bg-white border-brand-gold text-brand-gold'
                        : 'bg-white border-brand-line text-brand-navy/40'
                  }`}
                >
                  {done ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12l5 5 9-11"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    s.id
                  )}
                </div>
                <div
                  className={`text-[11px] mt-1.5 font-semibold whitespace-nowrap ${
                    active || done ? 'text-brand-navy' : 'text-brand-navy/40'
                  }`}
                >
                  {s.label}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-5 transition-colors ${
                    done ? 'bg-brand-gold' : 'bg-brand-line'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Icons ─────────────────────────────────────────────────────────── */

function IconTruck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 5v4h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function IconStore() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconExternalLink() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

/* ── Main component ─────────────────────────────────────────────────── */

function CheckoutPage() {
  const { items, subtotal } = useCart()
  const { user, loading: authLoading } = useAuth()
  const brand = useBrand()
  const location = useLocation()

  const [step, setStep] = useState(1)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')

  const [delivery, setDelivery] = useState({
    fullName: '',
    email: '',
    phone: '',
    deliveryType: 'home', // 'home' | 'pickup'
    houseNo: '',
    street: '',
    community: '',
    city: '',
    gpsCode: '',
  })

  const [mapQuery, setMapQuery] = useState('')
  const [showMap, setShowMap] = useState(false)

  const [providerId, setProviderId] = useState('mtn')
  const [momoPhone, setMomoPhone] = useState('')

  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')

  const deliveryFee =
    delivery.deliveryType === 'pickup'
      ? 0
      : subtotal >= brand.freeDeliveryThreshold
        ? 0
        : brand.deliveryFee

  const discountAmount = promoApplied
    ? Math.round(subtotal * (promoApplied.discount_percent / 100) * 100) / 100
    : 0
  const total = subtotal + deliveryFee - discountAmount

  const canSubmitDelivery =
    delivery.fullName.trim() &&
    delivery.email.trim() &&
    delivery.phone.trim() &&
    (delivery.deliveryType === 'pickup' ||
      (delivery.community.trim() && delivery.city.trim() && delivery.gpsCode.trim()))

  const canPay = momoPhone.trim().length >= 9

  /* helpers */

  const setField = (key, val) => setDelivery((d) => ({ ...d, [key]: val }))

  const handleDeliveryTypeChange = (type) => {
    setDelivery((d) => ({ ...d, deliveryType: type }))
    setShowMap(false)
    setMapQuery('')
  }

  const handlePreviewMap = () => {
    const parts = [
      delivery.houseNo.trim(),
      delivery.street.trim(),
      delivery.community.trim(),
      delivery.city.trim(),
      'Ghana',
    ].filter(Boolean)
    if (parts.length > 1) {
      setMapQuery(parts.join(', '))
      setShowMap(true)
    }
  }

  const mapOpenUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : null

  const mapEmbedSrc = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=15&hl=en`
    : null

  const gpsFinderUrl = `https://www.ghanapostgps.com/`

  /* promo */

  const handleApplyPromo = async () => {
    if (!promoCode.trim() || promoLoading) return
    setPromoLoading(true)
    setPromoError('')
    try {
      const result = await applyPromoCode(promoCode.trim())
      setPromoApplied({
        code: promoCode.trim().toUpperCase(),
        discount_percent: result.discount_percent,
      })
    } catch (err) {
      setPromoError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          'Invalid or expired promo code.',
      )
    } finally {
      setPromoLoading(false)
    }
  }

  /* payment */

  const onPay = async () => {
    if (!canPay || paying) return
    setPayError('')
    setPaying(true)

    const deliveryAddress =
      delivery.deliveryType === 'pickup'
        ? `Pickup — ${brand.contactStoreName || brand.storeName}, ${brand.pickupAddress} (GPS: ${brand.pickupGpsCode})`
        : [
            delivery.houseNo.trim() && `No. ${delivery.houseNo.trim()}`,
            delivery.street.trim(),
            delivery.community.trim(),
            delivery.city.trim(),
            `GPS: ${delivery.gpsCode.trim().toUpperCase()}`,
          ]
            .filter(Boolean)
            .join(', ')

    let order
    try {
      order = await createOrder(
        deliveryAddress,
        'paystack',
        null,
        promoApplied?.code ?? null,
        {
          customerName: delivery.fullName,
          customerPhone: delivery.phone,
          customerEmail: delivery.email || user?.email,
          deliveryType: delivery.deliveryType,
        }
      )
    } catch (err) {
      setPayError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Could not place your order. Please try again.',
      )
      setPaying(false)
      return
    }

    const email = user?.email || delivery.email
    if (order?.id == null || !email || !Number.isFinite(total) || total <= 0) {
      setPayError(
        `Cannot start payment — missing: ${[
          order?.id == null && 'order ID',
          !email && 'email',
          (!Number.isFinite(total) || total <= 0) && 'cart total',
        ]
          .filter(Boolean)
          .join(', ')}`,
      )
      setPaying(false)
      return
    }

    try {
      const { authorizationUrl } = await initializePayment(order.id, email, total)
      window.location.href = authorizationUrl
    } catch (err) {
      setPayError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'We could not start your payment. Please try again.',
      )
      setPaying(false)
    }
  }

  /* styles */

  const inputBase =
    'w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors'

  /* guards */

  if (authLoading) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (items.length === 0) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-gold-soft text-brand-gold flex items-center justify-center mb-5">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.8a2 2 0 002-1.6L21 8H6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy mb-2">
            Your cart is empty
          </h1>
          <p className="text-sm text-brand-navy/60 mb-6">
            Add a few books or stationery items, then come back to check out.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-6 py-3 rounded-lg"
          >
            Browse the Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)] py-8 md:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <div className="text-brand-gold text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5">
            Secure Checkout
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy">
            Complete your order
          </h1>
        </div>

        <ProgressBar current={step} />

        {/* ── Step 1: Delivery ─────────────────────────────────────────── */}
        {step === 1 && (
          <section className="bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-8">
            <h2 className="font-serif text-xl text-brand-navy mb-1">Delivery details</h2>
            <p className="text-sm text-brand-navy/60 mb-6">
              How would you like to receive your order?
            </p>

            {/* Delivery type selector */}
            <div className="grid grid-cols-2 gap-3 mb-7">
              {/* Home delivery card */}
              <button
                type="button"
                onClick={() => handleDeliveryTypeChange('home')}
                className={`flex flex-col items-center gap-2 rounded-xl border-[1.5px] p-4 text-center transition-all ${
                  delivery.deliveryType === 'home'
                    ? 'border-brand-gold bg-brand-gold-soft text-brand-navy shadow-sm'
                    : 'border-brand-line bg-white text-brand-navy/60 hover:border-brand-gold/40'
                }`}
              >
                <span
                  className={`${
                    delivery.deliveryType === 'home' ? 'text-brand-gold' : 'text-brand-navy/40'
                  }`}
                >
                  <IconTruck />
                </span>
                <span className="font-semibold text-sm leading-tight">
                  Home / Community
                  <br />
                  <span className="font-normal text-[11px]">
                    Delivered to your door
                  </span>
                </span>
                {delivery.deliveryType === 'home' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                    Selected
                  </span>
                )}
              </button>

              {/* Store pickup card */}
              <button
                type="button"
                onClick={() => handleDeliveryTypeChange('pickup')}
                className={`flex flex-col items-center gap-2 rounded-xl border-[1.5px] p-4 text-center transition-all ${
                  delivery.deliveryType === 'pickup'
                    ? 'border-brand-gold bg-brand-gold-soft text-brand-navy shadow-sm'
                    : 'border-brand-line bg-white text-brand-navy/60 hover:border-brand-gold/40'
                }`}
              >
                <span
                  className={`${
                    delivery.deliveryType === 'pickup' ? 'text-brand-gold' : 'text-brand-navy/40'
                  }`}
                >
                  <IconStore />
                </span>
                <span className="font-semibold text-sm leading-tight">
                  Pickup at Store
                  <br />
                  <span className="font-normal text-[11px]">Free — collect in person</span>
                </span>
                {delivery.deliveryType === 'pickup' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                    Selected
                  </span>
                )}
              </button>
            </div>

            {/* ── Contact fields (always shown) ───────────────────────── */}
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50 mb-0.5">
                Contact information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">
                    Full name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={delivery.fullName}
                    onChange={(e) => setField('fullName', e.target.value)}
                    placeholder="Ama Mensah"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">
                    Email <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    value={delivery.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="you@example.com"
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">
                  Phone <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  value={delivery.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="+233 24 123 4567"
                  className={inputBase}
                />
              </div>
            </div>

            {/* ── Home delivery address fields ─────────────────────────── */}
            {delivery.deliveryType === 'home' && (
              <div className="mt-6 space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50">
                  Delivery address
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">
                      House / Flat No.{' '}
                      <span className="font-normal text-brand-navy/40">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={delivery.houseNo}
                      onChange={(e) => setField('houseNo', e.target.value)}
                      placeholder="e.g. 5, Flat 2B"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">
                      Street name{' '}
                      <span className="font-normal text-brand-navy/40">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={delivery.street}
                      onChange={(e) => setField('street', e.target.value)}
                      placeholder="e.g. Atomic Road"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">
                      Community / Area <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={delivery.community}
                      onChange={(e) => setField('community', e.target.value)}
                      placeholder="e.g. Atomic Junction, Madina"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">
                      City / Town <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={delivery.city}
                      onChange={(e) => setField('city', e.target.value)}
                      placeholder="e.g. Accra, Tema, Kumasi"
                      className={inputBase}
                    />
                  </div>
                </div>

                {/* GPS code */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] font-semibold text-brand-navy">
                      Ghana Post GPS Code <span className="text-error">*</span>
                    </label>
                    <a
                      href={gpsFinderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-brand-gold hover:underline font-semibold"
                    >
                      Find my GPS code <IconExternalLink />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={delivery.gpsCode}
                    onChange={(e) =>
                      setField('gpsCode', e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))
                    }
                    placeholder="e.g. GA-044-3256"
                    maxLength={12}
                    className={`${inputBase} font-mono tracking-wider`}
                  />
                  <p className="text-[11px] text-brand-navy/50 mt-1.5">
                    Your Ghana Post digital address. Visit{' '}
                    <a
                      href={gpsFinderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-gold hover:underline"
                    >
                      ghanapostgps.com
                    </a>{' '}
                    or open Google Maps and tap your location to find it.
                  </p>
                </div>

                {/* Google Maps preview */}
                <div className="rounded-xl border border-brand-line overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-brand-page border-b border-brand-line">
                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
                      <span className="text-brand-gold">
                        <IconMapPin />
                      </span>
                      Verify your location on the map
                    </div>
                    <button
                      type="button"
                      onClick={handlePreviewMap}
                      disabled={!delivery.community.trim() && !delivery.city.trim()}
                      className="text-[12px] font-bold text-brand-gold hover:text-[#b7830a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {showMap ? 'Refresh map' : 'Preview map →'}
                    </button>
                  </div>

                  {showMap && mapEmbedSrc ? (
                    <div className="relative">
                      <iframe
                        src={mapEmbedSrc}
                        title="Location preview"
                        width="100%"
                        height="240"
                        style={{ border: 0, display: 'block' }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <div className="px-4 py-3 bg-white border-t border-brand-line flex items-center justify-between gap-3">
                        <p className="text-[11px] text-brand-navy/60">
                          Showing: <span className="font-medium text-brand-navy">{mapQuery}</span>
                        </p>
                        <a
                          href={mapOpenUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 flex items-center gap-1.5 text-[12px] font-bold text-brand-gold hover:underline"
                        >
                          Open in Google Maps <IconExternalLink />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-brand-navy/50 bg-white">
                      {delivery.community.trim() || delivery.city.trim() ? (
                        <>
                          Click{' '}
                          <button
                            type="button"
                            onClick={handlePreviewMap}
                            className="text-brand-gold font-semibold hover:underline"
                          >
                            Preview map
                          </button>{' '}
                          to verify your community location.
                        </>
                      ) : (
                        'Enter your community or city above to preview your delivery location.'
                      )}
                    </div>
                  )}
                </div>

                {deliveryFee === 0 && subtotal >= brand.freeDeliveryThreshold ? (
                  <div className="flex items-center gap-2 rounded-xl bg-success-bg border border-success/20 px-4 py-3 text-sm text-success font-semibold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Free delivery — order is above GH₵{brand.freeDeliveryThreshold}
                  </div>
                ) : (
                  <p className="text-[12px] text-brand-navy/55">
                    Delivery fee: <span className="font-semibold text-brand-navy">GH₵ {Number(brand.deliveryFee).toFixed(2)}</span>.{' '}
                    Free on orders above GH₵{brand.freeDeliveryThreshold}.
                  </p>
                )}
              </div>
            )}

            {/* ── Store pickup info card ───────────────────────────────── */}
            {delivery.deliveryType === 'pickup' && (
              <div className="mt-6 rounded-xl border border-brand-gold/30 bg-brand-gold-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-brand-gold/20 flex items-center gap-3">
                  <span className="text-brand-gold">
                    <IconStore />
                  </span>
                  <div>
                    <div className="font-bold text-sm text-brand-navy">{brand.contactStoreName || brand.storeName}</div>
                    <div className="text-[11px] text-brand-gold font-semibold uppercase tracking-wide mt-0.5">
                      Pickup point
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="flex items-start gap-2.5 text-sm text-brand-navy/80">
                    <span className="mt-0.5 shrink-0 text-brand-gold">
                      <IconMapPin />
                    </span>
                    <div>
                      <div className="font-semibold text-brand-navy">{brand.pickupAddress}</div>
                      <div className="text-[12px] text-brand-navy/60 mt-0.5 font-mono">
                        GPS: {brand.pickupGpsCode}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-brand-navy/70">
                    <span className="shrink-0 text-brand-gold">
                      <IconClock />
                    </span>
                    {brand.pickupHours}
                  </div>
                  <p className="text-[12px] text-brand-navy/60 leading-relaxed pt-1 border-t border-brand-gold/20">
                    {brand.pickupDescription}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.pickupAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-gold hover:underline"
                  >
                    View on Google Maps <IconExternalLink />
                  </a>
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-8">
              <Link
                to="/shop"
                className="text-center sm:text-left text-sm font-semibold text-brand-navy/70 hover:text-brand-navy h-11 inline-flex items-center justify-center"
              >
                ← Continue shopping
              </Link>
              <button
                type="button"
                onClick={() => canSubmitDelivery && setStep(2)}
                disabled={!canSubmitDelivery}
                className="bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-8 h-11 rounded-xl disabled:bg-brand-gold/50 disabled:cursor-not-allowed"
              >
                Next → Payment
              </button>
            </div>
          </section>
        )}

        {/* ── Step 2: Payment ──────────────────────────────────────────── */}
        {step === 2 && (
          <section className="bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-8">
            <h2 className="font-serif text-xl text-brand-navy mb-1">Payment</h2>
            <p className="text-sm text-brand-navy/60 mb-6">
              Choose your mobile money provider.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {providers.map((p) => {
                const selected = providerId === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProviderId(p.id)}
                    className={`relative rounded-2xl p-4 text-left transition-all border-[2.5px] ${
                      selected
                        ? 'border-brand-gold shadow-md'
                        : 'border-transparent hover:scale-[1.01]'
                    }`}
                    style={{ background: p.bg, color: p.fg }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 absolute top-3 right-3 transition-colors ${
                        selected ? 'bg-brand-gold border-brand-gold' : 'border-current opacity-60'
                      }`}
                    />
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                      {p.tagline}
                    </div>
                    <div className="font-extrabold text-[15px] mt-1 leading-tight">
                      {p.name}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mb-6">
              <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">
                Mobile Money number
              </label>
              <div className="flex items-stretch border border-brand-line rounded-xl overflow-hidden focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/20 transition-colors">
                <div className="flex items-center gap-2 px-3.5 bg-brand-page border-r border-brand-line shrink-0">
                  <span
                    aria-hidden="true"
                    className="inline-block w-6 h-4 rounded-sm overflow-hidden border border-brand-line"
                  >
                    <span className="block h-1/3 bg-[#CE1126]" />
                    <span className="block h-1/3 bg-[#FCD116]" />
                    <span className="block h-1/3 bg-[#006B3F]" />
                  </span>
                  <span className="text-sm font-semibold text-brand-navy">+233</span>
                </div>
                <input
                  type="tel"
                  value={momoPhone}
                  onChange={(e) =>
                    setMomoPhone(e.target.value.replace(/[^\d\s]/g, ''))
                  }
                  placeholder="24 123 4567"
                  className="flex-1 px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 outline-none bg-transparent"
                />
              </div>
              <p className="text-[11px] text-brand-navy/55 mt-1.5">
                You'll receive a prompt on this number to authorise payment.
              </p>
            </div>

            {/* Promo code */}
            <div className="mb-6">
              <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">
                Promo code
              </label>
              {promoApplied ? (
                <div className="flex items-center justify-between bg-success-bg border border-success/20 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-success font-semibold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-mono">{promoApplied.code}</span>
                    <span className="font-normal text-success/80">
                      — {promoApplied.discount_percent}% off applied
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setPromoApplied(null); setPromoCode('') }}
                    className="text-xs text-brand-navy/50 hover:text-brand-navy transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase())
                        setPromoError('')
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                      placeholder="Enter promo code"
                      className={`${inputBase} flex-1 font-mono`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim() || promoLoading}
                      className="shrink-0 bg-brand-navy hover:bg-brand-navy-soft transition-colors text-white font-bold text-sm px-5 h-11 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {promoLoading ? '…' : 'Apply'}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-error mt-1.5">{promoError}</p>
                  )}
                </>
              )}
            </div>

            {/* Order total summary */}
            <div className="bg-brand-page rounded-xl p-4 mb-6 space-y-1.5 text-sm">
              <div className="flex justify-between text-brand-navy/70">
                <span>Subtotal</span>
                <span>GH₵ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-brand-navy/70">
                <span>{delivery.deliveryType === 'pickup' ? 'Store pickup' : 'Home delivery'}</span>
                <span>{deliveryFee === 0 ? 'Free' : `GH₵ ${deliveryFee.toFixed(2)}`}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-success">
                  <span>Promo ({promoApplied.code})</span>
                  <span>−GH₵ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-brand-navy pt-2 border-t border-brand-line">
                <span>Total</span>
                <span className="text-brand-gold">GH₵ {total.toFixed(2)}</span>
              </div>
            </div>

            {payError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {payError}
              </div>
            )}

            <button
              type="button"
              onClick={onPay}
              disabled={!canPay || paying}
              className="w-full bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-extrabold text-base h-14 rounded-xl shadow-[0_8px_24px_rgba(201,146,10,0.35)] disabled:bg-brand-gold/50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {paying
                ? 'Redirecting to Paystack…'
                : `PAY NOW — GH₵ ${total.toFixed(2)}${promoApplied ? ` (saving GH₵ ${discountAmount.toFixed(2)})` : ''}`}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-semibold text-brand-navy/70 hover:text-brand-navy"
              >
                ← Back to delivery
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage
