
// Screen 1 (Desktop): Homepage — Desktop View (Kingdom Books)
function HomeDesktop({ onNavigate }) {
  const navy = '#001a36';
  const gold = '#C9920A';
  const bg = '#F5F6FA';

  const categories = [
    { label: 'Business' },
    { label: 'Science' },
    { label: 'Humanities' },
    { label: 'Vocational' },
    { label: 'General Books' },
    { label: 'Stationery' },
    { label: 'Gifts' },
  ];

  const books = [
    { id: 1, title: 'Financial Accounting Principles', author: 'Pauline Weetman', price: 'GH₵ 85', color: '#2d5fa6' },
    { id: 2, title: 'African Political Economy', author: 'Lansana Keita', price: 'GH₵ 62', color: '#7c3d9e' },
    { id: 3, title: 'Organic Chemistry, 12th Ed.', author: 'T. W. Graham Solomons', price: 'GH₵ 98', color: '#c0392b' },
    { id: 4, title: 'Principles of Marketing', author: 'Philip Kotler', price: 'GH₵ 74', color: '#1a7a4a' },
    { id: 5, title: 'Engineering Mathematics', author: 'K. A. Stroud', price: 'GH₵ 91', color: '#b7600e' },
    { id: 6, title: 'Auditing Today', author: 'Emile Woolf', price: 'GH₵ 78', color: '#1a4a8a' },
  ];

  return (
    <div style={{ background: bg, minHeight: '100%', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Top nav */}
      <div style={{
        background: navy, padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 6, background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke={navy} strokeWidth="2.2"/>
              <path d="M19 3v18M9 8l3-2 3 2v6l-3-2-3 2V8z" stroke={navy} strokeWidth="2" strokeLinejoin="round" fill={navy}/>
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 16, lineHeight: 1.1 }}>Kingdom Books</div>
            <div style={{ color: gold, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>& Stationery · UG</div>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)', margin: '0 12px' }}/>
          {['Browse', 'New Arrivals', 'Stationery', 'Gifts', 'Deals'].map(l => (
            <span key={l} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer', padding: '0 4px' }}>{l}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            onClick={() => onNavigate && onNavigate('search')}
            style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, width: 280, cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8"/>
              <path d="M12.5 12.5L16 16" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Search by Title, Author, or ISBN…</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer' }}>Sign in</span>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onNavigate && onNavigate('checkout')}>
            <svg width="22" height="20" viewBox="0 0 26 24" fill="none">
              <path d="M1 1h3.5l2.2 11h12.6l2.2-11H22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="21" r="2" fill="#fff"/>
              <circle cx="18" cy="21" r="2" fill="#fff"/>
            </svg>
            <div style={{ position: 'absolute', top: -4, right: -6, width: 16, height: 16, borderRadius: '50%', background: gold, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(120deg, ${navy} 0%, #002a5c 60%, #003a7c 100%)`,
        padding: '60px 40px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${gold}22 0%, transparent 70%)` }}/>
        <div style={{ maxWidth: 600, position: 'relative' }}>
          <div style={{ color: gold, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>The Official UG Bookshop</div>
          <div style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 48, lineHeight: 1.1, marginBottom: 16 }}>Books, stationery & gifts for the academic year</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 28, maxWidth: 480 }}>Search 12,000+ titles. Free delivery on the Legon campus. Pay with Mobile Money.</div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 6, display: 'flex', alignItems: 'center', gap: 8, maxWidth: 520, boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" style={{ marginLeft: 12 }}>
              <circle cx="8" cy="8" r="6" stroke={navy} strokeWidth="1.8"/>
              <path d="M12.5 12.5L16 16" stroke={navy} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              placeholder="Search by Title, Author, or ISBN..."
              onKeyDown={e => { if (e.key === 'Enter' && onNavigate) onNavigate('search'); }}
              style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 4px', fontSize: 14, color: navy, background: 'transparent', fontFamily: 'inherit' }}
            />
            <button
              onClick={() => onNavigate && onNavigate('search')}
              style={{ background: gold, color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
            >Search</button>
          </div>
        </div>
      </div>

      {/* Shop by Category */}
      <div style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 26, color: navy }}>Shop by Category</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Browse the bookshop's main sections</div>
          </div>
          <div style={{ color: gold, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View all departments →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
          {categories.map((cat, i) => (
            <div
              key={cat.label}
              onClick={() => onNavigate && onNavigate('search')}
              style={{
                background: i === 0 ? navy : '#fff',
                color: i === 0 ? gold : navy,
                border: i === 0 ? 'none' : '1px solid #e5e8ee',
                borderRadius: 14, padding: '24px 12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: i === 0 ? gold : '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke={i === 0 ? navy : navy} strokeWidth="1.8"/>
                </svg>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', color: i === 0 ? '#fff' : navy }}>{cat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div style={{ padding: '0 40px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 26, color: navy }}>New Arrivals This Semester</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Fresh stock for the new academic year</div>
          </div>
          <div style={{ color: gold, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>See all →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
          {books.map(book => (
            <div
              key={book.id}
              onClick={() => onNavigate && onNavigate('product')}
              style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer' }}
            >
              <div style={{
                background: `linear-gradient(145deg, ${book.color}, ${book.color}cc)`,
                aspectRatio: '3/4', position: 'relative',
                display: 'flex', alignItems: 'flex-end', padding: 12,
              }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: 'rgba(0,0,0,0.2)' }}/>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 600, lineHeight: 1.3 }}>{book.title}</div>
              </div>
              <div style={{ padding: '12px' }}>
                <div style={{ fontSize: 12, color: navy, fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>{book.title}</div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>{book.author}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, color: gold, fontSize: 14 }}>{book.price}</div>
                  <div style={{ color: navy, fontSize: 11, fontWeight: 600 }}>+ Cart</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo strip */}
      <div style={{ padding: '0 40px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ background: `linear-gradient(120deg, ${gold}, #e6a80f)`, borderRadius: 14, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 22 }}>Semester Bundle Deals</div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 }}>Save up to 30% when you buy required texts together</div>
          </div>
          <div style={{ background: '#fff', color: gold, borderRadius: 8, padding: '10px 20px', fontWeight: 700, cursor: 'pointer' }}>Shop Now</div>
        </div>
        <div style={{ background: navy, borderRadius: 14, padding: '24px', color: '#fff' }}>
          <div style={{ color: gold, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Free Delivery</div>
          <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 18, lineHeight: 1.3 }}>On the Legon campus, every order over GH₵ 50</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: navy, padding: '32px 40px', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
          <span>© 2026 Kingdom Books & Stationery Ltd · University of Ghana, Legon</span>
          <span>Privacy · Terms · Contact</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeDesktop });
