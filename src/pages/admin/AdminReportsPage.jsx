import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { getReports } from '../../api/admin.js'

const RANGES = [
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
]

const SLICE_COLORS = [
  '#C9920A',
  '#001a36',
  '#1a7a4a',
  '#2d5fa6',
  '#7c3d9e',
  '#c0392b',
  '#a87100',
]

const ghs = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  maximumFractionDigits: 0,
})

function formatPeriodLabel(period, range) {
  if (!period) return ''
  if (range === 'year') {
    const [y, m] = period.split('-')
    const d = new Date(Number(y), Number(m) - 1, 1)
    return d.toLocaleDateString(undefined, { month: 'short' })
  }
  const d = new Date(period)
  if (Number.isNaN(d.getTime())) return period
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function AdminReportsPage() {
  const [range, setRange] = useState('month')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getReports(range)
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((err) => {
        if (!cancelled)
          setError(err?.response?.data?.error || 'Failed to load reports.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [range])

  const revenueData = (data?.revenue_by_period || []).map((r) => ({
    label: formatPeriodLabel(r.period, range),
    revenue: Number(r.revenue),
  }))
  const categoryData = (data?.category_breakdown || []).map((c) => ({
    name: c.category,
    value: Number(c.revenue),
  }))
  const topProducts = data?.top_products || []

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-brand-navy">Reports</h1>
          <p className="text-sm text-brand-navy/60 mt-1">
            Sales performance and product trends
          </p>
        </div>
        <div className="flex bg-white border border-brand-line rounded-2xl p-1.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`px-4 h-9 rounded-xl text-[13px] font-bold transition-colors ${
                range === r.key
                  ? 'bg-brand-gold text-white'
                  : 'text-brand-navy/70 hover:text-brand-navy hover:bg-brand-page'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-error-bg text-error border border-error/20 rounded-xl p-4 text-sm mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white border border-brand-line rounded-2xl p-5 lg:col-span-2">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-serif text-xl text-brand-navy">Revenue</h2>
              <span className="text-[11px] uppercase tracking-wider text-brand-navy/50 font-bold">
                {range === 'year' ? 'Last 6 months' : range === 'month' ? 'Current month' : 'Last 7 days'}
              </span>
            </div>
            {revenueData.length === 0 ? (
              <div className="py-16 text-center text-sm text-brand-navy/60">
                No revenue in this period yet.
              </div>
            ) : (
              <div style={{ width: '100%', height: 280, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8eaef" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#001a36' }}
                      stroke="#cdd2da"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#001a36' }}
                      stroke="#cdd2da"
                      tickFormatter={(v) => ghs.format(v)}
                      width={70}
                    />
                    <Tooltip
                      formatter={(v) => ghs.format(Number(v))}
                      cursor={{ fill: 'rgba(201, 146, 10, 0.08)' }}
                    />
                    <Bar dataKey="revenue" fill="#C9920A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white border border-brand-line rounded-2xl p-5">
            <h2 className="font-serif text-xl text-brand-navy mb-4">
              Best Selling Categories
            </h2>
            {categoryData.length === 0 ? (
              <div className="py-16 text-center text-sm text-brand-navy/60">
                No category data yet.
              </div>
            ) : (
              <div style={{ width: '100%', height: 280, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => ghs.format(Number(v))} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconSize={10}
                      wrapperStyle={{ fontSize: 11 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white border border-brand-line rounded-2xl p-5 lg:col-span-3">
            <h2 className="font-serif text-xl text-brand-navy mb-4">
              Top 5 Products by Units Sold
            </h2>
            {topProducts.length === 0 ? (
              <div className="py-16 text-center text-sm text-brand-navy/60">
                No product sales in this period yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-brand-navy/55 border-b border-brand-line">
                    <th className="px-2 py-3 font-bold w-12">#</th>
                    <th className="px-2 py-3 font-bold">Product</th>
                    <th className="px-2 py-3 font-bold text-right">Units sold</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={p.id} className="border-b border-brand-line/60 last:border-0">
                      <td className="px-2 py-3 font-bold text-brand-gold">{i + 1}</td>
                      <td className="px-2 py-3 text-brand-navy">{p.title}</td>
                      <td className="px-2 py-3 text-right font-bold text-brand-navy">
                        {p.units_sold}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReportsPage
