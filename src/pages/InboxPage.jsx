import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getOrders } from '../api/orders.js'

const STATUS_LABEL = {
  pending: 'placed',
  confirmed: 'confirmed',
  packaged: 'packaged for delivery',
  out_for_delivery: 'out for delivery',
  delivered: 'delivered',
  ready_for_pickup: 'ready for pickup',
  picked_up: 'picked up',
  cancelled: 'cancelled',
  processing: 'processing',
}

const READ_KEY = 'kb_inbox_read'

function loadReadIds() {
  try {
    const raw = localStorage.getItem(READ_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function saveReadIds(set) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(Array.from(set)))
  } catch {
    /* storage full or disabled — silently ignore */
  }
}

function timeAgo(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`
  return d.toLocaleDateString()
}

function InboxPage() {
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [error, setError] = useState('')
  const [readIds, setReadIds] = useState(loadReadIds())

  useEffect(() => {
    if (!user) return
    setListLoading(true)
    getOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.response?.data?.error || 'Could not load your inbox.'))
      .finally(() => setListLoading(false))
  }, [user])

  const messages = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
    return orders
      .filter((o) => new Date(o.created_at).getTime() > cutoff)
      .map((o) => ({
        id: `order-${o.id}-${o.status}`,
        orderId: o.id,
        status: o.status,
        title: `Order #${o.id} ${STATUS_LABEL[o.status] || o.status}`,
        body: o.status === 'delivered' || o.status === 'picked_up'
          ? 'Thanks for shopping with us!'
          : o.status === 'cancelled'
          ? 'This order was cancelled.'
          : `We'll keep you posted as your order progresses.`,
        at: o.created_at,
      }))
  }, [orders])

  if (loading) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  function markAllRead() {
    const next = new Set(readIds)
    for (const m of messages) next.add(m.id)
    setReadIds(next)
    saveReadIds(next)
  }

  function toggleRead(id) {
    const next = new Set(readIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setReadIds(next)
    saveReadIds(next)
  }

  const unreadCount = messages.filter((m) => !readIds.has(m.id)).length

  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)] py-6 md:py-10 px-4 sm:px-6">
      <div className="max-w-md md:max-w-2xl mx-auto">
        <Link to="/account" className="text-[13px] text-brand-navy/60 hover:text-brand-navy inline-flex items-center gap-1 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back to account
        </Link>

        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl text-brand-navy">Inbox</h1>
            <p className="text-[13px] text-brand-navy/60 mt-1">
              Order updates from the last 30 days{unreadCount > 0 && ` · ${unreadCount} new`}.
            </p>
          </div>
          {messages.length > 0 && unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-[12px] font-bold text-brand-gold hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {listLoading && (
          <div className="bg-white rounded-2xl border border-brand-line p-10 flex justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
          </div>
        )}

        {!listLoading && error && (
          <div className="bg-error-bg border border-error/20 rounded-xl p-4 text-error text-sm">{error}</div>
        )}

        {!listLoading && !error && messages.length === 0 && (
          <div className="bg-white rounded-2xl border border-brand-line p-10 text-center">
            <div className="text-[40px] mb-2">📭</div>
            <p className="text-brand-navy font-bold mb-1">No messages yet</p>
            <p className="text-[13px] text-brand-navy/60">Place an order and you'll see status updates here.</p>
          </div>
        )}

        {!listLoading && !error && messages.length > 0 && (
          <div className="bg-white rounded-2xl border border-brand-line overflow-hidden divide-y divide-brand-line">
            {messages.map((m) => {
              const read = readIds.has(m.id)
              return (
                <div
                  key={m.id}
                  onClick={() => toggleRead(m.id)}
                  className={`px-4 py-4 cursor-pointer transition-colors ${read ? 'bg-white' : 'bg-brand-gold-soft/40'} hover:bg-brand-page`}
                >
                  <div className="flex items-start gap-3">
                    {!read && <span className="w-2 h-2 mt-2 rounded-full bg-brand-gold shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className={`text-[14px] ${read ? 'font-medium text-brand-navy/80' : 'font-bold text-brand-navy'} truncate`}>
                          {m.title}
                        </p>
                        <span className="text-[11px] text-brand-navy/50 shrink-0">{timeAgo(m.at)}</span>
                      </div>
                      <p className="text-[13px] text-brand-navy/60 mt-0.5 line-clamp-2">{m.body}</p>
                      <Link
                        to={`/orders/${m.orderId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block text-[12px] text-brand-gold font-bold mt-1.5 hover:underline"
                      >
                        View order →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default InboxPage
