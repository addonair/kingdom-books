import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useBrand } from '../context/BrandContext.jsx'
import { POPULAR_AUTHORS } from '../data/categories.js'
import useCategoryTree from '../hooks/useCategoryTree.js'

const navLinks = [
  { to: '/shop', label: 'Browse' },
  { to: '/shop?filter=new', label: 'New Arrivals' },
  { to: '/shop?filter=deals', label: 'Deals' },
]

function authorHref(name) {
  return `/shop?mainCategory=books&author=${encodeURIComponent(name)}`
}

function subcatHref(mainKey, subSlug) {
  return `/shop?mainCategory=${mainKey}&subCategory=${subSlug}`
}

function itemTypeHref(mainKey, subSlug, itemSlug) {
  return `/shop?mainCategory=${mainKey}&subCategory=${subSlug}&itemType=${itemSlug}`
}

const BookIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke="#001a36" strokeWidth="2.2" />
    <path d="M19 3v18M9 8l3-2 3 2v6l-3-2-3 2V8z" stroke="#001a36" strokeWidth="2" strokeLinejoin="round" fill="#001a36" />
  </svg>
)

const SearchIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="#C9920A" strokeWidth="2" />
    <path d="M20 20l-3.5-3.5" stroke="#C9920A" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

function CartButton() {
  const { cartCount } = useCart()
  return (
    <Link
      to="/cart"
      aria-label={`Cart (${cartCount} ${cartCount === 1 ? 'item' : 'items'})`}
      className="relative inline-flex items-center justify-center w-9 h-9 shrink-0"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.8a2 2 0 002-1.6L21 8H6"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="20" r="1.5" fill="#fff" />
        <circle cx="17" cy="20" r="1.5" fill="#fff" />
      </svg>
      {cartCount > 0 && (
        <span
          data-testid="cart-count"
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-gold text-brand-navy text-[10px] font-bold flex items-center justify-center"
        >
          {cartCount}
        </span>
      )}
    </Link>
  )
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
}

function AccountMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDocDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 group"
      >
        <span className="w-8 h-8 rounded-full bg-brand-gold text-brand-navy text-[12px] font-extrabold flex items-center justify-center shrink-0">
          {getInitials(user.name)}
        </span>
        <span className="text-[13px] font-semibold text-white group-hover:text-brand-gold transition-colors">
          {user.name}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 8"
          fill="none"
          className={`transition-transform text-white/70 ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M1 1l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-[0_12px_32px_rgba(0,26,54,0.18)] border border-brand-line overflow-hidden z-50"
        >
          {/* Profile header */}
          <div className="px-4 py-3 border-b border-brand-line bg-brand-navy">
            <div className="text-sm font-bold text-white truncate">{user.name}</div>
            <div className="text-[12px] text-white/60 truncate">{user.email}</div>
          </div>

          {/* Need assistance */}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="flex items-center gap-2.5 px-4 py-2.5 bg-brand-gold-soft hover:bg-brand-gold/15 transition-colors border-b border-brand-line"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#C9920A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[12px] font-semibold text-brand-navy">Need assistance? Contact support</span>
          </Link>

          {/* Activity */}
          <div className="py-1">
            <div className="px-4 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-muted">My Activity</div>
            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-brand-navy hover:bg-brand-page transition-colors cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M5 4h11l3 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              My Orders
            </Link>
            <Link
              to="/account/inbox"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-brand-navy hover:bg-brand-page transition-colors cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Inbox
            </Link>
            <Link
              to="/account/wishlist"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-brand-navy hover:bg-brand-page transition-colors cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-7-4.5-9.5-9C.8 8.7 2.6 5 6 5c2 0 3.5 1.2 4 2.5C10.5 6.2 12 5 14 5c3.4 0 5.2 3.7 3.5 7C19 16.5 12 21 12 21z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              Wishlist
            </Link>
          </div>

          {/* Settings */}
          <div className="border-t border-brand-line py-1">
            <div className="px-4 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-muted">Settings</div>
            <Link
              to="/account/payment"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-brand-navy hover:bg-brand-page transition-colors cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              Payment Settings
            </Link>
            <Link
              to="/account/security"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-brand-navy hover:bg-brand-page transition-colors cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Account &amp; Security
            </Link>
            <Link
              to="/account/notifications"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-brand-navy hover:bg-brand-page transition-colors cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Notifications
            </Link>
          </div>

          {/* Company links */}
          <div className="border-t border-brand-line py-1">
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2 text-[12px] text-brand-navy/70 hover:bg-brand-page transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2 text-[12px] text-brand-navy/70 hover:bg-brand-page transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Contact
            </Link>
            <Link
              to="/terms"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2 text-[12px] text-brand-navy/70 hover:bg-brand-page transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Terms & Privacy
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-brand-line">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                onLogout()
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-error hover:bg-red-50 transition-colors cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MegaMenuTrigger({ label, panelId, openId, setOpenId, children }) {
  const isOpen = openId === panelId
  const closeTimer = useRef(null)
  const open = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenId(panelId)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenId(null), 120)
  }
  useEffect(() => () => closeTimer.current && clearTimeout(closeTimer.current), [])

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={scheduleClose}>
      <Link
        to={`/shop?mainCategory=${panelId}`}
        className={`text-[13px] transition-colors hover:text-brand-gold flex items-center gap-1 ${
          isOpen ? 'text-brand-gold font-bold' : 'text-white/70 font-medium'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <svg
          width="9"
          height="9"
          viewBox="0 0 12 8"
          fill="none"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M1 1l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      {isOpen && (
        <div
          className="absolute left-0 top-full pt-3 z-50"
          onMouseEnter={open}
          onMouseLeave={scheduleClose}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function BooksMegaPanel({ onPick, subcats }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_18px_40px_rgba(0,26,54,0.22)] border border-brand-line p-6 grid grid-cols-2 gap-8 min-w-[460px]">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-gold mb-3">
          Subcategories
        </div>
        <div className="flex flex-col gap-2">
          {subcats.map((s) => (
            <Link
              key={s.slug}
              to={subcatHref('books', s.slug)}
              onClick={onPick}
              className="text-[13px] text-brand-navy hover:text-brand-gold font-medium transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-gold mb-3">
          Popular Authors
        </div>
        <div className="flex flex-col gap-2">
          {POPULAR_AUTHORS.map((a) => (
            <Link
              key={a}
              to={authorHref(a)}
              onClick={onPick}
              className="text-[13px] text-brand-navy hover:text-brand-gold font-medium transition-colors"
            >
              {a}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function StationeryMegaPanel({ onPick, subcats }) {
  const [hoveredSlug, setHoveredSlug] = useState(subcats[0]?.slug || '')
  const hovered =
    subcats.find((s) => s.slug === hoveredSlug) || subcats[0]
  const itemTypes = hovered?.itemTypes || []

  return (
    <div className="bg-white rounded-2xl shadow-[0_18px_40px_rgba(0,26,54,0.22)] border border-brand-line p-6 grid grid-cols-2 gap-8 min-w-[480px]">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-gold mb-3">
          Subcategories
        </div>
        <div className="flex flex-col gap-2">
          {subcats.map((s) => (
            <Link
              key={s.slug}
              to={subcatHref('stationery', s.slug)}
              onClick={onPick}
              onMouseEnter={() => setHoveredSlug(s.slug)}
              onFocus={() => setHoveredSlug(s.slug)}
              className={`text-[13px] font-medium transition-colors ${
                hoveredSlug === s.slug
                  ? 'text-brand-gold'
                  : 'text-brand-navy hover:text-brand-gold'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-gold mb-3">
          {hovered?.label || 'Item Types'}
        </div>
        <div className="flex flex-col gap-2">
          {itemTypes.length === 0 ? (
            <span className="text-[12px] text-brand-navy/50 italic">No items yet</span>
          ) : (
            itemTypes.map((it) => (
              <Link
                key={it.slug}
                to={itemTypeHref('stationery', hovered.slug, it.slug)}
                onClick={onPick}
                className="text-[13px] text-brand-navy hover:text-brand-gold font-medium transition-colors"
              >
                {it.label}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function Navbar() {
  const { user, logout } = useAuth()
  const brand = useBrand()
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const tree = useCategoryTree()
  const bookSubcats = tree.books?.subcategories || []
  const stationerySubcats = tree.stationery?.subcategories || []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const submitSearch = () => {
    const q = searchInput.trim()
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop')
  }

  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitSearch()
    }
  }

  return (
    <header className="bg-brand-navy text-white md:sticky md:top-0 md:z-40">
      {/* Mobile layout (< md): three stacked rows */}
      <div className="md:hidden">
        {/* Row 1: logo + Sign in + cart */}
        <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={brand.storeName}
                style={{ height: brand.logoHeight || 40, maxWidth: 160 }}
                className="object-contain"
              />
            ) : (
              <>
                <div className="w-9 h-9 rounded-lg bg-brand-gold flex items-center justify-center shrink-0">
                  {BookIcon}
                </div>
                <div className="leading-tight min-w-0">
                  <div className="font-serif text-[16px] leading-none truncate">{brand.storeNameShort}</div>
                  <div className="text-brand-gold text-[9px] uppercase tracking-[0.12em] mt-1">
                    {brand.taglineShort}
                  </div>
                </div>
              </>
            )}
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <Link
                to="/account"
                className="text-[12px] font-semibold text-brand-gold truncate max-w-[110px]"
              >
                {user.name}
              </Link>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-[12px] font-semibold transition-colors hover:text-brand-gold ${
                    isActive ? 'text-brand-gold' : 'text-white'
                  }`
                }
              >
                Sign in
              </NavLink>
            )}
            <CartButton />
          </div>
        </div>

        {/* Row 2: horizontally scrollable nav links */}
        <nav className="flex items-center gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NavLink
            to="/shop?mainCategory=books"
            className={({ isActive }) =>
              `text-[12.5px] whitespace-nowrap shrink-0 transition-colors hover:text-brand-gold ${
                isActive ? 'text-brand-gold font-bold' : 'text-white/75 font-medium'
              }`
            }
          >
            Books
          </NavLink>
          <NavLink
            to="/shop?mainCategory=stationery"
            className={({ isActive }) =>
              `text-[12.5px] whitespace-nowrap shrink-0 transition-colors hover:text-brand-gold ${
                isActive ? 'text-brand-gold font-bold' : 'text-white/75 font-medium'
              }`
            }
          >
            Stationery
          </NavLink>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `text-[12.5px] whitespace-nowrap shrink-0 transition-colors hover:text-brand-gold ${
                  isActive ? 'text-brand-gold font-bold' : 'text-white/75 font-medium'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Row 3: search */}
        <div className="px-4 pb-3">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              submitSearch()
            }}
            className="flex items-center gap-2 bg-white/10 rounded-full px-4 h-10"
          >
            {SearchIcon}
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search books, authors, courses…"
              aria-label="Search products"
              className="bg-transparent border-none outline-none text-[13px] text-white placeholder:text-brand-gold/70 flex-1 min-w-0"
            />
          </form>
        </div>
      </div>

      {/* Desktop layout (md+): single row */}
      <div className="hidden md:flex items-center h-16 px-8 lg:px-10 gap-8">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={brand.storeName}
              style={{ height: brand.logoHeight || 40, maxWidth: 200 }}
              className="object-contain"
            />
          ) : (
            <>
              <div className="w-9 h-9 rounded-[10px] bg-brand-gold flex items-center justify-center">
                {BookIcon}
              </div>
              <div className="leading-tight">
                <div className="font-serif text-[19px] leading-none">{brand.storeNameShort}</div>
                <div className="text-brand-gold text-[10px] uppercase tracking-[0.12em] mt-0.5">
                  {brand.taglineShort}
                </div>
              </div>
            </>
          )}
        </Link>

        <div className="h-7 w-px bg-white/15" />

        <nav className="flex items-center gap-7">
          <MegaMenuTrigger
            label="Books"
            panelId="books"
            openId={openMenu}
            setOpenId={setOpenMenu}
          >
            <BooksMegaPanel
              onPick={() => setOpenMenu(null)}
              subcats={bookSubcats}
            />
          </MegaMenuTrigger>
          <MegaMenuTrigger
            label="Stationery"
            panelId="stationery"
            openId={openMenu}
            setOpenId={setOpenMenu}
          >
            <StationeryMegaPanel
              onPick={() => setOpenMenu(null)}
              subcats={stationerySubcats}
            />
          </MegaMenuTrigger>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `text-[13px] transition-colors hover:text-brand-gold ${
                  isActive ? 'text-brand-gold font-bold' : 'text-white/70 font-medium'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              submitSearch()
            }}
            className="hidden lg:flex items-center gap-2 bg-white/10 hover:bg-white/[0.14] transition-colors rounded-full px-4 h-9 w-[260px]"
          >
            {SearchIcon}
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search books, authors, courses…"
              aria-label="Search products"
              className="bg-transparent border-none outline-none text-[13px] text-white placeholder:text-brand-gold/70 flex-1 min-w-0"
            />
          </form>
          <Link
            to="/shop-smart"
            className="hidden lg:flex items-center gap-1.5 text-[13px] font-bold text-brand-gold hover:text-brand-gold/80 transition-colors whitespace-nowrap"
          >
            ✨ Shop Smart
          </Link>
          {user ? (
            <AccountMenu user={user} onLogout={handleLogout} />
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-[13px] font-semibold transition-colors hover:text-brand-gold ${
                  isActive ? 'text-brand-gold' : 'text-white'
                }`
              }
            >
              Sign in
            </NavLink>
          )}
          <CartButton />
        </div>
      </div>
    </header>
  )
}

export default Navbar
