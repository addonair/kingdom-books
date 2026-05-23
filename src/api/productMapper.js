// Maps the live API product shape into the shape the existing UI expects.
// The DB is source of truth for inventory data; visual-only fields (shape,
// accent, rating, isbn, etc.) fall back to safe defaults derived from the
// product's format and title.

const categoryNameToSection = {
  'Stationery & Supplies': 'Stationery',
  'Gifts & Novelties': 'Gifts',
}

const categoryNameToSlug = {
  Business: 'business',
  Science: 'science',
  Humanities: 'humanities',
  Vocational: 'vocational',
  'General Books': 'general-books',
  'Stationery & Supplies': 'stationery-supplies',
  'Gifts & Novelties': 'gifts-novelties',
}

export function categorySlugForName(name) {
  return categoryNameToSlug[name] || null
}

// Accepts either a raw URL string (legacy seed data) or the API shape
// `{ image_url, is_primary }`. Returns just the URL, or null if missing.
export function imageSrc(img) {
  if (!img) return null
  if (typeof img === 'string') return img
  return img.image_url || img.url || null
}

// Returns the product's image URLs in display order: any image flagged
// `is_primary` floats to the front, the rest keep their original order.
// Skips entries without a usable URL.
export function imageUrls(images) {
  if (!Array.isArray(images)) return []
  const items = []
  for (const img of images) {
    const url = imageSrc(img)
    if (!url) continue
    const isPrimary =
      typeof img === 'object' && img != null
        ? !!(img.is_primary || img.isPrimary)
        : false
    items.push({ url, isPrimary })
  }
  items.sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
  return items.map((i) => i.url)
}

function deriveShape(p) {
  const t = (p.title || '').toLowerCase()
  if (t.includes('calculator')) return 'calculator'
  if (t.includes('notebook')) return 'notebook'
  if (t.includes('paper')) return 'ream'
  if (t.includes('tote')) return 'tote'
  if (t.includes('fineliner') || t.includes('marker')) return 'markers'
  if (t.includes('pen')) return 'pen'
  return 'book'
}

export function mapProduct(p) {
  if (!p) return null
  const section = categoryNameToSection[p.category_name] || p.category_name || ''
  const price = Number(p.price)
  const isSale = p.badge === 'Sale'
  return {
    id: p.id,
    title: p.title,
    brand: p.author || '',
    section,
    category: p.category_name || '',
    categorySlug: p.category_slug || '',
    itemType: p.item_type || '',
    authorName: p.author || '',
    brandName: p.brand || '',
    format: p.format || '',
    condition: p.condition || 'New',
    level: p.level || '',
    purpose: p.purpose || '',
    publisher: p.brand || '',
    badge: p.badge || null,
    price,
    oldPrice: isSale ? Math.round(price * 1.25 * 100) / 100 : null,
    rating: p.rating != null ? Number(p.rating) : null,
    reviewCount: Number(p.review_count ?? p.reviewCount ?? 0),
    edition: p.edition || '',
    isbn: p.isbn || null,
    pages: p.pages != null ? Number(p.pages) : null,
    language: p.language || null,
    color: p.cover_color || '#001a36',
    accent: '#fff',
    shape: deriveShape(p),
    description: p.description || '',
    stock: p.stock,
    images: imageUrls(p.images),
    created_at: p.created_at || null,
  }
}

export function mapProducts(list) {
  return (list || []).map(mapProduct)
}
