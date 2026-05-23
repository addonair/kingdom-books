import { useEffect, useRef, useState } from 'react'
import { getAllOrders, updateOrderStatus, emailCustomer } from '../../api/admin.js'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'delivered', label: 'Delivered' },
]

const statusStyles = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

const NEXT_STATUS = { pending: 'processing', processing: 'delivered' }
const NEXT_LABEL = { processing: 'Mark Processing', delivered: 'Mark Delivered' }
const NEXT_BUTTON_CLASS = {
  processing: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent disabled:bg-blue-600/50',
  delivered: 'bg-green-600 hover:bg-green-700 text-white border-transparent disabled:bg-green-600/50',
}

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase()
  const cls = statusStyles[key] || 'bg-brand-page text-brand-navy/70 border-brand-line'
  return (
    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${cls}`}>
      {status ? status[0].toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  )
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCurrency(value) {
  return `GH₵ ${Number(value || 0).toFixed(2)}`
}

function EmailModal({ order, onClose }) {
  const [subject, setSubject] = useState(`Your Kingdom Books order #${order.id}`)
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

function AdminOrdersPage() {
  const [tab, setTab] = useState('all')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [emailOrder, setEmailOrder] = useState(null)

  function load(currentTab = tab) {
    setLoading(true)
    setError('')
    getAllOrders(currentTab)
      .then((rows) => setOrders(Array.isArray(rows) ? rows : []))
      .catch((err) => setError(err?.response?.data?.error || 'Failed to load orders.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(tab) }, [tab])

  async function advanceStatus(id, next) {
    setActionError('')
    setUpdatingId(id)
    try {
      await updateOrderStatus(id, next)
      load(tab)
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Failed to update order.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {emailOrder && <EmailModal order={emailOrder} onClose={() => setEmailOrder(null)} />}

      <div className="mb-6">
        <h1 className="font-serif text-3xl text-brand-navy">Orders</h1>
        <p className="text-sm text-brand-navy/60 mt-1">
          {orders.length} order{orders.length === 1 ? '' : 's'} shown
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 bg-white border border-brand-line rounded-2xl p-1.5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 h-9 rounded-xl text-[13px] font-bold transition-colors ${
              tab === t.key ? 'bg-brand-navy text-white' : 'text-brand-navy/70 hover:text-brand-navy hover:bg-brand-page'
            }`}
          >
            {t.label}
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
                    <th className="px-5 py-3 font-bold">Order #</th>
                    <th className="px-5 py-3 font-bold">Customer</th>
                    <th className="px-5 py-3 font-bold">Items</th>
                    <th className="px-5 py-3 font-bold">Total</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold">Date</th>
                    <th className="px-5 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const status = (o.status || '').toLowerCase()
                    const next = NEXT_STATUS[status]
                    return (
                      <tr key={o.id} className="border-b border-brand-line/60 last:border-0 hover:bg-brand-page/40 transition-colors">
                        <td className="px-5 py-3 font-mono font-bold text-brand-navy">#{o.id}</td>
                        <td className="px-5 py-3">
                          <div className="font-semibold text-brand-navy truncate max-w-[180px]">{o.customer_name}</div>
                          <div className="text-[12px] text-brand-navy/60 truncate max-w-[180px]">{o.customer_email}</div>
                        </td>
                        <td className="px-5 py-3 text-brand-navy/70">{o.items_count}</td>
                        <td className="px-5 py-3 font-bold text-brand-gold">{formatCurrency(o.total)}</td>
                        <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                        <td className="px-5 py-3 text-brand-navy/60">{formatDate(o.created_at)}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEmailOrder(o)}
                              className="text-[12px] font-bold border border-brand-line text-brand-navy/70 hover:text-brand-gold hover:border-brand-gold transition-colors px-3 h-8 rounded-lg whitespace-nowrap"
                            >
                              Email
                            </button>
                            {next ? (
                              <button
                                type="button"
                                onClick={() => advanceStatus(o.id, next)}
                                disabled={updatingId === o.id}
                                className={`text-[12px] font-bold border transition-colors px-3 h-8 rounded-lg whitespace-nowrap ${NEXT_BUTTON_CLASS[next]}`}
                              >
                                {updatingId === o.id ? 'Updating…' : NEXT_LABEL[next]}
                              </button>
                            ) : (
                              <span className="text-[12px] text-brand-navy/40">—</span>
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
    </div>
  )
}

export default AdminOrdersPage
