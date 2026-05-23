import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getOrder, cancelOrder } from '../api/orders.js'
import Modal from '../components/Modal.jsx'

/* ── Helpers ─────────────────────────────────────────────────────────── */

function formatDate(value, opts) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, opts || { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase()
  const cls = STATUS_STYLES[key] || 'bg-brand-page text-brand-navy/70 border-brand-line'
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'
  return (
    <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  )
}

/* ── Status timeline ─────────────────────────────────────────────────── */

const TIMELINE_STEPS = [
  {
    key: 'pending',
    label: 'Order Placed',
    sub: 'We received your order',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    key: 'processing',
    label: 'Processing',
    sub: 'Packing your items',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    key: 'delivered',
    label: 'Delivered',
    sub: 'Order complete',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
]

function StatusTimeline({ status, createdAt }) {
  const cancelled = status === 'cancelled'

  const stepIndex = { pending: 0, processing: 1, delivered: 2 }
  const current = stepIndex[status] ?? -1

  if (cancelled) {
    return (
      <div className="bg-white rounded-2xl border border-brand-line p-5 sm:p-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50 mb-4">
          Order Status
        </div>
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-sm text-red-700">Order Cancelled</div>
            <div className="text-[12px] text-brand-navy/55 mt-0.5">
              This order was cancelled on {formatDate(createdAt)}
            </div>
          </div>
        </div>
        <p className="mt-4 text-[12px] text-brand-navy/60 bg-brand-page rounded-xl px-4 py-3 border border-brand-line">
          If you were charged, please contact us for a refund. Refunds typically take 3–5 business days.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-line p-5 sm:p-6">
      <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50 mb-5">
        Order Status
      </div>
      <div className="flex items-start gap-0">
        {TIMELINE_STEPS.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <div key={step.key} className="flex items-start flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                    done
                      ? 'bg-brand-gold border-brand-gold text-white'
                      : active
                        ? 'bg-white border-brand-gold text-brand-gold shadow-[0_0_0_4px_rgba(201,146,10,0.15)]'
                        : 'bg-white border-brand-line text-brand-navy/25'
                  }`}
                >
                  {done ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5 9-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>
                {/* Label (hidden on xs) */}
                <div className="mt-2 text-center">
                  <div className={`text-[11px] font-bold whitespace-nowrap ${active ? 'text-brand-navy' : done ? 'text-brand-navy' : 'text-brand-navy/35'}`}>
                    {step.label}
                  </div>
                  <div className={`text-[10px] whitespace-nowrap hidden sm:block mt-0.5 ${active || done ? 'text-brand-navy/55' : 'text-brand-navy/25'}`}>
                    {step.sub}
                  </div>
                </div>
              </div>
              {/* Connector */}
              {i < TIMELINE_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mt-5 mx-1 transition-colors ${done ? 'bg-brand-gold' : 'bg-brand-line'}`} />
              )}
            </div>
          )
        })}
      </div>
      {status === 'pending' && (
        <p className="mt-5 text-[12px] text-brand-navy/60 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
          Your order is confirmed and waiting to be picked up for packing. You can cancel it while it's still pending.
        </p>
      )}
      {status === 'processing' && (
        <p className="mt-5 text-[12px] text-brand-navy/60 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          Your order is being packed. You may still be able to cancel — contact us if you need help urgently.
        </p>
      )}
      {status === 'delivered' && (
        <p className="mt-5 text-[12px] text-success bg-success-bg border border-success/20 rounded-xl px-4 py-3 font-semibold">
          Your order has been delivered. Thank you for shopping with Kingdom Books!
        </p>
      )}
    </div>
  )
}

/* ── Delivery info parser ─────────────────────────────────────────────── */

function DeliveryInfo({ address }) {
  if (!address) return null
  const isPickup = address.startsWith('Pickup —') || address.startsWith('Campus pickup')
  return (
    <div className="bg-white rounded-2xl border border-brand-line p-5 sm:p-6">
      <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50 mb-4">
        Delivery Information
      </div>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPickup ? 'bg-brand-gold-soft text-brand-gold' : 'bg-blue-50 text-blue-600'}`}>
          {isPickup ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1" />
              <path d="M16 8h4l3 5v4h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-brand-navy mb-0.5">
            {isPickup ? 'Store Pickup' : 'Home / Community Delivery'}
          </div>
          <div className="text-[13px] text-brand-navy/70 leading-relaxed break-words">
            {isPickup ? address.replace(/^Pickup — /, '').replace(/^Campus pickup — /, '') : address}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────────────────── */

function OrderDetailPage() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  useEffect(() => {
    if (!user || !id) return
    let stale = false
    getOrder(id)
      .then((o) => { if (!stale) { setOrder(o); setLoading(false) } })
      .catch((err) => {
        if (!stale) {
          setFetchError(err?.response?.data?.error || 'Could not load this order.')
          setLoading(false)
        }
      })
    return () => { stale = true }
  }, [user, id])

  const handleCancel = async () => {
    setCancelError('')
    setCancelling(true)
    try {
      const updated = await cancelOrder(id)
      setOrder((prev) => ({ ...prev, ...updated }))
      setShowCancelModal(false)
    } catch (err) {
      setCancelError(err?.response?.data?.error || 'Could not cancel the order. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  /* guards */
  if (authLoading) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (loading) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-sm border border-brand-line p-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-400 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="font-serif text-xl text-brand-navy mb-2">Order not found</h1>
          <p className="text-sm text-brand-navy/60 mb-5">{fetchError}</p>
          <Link to="/orders" className="inline-block bg-brand-navy hover:bg-brand-navy-soft transition-colors text-white font-bold text-sm px-6 py-3 rounded-xl">
            ← Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  if (!order) return null

  const orderRef = order.order_number || `#${order.id}`
  const total = Number(order.total ?? 0)
  const items = Array.isArray(order.items) ? order.items : []
  const canCancel = order.status === 'pending' || order.status === 'processing'

  return (
    <>
      <div className="bg-brand-page min-h-[calc(100vh-64px)] py-8 md:py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Back link */}
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy/60 hover:text-brand-navy transition-colors mb-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Orders
          </Link>

          {/* Order header */}
          <div className="bg-white rounded-2xl border border-brand-line p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="text-brand-gold text-[11px] uppercase tracking-[0.16em] font-bold mb-1">
                  Your Account
                </div>
                <h1 className="font-serif text-xl sm:text-2xl text-brand-navy">
                  Order {orderRef}
                </h1>
                <div className="text-[13px] text-brand-navy/55 mt-1">
                  Placed {formatDate(order.created_at)} at {formatTime(order.created_at)}
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Quick stats */}
            <div className="mt-5 pt-4 border-t border-brand-line grid grid-cols-3 gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/45 mb-0.5">Items</div>
                <div className="font-bold text-brand-navy text-sm">{items.length}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/45 mb-0.5">Payment</div>
                <div className="font-bold text-brand-navy text-sm capitalize">{order.payment_method || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/45 mb-0.5">Total</div>
                <div className="font-bold text-brand-gold text-sm">GH₵ {total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Status timeline */}
          <StatusTimeline status={order.status} createdAt={order.created_at} />

          {/* Items */}
          <div className="bg-white rounded-2xl border border-brand-line p-5 sm:p-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50 mb-4">
              Items ({items.length})
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-brand-navy/50">No item details available.</p>
            ) : (
              <ul className="divide-y divide-brand-line">
                {items.map((item) => {
                  const itemTotal = Number(item.price ?? 0) * (item.quantity ?? 1)
                  const color = item.cover_color || '#e8eaef'
                  return (
                    <li key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      {/* Color swatch thumbnail */}
                      <div
                        className="w-12 h-14 rounded-lg shrink-0 flex items-end justify-center pb-1.5"
                        style={{ backgroundColor: color }}
                      >
                        <div className="w-8 h-1 rounded-full bg-white/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-brand-navy leading-snug truncate">
                          {item.title}
                        </div>
                        <div className="text-[12px] text-brand-navy/55 mt-0.5">
                          Qty: {item.quantity} · GH₵ {Number(item.price).toFixed(2)} each
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-brand-navy text-sm">
                          GH₵ {itemTotal.toFixed(2)}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Delivery info */}
          <DeliveryInfo address={order.delivery_address} />

          {/* Payment info */}
          <div className="bg-white rounded-2xl border border-brand-line p-5 sm:p-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50 mb-4">
              Payment
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-navy/70">Method</span>
              <span className="font-semibold text-brand-navy capitalize">{order.payment_method || '—'}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2.5">
              <span className="text-brand-navy/70">Reference</span>
              <span className={`font-mono text-[12px] ${order.payment_reference ? 'text-brand-navy' : 'text-brand-navy/40'}`}>
                {order.payment_reference || 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between font-bold text-brand-navy mt-4 pt-3 border-t border-brand-line">
              <span>Order Total</span>
              <span className="text-brand-gold text-base">GH₵ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Cancel section */}
          {canCancel && (
            <div className="bg-white rounded-2xl border border-brand-line p-5 sm:p-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50 mb-3">
                Cancel Order
              </div>
              <p className="text-sm text-brand-navy/65 mb-4 leading-relaxed">
                {order.status === 'pending'
                  ? 'Your order hasn\'t been packed yet. You can cancel it now and contact support if a refund is needed.'
                  : 'Your order is being processed. You can still request a cancellation, but it may already be prepared.'}
              </p>
              <button
                type="button"
                onClick={() => { setCancelError(''); setShowCancelModal(true) }}
                className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 font-bold text-sm px-5 h-10 rounded-xl transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Cancel this order
              </button>
            </div>
          )}

          {/* Help footer */}
          <div className="text-center text-[12px] text-brand-navy/50 pb-4">
            Need help?{' '}
            <Link to="/contact" className="text-brand-gold hover:underline font-semibold">
              Contact support
            </Link>
          </div>
        </div>
      </div>

      {/* Cancel confirmation modal */}
      <Modal
        open={showCancelModal}
        onClose={() => !cancelling && setShowCancelModal(false)}
        title="Cancel this order?"
        size="sm"
        footer={
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              disabled={cancelling}
              className="text-sm font-semibold text-brand-navy/70 hover:text-brand-navy h-10 px-5 rounded-xl border border-brand-line transition-colors disabled:opacity-50"
            >
              Keep Order
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-colors text-white font-bold text-sm h-10 px-6 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {cancelling ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Cancelling…
                </>
              ) : (
                'Yes, Cancel Order'
              )}
            </button>
          </div>
        }
      >
        <p className="text-sm text-brand-navy/70 leading-relaxed">
          Are you sure you want to cancel order <span className="font-bold text-brand-navy">{orderRef}</span>?
          This action cannot be undone.
        </p>
        {order.payment_reference && (
          <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-[12px] text-yellow-800 leading-relaxed">
            A payment reference was recorded for this order. If you were charged, please contact support to request a refund — refunds take 3–5 business days.
          </div>
        )}
        {cancelError && (
          <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[12px] text-red-700">
            {cancelError}
          </div>
        )}
      </Modal>
    </>
  )
}

export default OrderDetailPage
