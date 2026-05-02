
// Screen 1: Homepage — Mobile View (Kingdom Books)
function HomeMobile({ onNavigate }) {
  const [cartCount] = React.useState(2);
  const [searchVal, setSearchVal] = React.useState('');

  const navy = '#001a36';
  const gold = '#C9920A';
  const bg = '#F5F6FA';

  const categories = [
    { label: 'Business', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 7h18v13H3V7z" stroke="currentColor" strokeWidth="1.8"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 12h18" stroke="currentColor" strokeWidth="1.8"/></svg>
    ) },
    { label: 'Science', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 3v6L4 19a2 2 0 002 2h12a2 2 0 002-2L15 9V3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M8 3h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
    ) },
    { label: 'Humanities', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 5a2 2 0 012-2h6v18H5a2 2 0 01-2-2V5zM21 5a2 2 0 00-2-2h-6v18h6a2 2 0 002-2V5z" stroke="currentColor" strokeWidth="1.8"/></svg>
    ) },
    { label: 'Vocational', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 7l3-3 4 4-3 3M14 7l-9 9v4h4l9-9M14 7l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
    ) },
    { label: 'General Books', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.8"/><path d="M8 7h7M8 11h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
    ) },
    { label: 'Stationery', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M16 4l4 4-12 12H4v-4L16 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8"/></svg>
    ) },
    { label: 'Gifts', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8s-3-5-6-3 0 5 6 3zM12 8s3-5 6-3 0 5-6 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
    ) },
  ];

  const books = [
    { id: 1, title: 'Financial Accounting Principles', price: 'GH₵ 85', color: '#2d5fa6' },
    { id: 2, title: 'African Political Economy', price: 'GH₵ 62', color: '#7c3d9e' },
    { id: 3, title: 'Organic Chemistry, 12th Ed.', price: 'GH₵ 98', color: '#c0392b' },
    { id: 4, title: 'Principles of Marketing', price: 'GH₵ 74', color: '#1a7a4a' },
    { id: 5, title: 'Engineering Mathematics', price: 'GH₵ 91', color: '#b7600e' },
  ];

  return (
    <div style={{ background: bg, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: navy, padding: '54px 16px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Kingdom Books logo mark */}
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke={navy} strokeWidth="2.2"/>
              <path d="M19 3v18M9 8l3-2 3 2v6l-3-2-3 2V8z" stroke={navy} strokeWidth="2" strokeLinejoin="round" fill={navy}/>
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontWeight: 400, fontSize: 14, lineHeight: 1.1 }}>Kingdom Books</div>
            <div style={{ color: gold, fontFamily: '"DM Sans", sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>& Stationery · UG</div>
          </div>
        </div>
        <div
          onClick={() => onNavigate && onNavigate('checkout')}
          style={{ position: 'relative', cursor: 'pointer', padding: 6 }}
        >
          <svg width="26" height="24" viewBox="0 0 26 24" fill="none">
            <path d="M1 1h3.5l2.2 11h12.6l2.2-11H22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="10" cy="21" r="2" fill="#fff"/>
            <circle cx="18" cy="21" r="2" fill="#fff"/>
          </svg>
          {cartCount > 0 && (
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: 18, height: 18, borderRadius: '50%',
              background: gold, color: '#fff',
              fontFamily: '"DM Sans", sans-serif', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{cartCount}</div>
          )}
        </div>
      </div>

      {/* Hero / Search */}
      <div style={{
        background: `linear-gradient(160deg, ${navy} 0%, #002a5c 100%)`,
        padding: '24px 16px 28px',
      }}>
        <div style={{ color: '#fff', fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 22, fontWeight: 400, marginBottom: 4, lineHeight: 1.3 }}>
          The University Bookshop
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontFamily: '"DM Sans", sans-serif', fontSize: 12, marginBottom: 16 }}>
          Books, stationery & gifts — delivered on campus
        </div>
        <div
          onClick={() => onNavigate && onNavigate('search')}
          style={{
            background: '#fff', borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 14px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
            cursor: 'text',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="8" cy="8" r="6" stroke={navy} strokeWidth="1.8"/>
            <path d="M12.5 12.5L16 16" stroke={navy} strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && onNavigate) onNavigate('search'); }}
            placeholder='Search by Title, Author, or ISBN...'
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontFamily: '"DM Sans", sans-serif', fontSize: 13,
              color: navy, background: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Shop by Category */}
      <div style={{ padding: '20px 0 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', marginBottom: 12 }}>
          <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 18, color: navy }}>Shop by Category</div>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: gold, fontWeight: 600, cursor: 'pointer' }}>See all</div>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 6px' }}>
          {categories.map((cat, i) => (
            <div
              key={cat.label}
              onClick={() => onNavigate && onNavigate('search')}
              style={{
                flexShrink: 0, width: 66,
                background: i % 2 === 0 ? '#fff' : navy,
                color: i % 2 === 0 ? navy : gold,
                border: i % 2 === 0 ? '1px solid #e5e8ee' : 'none',
                borderRadius: 12,
                padding: '12px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              {cat.icon}
              <div style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 9, fontWeight: 600, textAlign: 'center', lineHeight: 1.2,
                color: i % 2 === 0 ? navy : '#fff',
              }}>{cat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div style={{ padding: '20px 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', marginBottom: 12 }}>
          <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 18, color: navy }}>New Arrivals This Semester</div>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: gold, fontWeight: 600, cursor: 'pointer' }}>See all</div>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 16px 4px', scrollSnapType: 'x mandatory' }}>
          {books.map(book => (
            <div
              key={book.id}
              onClick={() => onNavigate && onNavigate('product')}
              style={{ flexShrink: 0, width: 120, cursor: 'pointer', scrollSnapAlign: 'start' }}
            >
              <div style={{
                width: 120, height: 160,
                background: `linear-gradient(145deg, ${book.color}, ${book.color}cc)`,
                borderRadius: 8, marginBottom: 8,
                boxShadow: '3px 3px 12px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'flex-end', padding: 8,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: 'rgba(0,0,0,0.2)' }}/>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontFamily: '"DM Sans", sans-serif', fontSize: 10, lineHeight: 1.3, fontWeight: 600 }}>{book.title}</div>
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: navy, fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>{book.title}</div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: gold, fontWeight: 700 }}>{book.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo banner */}
      <div style={{
        margin: '20px 16px 16px',
        background: `linear-gradient(120deg, ${gold}, #e6a80f)`,
        borderRadius: 14, padding: '14px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 15, color: '#fff', fontWeight: 400 }}>Semester Bundle Deals</div>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>Up to 30% off selected texts</div>
        </div>
        <div style={{
          background: '#fff', color: gold, borderRadius: 8,
          padding: '8px 12px', fontFamily: '"DM Sans", sans-serif',
          fontSize: 11, fontWeight: 700, cursor: 'pointer',
        }}>Shop Now</div>
      </div>

      <div style={{ height: 70 }} />

      {/* Bottom Nav */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid #e8eaef',
        display: 'flex', height: 60,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
        zIndex: 20,
      }}>
        {[
          { icon: 'M3 10l9-8 9 8v11H14v-6H10v6H3V10Z', label: 'Home', active: true, path: 'home' },
          { icon: 'M11 19a8 8 0 100-16 8 8 0 000 16zm7-1l-3.5-3.5', label: 'Search', active: false, path: 'search' },
          { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Orders', active: false, path: 'home' },
          { icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z', label: 'Account', active: false, path: 'home' },
        ].map((item, i) => (
          <div
            key={i}
            onClick={() => onNavigate && onNavigate(item.path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 3, cursor: 'pointer',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d={item.icon} stroke={item.active ? gold : '#9aa0a6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 10,
              color: item.active ? gold : '#9aa0a6',
              fontWeight: item.active ? 700 : 400,
            }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeMobile });
