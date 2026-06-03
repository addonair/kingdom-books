import { Link } from 'react-router-dom'
import { useBrand } from '../context/BrandContext.jsx'

function Footer() {
  const brand = useBrand()
  return (
    <footer className="hidden md:block bg-brand-navy text-white/70">
      <div className="flex items-center justify-between px-8 lg:px-10 py-8 text-[12px]">
        <div>{brand.footerCopyright}</div>
        <div className="flex items-center gap-6">
          <Link to="/about" className="hover:text-brand-gold transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-brand-gold transition-colors">Contact</Link>
          <Link to="/about" className="hover:text-brand-gold transition-colors">Privacy</Link>
          <Link to="/about" className="hover:text-brand-gold transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
