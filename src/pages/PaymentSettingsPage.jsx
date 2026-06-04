import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getOrders } from '../api/orders.js'

function PaymentSettingsPage() {
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setListLoading(true)
    getOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.response?.data?.error || 'Could not load payment history.'))
      .finally(() => setListLoading(false))
  }, [user])

  const methods = useMemo(() => {
    const seen = new Map()
    for (const o of orders) {
      const key = o.payment_method || 'Unknown'
      const existing = seen.get(key)
      const at = new Date(o.created_at)
      if (!existing || at > existing.lastUsed) {
        seen.set(key, { method: key, lastUsed: at, count: (existing?.count || 0) + 1 })
      } else {
        seen.set(key, { ...existing, count: existing.count + 1 })
      }
    }
    return Array.from(seen.values()).sort((a, b) => b.lastUsed - a.lastUsed)
  }, [orders])

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
          <h1 className="font-serif text-2xl text-brand-navy mb-1">Payment Settings</h1>
          <p className="text-[13px] text-brand-navy/60 mb-5">How payment works at our store.</p>

          <div className="bg-brand-gold-soft border border-brand-gold/30 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="#C9920A" strokeWidth="1.8" />
                  <path d="M2 10h20" stroke="#C9920A" strokeWidth="1.8" />
                </svg>
              </span>
              <div>
                <p className="font-bold text-brand-navy text-[14px] mb-1">We don't store card details</p>
                <p className="text-[12px] text-brand-navy/70 leading-relaxed">
                  Payments are processed securely through Paystack at checkout. Your card information goes directly to Paystack — we never see or save it.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-muted mb-3">Payment methods used</h2>
          {listLoading && (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
            </div>
          )}
          {!listLoading && error && (
            <div className="bg-error-bg border border-error/20 rounded-xl p-3 text-error text-[13px]">{error}</div>
          )}
          {!listLoading && !error && methods.length === 0 && (
            <p className="text-[13px] text-brand-navy/60 py-2">No payments yet. Place your first order to see your history.</p>
          )}
          {!listLoading && methods.length > 0 && (
            <div className="space-y-2">
              {methods.map((m) => (
                <div key={m.method} className="flex items-center justify-between bg-brand-page rounded-xl px-4 py-3">
                  <div>
                    <p className="text-[14px] font-bold text-brand-navy">{m.method}</p>
                    <p className="text-[12px] text-brand-navy/60">Used {m.count} time{m.count === 1 ? '' : 's'}</p>
                  </div>
                  <p className="text-[12px] text-brand-navy/60">{m.lastUsed.toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentSettingsPage
