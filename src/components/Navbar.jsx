import { NavLink, Link } from 'react-router-dom'

const navLinks = [
  { to: '/shop', label: 'Browse' },
  { to: '/shop?filter=new', label: 'New Arrivals' },
  { to: '/shop?cat=stationery', label: 'Stationery' },
  { to: '/shop?cat=gifts', label: 'Gifts' },
  { to: '/shop?filter=deals', label: 'Deals' },
]

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

const CartButton = (
  <Link to="/cart" className="relative inline-flex items-center justify-center w-9 h-9 shrink-0">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.8a2 2 0 002-1.6L21 8H6"
        stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.5" fill="#fff" />
      <circle cx="17" cy="20" r="1.5" fill="#fff" />
    </svg>
    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-gold text-brand-navy text-[10px] font-bold flex items-center justify-center">
      2
    </span>
  </Link>
)

function Navbar() {
  return (
    <header className="bg-brand-navy text-white md:sticky md:top-0 md:z-40">
      {/* Mobile layout (< md): three stacked rows */}
      <div className="md:hidden">
        {/* Row 1: logo + Sign in + cart */}
        <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-brand-gold flex items-center justify-center shrink-0">
              {BookIcon}
            </div>
            <div className="leading-tight min-w-0">
              <div className="font-serif text-[16px] leading-none truncate">Kingdom Books</div>
              <div className="text-brand-gold text-[9px] uppercase tracking-[0.12em] mt-1">
                & Stationery · UG
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
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
            {CartButton}
          </div>
        </div>

        {/* Row 2: horizontally scrollable nav links */}
        <nav className="flex items-center gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 h-10">
            {SearchIcon}
            <input
              type="text"
              placeholder="Search books, authors, courses…"
              className="bg-transparent border-none outline-none text-[13px] text-white placeholder:text-brand-gold/70 flex-1 min-w-0"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout (md+): single row */}
      <div className="hidden md:flex items-center h-16 px-8 lg:px-10 gap-8">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-[10px] bg-brand-gold flex items-center justify-center">
            {BookIcon}
          </div>
          <div className="leading-tight">
            <div className="font-serif text-[19px] leading-none">Kingdom Books</div>
            <div className="text-brand-gold text-[10px] uppercase tracking-[0.12em] mt-0.5">
              & Stationery · UG
            </div>
          </div>
        </Link>

        <div className="h-7 w-px bg-white/15" />

        <nav className="flex items-center gap-7">
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
          <div className="hidden lg:flex items-center gap-2 bg-white/10 hover:bg-white/[0.14] transition-colors rounded-full px-4 h-9 w-[260px]">
            {SearchIcon}
            <input
              type="text"
              placeholder="Search books, authors, courses…"
              className="bg-transparent border-none outline-none text-[13px] text-white placeholder:text-brand-gold/70 flex-1"
            />
          </div>
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
          {CartButton}
        </div>
      </div>
    </header>
  )
}

export default Navbar
