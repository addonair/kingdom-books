import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MobileBottomNav from '../components/MobileBottomNav'

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-page text-brand-navy font-sans">
      {/* Site-wide announcement bar — sits at the very top, absorbs iOS safe-area inset */}
      <div className="bg-brand-navy-deep text-white text-[11px] sm:text-xs leading-relaxed px-4 pb-2.5 pt-[max(env(safe-area-inset-top),1.25rem)] text-center">
        <span className="text-brand-gold mr-1.5">★</span>
        Free delivery on all campus orders over <span className="font-semibold text-brand-gold">GH₵ 50</span>
        <span className="hidden sm:inline text-white/40 mx-2">·</span>
        <span className="hidden sm:inline text-white/70">Pay with Mobile Money or Card</span>
      </div>
      <Navbar />
      <main className="flex-1 pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export default MainLayout
