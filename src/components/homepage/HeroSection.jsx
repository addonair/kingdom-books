import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const trustSignals = [
  {
    label: '10,000+ Products',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    label: 'Free Delivery',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Mobile Money Accepted',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Gift Cards Available',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
]

function HeroSection({ content, interactive = true }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState(0)

  const title = content?.title || 'Books, stationery & gifts for the academic year'
  const subtitle =
    content?.subtitle || 'Search 12,000+ titles. Free delivery nationwide. Pay with Mobile Money.'
  const bgColor = content?.bg_color || '#001a36'
  const textColor = content?.text_color || '#ffffff'
  const buttonText = content?.button_text || 'Search'
  const buttonLink = content?.button_link || '/shop'
  const images = Array.isArray(content?.images) ? content.images.filter(Boolean) : []
  const hasImages = images.length > 0

  // Auto-advance slideshow
  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), 5000)
    return () => clearInterval(timer)
  }, [images.length])

  // Clamp index so it never falls out of range when the image list shrinks
  const slideIndex = images.length > 0 ? current % images.length : 0

  function onSearch(e) {
    e.preventDefault()
    if (!interactive) return
    const q = query.trim()
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : buttonLink || '/shop')
  }

  const sectionStyle = hasImages
    ? {
        backgroundImage: `linear-gradient(to bottom, rgba(0,10,26,0.62) 0%, rgba(0,10,26,0.48) 100%), url(${images[slideIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: textColor,
        transition: 'background-image 0.6s ease',
      }
    : {
        background: `linear-gradient(120deg, ${bgColor} 0%, ${bgColor} 60%, ${bgColor} 100%)`,
        color: textColor,
      }

  return (
    <section className="relative overflow-hidden" style={sectionStyle}>
      {/* Decorative glow orbs */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(201,146,10,0.18) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 w-[260px] h-[260px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(201,146,10,0.10) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-2xl">
          <div className="text-brand-gold text-[11px] md:text-xs uppercase tracking-[0.2em] mb-3">
            The Number One Academic Bookshop in Ghana
          </div>
          <h1
            className="font-serif leading-[1.1] text-2xl sm:text-4xl md:text-7xl lg:text-[56px] mb-3 md:mb-5"
            style={{ color: textColor }}
          >
            {title}
          </h1>
          <p className="text-sm md:text-base max-w-xl mb-6 md:mb-8" style={{ color: textColor, opacity: 0.75 }}>
            {subtitle}
          </p>

          <form
            onSubmit={onSearch}
            role="search"
            className="bg-white rounded-xl p-1.5 flex items-center gap-2 max-w-xl shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
          >
            <div className="pl-3 pr-1 text-brand-navy">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => interactive && setQuery(e.target.value)}
              placeholder="Search by Title, Author, or ISBN..."
              aria-label="Search products"
              readOnly={!interactive}
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-brand-navy placeholder:text-brand-navy/40 py-2.5"
            />
            {interactive ? (
              <button
                type="submit"
                className="bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shrink-0"
              >
                {buttonText}
              </button>
            ) : (
              <Link
                to={buttonLink || '/shop'}
                className="bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shrink-0"
              >
                {buttonText}
              </Link>
            )}
          </form>

          <Link
            to="/shop-smart"
            className="mt-3 inline-flex items-center gap-2 border border-brand-gold/40 bg-brand-navy/30 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-brand-gold hover:bg-brand-navy/50 transition-colors font-medium"
          >
            ✨ Try Shop Smart — upload a photo of your list and we'll find everything
          </Link>

          <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {trustSignals.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2 text-[12px] md:text-[13px]"
                style={{ color: textColor, opacity: 0.75 }}
              >
                <span className="text-brand-gold shrink-0">{t.icon}</span>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicators — only shown when multiple images exist */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 mt-8">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => interactive && setCurrent(i % images.length)}
                className={`rounded-full transition-all duration-300 ${
                  i === slideIndex
                    ? 'w-6 h-2 bg-brand-gold'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroSection
