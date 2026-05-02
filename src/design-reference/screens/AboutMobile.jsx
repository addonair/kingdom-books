
// Screen 6: About Us — Mobile View (Kingdom Books)
function AboutMobile({ onNavigate }) {
  const navy = '#001a36';
  const gold = '#C9920A';
  const bg = '#F5F6FA';

  const features = [
    {
      title: 'Free Delivery',
      sub: 'On the Legon campus',
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 7h11v9H3V7zM14 10h4l3 3v3h-7v-6z" stroke={navy} strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="7" cy="17" r="2" stroke={navy} strokeWidth="1.8"/>
        <circle cx="17" cy="17" r="2" stroke={navy} strokeWidth="1.8"/>
      </svg>,
    },
    {
      title: '30-Day Returns',
      sub: 'Hassle-free policy',
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l4-4M3 9l4 4M3 9h11a6 6 0 016 6v0a6 6 0 01-6 6H8" stroke={navy} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
    },
    {
      title: 'Mobile Money',
      sub: 'MTN, Voda, AirtelTigo',
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke={navy} strokeWidth="1.8"/>
        <circle cx="12" cy="17" r="1.2" fill={navy}/>
        <path d="M9 7h6" stroke={navy} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>,
    },
    {
      title: 'Bulk Discounts',
      sub: 'Save more on volume',
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M5 9l3-3h8l3 3v9a2 2 0 01-2 2H7a2 2 0 01-2-2V9z" stroke={navy} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M9 13l2 2 4-4" stroke={navy} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
    },
  ];

  return (
    <div style={{ background: bg, minHeight: '100%', fontFamily: '"DM Sans", sans-serif', paddingBottom: 40 }}>
      {/* Header bar */}
      <div style={{ background: navy, padding: '52px 16px 14px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={() => onNavigate && onNavigate('home')}
          style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 18 }}>About Us</span>
      </div>

      {/* Hero photo */}
      <div style={{
        height: 240, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #4a6178 100%)`,
      }}>
        {/* Subtle striped placeholder pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 14px, transparent 14px 28px)',
        }}/>
        {/* Warm glow */}
        <div style={{ position: 'absolute', bottom: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${gold}55 0%, transparent 70%)` }}/>
        {/* Placeholder label */}
        <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>[ photo · UG bookshop interior ]</div>
        {/* Caption */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '20px 20px', background: 'linear-gradient(transparent, rgba(0,15,30,0.85))' }}>
          <div style={{ color: gold, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Established 1960s</div>
          <div style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 24, lineHeight: 1.15 }}>50+ Years of Academic Excellence</div>
        </div>
      </div>

      {/* Story */}
      <div style={{ padding: '24px 20px 8px' }}>
        <div style={{ fontSize: 14, color: '#444', lineHeight: 1.6, marginBottom: 16 }}>
          Kingdom Books has served the <strong style={{ color: navy }}>University of Ghana, Legon</strong> community for over five decades — supplying generations of students, faculty, and researchers with the books and stationery that shape their academic journey.
        </div>
        <div style={{ fontSize: 14, color: '#444', lineHeight: 1.6, marginBottom: 16 }}>
          In <strong style={{ color: navy }}>October 2015</strong>, the bookshop was acquired by <strong style={{ color: navy }}>Kingdom Books & Stationery Ltd</strong>, who continues the tradition with a renewed focus on accessibility, fair pricing, and a digital-first experience for the modern UG student.
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, margin: '20px 0 8px' }}>
          {[
            { num: '50+', label: 'Years Serving UG' },
            { num: '12k', label: 'Titles in Stock' },
            { num: '40k', label: 'Students Served' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '14px 8px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: gold, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 10, color: '#666', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Kingdom Books */}
      <div style={{ padding: '20px' }}>
        <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: navy, marginBottom: 4 }}>Why Kingdom Books?</div>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>What we offer beyond just books</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#fff', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fffbf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 2 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: '#666', lineHeight: 1.3 }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact strip */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ background: navy, borderRadius: 16, padding: 20, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle, ${gold}33 0%, transparent 70%)` }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ color: gold, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Contact Us</div>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, marginBottom: 18 }}>Visit, call, or message</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Phone</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>+233 30 250 7777 · +233 24 444 7777</div>
                </div>
              </div>

              {/* WhatsApp */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,211,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 21l1.5-5A9 9 0 1112 21H8L3 21z" stroke="#25D366" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 10c0 3 2 5 5 5l1.5-1.5-2-1-1 .5c-1 0-2-1-2-2l.5-1-1-2L8.5 8.5C8.5 9 9 10 9 10z" fill="#25D366"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>WhatsApp</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>+233 24 444 7777 · Reply within 1 hr</div>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${gold}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" stroke={gold} strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.5" stroke={gold} strokeWidth="1.8"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Find us</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Balme Library Block, UG Legon Campus</div>
                </div>
              </div>
            </div>

            {/* Mini map placeholder */}
            <div style={{
              marginTop: 16, height: 100, borderRadius: 10,
              background: 'linear-gradient(135deg, #1a3556, #234770)',
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 10px, transparent 10px 20px)',
              position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              {/* Roads */}
              <div style={{ position: 'absolute', top: '60%', left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.15)' }}/>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '40%', width: 2, background: 'rgba(255,255,255,0.15)' }}/>
              {/* Pin */}
              <div style={{ position: 'absolute', top: '45%', left: '40%', transform: 'translate(-50%, -100%)' }}>
                <svg width="24" height="32" viewBox="0 0 24 32"><path d="M12 30s10-10 10-18a10 10 0 10-20 0c0 8 10 18 10 18z" fill={gold} stroke="#fff" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>
              </div>
              <div style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>UG Legon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AboutMobile });
