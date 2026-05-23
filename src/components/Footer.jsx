import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="hidden md:block bg-brand-navy text-white/70">
      <div className="flex items-center justify-between px-8 lg:px-10 py-8 text-[12px]">
        <div>
          © {new Date().getFullYear()} Kingdom Books & Stationery Ltd · University of Ghana, Legon
        </div>
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
