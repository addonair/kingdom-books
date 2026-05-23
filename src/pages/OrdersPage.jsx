import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getOrders } from '../api/orders.js'

const statusStyles = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  default: 'bg-brand-page text-brand-navy/70 border-brand-line',
}

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase()
  const cls = statusStyles[key] || statusStyles.default
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'
  return (
    <span
      className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cls}`}
    >
      {label}
    </span>
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
          setError(
            err?.response?.data?.message || 'Failed to load your orders.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
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
          <h1 className="font-serif text-2xl text-brand-navy mb-2">
            Couldn't load orders
          </h1>
          <p className="text-sm text-brand-navy/60 mb-5">{error}</p>
          <Link
            to="/shop"
            className="inline-block bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-6 py-3 rounded-lg"
          >
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
              <path
                d="M3 7l9-4 9 4v10l-9 4-9-4V7z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M3 7l9 4 9-4M12 11v10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy mb-2">
            No orders yet
          </h1>
          <p className="text-sm text-brand-navy/60 mb-6">
            When you place your first order, it'll appear here so you can track it.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-6 py-3 rounded-lg"
          >
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
          <div className="text-brand-gold text-[11px] uppercase tracking-[0.16em] font-bold mb-1">
            Your Account
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy">
            Your Orders
          </h1>
        </div>
        <ul className="space-y-3">
          {orders.map((o) => {
            const total = Number(o.total ?? o.amount ?? 0)
            const orderRef = o.order_number || `#${o.id}`
            return (
              <li
                key={o.id}
                className="bg-white border border-brand-line rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="font-mono font-bold text-brand-navy text-[15px]">
                    {orderRef}
                  </div>
                  <div className="text-[12px] text-brand-navy/60 mt-0.5">
                    Placed {formatDate(o.created_at || o.date)}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-5">
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wider text-brand-navy/55 font-bold">
                      Total
                    </div>
                    <div className="font-extrabold text-brand-gold text-base">
                      GH₵ {total.toFixed(2)}
                    </div>
                  </div>
                  <Link
                    to={`/orders/${o.id}`}
                    className="border border-brand-line hover:border-brand-gold hover:text-brand-gold transition-colors text-brand-navy font-bold text-[12px] px-4 h-10 rounded-lg flex items-center"
                  >
                    View Details
                  </Link>
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
