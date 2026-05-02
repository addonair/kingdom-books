
// Screen 0: Landing / Welcome — Mobile View (Kingdom Books)
function LandingMobile({ onNavigate }) {
  const navy = '#001a36';
  const gold = '#C9920A';

  return (
    <div style={{
      background: `linear-gradient(165deg, ${navy} 0%, #001229 60%, #000c1c 100%)`,
      minHeight: '100%', height: '100%',
      fontFamily: '"DM Sans", sans-serif',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient gold glow top-right */}
      <div style={{
        position: 'absolute', top: -120, right: -120,
        width: 360, height: 360, borderRadius: '50%',
        background: `radial-gradient(circle, ${gold}33 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>
      {/* Ambient blue glow bottom-left */}
      <div style={{
        position: 'absolute', bottom: -100, left: -120,
        width: 320, height: 320, borderRadius: '50%',
        background: `radial-gradient(circle, #1a4a8a44 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>
      {/* Subtle grid texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0 1px, transparent 1px 22px)',
        pointerEvents: 'none',
      }}/>

      {/* Top: logo */}
      <div style={{
        paddingTop: 90, paddingBottom: 24,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          width: 76, height: 76, borderRadius: 20,
          background: gold,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 12px 40px ${gold}55`,
          position: 'relative',
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke={navy} strokeWidth="2.2"/>
            <path d="M19 3v18M9 8l3-2 3 2v6l-3-2-3 2V8z" stroke={navy} strokeWidth="2" strokeLinejoin="round" fill={navy}/>
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 24, lineHeight: 1.05 }}>Kingdom Books</div>
          <div style={{ color: gold, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 6, fontWeight: 600 }}>& Stationery · Est. 1960s</div>
        </div>
      </div>

      {/* Hero illustration band */}
      <div style={{
        margin: '8px 28px 0',
        height: 200, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Stack of book spines */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, transform: 'perspective(600px) rotateY(-6deg)' }}>
          {[
            { c: '#1a4a8a', h: 130, w: 24 },
            { c: '#7c3d9e', h: 150, w: 22 },
            { c: gold,     h: 170, w: 28 },
            { c: '#c0392b', h: 145, w: 22 },
            { c: '#1a7a4a', h: 160, w: 24 },
            { c: '#b7600e', h: 130, w: 22 },
          ].map((b, i) => (
            <div key={i} style={{
              width: b.w, height: b.h,
              background: `linear-gradient(180deg, ${b.c}, ${b.c}cc)`,
              borderRadius: '3px 3px 1px 1px',
              boxShadow: `inset -2px 0 4px rgba(0,0,0,0.3), 0 12px 30px rgba(0,0,0,0.4)`,
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', left: '50%', top: '20%', transform: 'translateX(-50%) rotate(90deg)', whiteSpace: 'nowrap', fontSize: 7, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                {i % 2 === 0 ? 'KB·LEGON' : 'EDITION'}
              </div>
            </div>
          ))}
        </div>
        {/* Floating accent */}
        <div style={{ position: 'absolute', bottom: 8, right: 24, color: gold, opacity: 0.5 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v4M8 11v4M1 8h4M11 8h4M3 3l2.5 2.5M10.5 10.5L13 13M3 13l2.5-2.5M10.5 5.5L13 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* Hero headline */}
      <div style={{ padding: '32px 28px 0', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          color: '#fff', fontFamily: '"DM Serif Display", serif',
          fontSize: 32, lineHeight: 1.1, fontWeight: 400,
          marginBottom: 14, letterSpacing: '-0.01em',
        }}>
          Ghana's Premier Bookshop —
          <span style={{ color: gold }}> Now Online</span>
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.5,
          maxWidth: 320, margin: '0 auto',
        }}>
          Books, stationery & gifts delivered to your campus
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{ padding: '32px 24px 0', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => onNavigate && onNavigate('home')}
          style={{
            background: gold, color: '#fff',
            border: 'none', borderRadius: 14, padding: '18px 24px',
            fontSize: 15, fontWeight: 800, fontFamily: 'inherit',
            cursor: 'pointer', letterSpacing: '0.02em',
            boxShadow: `0 8px 28px ${gold}66, inset 0 1px 0 rgba(255,255,255,0.2)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'transform 0.1s',
          }}
        >
          Shop Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('signin')}
          style={{
            background: 'transparent', color: '#fff',
            border: `1.5px solid rgba(255,255,255,0.25)`, borderRadius: 14,
            padding: '15px 24px',
            fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            cursor: 'pointer', letterSpacing: '0.02em',
          }}
        >
          Sign In
        </button>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }}/>

      {/* Trust signals strip */}
      <div style={{
        padding: '20px 16px 40px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: '14px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {[
            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke={gold} strokeWidth="2"/></svg>, num: '10,000+', label: 'Products' },
            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 7h11v9H3V7zM14 10h4l3 3v3h-7v-6z" stroke={gold} strokeWidth="2" strokeLinejoin="round"/><circle cx="7" cy="17" r="2" stroke={gold} strokeWidth="2"/><circle cx="17" cy="17" r="2" stroke={gold} strokeWidth="2"/></svg>, num: 'Free', label: 'Campus Delivery' },
            { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke={gold} strokeWidth="2"/><circle cx="12" cy="17" r="1" fill={gold}/></svg>, num: 'MoMo', label: 'Accepted' },
          ].map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)' }}/>}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {item.icon}
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{item.num}</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, letterSpacing: '0.05em', textAlign: 'center' }}>{item.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
          Serving the University of Ghana since 1960s
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LandingMobile });
