import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true, icon: IconHome },
  { to: '/admin/homepage', label: 'Homepage', icon: IconLayout },
  { to: '/admin/products', label: 'Products', icon: IconBox },
  { to: '/admin/orders', label: 'Orders', icon: IconReceipt },
  { to: '/admin/customers', label: 'Customers', icon: IconUsers },
  { to: '/admin/categories', label: 'Categories', icon: IconTag },
  { to: '/admin/promotions', label: 'Promotions', icon: IconMegaphone },
  { to: '/admin/email-templates', label: 'Email Templates', icon: IconEmail },
  { to: '/admin/reports', label: 'Reports', icon: IconChart },
  { to: '/admin/settings', label: 'Settings', icon: IconCog },
]

function navClass({ isActive }) {
  return [
    'group flex items-center gap-3 px-4 h-11 rounded-lg text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-navy-soft text-brand-gold'
      : 'text-white/70 hover:bg-brand-navy-soft/60 hover:text-white',
  ].join(' ')
}

function AdminLayout() {
  const { user, logout } = useAdminAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-brand-page text-brand-navy flex">
      <aside className="hidden lg:flex w-64 flex-col bg-brand-navy text-white sticky top-0 h-screen">
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-brand-navy-deep/60"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-brand-navy text-white transform transition-transform duration-200 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-brand-line h-14 flex items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 -ml-2 flex items-center justify-center text-brand-navy"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-serif text-lg text-brand-navy">
            Kingdom <span className="text-brand-gold">Admin</span>
          </span>
          <span className="w-10" />
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ user, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="font-serif text-2xl">
          Kingdom <span className="text-brand-gold">Admin</span>
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 mt-1">
          Staff Dashboard
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.label} to={item.to} end={item.end} className={navClass}>
              <Icon />
              <span className="flex-1">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-4 space-y-2">
        <div className="text-[11px] uppercase tracking-wider text-white/50">
          Signed in as
        </div>
        <div className="text-sm font-semibold truncate">{user?.name || 'Admin'}</div>
        <div className="text-[11px] text-white/50 truncate">{user?.email}</div>
        <div className="flex gap-2 pt-2">
          <Link
            to="/"
            className="flex-1 text-center text-[12px] font-bold border border-white/20 hover:border-brand-gold hover:text-brand-gold rounded-lg h-9 leading-9 transition-colors"
          >
            Back to store
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="text-[12px] font-bold border border-white/20 hover:border-error hover:text-error rounded-lg h-9 px-3 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7H10v7H6a2 2 0 01-2-2v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}
function IconLayout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}
function IconBox() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 7l9 4 9-4M12 11v10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}
function IconReceipt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 11a4 4 0 100-8 4 4 0 000 8zM2 21a7 7 0 0114 0M16 3.5a4 4 0 010 7M22 21a6 6 0 00-4-5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 12V4a1 1 0 011-1h8l9 9-9 9-9-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  )
}
function IconMegaphone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 11v2a2 2 0 002 2h2l5 4V5L7 9H5a2 2 0 00-2 2zM18 8a5 5 0 010 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function IconEmail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}
function IconCog() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export default AdminLayout
