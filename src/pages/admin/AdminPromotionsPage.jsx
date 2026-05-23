import { useEffect, useState } from 'react'
import Modal from '../../components/Modal.jsx'
import { getPromotions, createPromotion } from '../../api/admin.js'

const inputClass =
  'w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors'
const labelClass =
  'block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5'

const EMPTY_FORM = { code: '', discount_percent: '', expires_at: '' }

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

function StatusBadge({ status }) {
  const styles =
    status === 'active'
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-red-50 text-red-700 border-red-200'
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${styles}`}
    >
      {status}
    </span>
  )
}

function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  function load() {
    setLoading(true)
    setError('')
    getPromotions()
      .then((rows) => setPromotions(Array.isArray(rows) ? rows : []))
      .catch((err) => setError(err?.response?.data?.error || 'Failed to load promotions.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!form.code.trim()) return setFormError('Code is required.')
    const pct = Number(form.discount_percent)
    if (!Number.isFinite(pct) || pct <= 0 || pct > 100) {
      return setFormError('Discount must be between 1 and 100.')
    }
    if (!form.expires_at) return setFormError('Expiry date is required.')

    setSaving(true)
    try {
      await createPromotion({
        code: form.code.trim().toUpperCase(),
        discount_percent: pct,
        expires_at: new Date(form.expires_at).toISOString(),
      })
      setModalOpen(false)
      load()
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Failed to create promotion.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-brand-navy">Promotions</h1>
          <p className="text-sm text-brand-navy/60 mt-1">
            {promotions.length} promo code{promotions.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-5 h-11 rounded-xl"
        >
          + Add New Promotion
        </button>
      </div>

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
                  <th className="px-5 py-3 font-bold">Code</th>
                  <th className="px-5 py-3 font-bold">Discount</th>
                  <th className="px-5 py-3 font-bold">Expires</th>
                  <th className="px-5 py-3 font-bold">Used</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-10 text-center text-sm text-brand-navy/60">
                      No promotions yet — create one to get started.
                    </td>
                  </tr>
                )}
                {promotions.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-brand-line/60 last:border-0 hover:bg-brand-page/40 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono font-bold text-brand-navy uppercase">
                      {p.code}
                    </td>
                    <td className="px-5 py-3 font-bold text-brand-gold">
                      {Number(p.discount_percent).toFixed(0)}%
                    </td>
                    <td className="px-5 py-3 text-brand-navy/70">
                      {formatDate(p.expires_at)}
                    </td>
                    <td className="px-5 py-3 text-brand-navy/80">{p.usage_count}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title="Add New Promotion"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => !saving && setModalOpen(false)}
              disabled={saving}
              className="text-sm font-bold text-brand-navy/70 hover:text-brand-navy px-4 h-10"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="promotion-form"
              disabled={saving}
              className="bg-brand-gold hover:bg-[#b7830a] disabled:opacity-60 transition-colors text-white font-bold text-sm px-5 h-10 rounded-xl"
            >
              {saving ? 'Saving…' : 'Create promotion'}
            </button>
          </div>
        }
      >
        <form id="promotion-form" onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-error-bg text-error border border-error/20 rounded-xl px-4 py-2.5 text-sm">
              {formError}
            </div>
          )}
          <div>
            <label className={labelClass}>Code *</label>
            <input
              className={`${inputClass} font-mono uppercase`}
              value={form.code}
              onChange={(e) =>
                setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
              }
              placeholder="SUMMER20"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Discount % *</label>
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                className={inputClass}
                value={form.discount_percent}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discount_percent: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className={labelClass}>Expires *</label>
              <input
                type="date"
                className={inputClass}
                value={form.expires_at}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expires_at: e.target.value }))
                }
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminPromotionsPage
