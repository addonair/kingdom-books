import { useMemo } from 'react'

const inputClass =
  'w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors disabled:bg-brand-page/60 disabled:cursor-not-allowed'

const labelClass =
  'block text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1.5'

const DEFAULT_LABELS = {
  main: 'Main Category',
  sub: 'Subcategory',
  item: 'Item Type / Subject',
}

// Resolve a category's parent id whether the API returns `parent_id`,
// `parentId`, or a nested `parent` object. Returns null for top-level rows.
function parentIdOf(c) {
  const raw =
    c?.parent_id ??
    c?.parentId ??
    (c?.parent && (c.parent.id ?? c.parent.ID)) ??
    null
  return raw == null ? null : Number(raw)
}

// Walk parent chain over a Map to collect all descendants of an id.
// `byParent` is keyed by Number(parent id); callers must pass Number(id).
function descendantsOf(byParent, id, acc = new Set()) {
  const kids = byParent.get(id) || []
  for (const k of kids) {
    const kid = Number(k.id)
    if (!acc.has(kid)) {
      acc.add(kid)
      descendantsOf(byParent, kid, acc)
    }
  }
  return acc
}

function CategoryCascadePicker({
  categories,
  value,
  onChange,
  layout = 'grid',
  maxLevel = 3,
  allowAll = false,
  excludeId,
  labels: labelOverrides,
}) {
  const labels = { ...DEFAULT_LABELS, ...(labelOverrides || {}) }
  const mainId = value?.mainId ?? ''
  const subId = value?.subId ?? ''
  const itemId = value?.itemId ?? ''

  // Keys are coerced to Number so the lookup matches no matter whether the
  // API returns `parent_id` as an integer or a numeric string. Select values
  // always come in as strings, so we coerce on read too.
  // `parentIdOf` tolerates `parent_id`, `parentId`, or a nested `parent`.
  const byParent = useMemo(() => {
    const m = new Map()
    for (const c of categories) {
      const k = parentIdOf(c)
      if (!m.has(k)) m.set(k, [])
      m.get(k).push(c)
    }
    for (const arr of m.values()) {
      arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }
    return m
  }, [categories])

  const excluded = useMemo(() => {
    if (excludeId == null) return new Set()
    const set = new Set([Number(excludeId)])
    descendantsOf(byParent, Number(excludeId), set)
    return set
  }, [byParent, excludeId])

  const roots = (byParent.get(null) || []).filter(
    (c) => !excluded.has(Number(c.id)),
  )
  const subLookupKey = mainId === '' ? null : Number(mainId)
  const itemLookupKey = subId === '' ? null : Number(subId)
  const subOptions = mainId
    ? (byParent.get(subLookupKey) || []).filter(
        (c) => !excluded.has(Number(c.id)),
      )
    : []
  const itemOptions = subId
    ? (byParent.get(itemLookupKey) || []).filter(
        (c) => !excluded.has(Number(c.id)),
      )
    : []

  function emit(next) {
    onChange?.({ mainId: '', subId: '', itemId: '', ...next })
  }

  function pickMain(v) {
    emit({ mainId: v, subId: '', itemId: '' })
  }
  function pickSub(v) {
    emit({ mainId, subId: v, itemId: '' })
  }
  function pickItem(v) {
    emit({ mainId, subId, itemId: v })
  }

  const wrapperClass =
    layout === 'grid'
      ? `grid grid-cols-1 ${maxLevel >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`
      : 'flex flex-col gap-3'

  return (
    <div className={wrapperClass}>
      <div>
        <label className={labelClass}>{labels.main}</label>
        <select
          className={inputClass}
          value={mainId}
          onChange={(e) => pickMain(e.target.value)}
        >
          <option value="">{allowAll ? 'All' : '— Top level —'}</option>
          {roots.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {maxLevel >= 2 && (
        <div>
          <label className={labelClass}>{labels.sub}</label>
          <select
            className={inputClass}
            value={subId}
            onChange={(e) => pickSub(e.target.value)}
            disabled={!mainId || subOptions.length === 0}
          >
            <option value="">
              {!mainId
                ? '— Pick main first —'
                : subOptions.length === 0
                  ? '— None —'
                  : allowAll
                    ? 'All'
                    : '— None —'}
            </option>
            {subOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {maxLevel >= 3 && (
        <div>
          <label className={labelClass}>{labels.item}</label>
          <select
            className={inputClass}
            value={itemId}
            onChange={(e) => pickItem(e.target.value)}
            disabled={!subId || itemOptions.length === 0}
          >
            <option value="">
              {!subId
                ? '— Pick subcategory first —'
                : itemOptions.length === 0
                  ? '— None —'
                  : allowAll
                    ? 'All'
                    : '— None —'}
            </option>
            {itemOptions.map((it) => (
              <option key={it.id} value={it.id}>
                {it.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default CategoryCascadePicker
