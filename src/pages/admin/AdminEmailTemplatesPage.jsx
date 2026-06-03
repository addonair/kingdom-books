import { useEffect, useState } from 'react'
import { getEmailTemplates, updateEmailTemplate } from '../../api/admin.js'
import { useBrand } from '../../context/BrandContext.jsx'

/* ── Template metadata ───────────────────────────────────────────────────── */

const TEMPLATE_LABELS = {
  order_confirmation:    'Order Confirmation',
  order_confirmed:       'Order Confirmed',
  order_packaged:        'Order Packaged',
  order_out_for_delivery:'Out for Delivery',
  order_delivered:       'Order Delivered',
  order_ready_for_pickup:'Ready for Pickup',
  order_picked_up:       'Order Collected',
  order_cancelled:       'Order Cancelled',
  order_processing:      'Order Processing (Legacy)',
  admin_new_order:       'New Order (Admin)',
  account_goodbye:       'Account Goodbye',
}

const TEMPLATE_DESCRIPTIONS = {
  order_confirmation:    'Sent immediately after a customer places any order.',
  order_confirmed:       'Sent when you confirm an order — both delivery types.',
  order_packaged:        'Home delivery only — sent when the order is packed and ready to ship.',
  order_out_for_delivery:'Home delivery only — sent when the order leaves the store.',
  order_delivered:       'Home delivery only — sent when the order is marked delivered.',
  order_ready_for_pickup:'Pickup only — sent when the order is ready for collection at the store.',
  order_picked_up:       'Pickup only — sent when the customer has collected their order.',
  order_cancelled:       'Sent when an order is cancelled — both delivery types.',
  order_processing:      'Legacy — sent for the old "Processing" status. Kept for backward compatibility.',
  admin_new_order:       `Sent to ${import.meta.env.VITE_ADMIN_EMAIL || 'the admin email'} each time a new order is placed.`,
  account_goodbye:       'Sent to a customer before their account is permanently deleted.',
}

// Delivery type tag for each template
const TEMPLATE_TYPE_TAG = {
  order_confirmation:    'both',
  order_confirmed:       'both',
  order_packaged:        'home',
  order_out_for_delivery:'home',
  order_delivered:       'home',
  order_ready_for_pickup:'pickup',
  order_picked_up:       'pickup',
  order_cancelled:       'both',
  order_processing:      'legacy',
  admin_new_order:       'system',
  account_goodbye:       'system',
}

// Visual style for each type tag
const TYPE_TAG_STYLE = {
  both:   { label: 'All Orders',    cls: 'bg-blue-50 text-blue-600 border-blue-200' },
  home:   { label: 'Home Delivery', cls: 'bg-sky-50 text-sky-600 border-sky-200' },
  pickup: { label: 'Store Pickup',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  legacy: { label: 'Legacy',        cls: 'bg-gray-50 text-gray-500 border-gray-200' },
  system: { label: 'System',        cls: 'bg-purple-50 text-purple-600 border-purple-200' },
}

// Grouped order for the sidebar list
const TEMPLATE_GROUPS = [
  {
    key:   'both',
    label: 'All Order Types',
    desc:  'Sent for both home delivery and pickup orders',
    icon:  '📋',
    style: 'bg-blue-50 text-blue-700 border-blue-200',
    types: ['order_confirmation', 'order_confirmed', 'order_cancelled'],
  },
  {
    key:   'home',
    label: 'Home Delivery Only',
    desc:  'Sent only for orders with home/community delivery',
    icon:  '🚚',
    style: 'bg-sky-50 text-sky-700 border-sky-200',
    types: ['order_packaged', 'order_out_for_delivery', 'order_delivered'],
  },
  {
    key:   'pickup',
    label: 'Store Pickup Only',
    desc:  'Sent only for store pickup orders',
    icon:  '🏪',
    style: 'bg-amber-50 text-amber-700 border-amber-200',
    types: ['order_ready_for_pickup', 'order_picked_up'],
  },
  {
    key:   'system',
    label: 'System & Admin',
    desc:  'Internal notifications and account emails',
    icon:  '⚙️',
    style: 'bg-purple-50 text-purple-700 border-purple-200',
    types: ['admin_new_order', 'account_goodbye', 'order_processing'],
  },
]

/* ── Variable reference ──────────────────────────────────────────────────── */

const VARIABLES = [
  { key: '{{customer_name}}',   desc: "Customer's full name" },
  { key: '{{customer_email}}',  desc: "Customer's email address" },
  { key: '{{store_name}}',      desc: 'Store name' },
  { key: '{{store_email}}',     desc: 'Store contact email' },
  { key: '{{order_id}}',        desc: 'Order number (order emails)' },
  { key: '{{order_total}}',     desc: 'Order total e.g. GH₵ 125.00 (order emails)' },
  { key: '{{order_items}}',     desc: 'Table of ordered items (auto-generated)' },
  { key: '{{order_status}}',    desc: 'Current order status (order emails)' },
  { key: '{{delivery_label}}',  desc: '"Delivering to" or "Pickup location" depending on order type' },
  { key: '{{delivery_address}}',desc: 'Delivery address or pickup address (order emails)' },
  { key: '{{pickup_location}}', desc: 'Store pickup address + GPS code (pickup emails)' },
  { key: '{{pickup_hours}}',    desc: 'Store pickup hours (pickup emails)' },
  { key: '{{admin_url}}',       desc: 'Admin panel base URL (admin template only)' },
]

/* ── Sample variable sets per preview type ───────────────────────────────── */

const HOME_SAMPLE_VARS = {
  customer_name: 'Emmanuel Addo',
  order_id: '42',
  order_total: 'GH₵ 185.00',
  order_status: 'Packaged',
  delivery_label: 'Delivering to',
  delivery_address: 'House 14, Community 12, Accra',
  pickup_location: '',
  pickup_hours: '',
  store_email: 'hello@yourstore.com',
  customer_email: 'customer@example.com',
  admin_url: 'http://localhost:5173',
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
}

const PICKUP_SAMPLE_VARS = {
  ...HOME_SAMPLE_VARS,
  order_status: 'Ready for Pickup',
  delivery_label: 'Pickup location',
  delivery_address: 'Kingdom Books Store — Main Branch',
  pickup_location: 'Kingdom Books Store, Ring Road, Accra (GPS: GA-123-4567)',
  pickup_hours: 'Mon–Sat: 8am–6pm · Sun: 10am–4pm',
}

/* ── Email preview helpers ───────────────────────────────────────────────── */

function buildEmailShell(content, storeName, emailHeaderSubtitle, emailFooterLine) {
  const escapedName   = storeName.replace(/&/g, '&amp;')
  const escapedFooter = emailFooterLine.replace(/&/g, '&amp;')
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5F6FA;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F6FA;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:540px;background:#fff;border-radius:16px;border:1px solid #e8eaef;overflow:hidden;">
        <tr><td style="background:#001a36;padding:22px 28px;">
          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#C9920A;">${escapedName}</p>
          <p style="margin:6px 0 0;font-size:17px;font-weight:700;color:#fff;">${emailHeaderSubtitle}</p>
        </td></tr>
        <tr><td style="padding:28px;">${content}</td></tr>
        <tr><td style="background:#f5f6fa;padding:14px 28px;border-top:1px solid #e8eaef;">
          <p style="margin:0;font-size:12px;color:#9aa0a6;text-align:center;">${escapedFooter}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function renderPreview(subject, bodyHtml, sampleVars, storeName, emailHeaderSubtitle, emailFooterLine) {
  let s = subject, b = bodyHtml
  for (const [k, v] of Object.entries(sampleVars)) {
    const re = new RegExp(`\\{\\{${k}\\}\\}`, 'g')
    s = s.replace(re, v)
    b = b.replace(re, v)
  }
  return { subject: s, html: buildEmailShell(b, storeName, emailHeaderSubtitle, emailFooterLine) }
}

/* ── Toast ───────────────────────────────────────────────────────────────── */

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

/* ── Type tag badge ──────────────────────────────────────────────────────── */

function TypeTag({ type }) {
  const meta = TYPE_TAG_STYLE[type]
  if (!meta) return null
  return (
    <span className={`inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${meta.cls}`}>
      {meta.label}
    </span>
  )
}

/* ── Main page ───────────────────────────────────────────────────────────── */

function AdminEmailTemplatesPage() {
  const brand = useBrand()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeType, setActiveType] = useState('order_confirmation')
  const [subject, setSubject] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [previewMode, setPreviewMode] = useState('desktop')
  const [previewDelivery, setPreviewDelivery] = useState('home') // 'home' | 'pickup'

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
    // Auto-switch preview delivery mode to match template type
    const tag = TEMPLATE_TYPE_TAG[type]
    if (tag === 'pickup') setPreviewDelivery('pickup')
    else if (tag === 'home') setPreviewDelivery('home')
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

  const baseSampleVars = previewDelivery === 'pickup' ? PICKUP_SAMPLE_VARS : HOME_SAMPLE_VARS
  const sampleVars = { ...baseSampleVars, store_name: brand.storeName }
  const preview = renderPreview(subject, bodyHtml, sampleVars, brand.storeName, brand.emailHeaderSubtitle, brand.emailFooterLine)

  // Build the ordered list of types from groups, in group order
  const orderedTypes = TEMPLATE_GROUPS.flatMap((g) => g.types)
  // Append any template types not listed in any group (future-proof)
  const ungroupedTypes = templates.map((t) => t.type).filter((t) => !orderedTypes.includes(t))

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
          Customize emails sent at each stage — grouped by delivery type so you know exactly when each one fires.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left — template list + editor */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Template selector — grouped by delivery type */}
          <div className="bg-white border border-brand-line rounded-2xl overflow-hidden">
            {TEMPLATE_GROUPS.map((group) => {
              const groupTemplates = group.types
                .map((type) => templates.find((t) => t.type === type))
                .filter(Boolean)
              if (groupTemplates.length === 0) return null
              return (
                <div key={group.key}>
                  {/* Group header */}
                  <div className={`flex items-center gap-2 px-5 py-2.5 border-b border-brand-line/60 ${group.style} bg-opacity-40`}>
                    <span className="text-sm">{group.icon}</span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider">{group.label}</span>
                      <span className="text-[10px] ml-2 opacity-70">— {group.desc}</span>
                    </div>
                  </div>

                  {/* Templates in this group */}
                  {groupTemplates.map((tpl) => (
                    <button
                      key={tpl.type}
                      type="button"
                      onClick={() => selectTemplate(tpl.type)}
                      className={`w-full flex items-start gap-3 px-5 py-3.5 text-left border-b border-brand-line/40 last:border-0 transition-colors ${
                        activeType === tpl.type
                          ? 'bg-brand-gold/5 border-l-2 border-l-brand-gold'
                          : 'hover:bg-brand-page/50'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${activeType === tpl.type ? 'bg-brand-gold' : 'bg-brand-line'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold ${activeType === tpl.type ? 'text-brand-navy' : 'text-brand-navy/80'}`}>
                            {TEMPLATE_LABELS[tpl.type] || tpl.name}
                          </span>
                          <TypeTag type={TEMPLATE_TYPE_TAG[tpl.type]} />
                        </div>
                        <div className="text-[11px] text-brand-navy/50 mt-0.5 leading-snug">
                          {TEMPLATE_DESCRIPTIONS[tpl.type] || ''}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )
            })}

            {/* Ungrouped fallback */}
            {ungroupedTypes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-5 py-2.5 border-b border-brand-line/60 bg-brand-page/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50">Other Templates</span>
                </div>
                {ungroupedTypes.map((type) => {
                  const tpl = templates.find((t) => t.type === type)
                  if (!tpl) return null
                  return (
                    <button
                      key={tpl.type}
                      type="button"
                      onClick={() => selectTemplate(tpl.type)}
                      className={`w-full flex items-start gap-3 px-5 py-3.5 text-left border-b border-brand-line/40 last:border-0 transition-colors ${
                        activeType === tpl.type ? 'bg-brand-gold/5 border-l-2 border-l-brand-gold' : 'hover:bg-brand-page/50'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${activeType === tpl.type ? 'bg-brand-gold' : 'bg-brand-line'}`} />
                      <div className="text-sm font-semibold text-brand-navy/80">{TEMPLATE_LABELS[tpl.type] || tpl.name}</div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Editor */}
          <form onSubmit={handleSave} className="bg-white border border-brand-line rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-brand-navy">
                  Editing: {TEMPLATE_LABELS[activeType] || activeType}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <TypeTag type={TEMPLATE_TYPE_TAG[activeType]} />
                  <span className="text-[11px] text-brand-navy/50">
                    {TEMPLATE_DESCRIPTIONS[activeType] || ''}
                  </span>
                </div>
              </div>
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

            {/* Preview delivery type toggle */}
            <div className="flex items-center gap-2 mb-3 p-2.5 bg-brand-page rounded-xl border border-brand-line">
              <span className="text-[11px] font-bold text-brand-navy/50 uppercase tracking-wider">Preview as:</span>
              {[
                { key: 'home',   label: '🚚 Home Delivery' },
                { key: 'pickup', label: '🏪 Store Pickup' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setPreviewDelivery(opt.key)}
                  className={`text-[11px] font-bold px-3 h-7 rounded-lg border transition-colors ${
                    previewDelivery === opt.key
                      ? 'bg-brand-navy text-white border-brand-navy'
                      : 'bg-white text-brand-navy/60 border-brand-line hover:text-brand-navy'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
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
