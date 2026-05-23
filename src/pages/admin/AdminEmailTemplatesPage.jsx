import { useEffect, useState } from 'react'
import { getEmailTemplates, updateEmailTemplate } from '../../api/admin.js'

const TEMPLATE_LABELS = {
  order_confirmation: 'Order Confirmation',
  order_processing: 'Order Processing',
  order_delivered: 'Order Delivered',
  order_cancelled: 'Order Cancelled',
  admin_new_order: 'New Order (Admin)',
}

const TEMPLATE_DESCRIPTIONS = {
  order_confirmation: 'Sent to the customer immediately after they place an order.',
  order_processing: 'Sent when you mark an order as "Processing".',
  order_delivered: 'Sent when you mark an order as "Delivered".',
  order_cancelled: 'Sent when an order is marked as "Cancelled".',
  admin_new_order: `Sent to ${import.meta.env.VITE_ADMIN_EMAIL || 'the admin email'} each time a new order is placed.`,
}

const VARIABLES = [
  { key: '{{customer_name}}', desc: 'Customer\'s full name' },
  { key: '{{order_id}}', desc: 'Order number' },
  { key: '{{order_total}}', desc: 'Order total (e.g. GH₵ 125.00)' },
  { key: '{{order_items}}', desc: 'Table of ordered items (auto-generated)' },
  { key: '{{order_status}}', desc: 'Current order status' },
  { key: '{{delivery_address}}', desc: 'Delivery address text' },
  { key: '{{store_name}}', desc: 'Store name' },
  { key: '{{store_email}}', desc: 'Store contact email' },
  { key: '{{customer_email}}', desc: 'Customer\'s email (admin template only)' },
  { key: '{{admin_url}}', desc: 'Admin panel base URL (admin template only)' },
]

const SAMPLE_VARS = {
  customer_name: 'Emmanuel Addo',
  order_id: '42',
  order_total: 'GH₵ 185.00',
  order_items: `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    <thead><tr style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#9aa0a6;border-bottom:1px solid #e8eaef;">
      <th style="padding:6px 0;font-weight:600;text-align:left;">Item</th>
      <th style="padding:6px 0;font-weight:600;text-align:center;">Qty</th>
      <th style="padding:6px 0;font-weight:600;text-align:right;">Price</th>
    </tr></thead>
    <tbody>
      <tr><td style="padding:8px 0;border-bottom:1px solid #e8eaef;font-size:13px;">Introduction to Algorithms</td><td style="padding:8px 0;border-bottom:1px solid #e8eaef;font-size:13px;text-align:center;">×1</td><td style="padding:8px 0;border-bottom:1px solid #e8eaef;font-size:13px;text-align:right;">GH₵ 120.00</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;">A4 Notebook (Pack of 3)</td><td style="padding:8px 0;font-size:13px;text-align:center;">×2</td><td style="padding:8px 0;font-size:13px;text-align:right;">GH₵ 65.00</td></tr>
    </tbody></table>`,
  order_status: 'Processing',
  delivery_address: 'House 14, Volta Hall Road, Legon, Accra',
  store_name: 'Kingdom Books & Stationery',
  store_email: 'hello@kingdombooks.gh',
  customer_email: 'emmanuel@example.com',
  admin_url: 'http://localhost:5173',
}

const EMAIL_SHELL_PREVIEW = (content) => `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5F6FA;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F6FA;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:540px;background:#fff;border-radius:16px;border:1px solid #e8eaef;overflow:hidden;">
        <tr><td style="background:#001a36;padding:22px 28px;">
          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#C9920A;">Kingdom Books &amp; Stationery</p>
          <p style="margin:6px 0 0;font-size:17px;font-weight:700;color:#fff;">University of Ghana Bookstore</p>
        </td></tr>
        <tr><td style="padding:28px;">${content}</td></tr>
        <tr><td style="background:#f5f6fa;padding:14px 28px;border-top:1px solid #e8eaef;">
          <p style="margin:0;font-size:12px;color:#9aa0a6;text-align:center;">&copy; 2026 Kingdom Books &amp; Stationery &bull; University of Ghana, Legon</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

function renderPreview(subject, bodyHtml) {
  let s = subject, b = bodyHtml
  for (const [k, v] of Object.entries(SAMPLE_VARS)) {
    const re = new RegExp(`\\{\\{${k}\\}\\}`, 'g')
    s = s.replace(re, v)
    b = b.replace(re, v)
  }
  return { subject: s, html: EMAIL_SHELL_PREVIEW(b) }
}

function Toast({ message, type }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 ${type === 'success' ? 'bg-success text-white' : 'bg-error text-white'}`}>
      {type === 'success' ? (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      )}
      {message}
    </div>
  )
}

function AdminEmailTemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeType, setActiveType] = useState('order_confirmation')
  const [subject, setSubject] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [previewMode, setPreviewMode] = useState('desktop')

  useEffect(() => {
    getEmailTemplates()
      .then((rows) => {
        setTemplates(rows)
        const first = rows.find((r) => r.type === 'order_confirmation') || rows[0]
        if (first) { setActiveType(first.type); setSubject(first.subject); setBodyHtml(first.body_html) }
      })
      .catch(() => setError('Failed to load templates.'))
      .finally(() => setLoading(false))
  }, [])

  function selectTemplate(type) {
    const tpl = templates.find((t) => t.type === type)
    if (!tpl) return
    setActiveType(type)
    setSubject(tpl.subject)
    setBodyHtml(tpl.body_html)
  }

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await updateEmailTemplate(activeType, { subject, body_html: bodyHtml })
      setTemplates((prev) => prev.map((t) => t.type === activeType ? { ...t, ...updated } : t))
      showToast('Template saved successfully.')
    } catch {
      showToast('Failed to save template.', 'error')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    const tpl = templates.find((t) => t.type === activeType)
    if (tpl) { setSubject(tpl.subject); setBodyHtml(tpl.body_html) }
  }

  const preview = renderPreview(subject, bodyHtml)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6 py-8">
        <div className="bg-error-bg text-error border border-error/20 rounded-xl p-4 text-sm">{error}</div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6">
        <h1 className="font-serif text-3xl text-brand-navy">Email Templates</h1>
        <p className="text-sm text-brand-navy/60 mt-1">
          Customize the emails customers receive at each stage of their order.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left — template list + editor */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Template selector */}
          <div className="bg-white border border-brand-line rounded-2xl overflow-hidden">
            {templates.map((tpl) => (
              <button
                key={tpl.type}
                type="button"
                onClick={() => selectTemplate(tpl.type)}
                className={`w-full flex items-start gap-3 px-5 py-4 text-left border-b border-brand-line/60 last:border-0 transition-colors ${
                  activeType === tpl.type ? 'bg-brand-gold/5 border-l-2 border-l-brand-gold' : 'hover:bg-brand-page/50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activeType === tpl.type ? 'bg-brand-gold' : 'bg-brand-line'}`} />
                <div>
                  <div className={`text-sm font-semibold ${activeType === tpl.type ? 'text-brand-navy' : 'text-brand-navy/80'}`}>
                    {TEMPLATE_LABELS[tpl.type] || tpl.name}
                  </div>
                  <div className="text-[12px] text-brand-navy/50 mt-0.5">
                    {TEMPLATE_DESCRIPTIONS[tpl.type] || ''}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Editor */}
          <form onSubmit={handleSave} className="bg-white border border-brand-line rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-brand-navy">
                Editing: {TEMPLATE_LABELS[activeType] || activeType}
              </h2>
              <button type="button" onClick={handleReset} className="text-[12px] text-brand-navy/50 hover:text-brand-navy transition-colors">
                Reset to last saved
              </button>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">Subject line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-brand-line rounded-xl px-4 h-10 text-sm text-brand-navy focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-brand-navy mb-1.5">Body (HTML)</label>
              <textarea
                required
                rows={14}
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                className="w-full border border-brand-line rounded-xl px-4 py-3 text-[13px] font-mono text-brand-navy focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors resize-y"
              />
              <p className="text-[11px] text-brand-navy/45 mt-1.5">
                Write HTML. Use the variables below to personalise messages.
              </p>
            </div>

            {/* Variable reference */}
            <div className="bg-brand-page rounded-xl p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50 mb-3">Available variables</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {VARIABLES.map((v) => (
                  <div key={v.key} className="flex items-baseline gap-2">
                    <code className="text-[11px] font-mono text-brand-gold bg-brand-gold/10 px-1.5 py-0.5 rounded shrink-0">{v.key}</code>
                    <span className="text-[11px] text-brand-navy/60">{v.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 h-10 rounded-xl bg-brand-gold hover:bg-[#b7830a] text-white text-sm font-bold transition-colors disabled:bg-brand-gold/50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving…' : 'Save Template'}
              </button>
            </div>
          </form>
        </div>

        {/* Right — live preview */}
        <div className="xl:w-[480px] shrink-0 space-y-3">
          <div className="bg-white border border-brand-line rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-brand-navy">Live Preview</h3>
              <div className="flex gap-1 bg-brand-page rounded-lg p-0.5">
                {['desktop', 'mobile'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPreviewMode(m)}
                    className={`px-3 h-7 rounded-md text-[12px] font-semibold transition-colors ${previewMode === m ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-navy/55 hover:text-brand-navy'}`}
                  >
                    {m === 'desktop' ? 'Desktop' : 'Mobile'}
                  </button>
                ))}
              </div>
            </div>
            <div className="border border-brand-line/60 rounded-xl overflow-hidden bg-[#F5F6FA]">
              <div className="bg-white border-b border-brand-line/60 px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex-1 bg-brand-page rounded-md h-5 text-[10px] flex items-center px-2 text-brand-navy/40 truncate">
                  Subject: {preview.subject}
                </div>
              </div>
              <div className={`overflow-auto transition-all ${previewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`} style={{ height: '520px' }}>
                <iframe
                  srcDoc={preview.html}
                  title="Email preview"
                  className="w-full h-full border-0"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
            <p className="text-[11px] text-brand-navy/40 mt-2 text-center">
              Preview uses sample data — actual emails use real order details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminEmailTemplatesPage
