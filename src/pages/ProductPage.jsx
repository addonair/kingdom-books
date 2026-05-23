import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { getProduct, getProducts } from '../api/products.js'
import { mapProduct, mapProducts } from '../api/productMapper.js'
import ImgWithFallback from '../components/ImgWithFallback.jsx'

const formatOptions = ['Paperback', 'Hardcover', 'Large Print', 'E-book Gift Card']

const trustItems = [
  {
    text: 'Free delivery in Accra',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 7h11v9H3V7zM14 10h4l3 3v3h-7v-6z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    text: '30-day returns',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9l4-4M3 9l4 4M3 9h11a6 6 0 016 6v0a6 6 0 01-6 6H8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    text: 'Price match guarantee',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.4C17.5 22.15 20 17.25 20 12V6L12 2z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    text: 'Gift wrap available',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8s-3-5-6-3 0 5 6 3zM12 8s3-5 6-3 0 5-6 3z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

const paymentOptions = [
  { name: 'MTN MoMo', bg: '#FFCC00', fg: '#001a36' },
  { name: 'Vodafone Cash', bg: '#E60000', fg: '#ffffff' },
  { name: 'AirtelTigo', bg: '#001a36', fg: '#ffffff' },
  { name: 'Paystack Card', bg: '#011B33', fg: '#00C3F7' },
]

// Reviews come from the backend once the endpoint exists; until then we show
// an empty state instead of mock testimonials that could be mistaken for real
// customer feedback.
const reviews = []

function StarRow({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 12 12">
          <path
            d="M6 1l1.4 3h3.1l-2.5 1.9.9 3L6 7.2 3.1 8.9l.9-3L1.5 4H4.6L6 1z"
            fill={s <= Math.round(rating) ? '#C9920A' : '#e0e0e0'}
          />
        </svg>
      ))}
    </div>
  )
}

function CoverArt({ product, size = 'lg' }) {
  const dims =
    size === 'lg'
      ? { w: 240, h: 340, pad: '32px 22px', titleSize: 22 }
      : { w: 110, h: 150, pad: '14px 10px', titleSize: 11 }

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        width: dims.w,
        height: dims.h,
        background: `linear-gradient(145deg, ${product.color}cc, ${product.color})`,
        borderRadius: '2px 10px 10px 2px',
        boxShadow:
          '8px 8px 40px rgba(0,0,0,0.35), inset -4px 0 8px rgba(0,0,0,0.3)',
        padding: dims.pad,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: size === 'lg' ? 14 : 6, background: 'rgba(0,0,0,0.35)' }}
      />
      <div
        className="font-bold uppercase tracking-widest"
        style={{
          color: product.accent,
          fontSize: size === 'lg' ? 11 : 8,
          marginLeft: size === 'lg' ? 8 : 4,
          marginBottom: size === 'lg' ? 14 : 6,
        }}
      >
        {product.section}
      </div>
      <div
        className="font-serif text-white leading-tight"
        style={{ fontSize: dims.titleSize, marginLeft: size === 'lg' ? 8 : 4 }}
      >
        {product.title}
      </div>
      {size === 'lg' && (
        <>
          <div
            className="opacity-40 my-3.5 mx-2"
            style={{ height: 1, background: product.accent }}
          />
          <div className="flex-1" />
          <div className="text-white/40 ml-2" style={{ fontSize: 10 }}>
            {product.edition}
          </div>
        </>
      )}
    </div>
  )
}

function NotFound({ id }) {
  return (
    <div className="bg-brand-page min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-brand-gold text-xs uppercase tracking-[0.16em] font-bold mb-2">
          404
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-brand-navy mb-3">
          Product not found
        </h1>
        <p className="text-sm text-brand-navy/60 mb-6">
          We couldn't find a product with id <code className="font-mono">{id}</code>. It may have
          been removed, or the link is incorrect.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  )
}

function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState(formatOptions[0])
  const [qty, setQty] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [activeThumb, setActiveThumb] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    Promise.all([getProduct(id), getProducts()])
      .then(([p, all]) => {
        if (cancelled) return
        console.log('[ProductPage] raw product from API →', p)
        const mapped = mapProduct(p)
        console.log('[ProductPage] mapped product →', mapped)
        setProduct(mapped)
        setAllProducts(mapProducts(all))
        if (mapped && formatOptions.includes(mapped.format)) {
          setSelectedFormat(mapped.format)
        }
      })
      .catch((err) => {
        if (cancelled) return
        if (err.response?.status === 404) setNotFound(true)
        else setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const related = useMemo(() => {
    if (!product) return []
    const same = allProducts.filter(
      (p) => p.id !== product.id && p.section === product.section,
    )
    const others = allProducts.filter(
      (p) => p.id !== product.id && p.section !== product.section,
    )
    return [...same, ...others].slice(0, 4)
  }, [product, allProducts])

  if (loading) {
    return (
      <div className="bg-brand-page min-h-[60vh] flex items-center justify-center">
        <div className="text-brand-navy/60 text-sm">Loading product…</div>
      </div>
    )
  }
  if (notFound || !product) return <NotFound id={id} />

  const total = product.price * qty
  const discountPct = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  const details = [
    ['ISBN', product.isbn || 'N/A'],
    ['Publisher', product.publisher || 'N/A'],
    ['Edition', product.edition || 'N/A'],
    ['Pages', product.pages != null ? String(product.pages) : 'N/A'],
    ['Language', product.language || 'N/A'],
  ]

  const thumbs = [product.color, '#0d3060', '#2d5fa6']
  const galleryImages = Array.isArray(product.images) ? product.images : []
  const hasImages = galleryImages.length > 0
  const safeThumbIdx = hasImages
    ? Math.min(activeThumb, galleryImages.length - 1)
    : Math.min(activeThumb, thumbs.length - 1)

  const handleAddToCart = () => {
    addToCart({ ...product, format: selectedFormat }, qty)
  }

  return (
    <div className="bg-brand-page min-h-screen pb-16">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-3 flex items-center gap-2 text-xs text-brand-navy/60 flex-wrap"
      >
        <Link to="/" className="text-brand-gold hover:underline">
          Home
        </Link>
        <span>›</span>
        <Link to="/shop" className="text-brand-gold hover:underline">
          Shop
        </Link>
        <span>›</span>
        <Link
          to={`/shop?section=${encodeURIComponent(product.section)}`}
          className="text-brand-gold hover:underline"
        >
          {product.section}
        </Link>
        <span>›</span>
        <span className="font-semibold text-brand-navy line-clamp-1">{product.title}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Gallery */}
          <div>
            {hasImages ? (
              <>
                <div className="relative rounded-2xl overflow-hidden bg-white border border-brand-line aspect-[4/5] sm:aspect-square">
                  <ImgWithFallback
                    key={safeThumbIdx}
                    src={galleryImages[safeThumbIdx]}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out"
                    style={{ animation: 'productImageFade 300ms ease-out' }}
                    fallback={
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(150deg, ${product.color} 0%, ${product.color}cc 100%)`,
                        }}
                      >
                        <CoverArt product={product} size="lg" />
                      </div>
                    }
                  />
                </div>
                {galleryImages.length > 1 && (
                  <div
                    className={`mt-3 sm:mt-4 grid gap-2 sm:gap-3 ${
                      galleryImages.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                    }`}
                  >
                    {galleryImages.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveThumb(i)}
                        aria-label={`Show image ${i + 1}`}
                        className={`relative aspect-square rounded-xl overflow-hidden bg-white border transition-all ${
                          safeThumbIdx === i
                            ? 'border-brand-gold ring-2 ring-brand-gold ring-offset-2 ring-offset-brand-page'
                            : 'border-brand-line opacity-80 hover:opacity-100'
                        }`}
                      >
                        <ImgWithFallback
                          src={src}
                          alt={`${product.title} thumbnail ${i + 1}`}
                          className="w-full h-full object-cover"
                          fallback={
                            <div
                              className="w-full h-full"
                              style={{ background: product.color }}
                            />
                          }
                        />
                      </button>
                    ))}
                  </div>
                )}
                <style>{`@keyframes productImageFade { from { opacity: 0 } to { opacity: 1 } }`}</style>
              </>
            ) : (
              <>
                <div
                  className="relative rounded-2xl flex items-center justify-center overflow-hidden p-4 sm:p-10 min-h-[240px] sm:min-h-[360px]"
                  style={{
                    background: `linear-gradient(150deg, ${thumbs[safeThumbIdx]} 0%, ${product.color} 50%, ${product.color}cc 100%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle at 40% 60%, rgba(201,146,10,0.2) 0%, transparent 70%)',
                    }}
                  />
                  <CoverArt product={product} size="lg" />
                </div>

                <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                  {thumbs.map((color, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveThumb(i)}
                      aria-label={`Thumbnail ${i + 1}`}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center transition-all ${
                        safeThumbIdx === i
                          ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-brand-page'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{
                        background: `linear-gradient(150deg, ${color}, ${color}cc)`,
                      }}
                    >
                      <CoverArt
                        product={{ ...product, color }}
                        size="md"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-[#f0f4ff] text-brand-navy rounded text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                {product.section} · {product.category}
              </span>
              <span className="bg-brand-navy text-white rounded text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                {selectedFormat}
              </span>
            </div>

            <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl text-brand-navy leading-tight mb-2">
              {product.title}
            </h1>
            <div className="text-sm text-brand-navy/65 mb-3">
              by{' '}
              <span className="text-brand-navy font-semibold">{product.brand}</span> ·{' '}
              {product.edition} · {product.publisher}
            </div>

            <div className="flex items-center gap-2 mb-5">
              {product.rating != null ? (
                <>
                  <StarRow rating={product.rating} size={16} />
                  <span className="text-[13px] text-brand-navy/65">
                    {product.rating} · {product.reviewCount.toLocaleString()} reviews
                  </span>
                </>
              ) : (
                <span className="text-[13px] text-brand-navy/55">No reviews yet</span>
              )}
            </div>

            <div className="flex items-baseline gap-3 flex-wrap mb-6">
              <div className="font-extrabold text-2xl sm:text-4xl text-brand-gold">
                GH₵ {product.price.toFixed(2)}
              </div>
              {product.oldPrice && (
                <>
                  <div className="text-base text-brand-muted line-through">
                    GH₵ {product.oldPrice.toFixed(2)}
                  </div>
                  <span className="bg-success-bg text-success rounded text-xs font-bold px-2 py-1">
                    {discountPct}% OFF
                  </span>
                </>
              )}
              <span className="ml-auto sm:ml-0 text-xs text-success font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success" />
                In Stock
              </span>
            </div>

            {/* Format selector */}
            <div className="mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-2.5">
                Choose Format
              </div>
              <div className="grid grid-cols-2 gap-2">
                {formatOptions.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFormat(f)}
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-left transition-colors border-[1.5px] ${
                      selectedFormat === f
                        ? 'border-brand-gold bg-brand-gold-soft'
                        : 'border-brand-line bg-white hover:border-brand-gold/50'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                        selectedFormat === f
                          ? 'border-brand-gold bg-brand-gold'
                          : 'border-[#ccc]'
                      }`}
                    />
                    <span
                      className={`text-[13px] ${
                        selectedFormat === f
                          ? 'text-brand-navy font-semibold'
                          : 'text-brand-navy/70'
                      }`}
                    >
                      {f}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-5 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                Quantity
              </span>
              <div className="inline-flex items-center border-[1.5px] border-brand-line rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 text-brand-navy text-lg hover:bg-brand-page"
                >
                  −
                </button>
                <div className="w-10 text-center text-sm font-semibold text-brand-navy">
                  {qty}
                </div>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-9 text-brand-navy text-lg hover:bg-brand-page"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <button
                type="button"
                onClick={handleAddToCart}
                className="sm:flex-[2] bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-extrabold text-sm sm:text-base px-6 py-4 rounded-xl shadow-[0_8px_24px_rgba(201,146,10,0.35)]"
              >
                Add to Cart — GH₵ {total.toFixed(2)}
              </button>
              <button
                type="button"
                onClick={() => setWishlisted((w) => !w)}
                className={`sm:flex-1 inline-flex items-center justify-center gap-2 border-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-colors ${
                  wishlisted
                    ? 'border-error text-error bg-error-bg'
                    : 'border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white'
                }`}
              >
                <svg width="18" height="16" viewBox="0 0 24 22" fill="none">
                  <path
                    d="M12 21C12 21 2 14.5 2 7a5 5 0 0110 0 5 5 0 0110 0c0 7.5-10 14-10 14z"
                    stroke="currentColor"
                    fill={wishlisted ? 'currentColor' : 'none'}
                    strokeWidth="2.5"
                  />
                </svg>
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Trust bar */}
            <div className="bg-white rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {trustItems.map((t) => (
                <div
                  key={t.text}
                  className="flex flex-col items-center text-center gap-1.5 text-brand-navy"
                >
                  {t.icon}
                  <span className="text-[11px] text-brand-navy/70 font-medium leading-tight">
                    {t.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment options */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/60 mb-2">
                Pay with
              </div>
              <div className="flex flex-wrap gap-2">
                {paymentOptions.map((p) => (
                  <span
                    key={p.name}
                    className="rounded-md text-[11px] font-bold px-2.5 py-1.5"
                    style={{ background: p.bg, color: p.fg }}
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <section className="mt-12 lg:mt-16 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-brand-line flex overflow-x-auto">
            {[
              { id: 'description', label: 'Description' },
              { id: 'details', label: 'Details' },
              { id: 'reviews', label: `Reviews (${product.reviewCount.toLocaleString()})` },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-5 sm:px-7 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === t.id
                    ? 'border-brand-gold text-brand-navy'
                    : 'border-transparent text-brand-navy/55 hover:text-brand-navy'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-7">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-[14px] sm:text-[15px] text-brand-navy/80 leading-relaxed space-y-4">
                <p>{product.description}</p>
                <p>
                  Suitable for undergraduate students at the University of Ghana and equivalent
                  institutions, as well as professional candidates preparing for foundation-level
                  papers in their respective fields.
                </p>
              </div>
            )}

            {activeTab === 'details' && (
              <dl className="divide-y divide-brand-line">
                {details.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-4 py-3 text-[14px]">
                    <dt className="text-brand-navy/55 font-medium">{k}</dt>
                    <dd className="col-span-2 text-brand-navy font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-5">
                {reviews.length === 0 && (
                  <div className="text-center py-10 text-sm text-brand-navy/60">
                    No reviews yet. Be the first to review this product after purchase.
                  </div>
                )}
                {reviews.map((r) => (
                  <article
                    key={r.name}
                    className="border border-brand-line rounded-xl p-4 sm:p-5"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-brand-navy text-brand-gold font-bold flex items-center justify-center text-sm shrink-0">
                        {r.name
                          .split(' ')
                          .map((s) => s[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-brand-navy text-[14px]">{r.name}</div>
                        <div className="text-[11px] text-brand-navy/55">{r.role}</div>
                      </div>
                      <StarRow rating={r.rating} size={13} />
                    </div>
                    <div className="font-semibold text-brand-navy text-[14px] mb-1">
                      {r.title}
                    </div>
                    <p className="text-[13px] text-brand-navy/70 leading-relaxed">{r.body}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* You might also like */}
        <section className="mt-12 lg:mt-16">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy">
                You Might Also Like
              </h2>
              <p className="text-sm text-brand-navy/60 mt-1">
                Hand-picked picks for {product.section.toLowerCase()} shoppers
              </p>
            </div>
            <Link
              to="/shop"
              className="text-brand-gold text-sm font-semibold hover:underline shrink-0"
            >
              See all →
            </Link>
          </div>

          {/* Mobile horizontal scroll */}
          <div className="md:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto">
            <div className="flex gap-3 pb-3 min-w-max">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/product/${r.id}`}
                  className="block w-44 shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[3/4] relative bg-white">
                    <ImgWithFallback
                      src={r.images && r.images[0]}
                      alt={r.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      fallback={
                        <div
                          className="absolute inset-0 flex items-end p-3"
                          style={{
                            background: `linear-gradient(145deg, ${r.color}, ${r.color}cc)`,
                          }}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />
                          <div className="text-white/90 text-[11px] font-semibold leading-tight">
                            {r.title}
                          </div>
                        </div>
                      }
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] uppercase tracking-wider text-brand-gold font-bold mb-1">
                      {r.section}
                    </div>
                    <div className="text-[13px] font-semibold text-brand-navy line-clamp-2 leading-snug min-h-[2.6em]">
                      {r.title}
                    </div>
                    <div className="text-[11px] text-brand-navy/55 mt-1">{r.brand}</div>
                    <div className="text-brand-gold font-extrabold text-base mt-2">
                      GH₵ {r.price}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {related.map((r) => (
              <article
                key={r.id}
                className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
              >
                <Link to={`/product/${r.id}`} className="block">
                  <div className="aspect-[3/4] relative bg-white">
                    <ImgWithFallback
                      src={r.images && r.images[0]}
                      alt={r.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      fallback={
                        <div
                          className="absolute inset-0 flex items-end p-3"
                          style={{
                            background: `linear-gradient(145deg, ${r.color}, ${r.color}cc)`,
                          }}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />
                          <div className="text-white/90 text-[12px] font-semibold leading-tight">
                            {r.title}
                          </div>
                        </div>
                      }
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-wider text-brand-gold font-bold mb-1.5">
                    {r.section}
                  </div>
                  <Link
                    to={`/product/${r.id}`}
                    className="text-[14px] font-semibold text-brand-navy line-clamp-2 leading-snug min-h-[2.8em] hover:text-brand-gold transition-colors block"
                  >
                    {r.title}
                  </Link>
                  <div className="text-[11px] text-brand-navy/55 mt-1">{r.brand}</div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-brand-gold font-extrabold text-lg">GH₵ {r.price}</div>
                    <button
                      type="button"
                      onClick={() => addToCart(r, 1)}
                      className="bg-brand-navy hover:bg-brand-navy-deep text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                      + Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductPage
