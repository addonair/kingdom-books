import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getWishlist, removeFromWishlist } from '../api/wishlist.js'
import { mapProduct } from '../api/productMapper.js'

function WishlistPage() {
  const { user, loading } = useAuth()
  const [items, setItems] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setListLoading(true)
    getWishlist()
      .then((raw) => {
        const mapped = (raw || []).map((p) => mapProduct(p))
        setItems(mapped)
      })
      .catch((err) => setError(err?.response?.data?.error || 'Could not load your wishlist.'))
      .finally(() => setListLoading(false))
  }, [user])

  async function onRemove(productId) {
    const prev = items
    setItems((arr) => arr.filter((p) => p.id !== productId))
    try {
      await removeFromWishlist(productId)
    } catch (err) {
      setItems(prev)
      setError(err?.response?.data?.error || 'Could not remove item.')
    }
  }

  if (loading) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)] py-6 md:py-10 px-4 sm:px-6">
      <div className="max-w-md md:max-w-6xl mx-auto">
        <Link to="/account" className="text-[13px] text-brand-navy/60 hover:text-brand-navy inline-flex items-center gap-1 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back to account
        </Link>

        <div className="mb-5">
          <h1 className="font-serif text-2xl text-brand-navy">Wishlist</h1>
          <p className="text-[13px] text-brand-navy/60 mt-1">
            {items.length === 0
              ? 'Save items you love and find them again here.'
              : `${items.length} saved item${items.length === 1 ? '' : 's'}.`}
          </p>
        </div>

        {listLoading && (
          <div className="bg-white rounded-2xl border border-brand-line p-10 flex justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
          </div>
        )}

        {!listLoading && error && (
          <div className="bg-error-bg border border-error/20 rounded-xl p-4 text-error text-sm mb-4">{error}</div>
        )}

        {!listLoading && items.length === 0 && !error && (
          <div className="bg-white rounded-2xl border border-brand-line p-10 text-center">
            <div className="text-[40px] mb-2">💝</div>
            <p className="text-brand-navy font-bold mb-1">Your wishlist is empty</p>
            <p className="text-[13px] text-brand-navy/60 mb-5">Tap the heart on any product to save it for later.</p>
            <Link to="/shop" className="inline-block px-6 py-2.5 rounded-xl bg-brand-gold text-white font-bold text-[14px] hover:bg-[#b7830a]">
              Browse the Shop
            </Link>
          </div>
        )}

        {!listLoading && items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {items.map((p) => {
              const img = p.images?.[0]?.image_url
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-brand-line overflow-hidden flex flex-col">
                  <Link to={`/product/${p.id}`} className="block relative aspect-[3/4] bg-brand-page">
                    {img ? (
                      <img src={img} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-navy/40 text-[12px]">No image</div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); onRemove(p.id) }}
                      aria-label="Remove from wishlist"
                      className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/95 backdrop-blur shadow-md flex items-center justify-center text-error hover:bg-white"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21s-7-4.5-9.5-9C.8 8.7 2.6 5 6 5c2 0 3.5 1.2 4 2.5C10.5 6.2 12 5 14 5c3.4 0 5.2 3.7 3.5 7C19 16.5 12 21 12 21z" />
                      </svg>
                    </button>
                  </Link>
                  <Link to={`/product/${p.id}`} className="p-3 flex-1 flex flex-col">
                    <p className="text-[12px] text-brand-navy/60 uppercase tracking-wide">{p.authorName || p.brandName || p.category || '—'}</p>
                    <p className="text-[14px] font-bold text-brand-navy line-clamp-2 mt-0.5 flex-1">{p.title}</p>
                    <p className="text-brand-gold font-bold mt-2">GH₵ {Number(p.price).toFixed(2)}</p>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
