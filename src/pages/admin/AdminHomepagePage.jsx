import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getAdminHomepage,
  updateHomepageSection,
  updateHomepageSettings,
  reorderHomepageSections,
} from '../../api/admin.js'
import { getProducts } from '../../api/products.js'
import { mapProducts } from '../../api/productMapper.js'
import useCategoryTree from '../../hooks/useCategoryTree.js'
import { useBrand } from '../../context/BrandContext.jsx'
import useDebounced from '../../hooks/useDebounced.js'
import Modal from '../../components/Modal.jsx'
import ImageUploadSlots from '../../components/admin/ImageUploadSlots.jsx'

import { FEATURE_ICON_KEYS } from '../../components/homepage/featureIcons.js'

const inputClass =
  'w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors'
const labelClass =
  'block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5'

// Only the five section_keys belong in `homepage_sections`. The announcement
// bar is a `homepage_settings` row (announcement_text + announcement_color)
// and is edited via a separate endpoint, so it gets a tab but never appears
// in the reorder strip.
const SECTION_TABS = [
  { type: 'hero', label: 'Hero' },
  { type: 'featured_trio', label: 'Featured Trio' },
  { type: 'bestsellers', label: 'Bestsellers' },
  { type: 'categories', label: 'Categories' },
  { type: 'features', label: 'Features' },
]

const TABS = [{ type: 'announcement_bar', label: 'Announcement Bar' }, ...SECTION_TABS]
const SECTION_KEYS = SECTION_TABS.map((t) => t.type)
const LABEL_BY_TYPE = Object.fromEntries(TABS.map((t) => [t.type, t.label]))

const DEFAULT_DRAFTS = {
  hero: {
    title: '',
    subtitle: '',
    bg_color: '#001a36',
    text_color: '#ffffff',
    button_text: 'Search',
    button_link: '/shop',
    eyebrow_text: '',
    title_size: 'lg',
    eyebrow_position: 'above',
    _images: [],
  },
  bestsellers: {
    title: 'Bestsellers',
    max_items: 4,
    strategy: 'auto',
    product_ids: [],
  },
  categories: { title: 'Shop by Section', max_items: 3, category_slugs: [] },
  features: { title: 'Why Shop With Us', cards: [] },
  featured_trio: { _images: [] },
}

const DEFAULT_SETTINGS = {
  announcement_text: '',
  announcement_color: '#000d1c',
  announcement_visible: true,
}

// Pull both the flat columns (title, subtitle, body_text, background_color,
// text_color) and the structured `content` JSON off a section row so the
// editor reflects whichever shape the backend is using.
function hydrateDraft(type, section) {
  const content = section?.content || {}
  const flat = {}
  if (section?.title != null) flat.title = section.title
  if (section?.subtitle != null) flat.subtitle = section.subtitle
  if (section?.body_text != null) flat.body = section.body_text
  if (section?.background_color != null) flat.bg_color = section.background_color
  if (section?.text_color != null) flat.text_color = section.text_color
  // These flat columns are in SECTION_FIELDS and saved to the DB — must be restored.
  if (section?.button_text != null) flat.button_text = section.button_text
  if (section?.button_link != null) flat.button_link = section.button_link
  if (section?.max_items != null) flat.max_items = section.max_items

  const merged = { ...DEFAULT_DRAFTS[type], ...content, ...flat }

  if (type === 'hero') {
    // Backend returns section.images as [{image_url, public_id, ...}]; map to URL strings.
    const sectionImageUrls = Array.isArray(section?.images)
      ? section.images.map((img) => img?.image_url || img).filter(Boolean)
      : []
    const fallbackUrls = Array.isArray(merged.images) ? merged.images : []
    const imageUrls = sectionImageUrls.length > 0 ? sectionImageUrls : fallbackUrls
    return { ...merged, _images: imageUrls.map((url) => ({ kind: 'existing', url })) }
  }
  if (type === 'featured_trio') {
    const sectionImageUrls = Array.isArray(section?.images)
      ? section.images.map((img) => img?.image_url || img).filter(Boolean)
      : []
    return { ...merged, _images: sectionImageUrls.map((url) => ({ kind: 'existing', url })) }
  }
  if (type === 'features') {
    return { ...merged, cards: Array.isArray(merged.cards) ? merged.cards : [] }
  }
  return merged
}

function hydrateSettingsDraft(settings) {
  if (!settings) return { ...DEFAULT_SETTINGS }
  return {
    announcement_text:
      settings.announcement_text != null
        ? settings.announcement_text
        : DEFAULT_SETTINGS.announcement_text,
    announcement_color:
      settings.announcement_color || DEFAULT_SETTINGS.announcement_color,
    // DB stores as TEXT 'true'/'false'; also handle boolean in case the API ever changes.
    announcement_visible:
      settings.announcement_visible === true || settings.announcement_visible === 'true',
  }
}

// Extract the structured content object for a section type.
// These fields have no flat column and are stored in the `content` JSONB column.
function buildContentJson(type, draft) {
  if (type === 'bestsellers') {
    return {
      strategy: draft.strategy || 'auto',
      product_ids: Array.isArray(draft.product_ids) ? draft.product_ids : [],
    }
  }
  if (type === 'categories') {
    return {
      category_slugs: Array.isArray(draft.category_slugs) ? draft.category_slugs : [],
    }
  }
  if (type === 'features') {
    return {
      cards: Array.isArray(draft.cards) ? draft.cards : [],
    }
  }
  return null
}

// Build the request payload for a Save click.
// Hero and featured_trio use FormData (image uploads).
// All other sections send JSON with flat fields + a `content` JSONB blob for
// structured data (cards, category_slugs, strategy/product_ids) that has no
// dedicated flat column — this is what makes those changes persist.
function buildSectionPayload(type, draft, isVisible) {
  if (type === 'hero' || type === 'featured_trio') {
    const fd = new FormData()
    if (type === 'hero') {
      fd.append('title', draft.title || '')
      fd.append('subtitle', draft.subtitle || '')
      fd.append('background_color', draft.bg_color || '#001a36')
      fd.append('text_color', draft.text_color || '#ffffff')
      fd.append('button_text', draft.button_text || '')
      fd.append('button_link', draft.button_link || '')
      fd.append('content', JSON.stringify({
        eyebrow_text: draft.eyebrow_text || '',
        title_size: draft.title_size || 'lg',
        eyebrow_position: draft.eyebrow_position || 'above',
      }))
    }
    fd.append('is_visible', isVisible ? 'true' : 'false')
    const entries = Array.isArray(draft._images) ? draft._images : []
    for (const e of entries) {
      if (e?.kind === 'existing' && e.url) {
        fd.append('existing_images[]', e.url)
      } else if (e?.kind === 'new' && e.file) {
        fd.append('images', e.file, e.file.name)
      }
    }
    return fd
  }

  const contentJson = buildContentJson(type, draft)
  return {
    title: draft.title,
    subtitle: draft.subtitle,
    body_text: draft.body,
    background_color: draft.bg_color,
    text_color: draft.text_color,
    button_text: draft.button_text,
    button_link: draft.button_link,
    max_items: draft.max_items,
    is_visible: !!isVisible,
    ...(contentJson != null ? { content: contentJson } : {}),
  }
}

// ----- Toast --------------------------------------------------------------

function useToast() {
  const [toasts, setToasts] = useState([])
  const push = useCallback((toast) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((xs) => [...xs, { id, ...toast }])
    setTimeout(() => setToasts((xs) => xs.filter((x) => x.id !== id)), 3000)
  }, [])
  return { toasts, push }
}

function Toaster({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto min-w-[220px] max-w-sm px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white animate-[slideIn_.2s_ease-out] ${
            t.kind === 'error' ? 'bg-error' : 'bg-success'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

function StatusLine({ status }) {
  if (!status) return null
  const cls = status.kind === 'error' ? 'text-error' : 'text-success'
  return <span className={`text-[12.5px] ${cls}`}>{status.message}</span>
}

// ----- Section reorder strip ---------------------------------------------

function EyeIcon({ on }) {
  return on ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 2l20 20M6.5 6.5C3.6 8.6 2 12 2 12s3.5 7 10 7c2.1 0 3.9-.5 5.4-1.3M9.9 5.1A11 11 0 0112 5c6.5 0 10 7 10 7-.6 1.2-1.5 2.6-2.7 3.8M9.5 9.5a3 3 0 004 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DragHandle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="6" r="1.4" />
      <circle cx="15" cy="6" r="1.4" />
      <circle cx="9" cy="12" r="1.4" />
      <circle cx="15" cy="12" r="1.4" />
      <circle cx="9" cy="18" r="1.4" />
      <circle cx="15" cy="18" r="1.4" />
    </svg>
  )
}

function SectionReorderStrip({ sections, onReorder, onToggleVisible, activeType, onPick }) {
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  function onDragStart(i) {
    setDragIdx(i)
  }
  function onDragOver(i, e) {
    if (dragIdx == null) return
    e.preventDefault()
    setOverIdx(i)
  }
  function onDrop(i, e) {
    e.preventDefault()
    if (dragIdx == null || dragIdx === i) {
      setDragIdx(null)
      setOverIdx(null)
      return
    }
    const next = [...sections]
    const [moved] = next.splice(dragIdx, 1)
    const insertAt = Math.min(i, next.length)
    next.splice(insertAt, 0, moved)
    onReorder(next.map((s, idx) => ({ ...s, display_order: idx })))
    setDragIdx(null)
    setOverIdx(null)
  }
  function onDragEnd() {
    setDragIdx(null)
    setOverIdx(null)
  }

  return (
    <div className="bg-white border border-brand-line rounded-2xl p-3 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/55 pr-3 shrink-0">
          Section order
        </div>
        {sections.map((s, i) => {
          const key = s.section_key || s.type
          const isActive = key === activeType
          const isOver = overIdx === i && dragIdx != null && dragIdx !== i
          return (
            <div
              key={key}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(i, e)}
              onDrop={(e) => onDrop(i, e)}
              onDragEnd={onDragEnd}
              onDragLeave={() => overIdx === i && setOverIdx(null)}
              onClick={() => onPick(key)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl border text-[12.5px] font-semibold cursor-move shrink-0 transition-colors ${
                isOver
                  ? 'border-brand-gold bg-brand-gold-soft'
                  : isActive
                  ? 'border-brand-navy bg-brand-navy text-white'
                  : s.is_visible
                  ? 'border-brand-line bg-white text-brand-navy hover:border-brand-gold/60'
                  : 'border-brand-line bg-brand-page text-brand-navy/50'
              } ${dragIdx === i ? 'opacity-50' : ''}`}
              title="Drag to reorder · click to edit"
            >
              <span className={isActive ? 'text-white/70' : 'text-brand-navy/40'}>
                <DragHandle />
              </span>
              <span>{LABEL_BY_TYPE[key] || key}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleVisible(key)
                }}
                aria-label={s.is_visible ? 'Hide section' : 'Show section'}
                className={`ml-1 flex items-center justify-center w-6 h-6 rounded-md transition-colors ${
                  isActive
                    ? 'text-white/80 hover:bg-white/10'
                    : s.is_visible
                    ? 'text-brand-navy/70 hover:bg-brand-page'
                    : 'text-brand-navy/35 hover:bg-brand-page'
                }`}
              >
                <EyeIcon on={s.is_visible} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ----- Editors -----------------------------------------------------------

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 rounded-xl border border-brand-line bg-white cursor-pointer"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          placeholder="#001a36"
        />
      </div>
    </div>
  )
}

function VisibilityRow({ value, onChange, label = 'Section visible on the homepage' }) {
  return (
    <label className="flex items-center gap-3 px-4 h-11 rounded-xl border border-brand-line bg-brand-page cursor-pointer select-none">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-brand-gold"
      />
      <span className="text-sm text-brand-navy font-semibold">{label}</span>
    </label>
  )
}

function AnnouncementBarEditor({ draft, setDraft }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Message</label>
        <input
          className={inputClass}
          value={draft.announcement_text}
          onChange={(e) => setDraft({ ...draft, announcement_text: e.target.value })}
          placeholder="Free delivery on orders over GH₵ 50…"
        />
      </div>
      <ColorField
        label="Background color"
        value={draft.announcement_color}
        onChange={(v) => setDraft({ ...draft, announcement_color: v })}
      />
      <VisibilityRow
        value={draft.announcement_visible}
        onChange={(v) => setDraft({ ...draft, announcement_visible: v })}
        label="Show announcement bar at the top of the homepage"
      />
    </div>
  )
}

function HeroEditor({ draft, setDraft, isVisible, setIsVisible }) {
  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Text above / below title</label>
        <input
          className={inputClass}
          value={draft.eyebrow_text || ''}
          placeholder="The Number One Academic Bookshop in Ghana"
          onChange={(e) => setDraft({ ...draft, eyebrow_text: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title font size</label>
          <select
            className={inputClass}
            value={draft.title_size || 'lg'}
            onChange={(e) => setDraft({ ...draft, title_size: e.target.value })}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large (default)</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Eyebrow text position</label>
          <select
            className={inputClass}
            value={draft.eyebrow_position || 'above'}
            onChange={(e) => setDraft({ ...draft, eyebrow_position: e.target.value })}
          >
            <option value="above">Above title</option>
            <option value="below">Below title</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Title</label>
        <input
          className={inputClass}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </div>
      <div>
        <label className={labelClass}>Subtitle</label>
        <textarea
          rows={2}
          className={`${inputClass} h-auto py-3 resize-y`}
          value={draft.subtitle}
          onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ColorField
          label="Background color"
          value={draft.bg_color}
          onChange={(v) => setDraft({ ...draft, bg_color: v })}
        />
        <ColorField
          label="Text color"
          value={draft.text_color}
          onChange={(v) => setDraft({ ...draft, text_color: v })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Button text</label>
          <input
            className={inputClass}
            value={draft.button_text}
            onChange={(e) => setDraft({ ...draft, button_text: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Button link</label>
          <input
            className={inputClass}
            value={draft.button_link}
            onChange={(e) => setDraft({ ...draft, button_link: e.target.value })}
            placeholder="/shop"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Slideshow images (up to 3)</label>
        <p className="text-[11.5px] text-brand-navy/55 mb-2">
          Images fill the hero background and auto-advance every 5 seconds. The first image is shown on load.
        </p>
        <ImageUploadSlots
          value={draft._images}
          onChange={(next) => setDraft({ ...draft, _images: next })}
          maxImages={3}
        />
      </div>
      <VisibilityRow value={isVisible} onChange={setIsVisible} />
    </div>
  )
}

function BestsellersEditor({ draft, setDraft, isVisible, setIsVisible, productCache }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const selectedIds = Array.isArray(draft.product_ids) ? draft.product_ids : []
  const selectedProducts = selectedIds
    .map((id) => productCache.find((p) => Number(p.id) === Number(id)))
    .filter(Boolean)

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Section title</label>
        <input
          className={inputClass}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Max items</label>
          <input
            type="number"
            min={1}
            max={8}
            className={inputClass}
            value={draft.max_items}
            onChange={(e) =>
              setDraft({ ...draft, max_items: Math.max(1, Math.min(8, Number(e.target.value) || 1)) })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Strategy</label>
          <div className="flex gap-2">
            {['auto', 'manual'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setDraft({ ...draft, strategy: s })}
                className={`flex-1 h-11 rounded-xl border text-sm font-semibold transition-colors ${
                  draft.strategy === s
                    ? 'border-brand-gold bg-brand-gold-soft text-brand-gold'
                    : 'border-brand-line bg-white text-brand-navy hover:border-brand-gold/60'
                }`}
              >
                {s === 'auto' ? 'Auto (top sellers)' : 'Manual pick'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {draft.strategy === 'manual' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`${labelClass} mb-0`}>Featured products</label>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="text-[12px] font-bold text-brand-gold hover:underline"
            >
              + Pick products
            </button>
          </div>
          {selectedProducts.length === 0 ? (
            <div className="text-[12px] text-brand-navy/55 border border-dashed border-brand-line rounded-xl px-4 py-3">
              No products selected yet. Click "Pick products" to add up to {draft.max_items}.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-2 bg-brand-page border border-brand-line rounded-full px-3 py-1.5 text-[12px]"
                >
                  <span className="font-semibold text-brand-navy max-w-[180px] truncate">{p.title}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        product_ids: selectedIds.filter((id) => Number(id) !== Number(p.id)),
                      })
                    }
                    className="text-brand-navy/50 hover:text-error"
                    aria-label="Remove product"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {pickerOpen && (
            <ProductPickerModal
              productCache={productCache}
              selectedIds={selectedIds}
              maxItems={draft.max_items}
              onClose={() => setPickerOpen(false)}
              onCommit={(ids) => {
                setDraft({ ...draft, product_ids: ids })
                setPickerOpen(false)
              }}
            />
          )}
        </div>
      )}

      <VisibilityRow value={isVisible} onChange={setIsVisible} />
    </div>
  )
}

function ProductPickerModal({ productCache, selectedIds, maxItems, onClose, onCommit }) {
  const [query, setQuery] = useState('')
  const [serverResults, setServerResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounced(query, 250)
  const [picked, setPicked] = useState(() =>
    selectedIds.map((id) => Number(id)).filter((id) => !Number.isNaN(id)),
  )

  useEffect(() => {
    const q = debouncedQuery.trim()
    if (!q) {
      setServerResults(null)
      return
    }
    let cancelled = false
    setLoading(true)
    getProducts({ search: q })
      .then((rows) => {
        if (cancelled) return
        const mapped = mapProducts(rows).map((p) => ({
          id: p.id,
          title: p.title,
          author: p.brand || p.authorName || '',
        }))
        setServerResults(mapped)
      })
      .catch(() => {
        if (!cancelled) setServerResults([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  const visible = serverResults || productCache
  const togglePick = (id) => {
    const n = Number(id)
    if (picked.includes(n)) {
      setPicked(picked.filter((x) => x !== n))
    } else if (picked.length < maxItems) {
      setPicked([...picked, n])
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Pick featured products"
      size="lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="text-[12px] text-brand-navy/60">
            {picked.length} / {maxItems} selected
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-brand-line text-sm font-semibold text-brand-navy hover:bg-brand-page"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onCommit(picked)}
              className="h-10 px-5 rounded-xl bg-brand-gold hover:bg-[#b7830a] text-white font-bold text-sm"
            >
              Save selection
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <input
          autoFocus
          placeholder="Search by title or author…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={inputClass}
        />
        <div className="border border-brand-line rounded-xl max-h-[420px] overflow-y-auto divide-y divide-brand-line">
          {loading && (
            <div className="px-4 py-3 text-[13px] text-brand-navy/55">Searching…</div>
          )}
          {!loading && visible.length === 0 && (
            <div className="px-4 py-6 text-[13px] text-brand-navy/55 text-center">
              No products found.
            </div>
          )}
          {!loading &&
            visible.map((p) => {
              const isPicked = picked.includes(Number(p.id))
              const disabled = !isPicked && picked.length >= maxItems
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePick(p.id)}
                  disabled={disabled}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                    isPicked
                      ? 'bg-brand-gold-soft'
                      : disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-brand-page'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-brand-navy truncate">{p.title}</div>
                    {p.author && (
                      <div className="text-[12px] text-brand-navy/55 truncate">{p.author}</div>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                      isPicked
                        ? 'bg-brand-gold text-white'
                        : 'bg-brand-page text-brand-navy/60'
                    }`}
                  >
                    {isPicked ? 'Selected' : 'Pick'}
                  </span>
                </button>
              )
            })}
        </div>
      </div>
    </Modal>
  )
}

function CategoriesEditor({ draft, setDraft, isVisible, setIsVisible, categoryTree }) {
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)
  const slugs = Array.isArray(draft.category_slugs) ? draft.category_slugs : []
  const allSlugs = Object.keys(categoryTree || {})
  const available = allSlugs.filter((s) => !slugs.includes(s))

  function onDragStart(i) {
    setDragIdx(i)
  }
  function onDragOver(i, e) {
    if (dragIdx == null) return
    e.preventDefault()
    setOverIdx(i)
  }
  function onDrop(i, e) {
    e.preventDefault()
    if (dragIdx == null || dragIdx === i) {
      setDragIdx(null)
      setOverIdx(null)
      return
    }
    const next = [...slugs]
    const [moved] = next.splice(dragIdx, 1)
    const insertAt = Math.min(i, next.length)
    next.splice(insertAt, 0, moved)
    setDraft({ ...draft, category_slugs: next })
    setDragIdx(null)
    setOverIdx(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Section title</label>
        <input
          className={inputClass}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </div>
      <div>
        <label className={labelClass}>Max items</label>
        <input
          type="number"
          min={1}
          max={8}
          className={inputClass}
          value={draft.max_items}
          onChange={(e) =>
            setDraft({
              ...draft,
              max_items: Math.max(1, Math.min(8, Number(e.target.value) || 1)),
            })
          }
        />
      </div>
      <div>
        <label className={labelClass}>Featured categories (drag to reorder)</label>
        {slugs.length === 0 ? (
          <div className="text-[12px] text-brand-navy/55 border border-dashed border-brand-line rounded-xl px-4 py-3">
            No categories selected. Add one below to start.
          </div>
        ) : (
          <div className="space-y-1.5">
            {slugs.map((slug, i) => {
              const label = categoryTree?.[slug]?.label || slug
              const isOver = overIdx === i && dragIdx != null && dragIdx !== i
              return (
                <div
                  key={slug}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(i, e)}
                  onDrop={(e) => onDrop(i, e)}
                  onDragEnd={() => {
                    setDragIdx(null)
                    setOverIdx(null)
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl border cursor-move bg-white ${
                    isOver ? 'border-brand-gold bg-brand-gold-soft' : 'border-brand-line'
                  } ${dragIdx === i ? 'opacity-50' : ''}`}
                >
                  <span className="text-brand-navy/40">
                    <DragHandle />
                  </span>
                  <span className="text-sm font-semibold text-brand-navy flex-1">{label}</span>
                  <span className="text-[11px] text-brand-navy/45 font-mono">{slug}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        category_slugs: slugs.filter((s) => s !== slug),
                      })
                    }
                    className="text-brand-navy/50 hover:text-error text-lg leading-none px-2"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {available.length > 0 && (
        <div>
          <label className={labelClass}>Add category</label>
          <select
            className={inputClass}
            value=""
            onChange={(e) => {
              if (!e.target.value) return
              setDraft({ ...draft, category_slugs: [...slugs, e.target.value] })
            }}
          >
            <option value="">Choose a category…</option>
            {available.map((s) => (
              <option key={s} value={s}>
                {categoryTree[s]?.label || s}
              </option>
            ))}
          </select>
        </div>
      )}
      <VisibilityRow value={isVisible} onChange={setIsVisible} />
    </div>
  )
}

function FeaturesEditor({ draft, setDraft, isVisible, setIsVisible }) {
  const cards = Array.isArray(draft.cards) ? draft.cards : []
  const addCard = () => {
    if (cards.length >= 4) return
    setDraft({
      ...draft,
      cards: [...cards, { icon: 'star', title: '', description: '' }],
    })
  }
  const updateCard = (i, patch) => {
    const next = cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c))
    setDraft({ ...draft, cards: next })
  }
  const removeCard = (i) => {
    setDraft({ ...draft, cards: cards.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Section title</label>
        <input
          className={inputClass}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </div>
      <div className="space-y-3">
        {cards.map((card, i) => (
          <div key={i} className="border border-brand-line rounded-xl p-3 bg-brand-page/40">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/55">
                Card {i + 1}
              </div>
              <button
                type="button"
                onClick={() => removeCard(i)}
                className="text-brand-navy/50 hover:text-error text-[12px] font-bold"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
              <div>
                <label className={labelClass}>Icon</label>
                <select
                  className={inputClass}
                  value={card.icon}
                  onChange={(e) => updateCard(i, { icon: e.target.value })}
                >
                  {FEATURE_ICON_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Title</label>
                <input
                  className={inputClass}
                  value={card.title}
                  onChange={(e) => updateCard(i, { title: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className={labelClass}>Description</label>
              <textarea
                rows={2}
                className={`${inputClass} h-auto py-3 resize-y`}
                value={card.description}
                onChange={(e) => updateCard(i, { description: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
      {cards.length < 4 && (
        <button
          type="button"
          onClick={addCard}
          className="h-10 px-4 border border-dashed border-brand-line rounded-xl text-sm font-bold text-brand-navy/70 hover:text-brand-gold hover:border-brand-gold/60 w-full"
        >
          + Add feature card
        </button>
      )}
      <VisibilityRow value={isVisible} onChange={setIsVisible} />
    </div>
  )
}

function FeaturedTrioEditor({ draft, setDraft, isVisible, setIsVisible }) {
  return (
    <div className="space-y-4">
      <div className="text-[12.5px] text-brand-navy/70 bg-brand-page rounded-xl p-3 border border-brand-line leading-relaxed">
        Upload one background image per card (left → right order). Images replace the default
        gradient. Card titles and text are hardcoded.
      </div>
      <div>
        <label className={labelClass}>Card background images (left to right)</label>
        <ImageUploadSlots
          value={draft._images}
          onChange={(next) => setDraft({ ...draft, _images: next })}
          maxImages={3}
        />
      </div>
      <VisibilityRow value={isVisible} onChange={setIsVisible} />
    </div>
  )
}

// ----- Live preview ------------------------------------------------------

// For the hero preview we replace the `_images` upload-slot entries with the
// flat `images` string[] HeroSection actually consumes, mapping new uploads
// to their object-URL `preview` and existing entries to the persisted URL.
// ----- Live preview (iframe) ---------------------------------------------
// An iframe gives each device size its OWN viewport, so Tailwind breakpoints
// (md:, lg:) respond to the iframe's width rather than the admin window.
// Desktop iframe = 1280px viewport → desktop layout.
// Mobile iframe = 390px viewport → mobile layout.
// The iframe always shows the PUBLISHED state; save first, then hit Refresh.

const PREVIEW_URL = typeof window !== 'undefined' ? window.location.origin + '/' : '/'
const DESKTOP_IFRAME_W = 1280
const DESKTOP_IFRAME_H = 860
const DESKTOP_SCALE = 0.44
const MOBILE_IFRAME_W = 390
const MOBILE_IFRAME_H = 812
const MOBILE_SCALE = 0.72
const PHONE_BEZEL = 14
// Phone outer dimensions (bezel + screen)
const PHONE_OUTER_W = MOBILE_IFRAME_W + PHONE_BEZEL * 2
const PHONE_OUTER_H = MOBILE_IFRAME_H + PHONE_BEZEL * 2

function PhoneFrame({ children }) {
  return (
    <div
      className="relative bg-black shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
      style={{ width: PHONE_OUTER_W, height: PHONE_OUTER_H, borderRadius: 56, padding: PHONE_BEZEL }}
    >
      {/* Volume / side buttons */}
      <div className="absolute bg-zinc-700 rounded-l" style={{ left: -3, top: 110, width: 3, height: 32 }} />
      <div className="absolute bg-zinc-700 rounded-l" style={{ left: -3, top: 160, width: 3, height: 56 }} />
      <div className="absolute bg-zinc-700 rounded-l" style={{ left: -3, top: 230, width: 3, height: 56 }} />
      <div className="absolute bg-zinc-700 rounded-r" style={{ right: -3, top: 140, width: 3, height: 86 }} />
      {/* Screen */}
      <div
        className="relative overflow-hidden bg-white"
        style={{ width: MOBILE_IFRAME_W, height: MOBILE_IFRAME_H, borderRadius: 42 }}
      >
        {/* Dynamic island */}
        <div
          className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-black rounded-full z-50"
          style={{ width: 110, height: 32 }}
        />
        {children}
      </div>
    </div>
  )
}

function LivePreview({ device, refreshing, onRefresh }) {
  const [iframeKey, setIframeKey] = useState(0)
  const isMobile = device === 'mobile'

  function handleRefresh() {
    setIframeKey((k) => k + 1)
    onRefresh?.()
  }

  // Compute panel height so the scaled content fits without scrolling
  const panelHeight = isMobile
    ? Math.ceil(PHONE_OUTER_H * MOBILE_SCALE) + 32
    : Math.ceil(DESKTOP_IFRAME_H * DESKTOP_SCALE) + 32

  return (
    <div className="bg-white border border-brand-line rounded-2xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-line">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/55">
            {isMobile ? 'Mobile preview · 390 px' : 'Desktop preview · 1280 px'}
          </div>
          <div className="text-[10px] text-brand-navy/40 mt-0.5">
            Shows published state — save first, then Refresh
          </div>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 hover:text-brand-gold disabled:opacity-50 transition-colors"
          title="Reload the preview with the latest published homepage"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={refreshing ? 'animate-spin' : ''}>
            <path
              d="M3 12a9 9 0 0115.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 01-15.5 6.2L3 16M3 21v-5h5"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          Refresh
        </button>
      </div>

      <div
        className="flex justify-center items-start bg-brand-page overflow-hidden"
        style={{ height: panelHeight, paddingTop: 16 }}
      >
        {isMobile ? (
          // 390px iframe has its own viewport → mobile breakpoints fire correctly.
          // The outer wrapper clips to the visual size so flex centering works.
          <div
            style={{
              width: Math.floor(PHONE_OUTER_W * MOBILE_SCALE),
              height: Math.floor(PHONE_OUTER_H * MOBILE_SCALE),
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <div style={{ transform: `scale(${MOBILE_SCALE})`, transformOrigin: 'top left' }}>
              <PhoneFrame>
                <iframe
                  key={iframeKey}
                  src={PREVIEW_URL}
                  title="Mobile preview"
                  style={{ width: MOBILE_IFRAME_W, height: MOBILE_IFRAME_H, border: 'none', display: 'block' }}
                />
              </PhoneFrame>
            </div>
          </div>
        ) : (
          // 1280px iframe has desktop viewport. The outer wrapper is sized to the
          // visual footprint (1280 × 0.44 = 563px) so flex centering works and
          // the panel never overflows horizontally.
          <div
            style={{
              width: Math.floor(DESKTOP_IFRAME_W * DESKTOP_SCALE),
              height: Math.floor(DESKTOP_IFRAME_H * DESKTOP_SCALE),
              overflow: 'hidden',
              flexShrink: 0,
              borderRadius: 6,
              boxShadow: '0 4px 20px rgba(0,26,54,0.12)',
            }}
          >
            <div style={{ transform: `scale(${DESKTOP_SCALE})`, transformOrigin: 'top left', width: DESKTOP_IFRAME_W }}>
              <iframe
                key={iframeKey}
                src={PREVIEW_URL}
                title="Desktop preview"
                style={{ width: DESKTOP_IFRAME_W, height: DESKTOP_IFRAME_H, border: 'none', display: 'block' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ----- Page --------------------------------------------------------------

// Build the section list returned from `getAdminHomepage()` into the shape
// the editor expects — keeps id, section_key, visibility + display_order on
// each row and seeds any missing section_keys with defaults so the reorder
// strip is always five-wide.
function normalizeSections(rows) {
  const list = Array.isArray(rows) ? rows : []
  const byKey = new Map()
  for (const r of list) {
    const k = r?.section_key || r?.type
    if (k && SECTION_KEYS.includes(k)) byKey.set(k, r)
  }
  const ordered = []
  let nextOrder = 0
  for (const r of list) {
    const k = r?.section_key || r?.type
    if (k && SECTION_KEYS.includes(k) && !ordered.find((s) => (s.section_key || s.type) === k)) {
      ordered.push({ ...r, section_key: k, display_order: r.display_order ?? nextOrder++ })
    }
  }
  for (const k of SECTION_KEYS) {
    if (!byKey.has(k)) {
      ordered.push({
        id: null,
        section_key: k,
        is_visible: true,
        display_order: nextOrder++,
        content: {},
      })
    }
  }
  ordered.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  return ordered
}

function AdminHomepagePage() {
  const [sections, setSections] = useState([])
  const [drafts, setDrafts] = useState({})
  const [settingsDraft, setSettingsDraft] = useState({ ...DEFAULT_SETTINGS })
  const [isVisibleByType, setIsVisibleByType] = useState({})
  const [activeTab, setActiveTab] = useState('announcement_bar')
  const [previewDevice, setPreviewDevice] = useState('desktop')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState({})
  const [status, setStatus] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  const [productCache, setProductCache] = useState([])
  const tree = useCategoryTree()
  const { toasts, push: pushToast } = useToast()
  const sectionsRef = useRef(sections)
  useEffect(() => {
    sectionsRef.current = sections
  }, [sections])

  const applyServerData = useCallback((data) => {
    const rawSections = Array.isArray(data?.sections)
      ? data.sections
      : Array.isArray(data)
      ? data
      : []
    const normalized = normalizeSections(rawSections)
    const nextDrafts = {}
    const nextVis = {}
    for (const s of normalized) {
      const key = s.section_key || s.type
      nextDrafts[key] = hydrateDraft(key, s)
      nextVis[key] = s.is_visible !== false
    }
    setSections(normalized)
    setDrafts(nextDrafts)
    setIsVisibleByType(nextVis)
    setSettingsDraft(hydrateSettingsDraft(data?.settings))
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getAdminHomepage()
      .then((data) => {
        if (cancelled) return
        applyServerData(data)
      })
      .catch((err) => {
        if (cancelled) return
        const msg = err?.response?.data?.error || 'Failed to load homepage config.'
        setLoadError(msg)
        applyServerData(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [applyServerData])

  useEffect(() => {
    let cancelled = false
    getProducts()
      .then((rows) => {
        if (cancelled) return
        const mapped = mapProducts(rows).map((p) => ({
          id: p.id,
          title: p.title,
          author: p.brand || p.authorName || '',
          section: p.section,
          format: p.format,
          price: p.price,
          color: p.color,
          image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
        }))
        setProductCache(mapped)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const setTabDraft = useCallback((type, next) => {
    setDrafts((d) => ({ ...d, [type]: next }))
  }, [])

  const setTabVisible = useCallback((type, value) => {
    setIsVisibleByType((m) => ({ ...m, [type]: value }))
  }, [])

  // PATCH body is the raw array `[{ id, display_order }]`. Rows that don't
  // yet exist on the server (id === null) are filtered out so the backend
  // never sees a null primary key.
  const handleReorder = useCallback(
    async (nextSections) => {
      const prev = sectionsRef.current
      setSections(nextSections)
      try {
        const payload = nextSections
          .filter((s) => s.id != null)
          .map((s) => ({ id: s.id, display_order: s.display_order }))
        console.log('[admin reorder] PATCH /admin/homepage/sections/reorder payload:', payload)
        const result = await reorderHomepageSections(payload)
        console.log('[admin reorder] PATCH /admin/homepage/sections/reorder response:', result)
        pushToast({ kind: 'success', message: 'Order saved' })
      } catch (err) {
        console.error('[admin reorder] failed:', {
          status: err?.response?.status,
          data: err?.response?.data,
          message: err?.message,
        })
        setSections(prev)
        const msg = err?.response?.data?.error || err?.response?.data?.message || 'Reorder failed.'
        pushToast({ kind: 'error', message: msg })
      }
    },
    [pushToast],
  )

  // Visibility toggles are persisted by re-saving the section with its
  // current content + flipped `is_visible`. Reorder PATCH is id/display_order
  // only and doesn't carry visibility.
  const handleToggleVisible = useCallback(
    async (key) => {
      const prevVis = isVisibleByType[key]
      const nextVis = !prevVis
      setIsVisibleByType((m) => ({ ...m, [key]: nextVis }))
      setSections((rows) =>
        rows.map((s) => ((s.section_key || s.type) === key ? { ...s, is_visible: nextVis } : s)),
      )
      try {
        const draft = drafts[key]
        if (!draft) return
        const payload = buildSectionPayload(key, draft, nextVis)
        await updateHomepageSection(key, payload)
        pushToast({ kind: 'success', message: 'Visibility updated' })
      } catch (err) {
        setIsVisibleByType((m) => ({ ...m, [key]: prevVis }))
        setSections((rows) =>
          rows.map((s) => ((s.section_key || s.type) === key ? { ...s, is_visible: prevVis } : s)),
        )
        const msg = err?.response?.data?.error || 'Failed to update visibility.'
        pushToast({ kind: 'error', message: msg })
      }
    },
    [drafts, isVisibleByType, pushToast],
  )

  const handleSave = useCallback(
    async (type) => {
      setSaving((s) => ({ ...s, [type]: true }))
      setStatus((s) => ({ ...s, [type]: null }))
      try {
        if (type === 'announcement_bar') {
          const settingsPayload = {
            announcement_text: settingsDraft.announcement_text,
            announcement_color: settingsDraft.announcement_color,
            announcement_visible: !!settingsDraft.announcement_visible,
          }
          console.log('[admin save] PUT /admin/homepage/settings payload:', settingsPayload)
          const updated = await updateHomepageSettings(settingsPayload)
          console.log('[admin save] PUT /admin/homepage/settings response:', updated)
          if (updated) setSettingsDraft(hydrateSettingsDraft(updated))
        } else {
          const payload = buildSectionPayload(type, drafts[type], isVisibleByType[type])
          console.log(`[admin save] PUT /admin/homepage/sections/by-key/${type} payload:`, payload)
          const updated = await updateHomepageSection(type, payload)
          console.log(`[admin save] PUT /admin/homepage/sections/by-key/${type} response:`, updated)
          if (updated) {
            const key = updated.section_key || updated.type || type
            setSections((rows) =>
              rows.map((r) => ((r.section_key || r.type) === key ? { ...r, ...updated } : r)),
            )
            setDrafts((d) => ({ ...d, [key]: hydrateDraft(key, updated) }))
            setIsVisibleByType((m) => ({ ...m, [key]: updated.is_visible !== false }))
          }
        }
        setStatus((s) => ({ ...s, [type]: { kind: 'success', message: 'Saved.' } }))
        pushToast({ kind: 'success', message: `${LABEL_BY_TYPE[type]} saved` })
      } catch (err) {
        console.error(`[admin save "${type}"] failed:`, {
          status: err?.response?.status,
          data: err?.response?.data,
          message: err?.message,
        })
        const msg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to save.'
        setStatus((s) => ({ ...s, [type]: { kind: 'error', message: msg } }))
        pushToast({ kind: 'error', message: msg })
      } finally {
        setSaving((s) => ({ ...s, [type]: false }))
      }
    },
    [drafts, isVisibleByType, settingsDraft, pushToast],
  )

  // Refresh button on the preview panel: re-fetch from the API and overwrite
  // local state with what's currently published. Unsaved drafts are dropped.
  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const data = await getAdminHomepage()
      applyServerData(data)
      pushToast({ kind: 'success', message: 'Preview synced with server' })
    } catch (err) {
      const msg = err?.response?.data?.error || 'Refresh failed.'
      pushToast({ kind: 'error', message: msg })
    } finally {
      setRefreshing(false)
    }
  }, [applyServerData, pushToast])

  const renderEditor = () => {
    if (activeTab === 'announcement_bar') {
      return <AnnouncementBarEditor draft={settingsDraft} setDraft={setSettingsDraft} />
    }
    if (!drafts[activeTab]) return null
    const props = {
      draft: drafts[activeTab],
      setDraft: (next) => setTabDraft(activeTab, next),
      isVisible: !!isVisibleByType[activeTab],
      setIsVisible: (v) => setTabVisible(activeTab, v),
    }
    switch (activeTab) {
      case 'hero':
        return <HeroEditor {...props} />
      case 'featured_trio':
        return <FeaturedTrioEditor {...props} />
      case 'bestsellers':
        return <BestsellersEditor {...props} productCache={productCache} />
      case 'categories':
        return <CategoriesEditor {...props} categoryTree={tree} />
      case 'features':
        return <FeaturesEditor {...props} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1500px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="font-serif text-3xl text-brand-navy">Homepage</h1>
          <p className="text-sm text-brand-navy/60 mt-1">
            Edit every section the public homepage renders. Preview updates as you type.
          </p>
        </div>
        <div className="inline-flex border border-brand-line rounded-xl overflow-hidden bg-white shrink-0">
          <button
            type="button"
            onClick={() => setPreviewDevice('desktop')}
            className={`flex items-center gap-2 px-3 h-10 text-[12px] font-bold uppercase tracking-wider transition-colors ${
              previewDevice === 'desktop' ? 'bg-brand-navy text-white' : 'text-brand-navy/70 hover:bg-brand-page'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 20h8M12 17v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice('mobile')}
            className={`flex items-center gap-2 px-3 h-10 text-[12px] font-bold uppercase tracking-wider transition-colors ${
              previewDevice === 'mobile' ? 'bg-brand-navy text-white' : 'text-brand-navy/70 hover:bg-brand-page'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Mobile
          </button>
        </div>
      </div>

      {loadError && (
        <div className="bg-warning-bg text-warning border border-warning/20 rounded-xl p-3 text-[13px] mb-4">
          {loadError} Editing with local defaults — saves will still hit the server.
        </div>
      )}

      <div className="mb-5">
        <SectionReorderStrip
          sections={sections}
          activeType={activeTab}
          onReorder={handleReorder}
          onToggleVisible={handleToggleVisible}
          onPick={(type) => setActiveTab(type)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-5 items-start">
        <div className="bg-white border border-brand-line rounded-2xl overflow-hidden flex flex-col">
          <div className="flex border-b border-brand-line overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => setActiveTab(t.type)}
                className={`px-4 h-12 text-[12.5px] font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === t.type
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-brand-navy/60 hover:text-brand-navy'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="p-5">{renderEditor()}</div>
          <div className="px-5 py-4 border-t border-brand-line bg-brand-page/50 flex items-center justify-end gap-4">
            <StatusLine status={status[activeTab]} />
            <button
              type="button"
              onClick={() => handleSave(activeTab)}
              disabled={!!saving[activeTab]}
              className="bg-brand-gold hover:bg-[#b7830a] disabled:opacity-60 transition-colors text-white font-bold text-sm px-5 h-10 rounded-xl"
            >
              {saving[activeTab] ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>

        <div className="lg:sticky lg:top-4 self-start">
          <LivePreview
            device={previewDevice}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      <Toaster toasts={toasts} />
    </div>
  )
}

export default AdminHomepagePage
