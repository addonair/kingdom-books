import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import * as cartApi from '../api/cart.js'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)

// Server returns: { id, quantity, product_id, title, author, price, cover_color, format, stock }
// Local cart shape: { id, productId, title, brand, price, format, color, qty, serverId? }
function fromServer(item) {
  return {
    id: item.product_id,
    serverId: item.id,
    productId: item.product_id,
    title: item.title,
    brand: item.author,
    price: Number(item.price),
    format: item.format,
    color: item.cover_color,
    qty: item.quantity,
  }
}

function localItemFromProduct(product, qty) {
  return {
    id: product.id,
    productId: product.id,
    title: product.title,
    brand: product.brand,
    price: product.price,
    format: product.format,
    color: product.color,
    qty,
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  // When the user changes (login/logout), pull or clear cart accordingly.
  useEffect(() => {
    if (!user) {
      setItems([])
      return
    }
    let cancelled = false
    cartApi
      .getCart()
      .then((rows) => {
        if (!cancelled) setItems(rows.map(fromServer))
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const addToCart = useCallback(
    async (product, qty = 1) => {
      if (!product || product.id == null) return

      // Optimistic local update so the cart badge reacts immediately.
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id)
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + qty } : i,
          )
        }
        return [...prev, localItemFromProduct(product, qty)]
      })

      if (!user) return
      try {
        await cartApi.addToCart(product.id, qty)
        const rows = await cartApi.getCart()
        setItems(rows.map(fromServer))
      } catch (err) {
        console.error('[cart] add failed:', err)
      }
    },
    [user],
  )

  const removeFromCart = useCallback(
    async (id) => {
      if (user) {
        const target = items.find((i) => i.id === id || i.serverId === id)
        if (!target) return
        setItems((prev) =>
          prev.filter((i) => i.serverId !== target.serverId),
        )
        try {
          await cartApi.removeFromCart(target.serverId)
        } catch (err) {
          console.error('[cart] remove failed:', err)
        }
        return
      }
      setItems((prev) => prev.filter((i) => i.id !== id))
    },
    [user, items],
  )

  const updateQuantity = useCallback(
    async (id, newQty) => {
      const target = items.find((i) => i.id === id || i.serverId === id)
      if (!target) return
      if (newQty < 1) return removeFromCart(id)

      // Optimistic update everywhere
      setItems((prev) =>
        prev.map((i) => (i.id === target.id ? { ...i, qty: newQty } : i)),
      )

      if (!user) return
      try {
        // Prefer the dedicated PATCH endpoint (atomic). If the backend
        // doesn't expose it yet, fall back to remove + re-add so the
        // feature keeps working until the route ships.
        try {
          await cartApi.updateQuantity(target.serverId, newQty)
        } catch (err) {
          const status = err?.response?.status
          if (status !== 404 && status !== 405) throw err
          await cartApi.removeFromCart(target.serverId)
          await cartApi.addToCart(target.productId, newQty)
        }
        const rows = await cartApi.getCart()
        setItems(rows.map(fromServer))
      } catch (err) {
        console.error('[cart] update qty failed:', err)
      }
    },
    [user, items, removeFromCart],
  )

  const clearCart = useCallback(() => setItems([]), [])

  const value = useMemo(() => {
    const cartCount = items.reduce((sum, i) => sum + i.qty, 0)
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
    return {
      items,
      cartCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }
  }, [items, addToCart, removeFromCart, updateQuantity, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
