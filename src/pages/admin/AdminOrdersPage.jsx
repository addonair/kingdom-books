import { useEffect, useRef, useState } from 'react'
import { getAllOrders, getAdminOrder, updateOrderStatus, deleteAdminOrder, emailCustomer } from '../../api/admin.js'
import { useBrand } from '../../context/BrandContext.jsx'

const TABS = [
  { key: 'all',         label: 'All',        statuses: null },
  { key: 'pending',     label: 'Pending',     statuses: ['pending'] },
  { key: 'confirmed',   label: 'Confirmed',   statuses: ['confirmed'] },
  { key: 'in_progress', label: 'In Progress', statuses: ['packaged', 'out_for_delivery', 'ready_for_pickup'] },
  { key: 'completed',   label: 'Completed',   statuses: ['delivered', 'picked_up'] },
  { key: 'cancelled',   label: 'Cancelled',   statuses: ['cancelled'] },
]

const STATUS_LABELS = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  packaged:         'Packaged',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  ready_for_pickup: 'Ready for Pickup',
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

const NEXT_BUTTON_CLASS = {
  confirmed:        'bg-blue-600 hover:bg-blue-700 text-white border-transparent disabled:bg-blue-600/50',
  packaged:         'bg-purple-600 hover:bg-purple-700 text-white border-transparent disabled:bg-purple-600/50',
  out_for_delivery: 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent disabled:bg-indigo-600/50',
  delivered:        'bg-green-600 hover:bg-green-700 text-white border-transparent disabled:bg-green-600/50',
  ready_for_pickup: 'bg-amber-600 hover:bg-amber-700 text-white border-transparent disabled:bg-amber-600/50',
  picked_up:        'bg-teal-600 hover:bg-teal-700 text-white border-transparent disabled:bg-teal-600/50',
}

const NEXT_BUTTON_LABELS = {
  confirmed:        'Confirm Order',
  packaged:         'Mark Packaged',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Mark Delivered',
  ready_for_pickup: 'Ready for Pickup',
  picked_up:        'Mark Collected',
}

// Full pipeline sequences for each delivery type
const HOME_PIPELINE   = ['pending', 'confirmed', 'packaged', 'out_for_delivery', 'delivered']
const PICKUP_PIPELINE = ['pending', 'confirmed', 'ready_for_pickup', 'picked_up']
const LEGACY_PIPELINE = ['pending', 'processing', 'delivered']

const PIPELINE_STEP_LABEL = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  packaged:         'Packaged',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  ready_for_pickup: 'Ready for Pickup',
  picked_up:        'Collected',
  processing:       'Processing',
}

function getNextStatus(status, deliveryType) {
  const isPickup = deliveryType === 'pickup'
  switch (status) {
    case 'pending':          return 'confirmed'
    case 'confirmed':        return isPickup ? 'ready_for_pickup' : 'packaged'
    case 'packaged':         return 'out_for_delivery'
    case 'out_for_delivery': return 'delivered'
    case 'ready_for_pickup': return 'picked_up'
    case 'processing':       return 'delivered'
    default:                 return null
  }
}

/* ── Mini pipeline progress dots ─────────────────────────────────────────── */

function MiniPipeline({ status, deliveryType }) {
  if (!status || status === 'cancelled') return null
  const isPickup = deliveryType === 'pickup'
  const steps = status === 'processing' ? LEGACY_PIPELINE
    : isPickup ? PICKUP_PIPELINE : HOME_PIPELINE
  const currentIdx = steps.findIndex((s) => s === status)
  if (currentIdx === -1) return null

  return (
    <div className="flex items-center gap-[3px] mt-1.5">
      {steps.map((step, i) => {
        const done   = i < currentIdx
        const active = i === currentIdx
        return (
          <div key={step} className="flex items-center gap-[3px]">
            <div
              title={PIPELINE_STEP_LABEL[step] || step}
              className={`w-2 h-2 rounded-full transition-colors ${
                done   ? 'bg-brand-gold'
                : active ? 'bg-brand-gold shadow-[0_0_0_3px_rgba(201,146,10,0.18)]'
                : 'bg-brand-line'
              }`}
            />
            {i < steps.length - 1 && (
              <div className={`w-3 h-px ${done ? 'bg-brand-gold' : 'bg-brand-line'}`} />
            )}
          </div>
        )
      })}
      <span className="ml-1 text-[9px] font-bold text-brand-navy/35 leading-none">
        {currentIdx + 1}/{steps.length}
      </span>
    </div>
  )
}

/* ── Status & delivery badges ─────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase()
  const cls = statusStyles[key] || 'bg-brand-page text-brand-navy/70 border-brand-line'
  return (
    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${cls}`}>
      {STATUS_LABELS[key] || (status ? status[0].toUpperCase() + status.slice(1) : 'Unknown')}
    </span>
  )
}

function DeliveryTypeBadge({ deliveryType }) {
  const isPickup = deliveryType === 'pickup'
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
      isPickup
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-sky-50 text-sky-700 border-sky-200'
    }`}>
      {isPickup ? (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        </svg>
      ) : (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      )}
      {isPickup ? 'Pickup' : 'Home'}
    </span>
  )
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCurrency(value) {
  return `GH₵ ${Number(value || 0).toFixed(2)}`
}

/* ── Order detail modal ───────────────────────────────────────────────────── */

function ModalSection({ title, children }) {
  return (
    <div className="pt-4 first:pt-0">
      <div className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/40 mb-3">{title}</div>
      {children}
    </div>
  )
}

function OrderDetailModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let stale = false
    getAdminOrder(orderId)
      .then((o) => { if (!stale) { setOrder(o); setLoading(false) } })
      .catch((err) => {
        if (!stale) {
          setError(err?.response?.data?.error || 'Could not load order.')
          setLoading(false)
        }
      })
    return () => { stale = true }
  }, [orderId])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const isPickup = order
    ? order.delivery_type === 'pickup' ||
      (order.delivery_address || '').toLowerCase().startsWith('pickup')
    : false

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-navy-deep/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-brand-line w-full max-w-xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-line shrink-0">
          <div>
            <h2 className="font-serif text-lg text-brand-navy">
              Order {order ? `#${order.id}` : `#${orderId}`}
            </h2>
            {order && (
              <p className="text-[12px] text-brand-navy/50 mt-0.5">
                {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                {' · '}
                {new Date(order.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {order && <StatusBadge status={order.status} />}
            <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-brand-navy/50 hover:text-brand-navy hover:bg-brand-page transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4 divide-y divide-brand-line">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
            </div>
          )}
          {error && (
            <div className="bg-error-bg text-error border border-error/20 rounded-xl p-4 text-sm">{error}</div>
          )}
          {order && (
            <>
              {/* Delivery info — most important for fulfilment */}
              <ModalSection title={isPickup ? 'Pickup Location' : 'Delivery Address'}>
                <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                  isPickup ? 'bg-amber-50 border-amber-200' : 'bg-sky-50 border-sky-200'
                }`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isPickup ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                  }`}>
                    {isPickup ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-brand-navy mb-0.5">
                      {isPickup ? 'Store Pickup' : 'Home / Community Delivery'}
                    </div>
                    <div className="text-[13px] text-brand-navy/70 leading-relaxed break-words">
                      {order.delivery_address || '—'}
                    </div>
                  </div>
                </div>
              </ModalSection>

              {/* Customer contact */}
              <ModalSection title="Customer Contact">
                <div className="space-y-2.5 text-sm">
                  {[
                    { label: 'Name',  value: order.customer_name },
                    { label: 'Phone', value: order.customer_phone, href: order.customer_phone ? `tel:${order.customer_phone}` : null },
                    { label: 'Email', value: order.customer_email, href: order.customer_email ? `mailto:${order.customer_email}` : null },
                  ].map(({ label, value, href }) => value ? (
                    <div key={label} className="flex items-center justify-between gap-4">
                      <span className="text-brand-navy/50 shrink-0">{label}</span>
                      {href ? (
                        <a href={href} className="font-semibold text-brand-navy hover:text-brand-gold transition-colors truncate">{value}</a>
                      ) : (
                        <span className="font-semibold text-brand-navy truncate">{value}</span>
                      )}
                    </div>
                  ) : null)}
                </div>
              </ModalSection>

              {/* Items */}
              <ModalSection title={`Items (${(order.items || []).length})`}>
                {!order.items || order.items.length === 0 ? (
                  <p className="text-sm text-brand-navy/50">No item details available.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <div
                          className="w-10 h-12 rounded-lg shrink-0 flex items-end justify-center pb-1"
                          style={{ backgroundColor: item.cover_color || '#e8eaef' }}
                        >
                          <div className="w-6 h-0.5 rounded-full bg-white/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-brand-navy leading-snug truncate">{item.title}</div>
                          <div className="text-[11px] text-brand-navy/50 mt-0.5">
                            {item.author || item.brand || ''}
                            {(item.author || item.brand) ? ' · ' : ''}
                            Qty {item.quantity} × GH₵ {Number(item.price).toFixed(2)}
                          </div>
                        </div>
                        <div className="font-bold text-sm text-brand-navy shrink-0">
                          GH₵ {(Number(item.price) * item.quantity).toFixed(2)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </ModalSection>

              {/* Payment + total */}
              <ModalSection title="Payment">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-navy/50">Method</span>
                    <span className="font-semibold text-brand-navy capitalize">{order.payment_method || '—'}</span>
                  </div>
                  {order.payment_reference && (
                    <div className="flex items-center justify-between">
                      <span className="text-brand-navy/50">Reference</span>
                      <span className="font-mono text-[12px] text-brand-navy">{order.payment_reference}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between font-bold text-brand-navy pt-2 border-t border-brand-line mt-1">
                    <span>Order Total</span>
                    <span className="text-brand-gold">GH₵ {Number(order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </ModalSection>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-brand-line shrink-0">
          <button type="button" onClick={onClose} className="w-full h-10 rounded-xl border border-brand-line text-sm font-semibold text-brand-navy/70 hover:text-brand-navy hover:border-brand-navy/30 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Delete confirmation modal ────────────────────────────────────────────── */

function DeleteOrderModal({ order, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleDelete() {
    setError('')
    setDeleting(true)
    try {
      await deleteAdminOrder(order.id)
      onDeleted(order.id)
      onClose()
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to delete order.')
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-navy-deep/60" onClick={!deleting ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-brand-line w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </div>
        <h2 className="font-serif text-lg text-brand-navy text-center mb-1">Delete Order #{order.id}?</h2>
        <p className="text-sm text-brand-navy/60 text-center leading-relaxed mb-4">
          This will permanently remove the order record. This action cannot be undone.
        </p>
        {error && (
          <div className="bg-error-bg text-error border border-error/20 rounded-xl px-4 py-3 text-[12px] mb-4">{error}</div>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 h-10 rounded-xl border border-brand-line text-sm font-semibold text-brand-navy/70 hover:text-brand-navy transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Deleting…</>
            ) : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Email customer modal ─────────────────────────────────────────────────── */

function EmailModal({ order, onClose }) {
  const brand = useBrand()
  const [subject, setSubject] = useState(`Your ${brand.storeNameShort} order #${order.id}`)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSend(e) {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return
    setError('')
    setSending(true)
    try {
      await emailCustomer(order.id, subject.trim(), message.trim())
      setSent(true)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to send email. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-navy-deep/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-brand-line w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-line">
          <div>
            <h2 className="font-serif text-lg text-brand-navy">Email Customer</h2>
            <p className="text-[12px] text-brand-navy/55 mt-0.5">
              To: <span className="font-semibold text-brand-navy">{order.customer_name}</span>
              {' '}&lt;{order.customer_email}&gt;
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-brand-navy/50 hover:text-brand-navy hover:bg-brand-page transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <p className="font-semibold text-brand-navy mb-1">Email sent!</p>
            <p className="text-sm text-brand-navy/60 mb-4">Your message was delivered to {order.customer_email}.</p>
            <button type="button" onClick={onClose} className="text-sm text-brand-gold font-semibold hover:underline">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-brand-line rounded-xl px-4 h-10 text-sm text-brand-navy focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">Message</label>
              <textarea
                ref={textareaRef}
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${order.customer_name},\n\nWrite your message here…`}
                className="w-full border border-brand-line rounded-xl px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/35 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors resize-none"
              />
            </div>
            {error && <p className="text-error text-[13px]">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 h-10 rounded-xl border border-brand-line text-sm font-semibold text-brand-navy/70 hover:text-brand-navy hover:border-brand-navy/30 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={sending} className="flex-1 h-10 rounded-xl bg-brand-gold hover:bg-[#b7830a] text-white text-sm font-bold transition-colors disabled:bg-brand-gold/50 disabled:cursor-not-allowed">
                {sending ? 'Sending…' : 'Send Email'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/* ── Main page ────────────────────────────────────────────────────────────── */

function AdminOrdersPage() {
  const [tab, setTab] = useState('all')
  const [deliveryFilter, setDeliveryFilter] = useState('all') // 'all' | 'home' | 'pickup'
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [emailOrder, setEmailOrder] = useState(null)
  const [detailOrderId, setDetailOrderId] = useState(null)
  const [deleteOrder, setDeleteOrder] = useState(null)

  function load() {
    setLoading(true)
    setError('')
    getAllOrders()
      .then((rows) => setAllOrders(Array.isArray(rows) ? rows : []))
      .catch((err) => setError(err?.response?.data?.error || 'Failed to load orders.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Apply delivery type filter first, then status tab filter
  const deliveryFiltered = deliveryFilter === 'all'
    ? allOrders
    : deliveryFilter === 'pickup'
      ? allOrders.filter((o) => o.delivery_type === 'pickup')
      : allOrders.filter((o) => o.delivery_type !== 'pickup')

  const tabDef = TABS.find((t) => t.key === tab) || TABS[0]
  const orders = tabDef.statuses
    ? deliveryFiltered.filter((o) => tabDef.statuses.includes((o.status || '').toLowerCase()))
    : deliveryFiltered

  // Badge counts per tab (respect delivery filter but not status tab)
  function tabCount(t) {
    return t.statuses
      ? deliveryFiltered.filter((o) => t.statuses.includes((o.status || '').toLowerCase())).length
      : deliveryFiltered.length
  }

  function handleOrderDeleted(id) {
    setAllOrders((prev) => prev.filter((o) => o.id !== id))
  }

  async function advanceStatus(id, next) {
    setActionError('')
    setUpdatingId(id)
    try {
      await updateOrderStatus(id, next)
      load()
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Failed to update order.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {emailOrder && <EmailModal order={emailOrder} onClose={() => setEmailOrder(null)} />}
      {detailOrderId && <OrderDetailModal orderId={detailOrderId} onClose={() => setDetailOrderId(null)} />}
      {deleteOrder && (
        <DeleteOrderModal
          order={deleteOrder}
          onClose={() => setDeleteOrder(null)}
          onDeleted={handleOrderDeleted}
        />
      )}

      <div className="mb-6">
        <h1 className="font-serif text-3xl text-brand-navy">Orders</h1>
        <p className="text-sm text-brand-navy/60 mt-1">
          {orders.length} order{orders.length === 1 ? '' : 's'} shown
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1.5 mb-3 bg-white border border-brand-line rounded-2xl p-1.5 w-fit">
        {TABS.map((t) => {
          const count = loading ? null : tabCount(t)
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-3.5 h-9 rounded-xl text-[13px] font-bold transition-colors flex items-center gap-1.5 ${
                tab === t.key ? 'bg-brand-navy text-white' : 'text-brand-navy/70 hover:text-brand-navy hover:bg-brand-page'
              }`}
            >
              {t.label}
              {count != null && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  tab === t.key ? 'bg-white/20 text-white' : 'bg-brand-page text-brand-navy/50'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Delivery type filter */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/45">Order type:</span>
        {[
          { key: 'all',    label: 'All Types' },
          { key: 'home',   label: '🚚 Home Delivery' },
          { key: 'pickup', label: '🏪 Store Pickup' },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setDeliveryFilter(f.key)}
            className={`text-[11px] font-bold px-3 h-7 rounded-full border transition-colors ${
              deliveryFilter === f.key
                ? 'bg-brand-navy text-white border-brand-navy'
                : 'bg-white text-brand-navy/60 border-brand-line hover:border-brand-navy/30 hover:text-brand-navy'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {actionError && (
        <div className="bg-error-bg text-error border border-error/20 rounded-xl p-4 text-sm mb-4">{actionError}</div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="bg-error-bg text-error border border-error/20 rounded-xl p-4 text-sm">{error}</div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-brand-line rounded-2xl overflow-hidden">
          {orders.length === 0 ? (
            <div className="px-5 py-16 text-center text-sm text-brand-navy/60">No orders in this view.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-brand-navy/55 border-b border-brand-line bg-brand-page/60">
                    <th className="px-5 py-3 font-bold">Order</th>
                    <th className="px-5 py-3 font-bold">Customer</th>
                    <th className="px-5 py-3 font-bold">Items</th>
                    <th className="px-5 py-3 font-bold">Total</th>
                    <th className="px-5 py-3 font-bold">Status & Progress</th>
                    <th className="px-5 py-3 font-bold">Date</th>
                    <th className="px-5 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const status = (o.status || '').toLowerCase()
                    const next = getNextStatus(status, o.delivery_type)
                    const isTerminal = ['delivered', 'picked_up', 'cancelled'].includes(status)
                    return (
                      <tr key={o.id} className="border-b border-brand-line/60 last:border-0 hover:bg-brand-page/40 transition-colors">
                        {/* Order # + delivery type */}
                        <td className="px-5 py-3">
                          <div className="font-mono font-bold text-brand-navy">#{o.id}</div>
                          <div className="mt-1">
                            <DeliveryTypeBadge deliveryType={o.delivery_type} />
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-3">
                          <div className="font-semibold text-brand-navy truncate max-w-[180px]">{o.customer_name}</div>
                          <div className="text-[12px] text-brand-navy/60 truncate max-w-[180px]">{o.customer_email}</div>
                          {o.customer_phone && (
                            <div className="text-[12px] text-brand-navy/50 truncate max-w-[180px]">{o.customer_phone}</div>
                          )}
                        </td>

                        <td className="px-5 py-3 text-brand-navy/70">{o.items_count}</td>
                        <td className="px-5 py-3 font-bold text-brand-gold">{formatCurrency(o.total)}</td>

                        {/* Status + pipeline progress */}
                        <td className="px-5 py-3">
                          <StatusBadge status={o.status} />
                          <MiniPipeline status={status} deliveryType={o.delivery_type} />
                        </td>

                        <td className="px-5 py-3 text-brand-navy/60 whitespace-nowrap">{formatDate(o.created_at)}</td>

                        {/* Actions */}
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            {/* View details */}
                            <button
                              type="button"
                              onClick={() => setDetailOrderId(o.id)}
                              className="text-[12px] font-bold border border-brand-line text-brand-navy/70 hover:text-brand-navy hover:border-brand-navy/40 transition-colors px-3 h-8 rounded-lg whitespace-nowrap"
                            >
                              View
                            </button>
                            {/* Email */}
                            <button
                              type="button"
                              onClick={() => setEmailOrder(o)}
                              className="text-[12px] font-bold border border-brand-line text-brand-navy/70 hover:text-brand-gold hover:border-brand-gold transition-colors px-3 h-8 rounded-lg whitespace-nowrap"
                            >
                              Email
                            </button>
                            {/* Advance status OR delete */}
                            {!isTerminal && next ? (
                              <button
                                type="button"
                                onClick={() => advanceStatus(o.id, next)}
                                disabled={updatingId === o.id}
                                className={`text-[12px] font-bold border transition-colors px-3 h-8 rounded-lg whitespace-nowrap ${NEXT_BUTTON_CLASS[next] || 'bg-brand-navy hover:bg-brand-navy-soft text-white border-transparent disabled:bg-brand-navy/50'}`}
                              >
                                {updatingId === o.id ? 'Updating…' : (NEXT_BUTTON_LABELS[next] || `→ ${next}`)}
                              </button>
                            ) : isTerminal ? (
                              <button
                                type="button"
                                onClick={() => setDeleteOrder(o)}
                                className="text-[12px] font-bold border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors px-3 h-8 rounded-lg whitespace-nowrap"
                              >
                                Delete
                              </button>
                            ) : (
                              <span className="text-[12px] text-brand-navy/40 px-3">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pipeline legend */}
      {!loading && !error && orders.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 px-1">
          {/* Home delivery pipeline */}
          {deliveryFilter !== 'pickup' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">🚚 Home:</span>
              <div className="flex items-center gap-[3px]">
                {HOME_PIPELINE.map((step, i) => (
                  <div key={step} className="flex items-center gap-[3px]">
                    <div title={PIPELINE_STEP_LABEL[step]} className="w-2 h-2 rounded-full bg-brand-line" />
                    {i < HOME_PIPELINE.length - 1 && <div className="w-3 h-px bg-brand-line/60" />}
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-brand-navy/40">{HOME_PIPELINE.map(s => PIPELINE_STEP_LABEL[s]).join(' → ')}</span>
            </div>
          )}
          {/* Pickup pipeline */}
          {deliveryFilter !== 'home' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">🏪 Pickup:</span>
              <div className="flex items-center gap-[3px]">
                {PICKUP_PIPELINE.map((step, i) => (
                  <div key={step} className="flex items-center gap-[3px]">
                    <div title={PIPELINE_STEP_LABEL[step]} className="w-2 h-2 rounded-full bg-brand-line" />
                    {i < PICKUP_PIPELINE.length - 1 && <div className="w-3 h-px bg-brand-line/60" />}
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-brand-navy/40">{PICKUP_PIPELINE.map(s => PIPELINE_STEP_LABEL[s]).join(' → ')}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-[10px] text-brand-navy/40">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-gold inline-block" /> Done</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_0_3px_rgba(201,146,10,0.18)] inline-block" /> Current</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-line inline-block" /> Upcoming</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage
