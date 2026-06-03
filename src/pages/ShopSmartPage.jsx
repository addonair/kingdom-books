import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { parseTextList, parseImageList } from '../api/shopSmart.js'
import { mapProducts } from '../api/productMapper.js'

const MAX_CHARS = 2000
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_BYTES = 10 * 1024 * 1024

// ─── Sub-component: individual matched product card ──────────────────────────

function MatchedProductCard({ product, qty, checked, onQtyChange, onCheckedChange }) {
  const [imgFailed, setImgFailed] = useState(false)
  const coverUrl = product.images?.[0]?.image_url ?? null

  return (
    <div
      className={`flex gap-3 p-3 sm:p-4 rounded-xl border transition-colors ${
        checked ? 'border-brand-gold/40 bg-white' : 'border-brand-line bg-brand-page opacity-60'
      }`}
    >
      {/* Custom checkbox */}
      <button
        type="button"
        onClick={() => onCheckedChange(!checked)}
        aria-label={checked ? 'Deselect item' : 'Select item'}
        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
          checked ? 'border-brand-gold bg-brand-gold' : 'border-brand-line bg-white'
        }`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4l3 3 5-6"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Cover image or color swatch */}
      <div
        className="w-12 h-16 sm:w-14 sm:h-[72px] rounded-lg shrink-0 overflow-hidden flex items-center justify-center"
        style={{ background: product.color || '#001a36' }}
      >
        {coverUrl && !imgFailed ? (
          <img
            src={coverUrl}
            alt={product.title}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[7px] font-bold uppercase tracking-widest text-white/70 text-center px-1 leading-tight">
            {product.title.split(' ').slice(0, 3).join(' ')}
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${product.id}`}
          className="font-bold text-brand-navy text-sm hover:text-brand-gold transition-colors line-clamp-2 leading-snug"
        >
          {product.title}
        </Link>
        {product.authorName && (
          <div className="text-xs text-brand-navy/55 mt-0.5 truncate">{product.authorName}</div>
        )}
        {!product.authorName && product.brandName && (
          <div className="text-xs text-brand-navy/55 mt-0.5 truncate">{product.brandName}</div>
        )}
        <div className="text-brand-gold font-bold text-sm mt-1">
          GH₵{' '}
          {typeof product.price === 'number'
            ? product.price.toFixed(2)
            : parseFloat(product.price || 0).toFixed(2)}
        </div>
      </div>

      {/* Qty stepper */}
      <div className="flex items-center shrink-0 self-center">
        <div className="inline-flex items-center border border-brand-line rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => onQtyChange(Math.max(1, qty - 1))}
            aria-label="Decrease quantity"
            className="w-7 h-7 flex items-center justify-center text-brand-navy hover:bg-brand-page transition-colors text-base leading-none select-none"
          >
            −
          </button>
          <div className="w-7 h-7 flex items-center justify-center text-[13px] font-bold text-brand-navy border-x border-brand-line">
            {qty}
          </div>
          <button
            type="button"
            onClick={() => onQtyChange(qty + 1)}
            aria-label="Increase quantity"
            className="w-7 h-7 flex items-center justify-center text-brand-navy hover:bg-brand-page transition-colors text-base leading-none select-none"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ShopSmartPage() {
  const [tab, setTab] = useState('text')
  const [textInput, setTextInput] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)
  const [itemQtys, setItemQtys] = useState({})
  const [itemChecked, setItemChecked] = useState({})

  const fileInputRef = useRef(null)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  // ── Image selection ────────────────────────────────────────────────────────

  function handleImageSelect(file) {
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, and WebP images are accepted.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image must be 10MB or smaller.')
      return
    }
    setError(null)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage(e) {
    e.stopPropagation()
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    handleImageSelect(e.dataTransfer.files?.[0])
  }

  // ── Submit handlers ────────────────────────────────────────────────────────

  function initResults(matched) {
    const qtys = {}
    const checked = {}
    matched.forEach((p) => {
      qtys[p.id] = p.requestedQty ?? 1
      checked[p.id] = true
    })
    setItemQtys(qtys)
    setItemChecked(checked)
  }

  async function handleTextSubmit() {
    if (!textInput.trim()) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const raw = await parseTextList(textInput.trim())
      const mappedMatched = mapProducts(raw.matched ?? [])
      // Restore requestedQty — mapProducts drops unknown fields, so use index alignment
      const matched = mappedMatched.map((p, i) => ({
        ...p,
        requestedQty: raw.matched[i]?.requestedQty ?? 1,
      }))
      setResults({ matched, unmatched: raw.unmatched ?? [] })
      initResults(matched)
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleImageSubmit() {
    if (!imageFile) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const raw = await parseImageList(imageFile)
      const mappedMatched = mapProducts(raw.matched ?? [])
      const matched = mappedMatched.map((p, i) => ({
        ...p,
        requestedQty: raw.matched[i]?.requestedQty ?? 1,
      }))
      setResults({ matched, unmatched: raw.unmatched ?? [] })
      initResults(matched)
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleAddToCart() {
    if (!results) return
    results.matched.forEach((product) => {
      if (itemChecked[product.id]) {
        addToCart(product, itemQtys[product.id] ?? 1)
      }
    })
    navigate('/cart')
  }

  function switchTab(t) {
    setTab(t)
    setResults(null)
    setError(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)]">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-navy mb-2">
            Shop Smart
          </h1>
          <p className="text-brand-navy/60 text-sm sm:text-base">
            Type your list or upload a photo — we'll find everything for you
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-xl bg-white border border-brand-line p-1 mb-6 shadow-sm">
          {['text', 'image'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchTab(t)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${
                tab === t
                  ? 'bg-brand-navy text-white'
                  : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              {t === 'text' ? 'Type Your List' : 'Upload a Photo'}
            </button>
          ))}
        </div>

        {/* ── Text tab ── */}
        {tab === 'text' && (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value.slice(0, MAX_CHARS))}
                placeholder={
                  'e.g.\n2 copies of Mathematics for JHS 3\n1 Financial Accounting textbook\n3 blue ballpoint pens\n1 A4 exercise book (48 leaves)'
                }
                rows={7}
                className="w-full p-4 rounded-xl border border-brand-line bg-white text-brand-navy text-sm outline-none focus:border-brand-gold transition-colors resize-y"
              />
              <div className="absolute bottom-3 right-3 text-xs text-brand-navy/35 pointer-events-none">
                {textInput.length} / {MAX_CHARS}
              </div>
            </div>
            <button
              type="button"
              onClick={handleTextSubmit}
              disabled={loading || !textInput.trim()}
              className="w-full bg-brand-gold hover:bg-[#b7830a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-bold py-3 rounded-xl text-sm"
            >
              {loading ? 'Reading your list…' : 'Find My Items'}
            </button>
          </div>
        )}

        {/* ── Photo tab ── */}
        {tab === 'image' && (
          <div className="space-y-3">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && !imagePreview && fileInputRef.current?.click()}
              aria-label="Upload shopping list photo"
              className={`relative rounded-xl border-2 border-dashed transition-colors ${
                imagePreview ? 'border-brand-line cursor-default' : 'cursor-pointer hover:border-brand-gold/50'
              } ${isDragging ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-line bg-white'}`}
              style={{ minHeight: 180 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => handleImageSelect(e.target.files?.[0])}
              />

              {imagePreview ? (
                <div className="relative p-3">
                  <img
                    src={imagePreview}
                    alt="Shopping list preview"
                    className="max-h-64 mx-auto rounded-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    aria-label="Remove image"
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-brand-navy/70 text-white text-xs flex items-center justify-center hover:bg-brand-navy transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-brand-navy/30"
                  >
                    <path
                      d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <div>
                    <p className="text-brand-navy/60 text-sm">
                      Drag a photo here or{' '}
                      <span className="text-brand-gold font-semibold">click to choose</span>
                    </p>
                    <p className="text-brand-navy/35 text-xs mt-1">JPG, PNG, WebP · max 10MB</p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={loading || !imageFile}
              className="w-full bg-brand-gold hover:bg-[#b7830a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-bold py-3 rounded-xl text-sm"
            >
              {loading ? 'Scanning your list…' : 'Scan My List'}
            </button>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="mt-8 flex items-center justify-center gap-1.5 text-brand-navy/60 text-sm">
            <span>Reading your list</span>
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="mt-4 p-4 rounded-xl bg-error-bg border border-error/20 text-error text-sm">
            {error}
          </div>
        )}

        {/* ── Results ── */}
        {results && !loading && (
          <div className="mt-8 space-y-8">

            {/* Found items */}
            {results.matched.length > 0 && (
              <section>
                <h2 className="font-serif text-xl text-brand-navy mb-3">
                  Found Items
                  <span className="ml-2 text-sm font-sans font-normal text-brand-navy/50">
                    ({results.matched.length})
                  </span>
                </h2>

                <div className="space-y-2.5">
                  {results.matched.map((product) => (
                    <MatchedProductCard
                      key={product.id}
                      product={product}
                      qty={itemQtys[product.id] ?? product.requestedQty ?? 1}
                      checked={itemChecked[product.id] ?? true}
                      onQtyChange={(q) =>
                        setItemQtys((prev) => ({ ...prev, [product.id]: q }))
                      }
                      onCheckedChange={(c) =>
                        setItemChecked((prev) => ({ ...prev, [product.id]: c }))
                      }
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="mt-4 w-full bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold py-3 rounded-xl text-sm"
                >
                  Add Selected to Cart
                </button>
              </section>
            )}

            {/* Not found items */}
            {results.unmatched.length > 0 && (
              <section>
                <h2 className="font-serif text-xl text-brand-navy mb-1">
                  Not Found
                  <span className="ml-2 text-sm font-sans font-normal text-brand-navy/50">
                    ({results.unmatched.length})
                  </span>
                </h2>
                <p className="text-sm text-brand-navy/55 mb-3">
                  We couldn't find exact matches — try searching the shop manually.
                </p>
                <div className="space-y-2">
                  {results.unmatched.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-brand-line"
                    >
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-brand-navy truncate block">
                          {item.name}
                        </span>
                        {item.details && (
                          <span className="text-xs text-brand-navy/45 block truncate">
                            {item.details}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/shop?search=${encodeURIComponent(item.name)}`}
                        className="text-xs font-bold text-brand-gold hover:text-brand-gold/80 transition-colors whitespace-nowrap shrink-0"
                      >
                        Search shop →
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty state — Claude found nothing */}
            {results.matched.length === 0 && results.unmatched.length === 0 && (
              <div className="text-center py-10 text-brand-navy/50 text-sm">
                No items were found in your list. Try being more specific.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
