import { Link } from 'react-router-dom'
import ImgWithFallback from '../ImgWithFallback.jsx'

function BestsellersSection({ content, products = [] }) {
  const title = content?.title || 'Bestsellers'
  const maxItems = content?.max_items ?? 4
  const list = products.slice(0, maxItems)

  return (
    <section className="max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pb-10 md:pb-14">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy">{title}</h2>
          <p className="text-sm text-brand-navy/60 mt-1">What's flying off the shelves this week</p>
        </div>
        <Link
          to="/shop?sort=bestselling"
          className="text-brand-gold text-sm font-semibold hover:underline shrink-0"
        >
          See all →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {list.map((book) => (
          <article
            key={book.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col"
          >
            <Link to={`/product/${book.id}`} className="block">
              <div className="aspect-[3/4] relative bg-white overflow-hidden">
                <ImgWithFallback
                  src={book.image}
                  alt={book.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  fallback={
                    <div
                      className="absolute inset-0 flex items-end p-3"
                      style={{
                        background: `linear-gradient(145deg, ${book.color || '#1a4a8a'}, ${
                          book.color || '#1a4a8a'
                        }cc)`,
                      }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />
                      <div className="text-white/90 text-[11px] font-semibold leading-tight">
                        {book.title}
                      </div>
                    </div>
                  }
                />
                {book.format && (
                  <span className="absolute top-2.5 right-2.5 bg-white/95 text-brand-navy text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
                    {book.format}
                  </span>
                )}
              </div>
            </Link>

            <div className="p-3 md:p-4 flex flex-col flex-1">
              {book.section && (
                <div className="text-[10px] uppercase tracking-wider text-brand-gold font-bold mb-1.5">
                  {book.section}
                </div>
              )}
              <Link
                to={`/product/${book.id}`}
                className="text-[13px] md:text-sm font-semibold text-brand-navy leading-snug hover:text-brand-gold transition-colors line-clamp-2"
              >
                {book.title}
              </Link>
              {book.author && (
                <div className="text-[11px] md:text-xs text-brand-navy/55 mt-1">{book.author}</div>
              )}

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
  )
}

export default BestsellersSection
