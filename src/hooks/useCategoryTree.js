import { useEffect, useState } from 'react'
import { getCategories } from '../api/categories.js'
import { CATEGORY_TREE } from '../data/categories.js'

// Builds the `{ slug: { label, subcategories: [...] } }` shape that ShopPage
// and Navbar expect from the nested-tree API response.
function transform(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null
  const out = {}
  for (const row of rows) {
    if (!row?.slug) continue
    const subs = Array.isArray(row.subcategories)
      ? row.subcategories
      : Array.isArray(row.children)
        ? row.children
        : []
    out[row.slug] = {
      label: row.label || row.name || row.slug,
      subcategories: subs
        .filter((s) => s?.slug)
        .map((s) => {
          const items = Array.isArray(s.subcategories)
            ? s.subcategories
            : Array.isArray(s.children)
              ? s.children
              : []
          return {
            slug: s.slug,
            label: s.label || s.name || s.slug,
            itemTypes: items
              .filter((i) => i?.slug)
              .map((i) => ({
                slug: i.slug,
                label: i.label || i.name || i.slug,
              })),
          }
        }),
    }
  }
  return out
}

// Returns the live category tree shaped like `CATEGORY_TREE`. While the
// network call is in flight (or if it fails) the static fallback is used so
// the UI never blanks out.
export default function useCategoryTree() {
  const [tree, setTree] = useState(CATEGORY_TREE)

  useEffect(() => {
    let cancelled = false
    getCategories()
      .then((rows) => {
        if (cancelled) return
        const shaped = transform(rows)
        if (shaped && Object.keys(shaped).length > 0) setTree(shaped)
      })
      .catch(() => {
        // Keep the static fallback already in state.
      })
    return () => {
      cancelled = true
    }
  }, [])

  return tree
}
