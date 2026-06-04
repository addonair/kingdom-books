import { useEffect, useMemo, useState } from 'react'
import {
  getCustomers,
  setCustomerSuspended,
  setCustomerRole,
  deleteCustomer,
  getCustomer,
  getCustomerOrders,
} from '../../api/admin.js'
import Modal from '../../components/Modal.jsx'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

const inputClass =
  'w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors'

const ghs = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  minimumFractionDigits: 2,
})

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() || '').join('') || '?'
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

function AdminCustomersPage() {
  const { user: currentAdmin } = useAdminAuth()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const [roleTarget, setRoleTarget] = useState(null) // { customer, nextRole }
  const [roleSaving, setRoleSaving] = useState(false)
  const [roleError, setRoleError] = useState('')

  const [detailTarget, setDetailTarget] = useState(null) // customer object
  const [detail, setDetail] = useState(null) // { customer, orders }
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  function load() {
    setLoading(true)
    setError('')
    getCustomers()
      .then((rows) => setCustomers(Array.isArray(rows) ? rows : []))
      .catch((err) => setError(err?.response?.data?.error || 'Failed to load customers.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) =>
      `${c.name || ''} ${c.email || ''}`.toLowerCase().includes(q)
    )
  }, [customers, search])

  async function handleSuspend(c) {
    setActionError('')
    setBusyId(c.id)
    try {
      await setCustomerSuspended(c.id, !c.suspended)
      load()
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Failed to update status.')
    } finally {
      setBusyId(null)
    }
  }

  function openDelete(c) {
    setDeleteTarget(c)
    setDeleteError('')
  }

  function closeDelete() {
    if (deleting) return
    setDeleteTarget(null)
    setDeleteError('')
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteCustomer(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (err) {
      setDeleteError(err?.response?.data?.error || 'Failed to delete account.')
    } finally {
      setDeleting(false)
    }
  }

  function openRoleChange(customer, nextRole) {
    setRoleTarget({ customer, nextRole })
    setRoleError('')
  }

  async function confirmRoleChange() {
    if (!roleTarget || roleSaving) return
    setRoleSaving(true)
    setRoleError('')
    try {
      await setCustomerRole(roleTarget.customer.id, roleTarget.nextRole)
      setRoleTarget(null)
      load()
    } catch (err) {
      setRoleError(err?.response?.data?.error || 'Failed to update role.')
    } finally {
      setRoleSaving(false)
    }
  }

  function openDetail(customer) {
    setDetailTarget(customer)
    setDetail(null)
    setDetailError('')
    setDetailLoading(true)
    Promise.all([getCustomer(customer.id), getCustomerOrders(customer.id)])
      .then(([c, orders]) => setDetail({ customer: c, orders: orders || [] }))
      .catch((err) => setDetailError(err?.response?.data?.error || 'Failed to load customer details.'))
      .finally(() => setDetailLoading(false))
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-brand-navy">Customers</h1>
          <p className="text-sm text-brand-navy/60 mt-1">
            {customers.length} account{customers.length === 1 ? '' : 's'}
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className={`${inputClass} sm:w-72`}
        />
      </div>

      {actionError && (
        <div className="bg-error-bg text-error border border-error/20 rounded-xl p-4 text-sm mb-4">
          {actionError}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="bg-error-bg text-error border border-error/20 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-brand-line rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-brand-navy/55 border-b border-brand-line bg-brand-page/60">
                  <th className="px-5 py-3 font-bold">Customer</th>
                  <th className="px-5 py-3 font-bold">Email</th>
                  <th className="px-5 py-3 font-bold">Role</th>
                  <th className="px-5 py-3 font-bold">Orders</th>
                  <th className="px-5 py-3 font-bold">Total spent</th>
                  <th className="px-5 py-3 font-bold">Joined</th>
                  <th className="px-5 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-10 text-center text-sm text-brand-navy/60">
                      No customers found.
                    </td>
                  </tr>
                )}
                {filtered.map((c) => {
                  const isSelf = currentAdmin?.id === c.id
                  const busy = busyId === c.id
                  return (
                    <tr
                      key={c.id}
                      className={`border-b border-brand-line/60 last:border-0 hover:bg-brand-page/40 transition-colors ${
                        c.suspended ? 'opacity-70' : ''
                      }`}
                    >
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => openDetail(c)}
                          className="flex items-center gap-3 text-left group"
                        >
                          <div className="w-9 h-9 rounded-full bg-brand-gold/15 text-brand-gold font-bold text-[12px] flex items-center justify-center shrink-0">
                            {initials(c.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-brand-navy group-hover:text-brand-gold transition-colors truncate max-w-[180px]">
                              {c.name}
                            </div>
                            {c.suspended && (
                              <div className="text-[10px] uppercase tracking-wider font-bold text-error">
                                Suspended
                              </div>
                            )}
                          </div>
                        </button>
                      </td>
                      <td className="px-5 py-3 text-brand-navy/75 truncate max-w-[220px]">
                        {c.email}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={c.role || 'customer'}
                          onChange={(e) => {
                            const nextRole = e.target.value
                            if (nextRole === (c.role || 'customer')) return
                            openRoleChange(c, nextRole)
                          }}
                          disabled={busy || (isSelf && c.role === 'admin')}
                          title={isSelf && c.role === 'admin' ? "You can't demote yourself" : ''}
                          className={`text-[12px] font-bold border rounded-lg px-2 h-8 outline-none disabled:opacity-40 disabled:cursor-not-allowed ${c.role === 'admin' ? 'bg-brand-gold/10 border-brand-gold/40 text-brand-gold' : 'border-brand-line text-brand-navy/80'}`}
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 text-brand-navy/80">{c.total_orders}</td>
                      <td className="px-5 py-3 font-bold text-brand-gold">
                        {ghs.format(Number(c.total_spent || 0))}
                      </td>
                      <td className="px-5 py-3 text-brand-navy/60">
                        {formatDate(c.created_at)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => openDetail(c)}
                            className="text-[12px] font-bold border border-brand-line hover:border-brand-gold hover:text-brand-gold transition-colors px-3 h-8 rounded-lg whitespace-nowrap"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSuspend(c)}
                            disabled={busy || (isSelf && !c.suspended)}
                            title={isSelf && !c.suspended ? "You can't suspend yourself" : ''}
                            className="text-[12px] font-bold border border-brand-line hover:border-warning hover:text-warning disabled:opacity-40 disabled:cursor-not-allowed transition-colors px-3 h-8 rounded-lg whitespace-nowrap"
                          >
                            {busy ? 'Working…' : c.suspended ? 'Unsuspend' : 'Suspend'}
                          </button>
                          <button
                            type="button"
                            onClick={() => openDelete(c)}
                            disabled={busy || isSelf}
                            title={isSelf ? "You can't delete your own account" : ''}
                            className="text-[12px] font-bold border border-brand-line hover:border-error hover:text-error disabled:opacity-40 disabled:cursor-not-allowed transition-colors px-3 h-8 rounded-lg whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={closeDelete}
        title="Delete customer account"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeDelete}
              disabled={deleting}
              className="text-sm font-bold text-brand-navy/70 hover:text-brand-navy px-4 h-10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-error hover:bg-red-700 disabled:opacity-60 transition-colors text-white font-bold text-sm px-5 h-10 rounded-xl"
            >
              {deleting ? 'Deleting…' : 'Yes, delete account'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {deleteError && (
            <div className="bg-error-bg text-error border border-error/20 rounded-xl px-4 py-2.5 text-sm">
              {deleteError}
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-brand-page rounded-xl">
            <div className="w-10 h-10 rounded-full bg-brand-gold/15 text-brand-gold font-bold text-[13px] flex items-center justify-center shrink-0">
              {initials(deleteTarget?.name)}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-brand-navy">{deleteTarget?.name}</div>
              <div className="text-[12px] text-brand-navy/60 truncate">{deleteTarget?.email}</div>
            </div>
          </div>

          <p className="text-sm text-brand-navy/80">
            This will <span className="font-semibold text-brand-navy">permanently delete</span> this
            customer's account and all associated data.
          </p>

          <div className="flex items-start gap-2.5 bg-brand-gold-soft border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-brand-navy/80">
            <svg className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            A goodbye email will be sent to{' '}
            <span className="font-semibold">{deleteTarget?.email}</span> before the account is
            removed. You can edit this email under{' '}
            <span className="font-semibold">Email Templates → Account Goodbye</span>.
          </div>

          <p className="text-[12px] text-brand-navy/50">This action cannot be undone.</p>
        </div>
      </Modal>

      {/* Role change confirmation */}
      <Modal
        open={!!roleTarget}
        onClose={() => !roleSaving && setRoleTarget(null)}
        title="Change role"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setRoleTarget(null)}
              disabled={roleSaving}
              className="text-sm font-bold text-brand-navy/70 hover:text-brand-navy px-4 h-10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmRoleChange}
              disabled={roleSaving}
              className="bg-brand-navy hover:bg-brand-navy-soft disabled:opacity-60 transition-colors text-white font-bold text-sm px-5 h-10 rounded-xl"
            >
              {roleSaving ? 'Saving…' : 'Confirm'}
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          {roleError && (
            <div className="bg-error-bg text-error border border-error/20 rounded-xl px-4 py-2.5 text-sm">{roleError}</div>
          )}
          <p className="text-sm text-brand-navy/80">
            Change <strong>{roleTarget?.customer?.name}</strong>'s role to{' '}
            <strong className={roleTarget?.nextRole === 'admin' ? 'text-brand-gold' : 'text-brand-navy'}>
              {roleTarget?.nextRole}
            </strong>?
          </p>
          {roleTarget?.nextRole === 'admin' && (
            <div className="text-[13px] bg-brand-gold-soft border border-brand-gold/30 rounded-xl p-3 text-brand-navy/80">
              Admins can access the full <strong>Admin Dashboard</strong>, edit products, manage customers, and change store settings.
            </div>
          )}
        </div>
      </Modal>

      {/* Customer detail modal */}
      <Modal
        open={!!detailTarget}
        onClose={() => { setDetailTarget(null); setDetail(null) }}
        title="Customer details"
        size="lg"
      >
        {detailLoading && (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
          </div>
        )}
        {detailError && (
          <div className="bg-error-bg text-error border border-error/20 rounded-xl px-4 py-2.5 text-sm">{detailError}</div>
        )}
        {detail && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-gold/15 text-brand-gold font-bold flex items-center justify-center shrink-0">
                {initials(detail.customer.name)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-bold text-brand-navy">{detail.customer.name}</div>
                  {detail.customer.role === 'admin' && (
                    <span className="text-[10px] bg-brand-gold/15 text-brand-gold font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                  )}
                  {detail.customer.suspended && (
                    <span className="text-[10px] bg-error-bg text-error font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Suspended</span>
                  )}
                </div>
                <div className="text-[13px] text-brand-navy/60">
                  <a href={`mailto:${detail.customer.email}`} className="hover:text-brand-gold">{detail.customer.email}</a>
                </div>
                <div className="text-[12px] text-brand-navy/50 mt-0.5">
                  Joined {formatDate(detail.customer.created_at)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-brand-page rounded-xl p-3">
                <div className="text-[11px] uppercase tracking-wider font-bold text-brand-navy/60">Orders</div>
                <div className="text-xl font-bold text-brand-navy">{detail.customer.total_orders ?? 0}</div>
              </div>
              <div className="bg-brand-page rounded-xl p-3">
                <div className="text-[11px] uppercase tracking-wider font-bold text-brand-navy/60">Lifetime spent</div>
                <div className="text-xl font-bold text-brand-gold">{ghs.format(Number(detail.customer.total_spent || 0))}</div>
              </div>
              <div className="bg-brand-page rounded-xl p-3">
                <div className="text-[11px] uppercase tracking-wider font-bold text-brand-navy/60">Last order</div>
                <div className="text-[13px] font-bold text-brand-navy">
                  {detail.customer.last_order_at ? formatDate(detail.customer.last_order_at) : '—'}
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-brand-navy/60 mb-2">Recent orders</p>
              {detail.orders.length === 0 ? (
                <p className="text-[13px] text-brand-navy/60 py-3">No orders yet.</p>
              ) : (
                <div className="border border-brand-line rounded-xl overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead className="bg-brand-page/60 text-[10px] uppercase tracking-wider text-brand-navy/60">
                      <tr>
                        <th className="px-3 py-2 text-left">Order</th>
                        <th className="px-3 py-2 text-left">Date</th>
                        <th className="px-3 py-2 text-left">Status</th>
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.orders.slice(0, 10).map((o) => (
                        <tr key={o.id} className="border-t border-brand-line/60">
                          <td className="px-3 py-2 font-bold text-brand-navy">#{o.id}</td>
                          <td className="px-3 py-2 text-brand-navy/60">{formatDate(o.created_at)}</td>
                          <td className="px-3 py-2 text-brand-navy/80">{o.status}</td>
                          <td className="px-3 py-2 text-right font-bold text-brand-gold">{ghs.format(Number(o.total || 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AdminCustomersPage
