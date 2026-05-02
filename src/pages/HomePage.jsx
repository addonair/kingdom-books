import { Link } from 'react-router-dom'

const sections = [
  {
    slug: 'business',
    label: 'Business',
    count: 420,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 7h18v13H3V7z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    slug: 'science',
    label: 'Science',
    count: 612,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 3v6L4 19a2 2 0 002 2h12a2 2 0 002-2L15 9V3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 3h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    slug: 'humanities',
    label: 'Humanities',
    count: 538,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 5a2 2 0 012-2h6v18H5a2 2 0 01-2-2V5zM21 5a2 2 0 00-2-2h-6v18h6a2 2 0 002-2V5z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    slug: 'vocational',
    label: 'Vocational',
    count: 184,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M14 7l3-3 4 4-3 3M14 7l-9 9v4h4l9-9M14 7l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'general',
    label: 'General Books',
    count: 1240,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 7h7M8 11h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    slug: 'stationery',
    label: 'Stationery & Supplies',
    count: 360,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M16 4l4 4-12 12H4v-4L16 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    slug: 'gifts',
    label: 'Gifts & Novelties',
    count: 96,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8s-3-5-6-3 0 5 6 3zM12 8s3-5 6-3 0 5-6 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const formats = [
  'Hardcover',
  'Paperback',
  'Audiobook',
  'E-book Gift Card',
  'Signed Copy',
  'Boxed Set',
  'Large Print',
  'Used / Secondhand',
]

const bestsellers = [
  { id: 1, title: 'Financial Accounting Principles', author: 'Pauline Weetman', section: 'Business', format: 'Paperback', price: 85, color: '#2d5fa6' },
  { id: 2, title: 'African Political Economy', author: 'Lansana Keita', section: 'Humanities', format: 'Hardcover', price: 62, color: '#7c3d9e' },
  { id: 3, title: 'Organic Chemistry, 12th Ed.', author: 'T. W. Graham Solomons', section: 'Science', format: 'Hardcover', price: 98, color: '#c0392b' },
  { id: 4, title: 'Principles of Marketing', author: 'Philip Kotler', section: 'Business', format: 'Paperback', price: 74, color: '#1a7a4a' },
]

const featured = [
  {
    title: 'New Arrivals',
    eyebrow: 'This Semester',
    desc: 'Fresh stock for the new academic year — required texts and recommended reading.',
    cta: 'Browse new',
    bg: 'linear-gradient(135deg, #001a36 0%, #002a5c 100%)',
    accent: '#C9920A',
  },
  {
    title: 'Stationery & Gifts',
    eyebrow: 'Everyday Essentials',
    desc: 'Notebooks, pens, planners and thoughtful gifts — curated for campus life.',
    cta: 'Shop stationery',
    bg: 'linear-gradient(135deg, #C9920A 0%, #e6a80f 100%)',
    accent: '#001a36',
  },
  {
    title: 'Signed & Collectible',
    eyebrow: 'Limited Editions',
    desc: 'First editions, signed copies and rare finds from Ghanaian and African authors.',
    cta: 'See collection',
    bg: 'linear-gradient(135deg, #1a4a8a 0%, #2d5fa6 100%)',
    accent: '#C9920A',
  },
]

const services = [
  {
    title: 'Free Delivery',
    desc: 'On all campus orders over GH₵ 50 — same-day on Legon.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7M6 19a2 2 0 100-4 2 2 0 000 4zM18 19a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: '30-Day Returns',
    desc: 'Bring it back unused for a full refund — no questions asked.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 12a9 9 0 1015.5-6.2L21 8M21 3v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Gift Cards',
    desc: 'Digital and physical gift cards from GH₵ 20 — perfect for any reader.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8s-3-5-6-3 0 5 6 3zM12 8s3-5 6-3 0 5-6 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Mobile Money',
    desc: 'Pay with MTN, Vodafone or AirtelTigo — instant confirmation.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

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

function HomePage() {
  return (
    <div className="bg-brand-page">
      {/* 1. Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(120deg, #001a36 0%, #002a5c 60%, #003a7c 100%)' }}
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,146,10,0.18) 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 w-[260px] h-[260px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,146,10,0.10) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-16 sm:py-20 md:py-16 lg:py-20">
          <div className="max-w-2xl">
            <div className="text-brand-gold text-[11px] md:text-xs uppercase tracking-[0.2em] mb-3">
              The Official UG Bookshop
            </div>
            <h1 className="font-serif leading-[1.1] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-5">
              Books, stationery & gifts for the academic year
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-xl mb-6 md:mb-8">
              Search 12,000+ titles. Free delivery on the Legon campus. Pay with Mobile Money.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-white rounded-xl p-1.5 flex items-center gap-2 max-w-2xl shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="pl-3 pr-1 text-brand-navy">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by Title, Author, or ISBN..."
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-brand-navy placeholder:text-brand-navy/40 py-2.5"
              />
              <button
                type="submit"
                className="bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shrink-0"
              >
                Search
              </button>
            </form>

            <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {trustSignals.map((t) => (
                <div key={t.label} className="flex items-center gap-2 text-white/75 text-[12px] md:text-[13px]">
                  <span className="text-brand-gold shrink-0">{t.icon}</span>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 md:py-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-navy">Shop by Section</h2>
            <p className="text-sm text-brand-navy/60 mt-1">Browse the bookshop's main departments</p>
          </div>
          <Link to="/shop" className="hidden sm:inline-block text-brand-gold text-sm font-semibold hover:underline shrink-0">
            View all departments →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {sections.map((s, i) => {
            const isFeatured = i === 0
            return (
              <Link
                key={s.slug}
                to={`/shop?section=${s.slug}`}
                className={`group rounded-2xl p-4 md:p-5 flex flex-col items-center text-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg ${
                  isFeatured
                    ? 'bg-brand-navy text-brand-gold shadow-md'
                    : 'bg-white border border-brand-line text-brand-navy shadow-sm'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    isFeatured ? 'bg-brand-gold text-brand-navy' : 'bg-[#f0f4ff] text-brand-navy'
                  }`}
                >
                  {s.icon}
                </div>
                <div>
                  <div className={`text-[12px] md:text-[13px] font-semibold leading-tight ${isFeatured ? 'text-white' : 'text-brand-navy'}`}>
                    {s.label}
                  </div>
                  <div className={`text-[11px] mt-1 ${isFeatured ? 'text-brand-gold' : 'text-brand-navy/50'}`}>
                    {s.count.toLocaleString()} items
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 4. Format strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-10 md:pb-14">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-serif text-xl md:text-2xl text-brand-navy">Shop by Format</h3>
          <Link to="/shop" className="text-brand-gold text-xs md:text-sm font-semibold hover:underline">
            All formats →
          </Link>
        </div>
        <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 px-4 sm:px-6 md:px-8 lg:px-10 overflow-x-auto">
          <div className="flex gap-2.5 pb-2 min-w-max">
            {formats.map((f, i) => (
              <Link
                key={f}
                to={`/shop?format=${encodeURIComponent(f)}`}
                className={`shrink-0 px-4 py-2.5 rounded-full text-[13px] font-semibold border transition-colors ${
                  i === 0
                    ? 'bg-brand-navy text-white border-brand-navy'
                    : 'bg-white text-brand-navy border-brand-line hover:border-brand-gold hover:text-brand-gold'
                }`}
              >
                {f}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bestsellers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-10 md:pb-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-navy">Bestsellers</h2>
            <p className="text-sm text-brand-navy/60 mt-1">What's flying off the shelves this week</p>
          </div>
          <Link to="/shop?sort=bestselling" className="text-brand-gold text-sm font-semibold hover:underline shrink-0">
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {bestsellers.map((book) => (
            <article
              key={book.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col"
            >
              <Link to={`/product/${book.id}`} className="block">
                <div
                  className="aspect-[3/4] relative flex items-end p-3"
                  style={{ background: `linear-gradient(145deg, ${book.color}, ${book.color}cc)` }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />
                  <span className="absolute top-2.5 right-2.5 bg-white/95 text-brand-navy text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
                    {book.format}
                  </span>
                  <div className="text-white/90 text-[11px] font-semibold leading-tight">{book.title}</div>
                </div>
              </Link>

              <div className="p-3 md:p-4 flex flex-col flex-1">
                <div className="text-[10px] uppercase tracking-wider text-brand-gold font-bold mb-1.5">
                  {book.section}
                </div>
                <Link
                  to={`/product/${book.id}`}
                  className="text-[13px] md:text-sm font-semibold text-brand-navy leading-snug hover:text-brand-gold transition-colors line-clamp-2"
                >
                  {book.title}
                </Link>
                <div className="text-[11px] md:text-xs text-brand-navy/55 mt-1">{book.author}</div>

                <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                  <div className="text-brand-gold font-extrabold text-base md:text-lg">
                    GH₵ {book.price}
                  </div>
                  <button
                    type="button"
                    className="bg-brand-navy hover:bg-brand-navy-deep text-white text-[11px] md:text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                  >
                    + Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Three featured cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-10 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {featured.map((card) => (
            <Link
              key={card.title}
              to="/shop"
              className="group relative overflow-hidden rounded-2xl p-6 md:p-7 text-white min-h-[180px] md:min-h-[200px] flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow"
              style={{ background: card.bg }}
            >
              <div>
                <div
                  className="text-[11px] uppercase tracking-[0.16em] font-bold mb-2"
                  style={{ color: card.accent }}
                >
                  {card.eyebrow}
                </div>
                <div className="font-serif text-2xl md:text-[26px] leading-tight">{card.title}</div>
                <p className="text-white/80 text-[13px] mt-2 max-w-xs">{card.desc}</p>
              </div>
              <div
                className="text-[13px] font-bold inline-flex items-center gap-1.5 mt-4 group-hover:gap-2.5 transition-all"
                style={{ color: card.accent }}
              >
                {card.cta} <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Why Kingdom Books */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-12 md:pb-20">
        <div className="text-center mb-8 md:mb-10">
          <div className="text-brand-gold text-[11px] uppercase tracking-[0.16em] font-bold mb-2">
            Why Shop With Us
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-brand-navy">Why Kingdom Books</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-2xl p-5 md:p-6 border border-brand-line shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-gold-soft text-brand-gold flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <div className="font-bold text-brand-navy text-[15px] md:text-base mb-1.5">{s.title}</div>
              <p className="text-[12px] md:text-[13px] text-brand-navy/60 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
