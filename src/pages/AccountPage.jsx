import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useBrand } from '../context/BrandContext.jsx'
import Modal from '../components/Modal.jsx'

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
}

function SectionLabel({ children }) {
  return (
    <div className="px-1 pt-6 pb-2">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-muted">
        {children}
      </span>
    </div>
  )
}

function MenuRow({ to, onClick, icon, label, sublabel, danger, badge }) {
  const base =
    'w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer transition-colors duration-150'
  const tone = danger
    ? 'hover:bg-red-50 active:bg-red-100'
    : 'hover:bg-brand-page active:bg-brand-line/40'

  const iconBg = danger
    ? 'bg-red-50 text-error'
    : 'bg-brand-gold-soft text-brand-gold'

  const labelColor = danger ? 'text-error' : 'text-brand-navy'

  const inner = (
    <>
      <span
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className={`block text-[14px] font-semibold ${labelColor}`}>
          {label}
        </span>
        {sublabel && (
          <span className="block text-[12px] text-brand-muted mt-0.5 truncate">
            {sublabel}
          </span>
        )}
      </span>
      {badge && (
        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand-gold text-brand-navy text-[10px] font-bold flex items-center justify-center shrink-0">
          {badge}
        </span>
      )}
      {!danger && !badge && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-brand-muted shrink-0">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${tone}`}>
        {inner}
      </button>
    )
  }
  return (
    <Link to={to} className={`${base} ${tone}`}>
      {inner}
    </Link>
  )
}

function ComingSoonModal({ open, onClose, feature }) {
  return (
    <Modal open={open} onClose={onClose} title={feature} size="sm">
      <div className="flex flex-col items-center text-center py-4 gap-4">
        <span className="w-14 h-14 rounded-full bg-brand-gold-soft flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#C9920A" strokeWidth="1.8" />
            <path d="M12 7v5l3 3" stroke="#C9920A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="font-serif text-lg text-brand-navy mb-1">Coming Soon</p>
          <p className="text-[14px] text-brand-navy/60 leading-relaxed">
            <strong className="text-brand-navy">{feature}</strong> is being built and will be available soon.
            Check back in a future update.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-1 px-6 py-2.5 rounded-xl bg-brand-navy text-white text-[14px] font-semibold hover:bg-brand-navy-soft transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </Modal>
  )
}

function CloseAccountModal({ open, onClose, onConfirm }) {
  const [confirm, setConfirm] = useState('')
  const ready = confirm.toLowerCase() === 'close'

  return (
    <Modal open={open} onClose={onClose} title="Close Account" size="sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-error-bg border border-error/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-error shrink-0 mt-0.5">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-[13px] text-error leading-relaxed">
            This will permanently delete your account, order history, and all saved data. This action cannot be undone.
          </p>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-brand-navy mb-1.5">
            Type <span className="font-mono text-error">close</span> to confirm
          </label>
          <input
            type="text"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="close"
            className="w-full border border-brand-line rounded-xl px-4 py-2.5 text-[14px] text-brand-navy outline-none focus:border-error focus:ring-2 focus:ring-error/20"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-brand-line text-[14px] font-semibold text-brand-navy hover:bg-brand-page transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!ready}
            className="flex-1 py-2.5 rounded-xl bg-error text-white text-[14px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors cursor-pointer"
          >
            Close Account
          </button>
        </div>
      </div>
    </Modal>
  )
}

function AccountPage() {
  const { user, loading, logout } = useAuth()
  const brand = useBrand()
  const navigate = useNavigate()
  const [closeAccountOpen, setCloseAccountOpen] = useState(false)
  const [comingSoon, setComingSoon] = useState(null)

  if (loading) {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCloseAccount = () => {
    setCloseAccountOpen(false)
    logout()
    navigate('/')
  }

  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)] pb-24 md:pb-12">
      <div className="max-w-md md:max-w-2xl mx-auto px-4 sm:px-6">

        {/* Profile header */}
        <section className="bg-brand-navy rounded-2xl shadow-md p-5 mt-4 md:mt-8 flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-brand-gold text-brand-navy text-[18px] font-extrabold flex items-center justify-center shrink-0">
            {getInitials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-serif text-[20px] text-white truncate leading-snug">
              {user.name}
            </div>
            <div className="text-[13px] text-white/60 truncate mt-0.5">
              {user.email}
            </div>
          </div>
          <Link
            to="/account/edit"
            onClick={(e) => { e.preventDefault(); setComingSoon('Edit Profile') }}
            className="shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Edit profile"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </section>

        {/* Need Assistance banner */}
        <Link
          to="/contact"
          className="mt-4 flex items-center gap-3 bg-brand-gold-soft border border-brand-gold/30 rounded-xl px-4 py-3.5 hover:bg-brand-gold/10 transition-colors cursor-pointer"
        >
          <span className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#C9920A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <span className="block text-[13px] font-bold text-brand-navy">Need assistance?</span>
            <span className="block text-[12px] text-brand-navy/60 mt-0.5">Contact our support team</span>
          </div>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-brand-gold shrink-0">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* My Activity */}
        <SectionLabel>My Activity</SectionLabel>
        <section className="bg-white rounded-2xl shadow-sm border border-brand-line overflow-hidden divide-y divide-brand-line">
          <MenuRow
            to="/orders"
            label="My Orders"
            sublabel="Track and manage your orders"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 4h11l3 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          />
          <MenuRow
            onClick={() => setComingSoon('Inbox')}
            label="Inbox"
            sublabel="Messages and notifications"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          />
          <MenuRow
            onClick={() => setComingSoon('Wishlist')}
            label="Wishlist"
            sublabel="Your saved items"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-7-4.5-9.5-9C.8 8.7 2.6 5 6 5c2 0 3.5 1.2 4 2.5C10.5 6.2 12 5 14 5c3.4 0 5.2 3.7 3.5 7C19 16.5 12 21 12 21z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            }
          />
        </section>

        {/* Settings */}
        <SectionLabel>Settings</SectionLabel>
        <section className="bg-white rounded-2xl shadow-sm border border-brand-line overflow-hidden divide-y divide-brand-line">
          <MenuRow
            onClick={() => setComingSoon('Payment Settings')}
            label="Payment Settings"
            sublabel="Manage payment methods & billing"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            }
          />
          <MenuRow
            onClick={() => setComingSoon('Account Management')}
            label="Account Management"
            sublabel="Email, password & security"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          />
          <MenuRow
            onClick={() => setComingSoon('Notification Preferences')}
            label="Notification Preferences"
            sublabel="Manage alerts and updates"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <MenuRow
            onClick={() => setComingSoon('More Settings')}
            label="More Settings"
            sublabel="Language, region & preferences"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5h.1a1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            }
          />
        </section>

        {/* Danger zone */}
        <section className="bg-white rounded-2xl shadow-sm border border-brand-line overflow-hidden mt-3">
          <MenuRow
            onClick={() => setCloseAccountOpen(true)}
            label="Close Account"
            sublabel="Permanently delete your account"
            danger
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </section>

        {/* Company / Info */}
        <SectionLabel>Company</SectionLabel>
        <section className="bg-white rounded-2xl shadow-sm border border-brand-line overflow-hidden divide-y divide-brand-line">
          <MenuRow
            to="/about"
            label="About Us"
            sublabel="Our story and mission"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <MenuRow
            to="/contact"
            label="Contact Us"
            sublabel="Get in touch with our team"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <MenuRow
            onClick={() => setComingSoon('Terms & Privacy')}
            label="Terms & Privacy"
            sublabel="Our policies and legal info"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          />
        </section>

        {/* Logout */}
        <div className="mt-6 mb-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 border-error/30 text-error bg-white hover:bg-error-bg transition-colors text-[14px] font-bold cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign Out
          </button>
        </div>

        <p className="text-center text-[11px] text-brand-muted pb-4">
          {brand.accountFooterLine}
        </p>
      </div>

      {/* Modals */}
      <ComingSoonModal
        open={!!comingSoon}
        onClose={() => setComingSoon(null)}
        feature={comingSoon || ''}
      />
      <CloseAccountModal
        open={closeAccountOpen}
        onClose={() => setCloseAccountOpen(false)}
        onConfirm={handleCloseAccount}
      />
    </div>
  )
}

export default AccountPage
