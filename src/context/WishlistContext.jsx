import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlist.js'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [ids, setIds] = useState(() => new Set())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) {
      setIds(new Set())
      setLoaded(false)
      return
    }
    let cancelled = false
    getWishlist()
      .then((items) => {
        if (cancelled) return
        const next = new Set()
        for (const p of items || []) next.add(p.id)
        setIds(next)
        setLoaded(true)
      })
      .catch(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => { cancelled = true }
  }, [user])

  const isWishlisted = useCallback((productId) => ids.has(productId), [ids])

  const toggle = useCallback(async (productId) => {
    if (!user) {
      return { needsAuth: true }
    }
    const wasIn = ids.has(productId)
    const next = new Set(ids)
    if (wasIn) next.delete(productId)
    else next.add(productId)
    setIds(next)
    try {
      if (wasIn) await removeFromWishlist(productId)
      else await addToWishlist(productId)
      return { ok: true, nowIn: !wasIn }
    } catch (err) {
      // Revert
      setIds(ids)
      return { error: err?.response?.data?.error || 'Wishlist update failed' }
    }
  }, [ids, user])

  const value = useMemo(() => ({ ids, loaded, isWishlisted, toggle }), [ids, loaded, isWishlisted, toggle])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}
