// Icon dictionary keyed by emoji-style icon name. The admin picker stores
// the key string; renderer maps it back to a JSX SVG. A handful of common
// commerce/service icons + a star fallback covers the spec.
const ICONS = {
  truck: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6h11v10H3zM14 9h4l3 3v4h-7M6 19a2 2 0 100-4 2 2 0 000 4zM18 19a2 2 0 100-4 2 2 0 000 4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
  return: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12a9 9 0 1015.5-6.2L21 8M21 3v5h-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  gift: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8s-3-5-6-3 0 5 6 3zM12 8s3-5 6-3 0 5-6 3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
  phone: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  book: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  star: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.9L12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

import { useBrand } from '../../context/BrandContext.jsx'

function FeaturesSection({ content }) {
  const brand = useBrand()
  const title = content?.title || `Why ${brand.storeNameShort}`
  const cards = Array.isArray(content?.cards) ? content.cards.slice(0, 4) : []

  return (
    <section className="max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-12 md:pb-14">
      <div className="text-center mb-8 md:mb-10">
        <div className="text-brand-gold text-[11px] uppercase tracking-[0.16em] font-bold mb-2">
          Why Shop With Us
        </div>
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy">{title}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 md:p-5 border border-brand-line shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-gold-soft text-brand-gold flex items-center justify-center mb-4">
              {ICONS[card.icon] || ICONS.star}
            </div>
            <div className="font-bold text-brand-navy text-[15px] md:text-base mb-1.5">
              {card.title}
            </div>
            <p className="text-[12px] md:text-[13px] text-brand-navy/60 leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection
