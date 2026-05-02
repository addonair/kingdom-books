import { NavLink } from 'react-router-dom'

const tabs = [
  {
    to: '/',
    label: 'Home',
    end: true,
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-9z"
          stroke={active ? '#C9920A' : '#9aa0a6'} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/shop',
    label: 'Search',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke={active ? '#C9920A' : '#9aa0a6'} strokeWidth="1.8" />
        <path d="M20 20l-3.5-3.5" stroke={active ? '#C9920A' : '#9aa0a6'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/orders',
    label: 'Orders',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M5 4h11l3 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
          stroke={active ? '#C9920A' : '#9aa0a6'} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 12h8M8 16h5" stroke={active ? '#C9920A' : '#9aa0a6'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/login',
    label: 'Account',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={active ? '#C9920A' : '#9aa0a6'} strokeWidth="1.8" />
        <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"
          stroke={active ? '#C9920A' : '#9aa0a6'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-brand-line shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-around h-[60px] pb-[env(safe-area-inset-bottom)] box-content">
      {tabs.map(({ to, label, end, icon }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
        >
          {({ isActive }) => (
            <>
              {icon(isActive)}
              <span
                className={`text-[10px] tracking-wide ${
                  isActive ? 'text-brand-gold font-bold' : 'text-brand-muted font-medium'
                }`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileBottomNav
