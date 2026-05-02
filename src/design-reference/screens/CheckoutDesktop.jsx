
// Screen 4 (Desktop): Checkout — Payment Step — Desktop View
function CheckoutDesktop({ onNavigate }) {
  const navy = '#001a36';
  const gold = '#C9920A';
  const bg = '#F5F6FA';

  const [selectedPayment, setSelectedPayment] = React.useState('mtn');
  const [momoNumber, setMomoNumber] = React.useState('');
  const [paying, setPaying] = React.useState(false);

  const providers = [
    { id: 'mtn', name: 'MTN MoMo', sub: 'Most popular', logo: <svg width="56" height="32" viewBox="0 0 56 32"><rect width="56" height="32" rx="6" fill="#FFCC00"/><text x="8" y="22" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="14" fill="#000">MTN</text></svg> },
    { id: 'vodafone', name: 'Vodafone Cash', sub: 'Instant transfer', logo: <svg width="56" height="32" viewBox="0 0 56 32"><rect width="56" height="32" rx="6" fill="#E60000"/><circle cx="28" cy="16" r="11" fill="none" stroke="#fff" strokeWidth="2.5"/><path d="M22 16c0-3 3-6 6-6 3 0 6 3 6 6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg> },
    { id: 'airteltigo', name: 'AirtelTigo Money', sub: 'No fees', logo: <svg width="56" height="32" viewBox="0 0 56 32"><rect width="56" height="32" rx="6" fill="#E8001C"/><text x="6" y="14" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="9" fill="#fff">AIRTEL</text><text x="6" y="26" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="9" fill="#FFD700">TIGO</text></svg> },
  ];

  const handlePay = () => {
    if (!momoNumber || momoNumber.length < 9) return;
    setPaying(true);
    setTimeout(() => { setPaying(false); onNavigate && onNavigate('home'); }, 2000);
  };

  return (
    <div style={{ background: bg, minHeight: '100%', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Top nav */}
      <div style={{ background: navy, padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke={navy} strokeWidth="2.2"/>
              <path d="M19 3v18M9 8l3-2 3 2v6l-3-2-3 2V8z" stroke={navy} strokeWidth="2" fill={navy}/>
            </svg>
          </div>
          <span style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 14 }}>Kingdom Books · Secure Checkout</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: gold, fontSize: 12 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.4C17.5 22.15 20 17.25 20 12V6L12 2z" stroke={gold} strokeWidth="2"/></svg>
          256-bit SSL encrypted
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '20px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 600, margin: '0 auto' }}>
          {[
            { num: 1, label: 'Delivery', done: true },
            { num: 2, label: 'Payment', active: true },
            { num: 3, label: 'Confirm', done: false },
          ].map((step, i) => (
            <React.Fragment key={step.num}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: step.done ? '#1a7a4a' : step.active ? gold : '#e0e0e0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                  {step.done ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.5"/></svg> : step.num}
                </div>
                <span style={{ fontSize: 12, color: step.active ? gold : step.done ? '#1a7a4a' : '#aaa', fontWeight: step.active ? 700 : 500 }}>{step.label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, maxWidth: 80, height: 2, margin: '0 16px', marginTop: -16, background: step.done ? '#1a7a4a' : '#e0e0e0' }}/>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 28, maxWidth: 1100, margin: '0 auto' }}>
        {/* Payment column */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: navy, marginBottom: 20 }}>Pay with Mobile Money</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            {providers.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedPayment(p.id)}
                style={{
                  border: `2px solid ${selectedPayment === p.id ? gold : '#eee'}`,
                  borderRadius: 12, padding: '16px 14px',
                  background: selectedPayment === p.id ? '#fffbf0' : '#fff',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10,
                  position: 'relative',
                }}
              >
                {selectedPayment === p.id && (
                  <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: '50%', background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3"/></svg>
                  </div>
                )}
                {p.logo}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: navy }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{p.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: navy, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>MoMo Phone Number</div>
            <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${momoNumber ? navy : '#ddd'}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '14px 14px', background: '#F5F6FA', display: 'flex', alignItems: 'center', gap: 8, borderRight: '1px solid #eee' }}>
                <svg width="22" height="14" viewBox="0 0 22 14" style={{ borderRadius: 2 }}>
                  <rect width="22" height="5" fill="#006B3F"/>
                  <rect y="5" width="22" height="4" fill="#FCD116"/>
                  <rect y="9" width="22" height="5" fill="#CE1126"/>
                  <polygon points="11,6 12.2,8.7 15,8.7 12.9,10.3 13.7,13 11,11.4 8.3,13 9.1,10.3 7,8.7 9.8,8.7" fill="#000"/>
                </svg>
                <span style={{ fontSize: 14, fontWeight: 600, color: navy }}>+233</span>
              </div>
              <input
                type="tel"
                value={momoNumber}
                onChange={e => setMomoNumber(e.target.value.replace(/\D/g,'').slice(0,10))}
                placeholder="XX XXX XXXX"
                style={{ flex: 1, border: 'none', outline: 'none', padding: '14px', fontSize: 15, color: navy, letterSpacing: '0.08em', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={paying}
            style={{ width: '100%', padding: '16px', border: 'none', borderRadius: 12, background: paying ? '#b8800a' : gold, color: '#fff', fontSize: 15, fontWeight: 900, cursor: paying ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: `0 6px 24px ${gold}55`, letterSpacing: '0.02em' }}
          >
            {paying ? 'Processing…' : 'PAY NOW — GH₵ 120.00'}
          </button>
          <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: '#888' }}>
            🔒 Secured by Paystack. Your payment is encrypted.
          </div>
        </div>

        {/* Order summary */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: navy, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order Summary</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ width: 56, height: 76, borderRadius: 4, background: 'linear-gradient(145deg, #1a4a8a, #2d5fa6)', flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: navy, lineHeight: 1.3 }}>Financial Accounting: An Introduction</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Paperback · 8th Ed. · Pauline Weetman</div>
            </div>
            <div style={{ fontWeight: 800, color: gold, fontSize: 14 }}>GH₵ 120</div>
          </div>
          <div style={{ height: 1, background: '#eee', margin: '12px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 6 }}><span>Subtotal</span><span>GH₵ 120.00</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#1a7a4a' }}><span>Delivery (On Campus)</span><span>FREE</span></div>
          <div style={{ height: 1, background: '#eee', margin: '12px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16, color: navy }}><span>Total</span><span style={{ color: gold }}>GH₵ 120.00</span></div>
          <div style={{ marginTop: 16, padding: 12, background: '#f0f4ff', borderRadius: 8, fontSize: 11, color: navy }}>
            <strong>Delivery to:</strong> Hostel B, Legon Campus<br/>Estimated arrival: Tomorrow by 5pm
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CheckoutDesktop });
