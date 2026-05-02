
// Screen 3 (Desktop): Product Detail — Desktop View
function ProductDesktop({ onNavigate }) {
  const navy = '#001a36';
  const gold = '#C9920A';
  const bg = '#F5F6FA';

  const [selectedFormat, setSelectedFormat] = React.useState('Paperback');
  const [qty, setQty] = React.useState(1);
  const [wishlisted, setWishlisted] = React.useState(false);
  const formats = ['Paperback', 'Hardcover', 'Large Print', 'E-book Gift Card'];

  const StarRating = ({ rating, count }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3,4,5].map(s => (
          <svg key={s} width="14" height="14" viewBox="0 0 12 12">
            <path d="M6 1l1.4 3h3.1l-2.5 1.9.9 3L6 7.2 3.1 8.9l.9-3L1.5 4H4.6L6 1z" fill={s <= Math.round(rating) ? gold : '#e0e0e0'}/>
          </svg>
        ))}
      </div>
      <span style={{ fontSize: 13, color: '#666' }}>{rating} · {count} reviews</span>
    </div>
  );

  return (
    <div style={{ background: bg, minHeight: '100%', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Top nav */}
      <div style={{ background: navy, padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke={navy} strokeWidth="2.2"/>
              <path d="M19 3v18M9 8l3-2 3 2v6l-3-2-3 2V8z" stroke={navy} strokeWidth="2" strokeLinejoin="round" fill={navy}/>
            </svg>
          </div>
          <span style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 14 }}>Kingdom Books</span>
        </div>
        <div onClick={() => onNavigate && onNavigate('checkout')} style={{ position: 'relative', cursor: 'pointer' }}>
          <svg width="22" height="20" viewBox="0 0 26 24" fill="none">
            <path d="M1 1h3.5l2.2 11h12.6l2.2-11H22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="10" cy="21" r="2" fill="#fff"/>
            <circle cx="18" cy="21" r="2" fill="#fff"/>
          </svg>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: '14px 40px', fontSize: 12, color: '#666' }}>
        <span onClick={() => onNavigate && onNavigate('home')} style={{ cursor: 'pointer', color: gold }}>Home</span>
        <span style={{ margin: '0 6px' }}>›</span>
        <span style={{ cursor: 'pointer', color: gold }}>Business</span>
        <span style={{ margin: '0 6px' }}>›</span>
        <span style={{ cursor: 'pointer', color: gold }}>Accounting</span>
        <span style={{ margin: '0 6px' }}>›</span>
        <span style={{ color: navy, fontWeight: 600 }}>Financial Accounting: An Introduction</span>
      </div>

      <div style={{ padding: '0 40px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1100, margin: '0 auto' }}>
        {/* Book hero */}
        <div style={{
          background: 'linear-gradient(150deg, #1a4a8a 0%, #2d5fa6 50%, #3d7fcf 100%)',
          borderRadius: 16, padding: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 480, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 40% 60%, rgba(201,146,10,0.2) 0%, transparent 70%)' }}/>
          <div style={{
            width: 240, height: 340,
            background: 'linear-gradient(145deg, #0d3060, #1a4a8a)',
            borderRadius: '2px 10px 10px 2px',
            boxShadow: '8px 8px 40px rgba(0,0,0,0.5), inset -4px 0 8px rgba(0,0,0,0.3)',
            position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', padding: '32px 22px',
          }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 14, background: 'rgba(0,0,0,0.35)' }}/>
            <div style={{ color: gold, fontSize: 11, letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', marginBottom: 14, marginLeft: 8 }}>BUSINESS</div>
            <div style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 22, lineHeight: 1.25, marginLeft: 8 }}>Financial Accounting: An Introduction</div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 12, marginLeft: 8 }}>Pauline Weetman</div>
            <div style={{ height: 1, background: gold, opacity: 0.4, margin: '14px 8px' }}/>
            <div style={{ flex: 1 }}/>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginLeft: 8 }}>8th Edition</div>
          </div>
        </div>

        {/* Details */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <div style={{ background: '#f0f4ff', color: navy, borderRadius: 4, padding: '4px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Business · Accounting</div>
            <div style={{ background: navy, color: '#fff', borderRadius: 4, padding: '4px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{selectedFormat}</div>
          </div>
          <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 32, color: navy, lineHeight: 1.15, marginBottom: 8 }}>Financial Accounting: An Introduction</div>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 14 }}>by <span style={{ color: navy, fontWeight: 600 }}>Pauline Weetman</span> · 8th Edition · Pearson</div>
          <div style={{ marginBottom: 20 }}><StarRating rating={4.8} count={1204} /></div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
            <div style={{ fontWeight: 800, fontSize: 36, color: gold }}>GH₵ 120.00</div>
            <div style={{ fontSize: 16, color: '#aaa', textDecoration: 'line-through' }}>GH₵ 145.00</div>
            <div style={{ background: '#eaf7ef', color: '#1a7a4a', borderRadius: 4, padding: '3px 8px', fontSize: 12, fontWeight: 700 }}>17% OFF</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Choose Format</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {formats.map(f => (
                <div
                  key={f}
                  onClick={() => setSelectedFormat(f)}
                  style={{
                    border: `1.5px solid ${selectedFormat === f ? gold : '#ddd'}`,
                    borderRadius: 10, padding: '12px 14px',
                    background: selectedFormat === f ? '#fffbf0' : '#fff',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${selectedFormat === f ? gold : '#ccc'}`, background: selectedFormat === f ? gold : 'transparent', flexShrink: 0 }}/>
                  <span style={{ fontSize: 13, color: selectedFormat === f ? navy : '#555', fontWeight: selectedFormat === f ? 600 : 400 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width: 32, height: 32, border: 'none', background: '#fff', cursor: 'pointer', fontSize: 16, color: navy }}>−</button>
              <div style={{ width: 32, textAlign: 'center', fontSize: 14, fontWeight: 600, color: navy }}>{qty}</div>
              <button onClick={() => setQty(q => q+1)} style={{ width: 32, height: 32, border: 'none', background: '#fff', cursor: 'pointer', fontSize: 16, color: navy }}>+</button>
            </div>
            <span style={{ fontSize: 12, color: '#1a7a4a', fontWeight: 600 }}>● In Stock</span>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              style={{ flex: 1, padding: '14px', border: `2px solid ${navy}`, borderRadius: 12, background: 'transparent', color: navy, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <svg width="16" height="14" viewBox="0 0 24 22" fill="none">
                <path d="M12 21C12 21 2 14.5 2 7a5 5 0 0110 0 5 5 0 0110 0c0 7.5-10 14-10 14z" stroke={wishlisted ? '#e63946' : navy} fill={wishlisted ? '#e63946' : 'none'} strokeWidth="2.5"/>
              </svg>
              Add to Wishlist
            </button>
            <button
              onClick={() => onNavigate && onNavigate('checkout')}
              style={{ flex: 2, padding: '14px', border: 'none', borderRadius: 12, background: gold, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 16px ${gold}66` }}
            >Add to Cart — GH₵ {120 * qty}.00</button>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 7h11v9H3V7zM14 10h4l3 3v3h-7v-6z" stroke={navy} strokeWidth="1.6" strokeLinejoin="round"/><circle cx="7" cy="17" r="2" stroke={navy} strokeWidth="1.6"/><circle cx="17" cy="17" r="2" stroke={navy} strokeWidth="1.6"/></svg>, text: 'Free delivery on campus' },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9l4-4M3 9l4 4M3 9h11a6 6 0 016 6v0a6 6 0 01-6 6H8" stroke={navy} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, text: '30-day returns' },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.4C17.5 22.15 20 17.25 20 12V6L12 2z" stroke={navy} strokeWidth="1.6"/><path d="M9 12l2 2 4-4" stroke={navy} strokeWidth="1.8" strokeLinecap="round"/></svg>, text: 'Price match guaranteed' },
            ].map((tr, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
                {tr.icon}
                <span style={{ fontSize: 11, color: '#555', fontWeight: 500 }}>{tr.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProductDesktop });
