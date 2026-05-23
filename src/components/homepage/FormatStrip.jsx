import { Link } from 'react-router-dom'

const FORMATS = [
  'Hardcover',
  'Paperback',
  'Audiobook',
  'E-book Gift Card',
  'Signed Copy',
  'Boxed Set',
  'Large Print',
  'Used / Secondhand',
]

function FormatStrip() {
  return (
    <section className="max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-10 md:pb-14">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-serif text-xl md:text-2xl text-brand-navy">Shop by Format</h3>
        <Link to="/shop" className="text-brand-gold text-xs md:text-sm font-semibold hover:underline">
          All formats →
        </Link>
      </div>
      <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 px-4 sm:px-6 md:px-8 lg:px-10 overflow-x-auto">
        <div className="flex gap-2.5 pb-2 min-w-max">
          {FORMATS.map((f, i) => (
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
  )
}

export default FormatStrip
