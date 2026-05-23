import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from '../config/delivery.js'

function CoverThumb({ item }) {
  return (
    <div
      className="w-16 h-20 sm:w-20 sm:h-24 rounded-md flex items-center justify-center shrink-0 shadow-[2px_2px_8px_rgba(0,0,0,0.18)]"
      style={{
        background: item.color || '#001a36',
        borderRadius: '3px 6px 6px 3px',
      }}
    >
      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-white/85 text-center px-1.5 leading-tight">
        {(item.title || '').split(' ').slice(0, 2).join(' ')}
      </span>
    </div>
  )
}

function QtyControl({ qty, onDec, onInc }) {
  return (
    <div className="inline-flex items-center border border-brand-line rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onDec}
        aria-label="Decrease quantity"
        className="w-8 h-8 flex items-center justify-center text-brand-navy hover:bg-brand-page transition-colors"
      >
        <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
          <path d="M0 1h12" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      <div className="w-9 h-8 flex items-center justify-center text-sm font-bold text-brand-navy border-x border-brand-line">
        {qty}
      </div>
      <button
        type="button"
        onClick={onInc}
        aria-label="Increase quantity"
        className="w-8 h-8 flex items-center justify-center text-brand-navy hover:bg-brand-page transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </div>
  )
}

function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-gold-soft text-brand-gold flex items-center justify-center mb-5">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.8a2 2 0 002-1.6L21 8H6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy mb-2">
            Your cart is empty
          </h1>
          <p className="text-sm text-brand-navy/60 mb-6">
            Add a few books or stationery items, then come back to check out.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-6 py-3 rounded-lg"
          >
            Browse the Shop
          </Link>
        </div>
      </div>
    )
  }

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = subtotal + deliveryFee

  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)] py-8 md:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <div className="text-brand-gold text-[11px] uppercase tracking-[0.16em] font-bold mb-1">
              Your Bag
            </div>
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy">
              Shopping Cart
            </h1>
          </div>
          <span className="text-sm text-brand-navy/60">
            {items.reduce((s, i) => s + i.qty, 0)} item
            {items.reduce((s, i) => s + i.qty, 0) === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
          {/* Items */}
          <ul className="space-y-3">
            {items.map((item) => {
              const lineTotal = item.price * item.qty
              return (
                <li
                  key={item.serverId ?? item.id}
                  className="bg-white rounded-2xl shadow-sm border border-brand-line p-4 sm:p-5 flex gap-4"
                >
                  <CoverThumb item={item} />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-[15px] font-semibold text-brand-navy leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                        {item.brand && (
                          <p className="text-[12px] text-brand-navy/60 mt-0.5 truncate">
                            {item.brand}
                          </p>
                        )}
                        {item.format && (
                          <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-brand-gold-soft px-2 py-0.5 rounded">
                            {item.format}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                        className="shrink-0 w-8 h-8 rounded-full text-brand-navy/50 hover:text-error hover:bg-red-50 transition-colors flex items-center justify-center"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13M10 11v7M14 11v7"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-auto pt-3 flex items-end justify-between gap-3 flex-wrap">
                      <QtyControl
                        qty={item.qty}
                        onDec={() => updateQuantity(item.id, item.qty - 1)}
                        onInc={() => updateQuantity(item.id, item.qty + 1)}
                      />
                      <div className="text-right">
                        <div className="text-[11px] text-brand-navy/55">
                          GH₵ {item.price.toFixed(2)} each
                        </div>
                        <div className="font-extrabold text-brand-gold text-base">
                          GH₵ {lineTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-6 self-start">
            <div className="bg-white rounded-2xl shadow-sm border border-brand-line p-5 md:p-6">
              <h2 className="font-serif text-xl text-brand-navy mb-4">
                Order summary
              </h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-brand-navy/75">
                  <span>Subtotal</span>
                  <span>GH₵ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-navy/75">
                  <span>Delivery fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-success font-semibold">Free</span>
                    ) : (
                      `GH₵ ${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[11px] text-brand-navy/55 leading-relaxed">
                    Spend GH₵ {(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)}{' '}
                    more to qualify for free home delivery.
                  </p>
                )}
                <div className="h-px bg-brand-line my-2" />
                <div className="flex justify-between font-bold text-brand-navy text-base">
                  <span>Total</span>
                  <span className="text-brand-gold">
                    GH₵ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-5 w-full bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-extrabold text-sm h-12 rounded-xl shadow-[0_8px_24px_rgba(201,146,10,0.35)] flex items-center justify-center"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/shop"
                className="mt-3 w-full border border-brand-line hover:border-brand-gold transition-colors text-brand-navy font-bold text-sm h-12 rounded-xl flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CartPage
