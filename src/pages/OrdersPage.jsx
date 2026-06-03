import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getOrders } from '../api/orders.js'

const STATUS_LABELS = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  packaged:         'Packaged',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  ready_for_pickup: 'Ready to Collect',
  picked_up:        'Collected',
  processing:       'Processing',
  cancelled:        'Cancelled',
}

const statusStyles = {
  pending:          'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed:        'bg-blue-50 text-blue-700 border-blue-200',
  packaged:         'bg-purple-50 text-purple-700 border-purple-200',
  out_for_delivery: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered:        'bg-green-50 text-green-700 border-green-200',
  ready_for_pickup: 'bg-amber-50 text-amber-700 border-amber-200',
  picked_up:        'bg-teal-50 text-teal-700 border-teal-200',
  processing:       'bg-blue-50 text-blue-700 border-blue-200',
  cancelled:        'bg-red-50 text-red-700 border-red-200',
}

// Pipeline sequences per delivery type
const HOME_PIPELINE   = ['pending', 'confirmed', 'packaged', 'out_for_delivery', 'delivered']
const PICKUP_PIPELINE = ['pending', 'confirmed', 'ready_for_pickup', 'picked_up']
const LEGACY_PIPELINE = ['pending', 'processing', 'delivered']

function detectIsPickup(order) {
  if (order.delivery_type === 'pickup') return true
  if (order.delivery_type === 'home') return false
  const addr = (order.delivery_address || '').toLowerCase()
  return addr.startsWith('pickup') || addr.includes('store pickup')
}

function getPipeline(order) {
  const status = (order.status || '').toLowerCase()
  if (status === 'processing') return LEGACY_PIPELINE
  return detectIsPickup(order) ? PICKUP_PIPELINE : HOME_PIPELINE
}

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase()
  const cls = statusStyles[key] || 'bg-brand-page text-brand-navy/70 border-brand-line'
  return (
    <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cls}`}>
      {STATUS_LABELS[key] || key}
    </span>
  )
}

function DeliveryTypeBadge({ order }) {
  const isPickup = detectIsPickup(order)
  const status = (order.status || '').toLowerCase()
  if (status === 'cancelled') return null
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
      isPickup
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-sky-50 text-sky-600 border-sky-200'
    }`}>
      {isPickup ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      )}
      {isPickup ? 'Store Pickup' : 'Home Delivery'}
    </span>
  )
}

function MiniProgress({ order }) {
  const status = (order.status || '').toLowerCase()
  if (status === 'cancelled') return null
  const pipeline = getPipeline(order)
  const currentIdx = pipeline.findIndex((s) => s === status)
  if (currentIdx === -1) return null

  return (
    <div className="flex items-center gap-[3px]">
      {pipeline.map((step, i) => {
        const done   = i < currentIdx
        const active = i === currentIdx
        return (
          <div key={step} className="flex items-center gap-[3px]">
            <div className={`w-2 h-2 rounded-full transition-colors ${
              done   ? 'bg-brand-gold'
              : active ? 'bg-brand-gold shadow-[0_0_0_3px_rgba(201,146,10,0.15)]'
              : 'bg-brand-line'
            }`} />
            {i < pipeline.length - 1 && (
              <div className={`w-2.5 h-px ${done ? 'bg-brand-gold' : 'bg-brand-line'}`} />
            )}
          </div>
        )
      })}
      <span className="ml-1.5 text-[10px] text-brand-navy/40 font-semibold">
        Step {currentIdx + 1} of {pipeline.length}
      </span>
    </div>
  )
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    setError('')
    getOrders()
      .then((rows) => {
        if (!cancelled) setOrders(Array.isArray(rows) ? rows : [])
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to load your orders.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [user])

  if (!user) return <Navigate to="/login" replace />

  if (loading) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-sm border border-brand-line p-8">
          <h1 className="font-serif text-2xl text-brand-navy mb-2">Couldn't load orders</h1>
          <p className="text-sm text-brand-navy/60 mb-5">{error}</p>
          <Link to="/shop" className="inline-block bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-6 py-3 rounded-lg">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-gold-soft text-brand-gold flex items-center justify-center mb-5">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M3 7l9 4 9-4M12 11v10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy mb-2">No orders yet</h1>
          <p className="text-sm text-brand-navy/60 mb-6">
            When you place your first order, it'll appear here so you can track it.
          </p>
          <Link to="/shop" className="inline-block bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-6 py-3 rounded-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)] py-10 md:py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="text-brand-gold text-[11px] uppercase tracking-[0.16em] font-bold mb-1">Your Account</div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy">Your Orders</h1>
        </div>
        <ul className="space-y-3">
          {orders.map((o) => {
            const total    = Number(o.total ?? o.amount ?? 0)
            const orderRef = o.order_number || `#${o.id}`
            const status   = (o.status || '').toLowerCase()
            const isCancelled = status === 'cancelled'
            return (
              <li
                key={o.id}
                className="bg-white border border-brand-line rounded-2xl p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
                  <div className="flex-1 min-w-0">
                    {/* Status + delivery type */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <StatusBadge status={o.status} />
                      <DeliveryTypeBadge order={o} />
                    </div>

                    {/* Order ref + date */}
                    <div className="font-mono font-bold text-brand-navy text-[15px]">{orderRef}</div>
                    <div className="text-[12px] text-brand-navy/60 mt-0.5 mb-3">
                      Placed {formatDate(o.created_at || o.date)}
                    </div>

                    {/* Progress bar */}
                    {!isCancelled && <MiniProgress order={o} />}
                    {isCancelled && (
                      <div className="text-[11px] text-red-500 font-semibold">This order was cancelled</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4 sm:gap-3">
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wider text-brand-navy/55 font-bold">Total</div>
                      <div className="font-extrabold text-brand-gold text-base">GH₵ {total.toFixed(2)}</div>
                    </div>
                    <Link
                      to={`/orders/${o.id}`}
                      className="border border-brand-line hover:border-brand-gold hover:text-brand-gold transition-colors text-brand-navy font-bold text-[12px] px-4 h-10 rounded-lg flex items-center whitespace-nowrap"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default OrdersPage
