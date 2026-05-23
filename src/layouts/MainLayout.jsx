import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MobileBottomNav from '../components/MobileBottomNav'

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-page text-brand-navy font-sans">
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
