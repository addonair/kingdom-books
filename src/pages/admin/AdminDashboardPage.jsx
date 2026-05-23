import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats, getRecentOrders, getTopSellingProducts } from '../../api/admin.js'

const statusStyles = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

function StatusBadge({ status }) {
  const key = (status || '').toLowerCase()
  const cls = statusStyles[key] || 'bg-brand-page text-brand-navy/70 border-brand-line'
  const label = status ? status[0].toUpperCase() + status.slice(1) : 'Unknown'
  return (
    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  )
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCurrency(value) {
  const n = Number(value || 0)
  return `GH₵ ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function StatCard({ label, value, icon, accent = 'gold' }) {
  const accents = {
    gold: 'bg-brand-gold/10 text-brand-gold',
    navy: 'bg-brand-navy/5 text-brand-navy',
    success: 'bg-success-bg text-success',
    warning: 'bg-warning-bg text-warning',
  }
  return (
    <div className="bg-white border border-brand-line rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accents[accent]}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-wider text-brand-navy/55 font-bold">
          {label}
        </div>
        <div className="font-serif text-2xl text-brand-navy mt-1 truncate">{value}</div>
      </div>
    </div>
  )
}

function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [top, setTop] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    Promise.all([getStats(), getRecentOrders(), getTopSellingProducts()])
      .then(([s, r, t]) => {
        if (cancelled) return
        setStats(s)
        setRecent(r || [])
        setTop(t || [])
      })
      .catch((err) => {
        if (cancelled) return
        setError(err?.response?.data?.error || 'Failed to load dashboard.')
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-brand-navy">Dashboard</h1>
        <p className="text-sm text-brand-navy/60 mt-1">{today}</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="bg-error-bg text-error border border-error/20 rounded-xl p-4 text-sm mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Revenue"
              value={formatCurrency(stats?.totalRevenue)}
              accent="gold"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              }
            />
            <StatCard
              label="Orders Today"
              value={stats?.ordersToday ?? 0}
              accent="navy"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18l-2 13H5L3 6zM8 10v4M16 10v4M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <StatCard
              label="Low Stock"
              value={stats?.lowStockCount ?? 0}
              accent="warning"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 22h20L12 2zM12 9v6M12 18h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <StatCard
              label="Active Customers"
              value={stats?.activeCustomers ?? 0}
              accent="success"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11a4 4 0 100-8 4 4 0 000 8zM2 21a7 7 0 0114 0M16 3.5a4 4 0 010 7M22 21a6 6 0 00-4-5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white border border-brand-line rounded-2xl">
              <header className="flex items-center justify-between px-5 py-4 border-b border-brand-line">
                <h2 className="font-serif text-lg text-brand-navy">Recent Orders</h2>
                <Link
                  to="/admin/orders"
                  className="text-[12px] font-bold text-brand-gold hover:underline"
                >
                  View all
                </Link>
              </header>
              {recent.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-brand-navy/60">
                  No orders yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wider text-brand-navy/55 border-b border-brand-line">
                        <th className="px-5 py-3 font-bold">Order</th>
                        <th className="px-5 py-3 font-bold">Customer</th>
                        <th className="px-5 py-3 font-bold">Items</th>
                        <th className="px-5 py-3 font-bold">Total</th>
                        <th className="px-5 py-3 font-bold">Status</th>
                        <th className="px-5 py-3 font-bold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((o) => (
                        <tr key={o.id} className="border-b border-brand-line/60 last:border-0">
                          <td className="px-5 py-3 font-mono font-bold text-brand-navy">#{o.id}</td>
                          <td className="px-5 py-3 text-brand-navy/80 truncate max-w-[200px]">
                            {o.customer_name}
                          </td>
                          <td className="px-5 py-3 text-brand-navy/70">{o.items_count}</td>
                          <td className="px-5 py-3 font-bold text-brand-gold">
                            {formatCurrency(o.total)}
                          </td>
                          <td className="px-5 py-3">
                            <StatusBadge status={o.status} />
                          </td>
                          <td className="px-5 py-3 text-brand-navy/60">
                            {formatDate(o.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="bg-white border border-brand-line rounded-2xl">
              <header className="px-5 py-4 border-b border-brand-line">
                <h2 className="font-serif text-lg text-brand-navy">Top Selling</h2>
              </header>
              {top.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-brand-navy/60">
                  No sales data yet.
                </div>
              ) : (
                <ul className="p-3">
                  {top.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-page transition-colors"
                    >
                      <div
                        className="w-10 h-12 rounded shadow-sm shrink-0"
                        style={{ backgroundColor: p.cover_color || '#001a36' }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-brand-navy truncate">
                          {p.title}
                        </div>
                        <div className="text-[12px] text-brand-navy/60 truncate">
                          {p.author || p.category_name}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-brand-navy">{p.units_sold}</div>
                        <div className="text-[10px] uppercase tracking-wider text-brand-navy/50">
                          sold
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboardPage
