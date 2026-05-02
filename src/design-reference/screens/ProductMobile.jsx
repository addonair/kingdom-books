
// Screen 3: Product Detail Page — Mobile View
function ProductMobile({ onNavigate }) {
  const navy = '#001a36';
  const gold = '#C9920A';

  const [selectedFormat, setSelectedFormat] = React.useState('Paperback');
  const [addedToCart, setAddedToCart] = React.useState(false);
  const [wishlisted, setWishlisted] = React.useState(false);

  const formats = ['Paperback', 'Hardcover', 'Large Print', 'E-book Gift Card'];

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const StarRating = ({ rating, count }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3,4,5].map(s => (
          <svg key={s} width="13" height="13" viewBox="0 0 12 12">
            <path d="M6 1l1.4 3h3.1l-2.5 1.9.9 3L6 7.2 3.1 8.9l.9-3L1.5 4H4.6L6 1z"
              fill={s <= Math.round(rating) ? gold : '#e0e0e0'}/>
          </svg>
        ))}
      </div>
      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#666' }}>{rating} ({count} reviews)</span>
    </div>
  );

  return (
    <div style={{ background: '#fff', height: '100%', overflowY: 'auto', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '52px 16px 10px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div
          onClick={() => onNavigate && onNavigate('search')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: navy }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke={navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Results</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div
            onClick={() => setWishlisted(!wishlisted)}
            style={{ cursor: 'pointer' }}
          >
            <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
              <path d="M12 21C12 21 2 14.5 2 7a5 5 0 0110 0 5 5 0 0110 0c0 7.5-10 14-10 14z"
                stroke={wishlisted ? '#e63946' : '#666'}
                fill={wishlisted ? '#e63946' : 'none'}
                strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div onClick={() => onNavigate && onNavigate('checkout')} style={{ position: 'relative', cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 26 24" fill="none">
              <path d="M1 1h3.5l2.2 11h12.6l2.2-11H22" stroke={navy} strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="21" r="2" fill={navy}/>
              <circle cx="18" cy="21" r="2" fill={navy}/>
            </svg>
            <div style={{
              position: 'absolute', top: -4, right: -4,
              width: 16, height: 16, borderRadius: '50%',
              background: gold, color: '#fff', fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>2</div>
          </div>
        </div>
      </div>

      {/* Book hero image */}
      <div style={{
        width: '100%', height: 280,
        background: 'linear-gradient(150deg, #1a4a8a 0%, #2d5fa6 50%, #3d7fcf 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 40% 60%, rgba(201,146,10,0.2) 0%, transparent 70%)',
        }}/>
        {/* Book mockup */}
        <div style={{
          width: 140, height: 200,
          background: 'linear-gradient(145deg, #0d3060, #1a4a8a)',
          borderRadius: '2px 8px 8px 2px',
          boxShadow: '6px 6px 30px rgba(0,0,0,0.5), inset -3px 0 6px rgba(0,0,0,0.3)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          padding: '20px 14px',
        }}>
          {/* Spine */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 10,
            background: 'rgba(0,0,0,0.35)',
          }}/>
          <div style={{
            color: gold, fontSize: 9, letterSpacing: '0.1em',
            fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, marginLeft: 6,
          }}>BUSINESS</div>
          <div style={{
            color: '#fff', fontFamily: '"DM Serif Display", Georgia, serif',
            fontSize: 16, lineHeight: 1.3, marginLeft: 6, fontWeight: 400,
          }}>Financial Accounting: An Introduction</div>
          <div style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 8, marginLeft: 6,
          }}>Pauline Weetman</div>
          {/* decorative line */}
          <div style={{ height: 1, background: gold, opacity: 0.4, margin: '10px 6px' }}/>
          <div style={{ flex: 1 }}/>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, marginLeft: 6 }}>8th Edition</div>
        </div>
      </div>

      {/* Required tag */}
      {/* Subject + format tags */}
      <div style={{
        background: '#fff',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: '1px solid #eee',
      }}>
        <div style={{
          background: '#f0f4ff', color: navy, borderRadius: 4,
          padding: '3px 9px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Business · Accounting</div>
        <div style={{
          background: navy, color: '#fff', borderRadius: 4,
          padding: '3px 9px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{selectedFormat}</div>
      </div>

      {/* Main content */}
      <div style={{ padding: '20px 16px' }}>
        <div style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize: 22, color: navy, lineHeight: 1.2, marginBottom: 6, fontWeight: 400,
        }}>
          Financial Accounting: An Introduction
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
          by <span style={{ color: navy, fontWeight: 600 }}>Pauline Weetman</span> · 8th Edition
        </div>
        <div style={{ marginBottom: 14 }}>
          <StarRating rating={4.8} count={1204} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 28, color: gold }}>GH₵ 120.00</div>
          <div style={{ fontSize: 14, color: '#aaa', textDecoration: 'line-through' }}>GH₵ 145.00</div>
          <div style={{
            background: '#eaf7ef', color: '#1a7a4a',
            borderRadius: 4, padding: '2px 7px', fontSize: 11, fontWeight: 700,
          }}>17% OFF</div>
        </div>

        {/* Format selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: navy, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Choose Format</div>
          <div style={{
            border: `1.5px solid #ddd`, borderRadius: 10,
            overflow: 'hidden',
          }}>
            {formats.map((f, i) => (
              <div
                key={f}
                onClick={() => setSelectedFormat(f)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: selectedFormat === f ? '#f0f4ff' : '#fff',
                  borderTop: i > 0 ? '1px solid #eee' : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: `2px solid ${selectedFormat === f ? gold : '#ccc'}`,
                    background: selectedFormat === f ? gold : 'transparent',
                  }}/>
                  <span style={{ fontSize: 13, color: selectedFormat === f ? navy : '#555', fontWeight: selectedFormat === f ? 600 : 400 }}>{f}</span>
                </div>
                {f.includes('Instant') && (
                  <span style={{ fontSize: 10, color: '#1a7a4a', fontWeight: 600 }}>INSTANT</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            style={{
              flex: 1, padding: '13px',
              border: `2px solid ${navy}`, borderRadius: 12,
              background: 'transparent', color: navy,
              fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <svg width="16" height="14" viewBox="0 0 24 22" fill="none">
              <path d="M12 21C12 21 2 14.5 2 7a5 5 0 0110 0 5 5 0 0110 0c0 7.5-10 14-10 14z"
                stroke={wishlisted ? '#e63946' : navy}
                fill={wishlisted ? '#e63946' : 'none'}
                strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Wishlist
          </button>
          <button
            onClick={handleAddToCart}
            style={{
              flex: 2, padding: '13px',
              border: 'none', borderRadius: 12,
              background: addedToCart ? '#1a7a4a' : gold,
              color: '#fff',
              fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 800,
              cursor: 'pointer',
              transition: 'background 0.25s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: `0 4px 16px ${gold}66`,
            }}
          >
            {addedToCart ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Added to Cart!
              </>
            ) : (
              <>Add to Cart — GH₵ 120</>
            )}
          </button>
        </div>

        {/* Trust bar */}
        <div style={{
          background: '#F5F6FA', borderRadius: 12, padding: '12px 14px',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
        }}>
          {[
            {
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 7h11v9H3V7zM14 10h4l3 3v3h-7v-6z" stroke={navy} strokeWidth="1.6" strokeLinejoin="round"/><circle cx="7" cy="17" r="2" stroke={navy} strokeWidth="1.6"/><circle cx="17" cy="17" r="2" stroke={navy} strokeWidth="1.6"/></svg>,
              text: 'Free delivery on campus',
            },
            {
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9l4-4M3 9l4 4M3 9h11a6 6 0 016 6v0a6 6 0 01-6 6H8" stroke={navy} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
              text: '30-day returns',
            },
            {
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.4C17.5 22.15 20 17.25 20 12V6L12 2z" stroke={navy} strokeWidth="1.6"/><path d="M9 12l2 2 4-4" stroke={navy} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
              text: 'Price match guaranteed',
            },
          ].map((tr, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
              {tr.icon}
              <span style={{ fontSize: 10, color: '#555', lineHeight: 1.3, fontWeight: 500 }}>{tr.text}</span>
            </div>
          ))}
        </div>

        {/* Description snippet */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: navy, marginBottom: 8 }}>About this textbook</div>
          <div style={{ fontSize: 12, color: '#666', lineHeight: 1.7 }}>
            The world's most successful calculus textbook for science, mathematics, and engineering students. James Stewart's writing is clear and accessible, making complex concepts approachable.
          </div>
        </div>

        <div style={{ height: 30 }}/>
      </div>
    </div>
  );
}

Object.assign(window, { ProductMobile });
