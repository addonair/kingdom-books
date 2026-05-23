import { useCallback, useEffect, useMemo, useState } from 'react'
import Modal from '../../components/Modal.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import CategoryCascadePicker from '../../components/admin/CategoryCascadePicker.jsx'
import ImageUploadSlots from '../../components/admin/ImageUploadSlots.jsx'
import useDebounced from '../../hooks/useDebounced.js'
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from '../../api/admin.js'
import { imageUrls } from '../../api/productMapper.js'
import ImgWithFallback from '../../components/ImgWithFallback.jsx'
import { conditions } from '../../data/products.js'

const EXTENDED_FORMATS = [
  'Hardcover',
  'Paperback',
  'Board Book',
  'Audiobook',
  'E-book Gift Card',
  'Signed Copy',
  'Used/Secondhand',
  'Boxed Set',
  'Limited Edition',
]

const BADGES = ['', 'Bestseller', 'New', 'Sale', 'Limited']

const inputClass =
  'w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors'

const labelClass =
  'block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5'

const EMPTY_FORM = {
  title: '',
  author: '',
  description: '',
  price: '',
  stock: '0',
  format: '',
  condition: 'New',
  badge: '',
  cover_color: '#001a36',
  mainId: '',
  subId: '',
  itemId: '',
  images: [],
}

const STATUS_META = {
  active: { label: 'Active', className: 'bg-success-bg text-success border border-success/20' },
  low: { label: 'Low Stock', className: 'bg-warning-bg text-warning border border-warning/20' },
  out: { label: 'Out of Stock', className: 'bg-error-bg text-error border border-error/20' },
}

function statusFor(stock) {
  const n = Number(stock || 0)
  if (n === 0) return 'out'
  if (n < 10) return 'low'
  return 'active'
}

function formatCurrency(value) {
  const n = Number(value || 0)
  return `GH₵ ${n.toFixed(2)}`
}

// Read whichever parent-id shape the API actually returns.
function parentIdOf(c) {
  const raw =
    c?.parent_id ??
    c?.parentId ??
    (c?.parent && (c.parent.id ?? c.parent.ID)) ??
    null
  return raw == null ? null : Number(raw)
}

function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounced(searchInput, 300)
  const [filter, setFilter] = useState({ mainId: '', subId: '', itemId: '' })

  const [sortKey, setSortKey] = useState('title')
  const [sortDir, setSortDir] = useState('asc')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [uploadPercent, setUploadPercent] = useState(0)
  const [formError, setFormError] = useState('')

  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  const [refreshTick, setRefreshTick] = useState(0)

  // Categories load once on mount; the list rarely changes within a session
  // and is needed for both the filter cascade and the modal cascade.
  useEffect(() => {
    let ignore = false
    getCategories()
      .then((rows) => {
        if (!ignore) setCategories(Array.isArray(rows) ? rows : [])
      })
      .catch(() => {
        if (!ignore) setCategories([])
      })
    return () => {
      ignore = true
    }
  }, [])

  // Server-side product fetch reacts to debounced search + cascade filters.
  // The `ignore` flag guards against out-of-order responses.
  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')
    const params = {
      search: debouncedSearch.trim() || undefined,
      main: filter.mainId || undefined,
      sub: filter.subId || undefined,
      item: filter.itemId || undefined,
    }
    getAdminProducts(params)
      .then((rows) => {
        if (ignore) return
        console.log('[AdminProductsPage] raw products from API →', rows)
        setProducts(Array.isArray(rows) ? rows : [])
      })
      .catch((err) => {
        if (ignore) return
        setError(err?.response?.data?.error || 'Failed to load products.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [debouncedSearch, filter.mainId, filter.subId, filter.itemId, refreshTick])

  // Keys are coerced to Number so lookups work whether the API returns
  // numeric IDs as integers or strings.
  const categoryById = useMemo(() => {
    const m = new Map()
    categories.forEach((c) => m.set(Number(c.id), c))
    return m
  }, [categories])

  const ancestorsOf = useCallback(
    (id) => {
      const chain = []
      let cur = id == null ? undefined : categoryById.get(Number(id))
      let guard = 0
      while (cur && guard++ < 8) {
        chain.unshift(cur)
        const pid = parentIdOf(cur)
        cur = pid != null ? categoryById.get(pid) : null
      }
      return chain
    },
    [categoryById],
  )

  const pathById = useMemo(() => {
    const m = new Map()
    categories.forEach((c) => {
      m.set(Number(c.id), ancestorsOf(c.id).map((n) => n.name).join(' › '))
    })
    return m
  }, [categories, ancestorsOf])

  const sorted = useMemo(() => {
    const arr = [...products]
    const dir = sortDir === 'asc' ? 1 : -1
    arr.sort((a, b) => {
      let av, bv
      switch (sortKey) {
        case 'price':
          av = Number(a.price || 0); bv = Number(b.price || 0); break
        case 'stock':
          av = Number(a.stock || 0); bv = Number(b.stock || 0); break
        case 'status':
          av = statusFor(a.stock); bv = statusFor(b.stock); break
        case 'category':
          av = (pathById.get(Number(a.category_id)) || a.category_name || '').toLowerCase()
          bv = (pathById.get(Number(b.category_id)) || b.category_name || '').toLowerCase()
          break
        case 'format':
          av = (a.format || '').toLowerCase(); bv = (b.format || '').toLowerCase(); break
        case 'author':
          av = (a.author || a.brand || '').toLowerCase()
          bv = (b.author || b.brand || '').toLowerCase()
          break
        case 'title':
        default:
          av = (a.title || '').toLowerCase(); bv = (b.title || '').toLowerCase(); break
      }
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    return arr
  }, [products, sortKey, sortDir, pathById])

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtersActive =
    !!searchInput || !!filter.mainId || !!filter.subId || !!filter.itemId

  function clearFilters() {
    setSearchInput('')
    setFilter({ mainId: '', subId: '', itemId: '' })
  }

  function refresh() {
    setRefreshTick((t) => t + 1)
  }

  // Pre-fills the form's cascade from a product's category_id by walking
  // ancestors. Returns { mainId, subId, itemId } as strings (or empty).
  function cascadeForCategory(categoryId) {
    if (categoryId == null) return { mainId: '', subId: '', itemId: '' }
    const chain = ancestorsOf(categoryId)
    const [root, mid, leaf] = chain
    if (chain.length === 1) return { mainId: String(root.id), subId: '', itemId: '' }
    if (chain.length === 2)
      return { mainId: String(root.id), subId: String(mid.id), itemId: '' }
    if (chain.length >= 3)
      return { mainId: String(root.id), subId: String(mid.id), itemId: String(leaf.id) }
    return { mainId: '', subId: '', itemId: '' }
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setUploadPercent(0)
    setModalOpen(true)
  }

  function openEdit(p) {
    const cas = cascadeForCategory(p.category_id)
    setEditing(p)
    setForm({
      title: p.title || '',
      author: p.author || p.brand || '',
      description: p.description || '',
      price: p.price != null ? String(p.price) : '',
      stock: p.stock != null ? String(p.stock) : '0',
      format: p.format || '',
      condition: p.condition || 'New',
      badge: p.badge || '',
      cover_color: p.cover_color || '#001a36',
      images: imageUrls(p.images).map((url) => ({ kind: 'existing', url })),
      ...cas,
    })
    setFormError('')
    setUploadPercent(0)
    setModalOpen(true)
  }

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
  }

  function setCategorySelection(next) {
    setForm((f) => ({ ...f, ...next }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!form.title.trim()) return setFormError('Title is required.')
    if (form.price === '' || Number.isNaN(Number(form.price))) {
      return setFormError('Price must be a number.')
    }
    if (form.stock === '' || Number.isNaN(parseInt(form.stock, 10))) {
      return setFormError('Stock must be a whole number.')
    }
    const categoryId = form.itemId || form.subId || form.mainId || ''

    const fd = new FormData()
    fd.append('title', form.title.trim())
    fd.append('author', form.author.trim())
    fd.append('description', form.description.trim())
    fd.append('price', String(Number(form.price)))
    fd.append('stock', String(parseInt(form.stock, 10)))
    fd.append('format', form.format || '')
    fd.append('condition', form.condition || 'New')
    fd.append('badge', form.badge || '')
    fd.append('cover_color', form.cover_color || '')
    if (categoryId) fd.append('category_id', String(Number(categoryId)))

    form.images.forEach((entry) => {
      if (!entry) return
      if (entry.kind === 'new' && entry.file) {
        fd.append('images', entry.file, entry.file.name)
      } else if (entry.kind === 'existing' && entry.url) {
        fd.append('existing_images[]', entry.url)
      }
    })

    setSaving(true)
    setUploadPercent(0)
    const config = {
      onUploadProgress: (evt) => {
        if (!evt.total) return
        setUploadPercent(Math.round((evt.loaded / evt.total) * 100))
      },
    }
    try {
      if (editing) {
        await updateProduct(editing.id, fd, config)
      } else {
        await createProduct(fd, config)
      }
      setModalOpen(false)
      refresh()
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Failed to save product.')
    } finally {
      setSaving(false)
      setUploadPercent(0)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return
    setDeleting(true)
    setActionError('')
    try {
      await deleteProduct(confirmDelete.id)
      setConfirmDelete(null)
      refresh()
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Failed to delete product.')
      setConfirmDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-brand-navy">Products</h1>
          <p className="text-sm text-brand-navy/60 mt-1">
            {products.length} item{products.length === 1 ? '' : 's'} in catalogue
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-5 h-11 rounded-xl shrink-0"
        >
          + Add New Product
        </button>
      </div>

      {actionError && (
        <div className="bg-error-bg text-error border border-error/20 rounded-xl p-4 text-sm mb-4">
          {actionError}
        </div>
      )}

      <div className="lg:flex lg:gap-6">
        <aside className="lg:w-72 lg:shrink-0 mb-5 lg:mb-0">
          <div className="bg-white border border-brand-line rounded-2xl p-5 lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-navy">
                Filters
              </div>
              {filtersActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[11px] font-semibold text-brand-gold hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <CategoryCascadePicker
              categories={categories}
              value={filter}
              onChange={setFilter}
              layout="stacked"
              maxLevel={3}
              allowAll
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, author or brand"
              className={inputClass}
            />
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
              <div className="px-5 py-3 border-b border-brand-line text-[12px] text-brand-navy/60">
                {sorted.length === 0 ? 'No products match your filters.' : (
                  <>Showing <strong className="text-brand-navy">{sorted.length}</strong> product{sorted.length === 1 ? '' : 's'}</>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-brand-navy/55 border-b border-brand-line bg-brand-page/60">
                      <th className="px-5 py-3 font-bold">Cover</th>
                      <SortableHeader label="Title" col="title" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <SortableHeader label="Author / Brand" col="author" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <SortableHeader label="Category" col="category" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <SortableHeader label="Format" col="format" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <SortableHeader label="Price" col="price" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <SortableHeader label="Stock" col="stock" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <SortableHeader label="Status" col="status" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <th className="px-5 py-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((p) => {
                      const stockNum = Number(p.stock || 0)
                      const status = statusFor(p.stock)
                      const meta = STATUS_META[status]
                      const path =
                        pathById.get(Number(p.category_id)) ||
                        p.category_name ||
                        '—'
                      return (
                        <tr key={p.id} className="border-b border-brand-line/60 last:border-0 hover:bg-brand-page/40 transition-colors">
                          <td className="px-5 py-3">
                            <div className="relative w-10 h-12 rounded shadow-sm border border-brand-line overflow-hidden">
                              <ImgWithFallback
                                src={imageUrls(p.images)[0]}
                                alt={p.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                                fallback={
                                  <div
                                    className="absolute inset-0"
                                    style={{ backgroundColor: p.cover_color || '#001a36' }}
                                    title={p.cover_color || ''}
                                  />
                                }
                              />
                            </div>
                          </td>
                          <td className="px-5 py-3 max-w-[260px]">
                            <div className="font-semibold text-brand-navy truncate">{p.title}</div>
                          </td>
                          <td className="px-5 py-3 text-brand-navy/80 max-w-[180px] truncate">
                            {p.author || p.brand || '—'}
                          </td>
                          <td className="px-5 py-3 text-brand-navy/80 text-[12px] max-w-[260px] truncate" title={path}>
                            {path}
                          </td>
                          <td className="px-5 py-3 text-brand-navy/80">{p.format || '—'}</td>
                          <td className="px-5 py-3 font-bold text-brand-navy whitespace-nowrap">
                            {formatCurrency(p.price)}
                          </td>
                          <td className={`px-5 py-3 font-semibold ${stockNum < 10 ? 'text-error' : 'text-brand-navy/80'}`}>
                            {stockNum}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${meta.className}`}>
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(p)}
                                className="text-[12px] font-bold border border-brand-line hover:border-brand-gold hover:text-brand-gold transition-colors px-3 h-8 rounded-lg"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(p)}
                                className="text-[12px] font-bold border border-brand-line hover:border-error hover:text-error transition-colors px-3 h-8 rounded-lg"
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
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? 'Edit Product' : 'Add New Product'}
        size="lg"
        footer={
          <div className="space-y-3">
            {saving && uploadPercent > 0 && (
              <div>
                <div className="h-1.5 w-full rounded-full bg-brand-line overflow-hidden">
                  <div
                    className="h-full bg-brand-gold transition-[width] duration-150 ease-out"
                    style={{ width: `${uploadPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-brand-muted mt-1">
                  {uploadPercent < 100
                    ? `Uploading… ${uploadPercent}%`
                    : 'Saving…'}
                </div>
              </div>
            )}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => !saving && setModalOpen(false)}
                className="text-sm font-bold text-brand-navy/70 hover:text-brand-navy px-4 h-10"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={saving}
                className="bg-brand-gold hover:bg-[#b7830a] disabled:opacity-60 transition-colors text-white font-bold text-sm px-5 h-10 rounded-xl"
              >
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Create product'}
              </button>
            </div>
          </div>
        }
      >
        <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-error-bg text-error border border-error/20 rounded-xl px-4 py-2.5 text-sm">
              {formError}
            </div>
          )}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Author / Brand</label>
            <input
              className={inputClass}
              value={form.author}
              onChange={(e) => setField('author', e.target.value)}
              placeholder="e.g. Chinua Achebe, or Casio"
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              className={`${inputClass} h-auto py-3 resize-y`}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Price (GH₵) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={inputClass}
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Stock *</label>
              <input
                type="number"
                step="1"
                min="0"
                className={inputClass}
                value={form.stock}
                onChange={(e) => setField('stock', e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Badge</label>
              <select
                className={inputClass}
                value={form.badge}
                onChange={(e) => setField('badge', e.target.value)}
              >
                {BADGES.map((b) => (
                  <option key={b || 'none'} value={b}>
                    {b || 'None'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Format</label>
              <select
                className={inputClass}
                value={form.format}
                onChange={(e) => setField('format', e.target.value)}
              >
                <option value="">— Select —</option>
                {EXTENDED_FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Condition</label>
              <select
                className={inputClass}
                value={form.condition}
                onChange={(e) => setField('condition', e.target.value)}
              >
                {conditions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Cover Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="w-14 h-11 rounded-xl border border-brand-line cursor-pointer"
                value={form.cover_color}
                onChange={(e) => setField('cover_color', e.target.value)}
              />
              <input
                className={`${inputClass} font-mono`}
                value={form.cover_color}
                onChange={(e) => setField('cover_color', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Product Images</label>
            <ImageUploadSlots
              value={form.images}
              onChange={(next) => setField('images', next)}
              maxImages={3}
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <CategoryCascadePicker
              categories={categories}
              value={{ mainId: form.mainId, subId: form.subId, itemId: form.itemId }}
              onChange={setCategorySelection}
              layout="grid"
              maxLevel={3}
            />
            <p className="text-[11px] text-brand-navy/50 mt-2">
              Place the product as deeply as possible. Leave deeper levels blank to keep it on a parent category.
            </p>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => !deleting && setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete this product?"
        message={
          confirmDelete
            ? `This will permanently delete "${confirmDelete.title}". This action cannot be undone.`
            : ''
        }
        confirmLabel="Yes, delete"
        busy={deleting}
      />
    </div>
  )
}

function SortableHeader({ label, col, sortKey, sortDir, onClick }) {
  const active = sortKey === col
  return (
    <th className="px-5 py-3 font-bold">
      <button
        type="button"
        onClick={() => onClick(col)}
        className={`inline-flex items-center gap-1 uppercase tracking-wider text-[11px] ${
          active ? 'text-brand-navy' : 'text-brand-navy/55 hover:text-brand-navy'
        }`}
      >
        {label}
        <span className="text-[9px]">
          {active ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
        </span>
      </button>
    </th>
  )
}

export default AdminProductsPage
