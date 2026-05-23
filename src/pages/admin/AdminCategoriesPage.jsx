import { useEffect, useMemo, useState } from 'react'
import Modal from '../../components/Modal.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import CategoryCascadePicker from '../../components/admin/CategoryCascadePicker.jsx'
import Highlight from '../../components/admin/Highlight.jsx'
import useDebounced from '../../hooks/useDebounced.js'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../api/admin.js'

const inputClass =
  'w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors'

const labelClass =
  'block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5'

const EMPTY_FORM = { name: '', slug: '', l1Id: '', l2Id: '' }

const LEVEL_BADGE = {
  1: 'bg-brand-navy text-white',
  2: 'bg-brand-gold-soft text-brand-gold border border-brand-gold/30',
  3: 'bg-brand-page text-brand-navy/70 border border-brand-line',
}

function slugify(value) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

function buildTree(rows) {
  // Map keys are Number-coerced so the lookup matches regardless of whether
  // the API returns ids/parent_ids as integers or numeric strings.
  const byId = new Map()
  rows.forEach((r) => byId.set(Number(r.id), { ...r, children: [] }))
  const roots = []
  byId.forEach((node) => {
    const pid = parentIdOf(node)
    if (pid != null && byId.has(pid)) {
      byId.get(pid).children.push(node)
    } else {
      roots.push(node)
    }
  })
  const sortRec = (list) => {
    list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    list.forEach((n) => sortRec(n.children))
  }
  sortRec(roots)
  return roots
}

function collectAllIdsWithChildren(nodes, acc = []) {
  for (const n of nodes) {
    if (n.children.length > 0) {
      acc.push(n.id)
      collectAllIdsWithChildren(n.children, acc)
    }
  }
  return acc
}

function Caret({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`transition-transform ${open ? 'rotate-90' : ''}`}
    >
      <path
        d="M4 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TreeRow({
  node,
  level,
  expanded,
  hasChildren,
  query,
  rowError,
  onToggleExpand,
  onEdit,
  onAskDelete,
}) {
  const indent = 14 + level * 22
  return (
    <>
      <div
        className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-brand-line/60 hover:bg-brand-page/40 transition-colors"
        style={{ paddingLeft: indent }}
      >
        <button
          type="button"
          onClick={hasChildren ? () => onToggleExpand(node.id) : undefined}
          aria-label={hasChildren ? (expanded ? 'Collapse' : 'Expand') : undefined}
          className={`w-5 h-5 flex items-center justify-center shrink-0 text-brand-navy/60 hover:text-brand-navy ${
            hasChildren ? '' : 'invisible'
          }`}
        >
          <Caret open={expanded} />
        </button>

        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
            LEVEL_BADGE[Math.min(level + 1, 3)] || LEVEL_BADGE[3]
          }`}
        >
          L{level + 1}
        </span>

        <div className="min-w-0 flex-1">
          <div className="font-semibold text-brand-navy text-sm truncate">
            <Highlight text={node.name} query={query} />
          </div>
          <div className="font-mono text-[11px] text-brand-navy/55 truncate">
            <Highlight text={node.slug} query={query} />
          </div>
        </div>

        <span className="hidden sm:inline-block text-[12px] text-brand-navy/70 shrink-0">
          {node.product_count ?? 0} product{node.product_count === 1 ? '' : 's'}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(node)}
            className="text-[12px] font-bold border border-brand-line hover:border-brand-gold hover:text-brand-gold transition-colors px-3 h-8 rounded-lg"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onAskDelete(node)}
            className="text-[12px] font-bold border border-brand-line hover:border-error hover:text-error transition-colors px-3 h-8 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
      {rowError && (
        <div
          className="border-b border-brand-line/60 bg-error-bg/40 text-error text-[12px] px-4 sm:px-5 py-2"
          style={{ paddingLeft: indent + 28 }}
          role="alert"
        >
          {rowError}
        </div>
      )}
    </>
  )
}

function CategoryTree({
  tree,
  expandedIds,
  query,
  rowErrors,
  onToggleExpand,
  onEdit,
  onAskDelete,
}) {
  const walk = (nodes, level) =>
    nodes.flatMap((n) => {
      const row = (
        <TreeRow
          key={n.id}
          node={n}
          level={level}
          expanded={expandedIds.has(n.id)}
          hasChildren={n.children.length > 0}
          query={query}
          rowError={rowErrors.get(n.id)}
          onToggleExpand={onToggleExpand}
          onEdit={onEdit}
          onAskDelete={onAskDelete}
        />
      )
      const childRows = expandedIds.has(n.id) ? walk(n.children, level + 1) : []
      return [row, ...childRows]
    })
  return <div>{walk(tree, 0)}</div>
}

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounced(searchInput, 300)

  const [expandedIds, setExpandedIds] = useState(() => new Set())
  const [defaultExpansionApplied, setDefaultExpansionApplied] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [rowErrors, setRowErrors] = useState(() => new Map())

  // Server-side fetch (full list or filtered) reacts to debounced search.
  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')
    const params = { search: debouncedSearch.trim() || undefined }
    getCategories(params)
      .then((rows) => {
        if (ignore) return
        setCategories(Array.isArray(rows) ? rows : [])
        setRowErrors(new Map())
      })
      .catch((err) => {
        if (ignore) return
        setError(err?.response?.data?.error || 'Failed to load categories.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [debouncedSearch])

  const tree = useMemo(() => buildTree(categories), [categories])
  const allExpandableIds = useMemo(
    () => collectAllIdsWithChildren(tree),
    [tree],
  )
  const allExpanded =
    allExpandableIds.length > 0 && expandedIds.size === allExpandableIds.length

  // First successful load: expand top-level roots so users see L2 immediately.
  // `setState` in an effect is the established pattern across admin pages.
  useEffect(() => {
    if (defaultExpansionApplied) return
    if (categories.length === 0) return
    const next = new Set()
    tree.forEach((root) => {
      if (root.children.length > 0) next.add(root.id)
    })
    setExpandedIds(next)
    setDefaultExpansionApplied(true)
  }, [tree, categories.length, defaultExpansionApplied])

  // When a search is active, derive the ancestor chain of every matching
  // node so hits buried deep in the tree become visible without trampling
  // the user's manual expansion state.
  const searchExpandedIds = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    if (!q) return expandedIds
    const byId = new Map(categories.map((c) => [Number(c.id), c]))
    const result = new Set(expandedIds)
    for (const c of categories) {
      const hay = `${c.name || ''} ${c.slug || ''}`.toLowerCase()
      if (!hay.includes(q)) continue
      let pid = parentIdOf(c)
      let cur = pid != null ? byId.get(pid) : null
      let guard = 0
      while (cur && guard++ < 8) {
        result.add(cur.id)
        pid = parentIdOf(cur)
        cur = pid != null ? byId.get(pid) : null
      }
    }
    return result
  }, [debouncedSearch, categories, expandedIds])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setSlugTouched(false)
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(c) {
    const byId = new Map(categories.map((x) => [Number(x.id), x]))
    const parentPid = parentIdOf(c)
    const parent = parentPid != null ? byId.get(parentPid) : null
    const grandPid = parent ? parentIdOf(parent) : null
    const grand = grandPid != null ? byId.get(grandPid) : null
    let l1Id = ''
    let l2Id = ''
    if (grand) {
      l1Id = String(grand.id)
      l2Id = String(parent.id)
    } else if (parent) {
      l1Id = String(parent.id)
    }
    setEditing(c)
    setForm({ name: c.name || '', slug: c.slug || '', l1Id, l2Id })
    setSlugTouched(true)
    setFormError('')
    setModalOpen(true)
  }

  function setField(name, value) {
    setForm((f) => {
      if (name === 'name' && !slugTouched) {
        return { ...f, name: value, slug: slugify(value) }
      }
      return { ...f, [name]: value }
    })
  }

  function setParentSelection(next) {
    setForm((f) => ({
      ...f,
      l1Id: next.mainId || '',
      l2Id: next.subId || '',
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim()) return setFormError('Name is required.')
    if (!form.slug.trim()) return setFormError('Slug is required.')
    const parentId =
      form.l2Id ? Number(form.l2Id) : form.l1Id ? Number(form.l1Id) : null
    if (editing && parentId === editing.id) {
      return setFormError('A category cannot be its own parent.')
    }
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      parent_id: parentId,
    }
    setSaving(true)
    try {
      if (editing) {
        await updateCategory(editing.id, payload)
      } else {
        await createCategory(payload)
      }
      setModalOpen(false)
      // Force a refetch by toggling the search input back to itself — the
      // dep array is `[debouncedSearch]` so we re-run the effect by bumping
      // the debounced value through a quick setSearchInput.
      // Simpler: call getCategories directly here.
      const rows = await getCategories({
        search: debouncedSearch.trim() || undefined,
      }).catch(() => [])
      setCategories(Array.isArray(rows) ? rows : [])
      setRowErrors(new Map())
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Failed to save category.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return
    const id = confirmDelete.id
    setDeleting(true)
    try {
      await deleteCategory(id)
      setConfirmDelete(null)
      const rows = await getCategories({
        search: debouncedSearch.trim() || undefined,
      }).catch(() => [])
      setCategories(Array.isArray(rows) ? rows : [])
      setRowErrors((prev) => {
        const next = new Map(prev)
        next.delete(id)
        return next
      })
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to delete category.'
      setConfirmDelete(null)
      setRowErrors((prev) => {
        const next = new Map(prev)
        next.set(id, msg)
        return next
      })
    } finally {
      setDeleting(false)
    }
  }

  function toggleExpand(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function expandAll() {
    setExpandedIds(new Set(allExpandableIds))
  }

  function collapseAll() {
    setExpandedIds(new Set())
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-brand-navy">Categories</h1>
          <p className="text-sm text-brand-navy/60 mt-1">
            {categories.length} categor{categories.length === 1 ? 'y' : 'ies'}{' '}
            across {tree.length} top-level group{tree.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-5 h-11 rounded-xl"
        >
          + Add New Category
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or slug"
          className={`${inputClass} sm:max-w-md`}
        />
        <div className="flex items-center gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={expandAll}
            disabled={allExpandableIds.length === 0}
            className="text-[12px] font-bold border border-brand-line hover:border-brand-gold hover:text-brand-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-3 h-9 rounded-lg"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={collapseAll}
            disabled={expandedIds.size === 0}
            className="text-[12px] font-bold border border-brand-line hover:border-brand-gold hover:text-brand-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-3 h-9 rounded-lg"
          >
            Collapse all
          </button>
        </div>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3 border-b border-brand-line bg-brand-page/60">
            <div className="text-[11px] uppercase tracking-wider text-brand-navy/55 font-bold">
              Name / Slug
            </div>
            <span className="hidden md:inline-flex items-center gap-2 text-[11px] text-brand-navy/55">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-navy" />
                L1
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
                L2
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-line" />
                L3
              </span>
              <span>{allExpanded ? 'all expanded' : `${expandedIds.size} expanded`}</span>
            </span>
          </div>

          {tree.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-brand-navy/60">
              {debouncedSearch.trim()
                ? 'No categories match your search.'
                : 'No categories yet.'}
            </div>
          ) : (
            <CategoryTree
              tree={tree}
              expandedIds={searchExpandedIds}
              query={debouncedSearch}
              rowErrors={rowErrors}
              onToggleExpand={toggleExpand}
              onEdit={openEdit}
              onAskDelete={(node) => setConfirmDelete(node)}
            />
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? 'Edit Category' : 'Add New Category'}
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
              form="category-form"
              disabled={saving}
              className="bg-brand-gold hover:bg-[#b7830a] disabled:opacity-60 transition-colors text-white font-bold text-sm px-5 h-10 rounded-xl"
            >
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create category'}
            </button>
          </div>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-error-bg text-error border border-error/20 rounded-xl px-4 py-2.5 text-sm">
              {formError}
            </div>
          )}
          <div>
            <label className={labelClass}>Name *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              className={`${inputClass} font-mono`}
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                setField('slug', e.target.value)
              }}
              required
            />
            <p className="text-[11px] text-brand-navy/50 mt-1">
              Lowercase, hyphens only — auto-generated from the name.
            </p>
          </div>
          <div>
            <label className={labelClass}>Parent category</label>
            <p className="text-[11px] text-brand-navy/55 mb-2">
              Leave blank to create a top-level category. Pick a Level 1 to
              create a subcategory; pick Level 1 + Level 2 to place it as an
              item type.
            </p>
            <CategoryCascadePicker
              categories={categories}
              value={{
                mainId: form.l1Id,
                subId: form.l2Id,
                itemId: '',
              }}
              onChange={setParentSelection}
              layout="grid"
              maxLevel={2}
              excludeId={editing?.id}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => !deleting && setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete this category?"
        message={
          confirmDelete
            ? `This will permanently delete "${confirmDelete.name}". If it has children or assigned products the server will refuse the operation.`
            : ''
        }
        confirmLabel="Yes, delete"
        busy={deleting}
      />
    </div>
  )
}

export default AdminCategoriesPage
