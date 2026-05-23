import { Link } from 'react-router-dom'

const stats = [
  { number: '50+', label: 'Years on campus' },
  { number: '12k+', label: 'Titles in stock' },
  { number: '24h', label: 'Legon delivery' },
  { number: '4.9★', label: 'Average rating' },
]

const reasons = [
  {
    title: 'Curated Selection',
    desc: 'Required course texts plus general reading — chosen for Ghanaian students and academic life.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M19 3v18M9 8l3-2 3 2v6l-3-2-3 2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Trusted Since 1974',
    desc: 'Five decades on the Legon campus serving generations of students, faculty and staff.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Local Expertise',
    desc: 'Staff who know UG syllabi and recommend confidently — across every faculty.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: 'Built for Students',
    desc: 'Mobile Money payment, free campus delivery, and fair prices that respect your budget.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-5 9 5-9 5-9-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 11v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M21 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

function AboutPage() {
  return (
    <div className="bg-brand-page">
      {/* Hero */}
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
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 sm:py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="text-brand-gold text-[11px] md:text-xs uppercase tracking-[0.2em] mb-3">
              Our Story
            </div>
            <h1 className="font-serif leading-[1.1] text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-5">
              Serving UG since 1974
            </h1>
            <p className="text-white/75 text-sm md:text-base max-w-xl">
              The official campus bookshop of the University of Ghana — books, stationery and gifts
              for every faculty, every semester, every reader.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-brand-navy">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 text-white">
                <div className="font-serif text-3xl md:text-4xl text-brand-gold leading-none mb-2">
                  {s.number}
                </div>
                <div className="text-[12px] md:text-[13px] text-white/65 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16 text-center">
        <div className="w-12 h-1 bg-brand-gold mx-auto mb-5 rounded-full" />
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy mb-4">
          Five Decades of Books, Stationery & Service
        </h2>
        <p className="text-brand-navy/70 text-sm md:text-base leading-relaxed">
          Kingdom Books opened its doors on the Legon campus in 1974 with a simple promise: every
          UG student should be able to find the right book at a fair price. Fifty years on, that
          promise still guides us. We've grown from a single counter into a full-service bookshop
          stocking thousands of titles, premium stationery, and thoughtful gifts — but we still
          measure success the same way: by the students we send back to the lecture hall ready to
          learn.
        </p>
      </section>

      {/* Why Kingdom Books */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-12 md:pb-20">
        <div className="text-center mb-8 md:mb-10">
          <div className="text-brand-gold text-[11px] uppercase tracking-[0.16em] font-bold mb-2">
            Why Shop With Us
          </div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy">Why Kingdom Books</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="bg-white rounded-2xl p-5 md:p-6 border border-brand-line shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-gold-soft text-brand-gold flex items-center justify-center mb-4">
                {r.icon}
              </div>
              <div className="font-bold text-brand-navy text-[15px] md:text-base mb-1.5">
                {r.title}
              </div>
              <p className="text-[12px] md:text-[13px] text-brand-navy/60 leading-relaxed">
                {r.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 md:mt-12 text-center">
          <Link
            to="/shop"
            className="inline-block bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-6 py-3 rounded-lg"
          >
            Browse the Bookshop
          </Link>
          <Link
            to="/contact"
            className="inline-block ml-4 border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition-colors font-bold text-sm px-6 py-3 rounded-lg"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
