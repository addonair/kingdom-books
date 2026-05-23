import { Link } from 'react-router-dom'

const categoryMeta = {
  books: {
    desc: 'Textbooks, novels, religious & more',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M19 3v18M9 8l3-2 3 2v6l-3-2-3 2V8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  stationery: {
    desc: 'Pens, paper, office supplies & more',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <path d="M16 4l4 4-12 12H4v-4L16 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
}

const defaultIcon = (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 9h18M8 13h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

function CategoriesSection({ content, categoryTree = {} }) {
  const title = content?.title || 'Shop by Section'
  const maxItems = content?.max_items ?? 8
  const slugs = Array.isArray(content?.category_slugs) && content.category_slugs.length > 0
    ? content.category_slugs
    : Object.keys(categoryTree)

  const cards = slugs.slice(0, maxItems).map((slug) => {
    const node = categoryTree[slug]
    return {
      key: slug,
      label: node?.label || slug,
      desc: categoryMeta[slug]?.desc || `Browse our ${(node?.label || slug).toLowerCase()} collection`,
      icon: categoryMeta[slug]?.icon || defaultIcon,
    }
  })

  const bookSubcatChips = (categoryTree.books?.subcategories ?? []).map((s) => ({
    slug: s.slug,
    label: s.label,
  }))

  return (
    <section className="max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy">{title}</h2>
          <p className="text-sm text-brand-navy/60 mt-1">Pick a department to start browsing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {cards.map((c, i) => {
          const isFeatured = i === 0
          return (
            <Link
              key={c.key}
              to={`/shop?mainCategory=${c.key}`}
              className={`group rounded-2xl p-5 md:p-6 flex items-center gap-5 md:gap-6 min-h-[130px] md:min-h-[150px] transition-all hover:-translate-y-1 hover:shadow-xl ${
                isFeatured
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-white border border-brand-line text-brand-navy shadow-sm'
              }`}
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                  isFeatured ? 'bg-brand-gold text-brand-navy' : 'bg-brand-gold-soft text-brand-gold'
                }`}
              >
                {c.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={`font-serif text-2xl md:text-[26px] leading-tight ${
                    isFeatured ? 'text-white' : 'text-brand-navy'
                  }`}
                >
                  {c.label}
                </div>
                <p
                  className={`text-[13px] md:text-sm mt-1.5 ${
                    isFeatured ? 'text-white/70' : 'text-brand-navy/60'
                  }`}
                >
                  {c.desc}
                </p>
                <span className="inline-flex items-center gap-1.5 mt-3 text-[12px] md:text-[13px] font-bold group-hover:gap-2.5 transition-all text-brand-gold">
                  Shop {c.label} <span>→</span>
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {bookSubcatChips.length > 0 && (
        <div className="mt-6 md:mt-7">
          <div className="text-[11px] md:text-xs uppercase tracking-[0.16em] font-bold text-brand-navy/55 mb-3">
            Jump to a Books level
          </div>
          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto sm:overflow-visible">
            <div className="flex sm:flex-wrap gap-2 min-w-max sm:min-w-0">
              {bookSubcatChips.map((s) => (
                <Link
                  key={s.slug}
                  to={`/shop?mainCategory=books&subCategory=${s.slug}`}
                  className="shrink-0 bg-white border border-brand-line text-brand-navy text-[12.5px] md:text-[13px] font-semibold px-3.5 py-2 rounded-full hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CategoriesSection
