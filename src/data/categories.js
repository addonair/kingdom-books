// Three-level category tree powering the shop filters and navbar mega menus.
// Slugs match the backend `category_slug` values where leaf categories exist.
// For book subcategories that do not have leaf item types in the backend
// (Basic School, JHS, SHS, Tertiary, Novels & Fiction, Religious & General),
// the subcategory slug itself maps directly to a backend category_slug.

export const POPULAR_AUTHORS = [
  'Chinua Achebe',
  'Yaa Gyasi',
  'Kwame Nkrumah',
  'Ama Ata Aidoo',
  'Ben Okri',
]

export const STATIONERY_BRANDS = [
  'Deli',
  'Staedtler',
  'Faber-Castell',
  'Casio',
  'Pilot',
  'Claro',
  'Flair',
  'Bic',
]

export const CONDITIONS = ['New', 'Used Good', 'Remaindered']

export const PRICE_MIN = 0
export const PRICE_MAX = 1000

export const CATEGORY_TREE = {
  books: {
    label: 'Books',
    subcategories: [
      { slug: 'basic-school', label: 'Basic School', itemTypes: [] },
      { slug: 'jhs', label: 'JHS', itemTypes: [] },
      { slug: 'shs', label: 'SHS', itemTypes: [] },
      { slug: 'tertiary', label: 'Tertiary', itemTypes: [] },
      { slug: 'novels-fiction', label: 'Novels & Fiction', itemTypes: [] },
      { slug: 'religious-general', label: 'Religious & General', itemTypes: [] },
      {
        slug: 'writing-books',
        label: 'Writing Books',
        itemTypes: [
          { slug: 'exercise-books', label: 'Exercise Books' },
          { slug: 'notebooks', label: 'Notebooks' },
          { slug: 'diaries', label: 'Diaries' },
          { slug: 'spiral-notebooks', label: 'Spiral Notebooks' },
          { slug: 'foolscap-books', label: 'Foolscap Books' },
        ],
      },
    ],
  },
  stationery: {
    label: 'Stationery',
    subcategories: [
      {
        slug: 'writing-instruments',
        label: 'Writing Instruments',
        itemTypes: [
          { slug: 'pens', label: 'Pens' },
          { slug: 'pencils', label: 'Pencils' },
          { slug: 'markers', label: 'Markers' },
          { slug: 'highlighters', label: 'Highlighters' },
          { slug: 'crayons', label: 'Crayons' },
          { slug: 'erasers', label: 'Erasers' },
        ],
      },
      {
        slug: 'paper-supplies',
        label: 'Paper & Supplies',
        itemTypes: [
          { slug: 'a4-paper', label: 'A4 Paper' },
          { slug: 'photocopier-paper', label: 'Photocopier Paper' },
          { slug: 'cardstock', label: 'Cardstock' },
          { slug: 'envelopes', label: 'Envelopes' },
        ],
      },
      {
        slug: 'office-supplies',
        label: 'Office Supplies',
        itemTypes: [
          { slug: 'staplers', label: 'Staplers' },
          { slug: 'scissors', label: 'Scissors' },
          { slug: 'tape', label: 'Tape' },
          { slug: 'calculators', label: 'Calculators' },
          { slug: 'rulers', label: 'Rulers' },
        ],
      },
      {
        slug: 'files-folders',
        label: 'Files & Folders',
        itemTypes: [
          { slug: 'arch-files', label: 'Arch Files' },
          { slug: 'suspension-files', label: 'Suspension Files' },
          { slug: 'ring-binders', label: 'Ring Binders' },
          { slug: 'box-files', label: 'Box Files' },
          { slug: 'display-books', label: 'Display Books' },
        ],
      },
      {
        slug: 'art-drawing',
        label: 'Art & Drawing',
        itemTypes: [
          { slug: 'brushes', label: 'Brushes' },
          { slug: 'paints', label: 'Paints' },
          { slug: 'canvas', label: 'Canvas' },
          { slug: 'oil-pastels', label: 'Oil Pastels' },
          { slug: 'sketchpads', label: 'Sketchpads' },
        ],
      },
      {
        slug: 'school-essentials',
        label: 'School Essentials',
        itemTypes: [
          { slug: 'math-sets', label: 'Math Sets' },
          { slug: 'compass', label: 'Compass' },
          { slug: 'drawing-boards', label: 'Drawing Boards' },
          { slug: 'protractors', label: 'Protractors' },
        ],
      },
    ],
  },
}

export function getSubcategories(tree, mainCategory) {
  return tree?.[mainCategory]?.subcategories || []
}

export function findSubcategory(tree, mainCategory, subSlug) {
  return getSubcategories(tree, mainCategory).find((s) => s.slug === subSlug) || null
}

export function findItemType(tree, mainCategory, subSlug, itemSlug) {
  const sub = findSubcategory(tree, mainCategory, subSlug)
  return sub?.itemTypes?.find((i) => i.slug === itemSlug) || null
}

// Set of leaf category_slug values that belong to each main category.
// Used for client-side narrowing when the backend does not yet honor
// mainCategory/subCategory query params.
export function leafSlugsForMain(tree, mainCategory) {
  const subs = getSubcategories(tree, mainCategory)
  const leaves = new Set()
  for (const s of subs) {
    if (s.itemTypes && s.itemTypes.length > 0) {
      for (const it of s.itemTypes) leaves.add(it.slug)
    } else {
      leaves.add(s.slug)
    }
  }
  return leaves
}

export function leafSlugsForSubcategory(tree, mainCategory, subSlug) {
  const sub = findSubcategory(tree, mainCategory, subSlug)
  if (!sub) return new Set()
  if (sub.itemTypes && sub.itemTypes.length > 0) {
    return new Set(sub.itemTypes.map((i) => i.slug))
  }
  return new Set([sub.slug])
}
