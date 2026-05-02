
// Screen 4: Checkout — Payment Step — Mobile View
function CheckoutMobile({ onNavigate }) {
  const navy = '#001a36';
  const gold = '#C9920A';

  const [selectedPayment, setSelectedPayment] = React.useState('mtn');
  const [momoNumber, setMomoNumber] = React.useState('');
  const [paying, setPaying] = React.useState(false);
  const [paid, setPaid] = React.useState(false);

  const providers = [
    {
      id: 'mtn',
      name: 'MTN MoMo',
      color: '#FFCC00',
      textColor: '#000',
      // SVG logo approximation for MTN
      logo: (
        <svg width="40" height="24" viewBox="0 0 40 24">
          <rect width="40" height="24" rx="4" fill="#FFCC00"/>
          <text x="5" y="17" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="11" fill="#000">MTN</text>
        </svg>
      ),
    },
    {
      id: 'vodafone',
      name: 'Vodafone Cash',
      color: '#E60000',
      textColor: '#fff',
      logo: (
        <svg width="40" height="24" viewBox="0 0 40 24">
          <rect width="40" height="24" rx="4" fill="#E60000"/>
          <circle cx="20" cy="12" r="9" fill="none" stroke="#fff" strokeWidth="2.5"/>
          <path d="M16 12c0-2.2 1.8-4 4-4a4 4 0 014 4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 'airteltigo',
      name: 'AirtelTigo Money',
      color: '#E8001C',
      textColor: '#fff',
      logo: (
        <svg width="40" height="24" viewBox="0 0 40 24">
          <rect width="40" height="24" rx="4" fill="#E8001C"/>
          <text x="4" y="10" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="7" fill="#fff">AIRTEL</text>
          <text x="4" y="20" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="7" fill="#FFD700">TIGO</text>
        </svg>
      ),
    },
  ];

  const handlePay = () => {
    if (!momoNumber || momoNumber.length < 9) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
    }, 2200);
  };

  if (paid) {
    return (
      <div style={{
        background: '#fff', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '32px 24px',
        fontFamily: '"DM Sans", sans-serif',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#eaf7ef', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="#1a7a4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 26, color: navy, marginBottom: 8, textAlign: 'center' }}>
          Payment Successful!
        </div>
        <div style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 28, lineHeight: 1.6 }}>
          Your order has been confirmed. Check your email for delivery details.
        </div>
        <div style={{ width: '100%', background: '#F5F6FA', borderRadius: 14, padding: '16px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#888' }}>Order ref</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: navy }}>#UGB-2026-4821</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#888' }}>Amount paid</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: gold }}>GH₵ 120.00</span>
          </div>
        </div>
        <button
          onClick={() => onNavigate && onNavigate('home')}
          style={{
            width: '100%', padding: '14px', borderRadius: 12,
            border: 'none', background: navy, color: '#fff',
            fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 700,
            cursor: 'pointer',
          }}
        >Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ background: '#F5F6FA', height: '100%', overflowY: 'auto', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Header */}
      <div style={{
        background: navy, padding: '52px 16px 14px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div
          onClick={() => onNavigate && onNavigate('product')}
          style={{ cursor: 'pointer' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Secure Checkout</div>
        <div style={{ marginLeft: 'auto' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.4C17.5 22.15 20 17.25 20 12V6L12 2z" stroke={gold} strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      {/* Progress indicator */}
      <div style={{
        background: '#fff', padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid #eee',
      }}>
        {[
          { num: 1, label: 'Delivery', done: true },
          { num: 2, label: 'Payment', active: true },
          { num: 3, label: 'Confirm', done: false },
        ].map((step, i) => (
          <React.Fragment key={step.num}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step.done ? '#1a7a4a' : step.active ? gold : '#e0e0e0',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
              }}>
                {step.done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                ) : step.num}
              </div>
              <span style={{ fontSize: 10, color: step.active ? gold : step.done ? '#1a7a4a' : '#aaa', fontWeight: step.active ? 700 : 500 }}>
                {step.label}
              </span>
            </div>
            {i < 2 && (
              <div style={{
                flex: 1, height: 2, margin: '0 8px', marginTop: -12,
                background: step.done ? '#1a7a4a' : '#e0e0e0',
                borderRadius: 1,
              }}/>
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {/* Order summary */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: '14px 16px', marginBottom: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order Summary</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              width: 44, height: 60, borderRadius: 4,
              background: 'linear-gradient(145deg, #1a4a8a, #2d5fa6)',
              flexShrink: 0,
            }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: navy, lineHeight: 1.3 }}>Financial Accounting: An Introduction</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Paperback · 8th Ed.</div>
            </div>
            <div style={{ fontWeight: 800, color: gold, fontSize: 14 }}>GH₵ 120</div>
          </div>
          <div style={{ height: 1, background: '#eee', margin: '12px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 4 }}>
            <span>Subtotal</span><span>GH₵ 120.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#1a7a4a' }}>
            <span>Delivery (On Campus)</span><span>FREE</span>
          </div>
          <div style={{ height: 1, background: '#eee', margin: '10px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 14, color: navy }}>
            <span>Total</span><span style={{ color: gold }}>GH₵ 120.00</span>
          </div>
        </div>

        {/* Payment section */}
        <div style={{
          background: '#fff', borderRadius: 14, padding: '16px', marginBottom: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: navy, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pay with Mobile Money</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {providers.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedPayment(p.id)}
                style={{
                  border: `2px solid ${selectedPayment === p.id ? gold : '#eee'}`,
                  borderRadius: 12, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer', background: selectedPayment === p.id ? '#fffbf0' : '#fff',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: `2px solid ${selectedPayment === p.id ? gold : '#ccc'}`,
                  background: selectedPayment === p.id ? gold : 'transparent',
                  flexShrink: 0,
                }}/>
                {p.logo}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: navy }}>{p.name}</div>
                </div>
                {selectedPayment === p.id && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke={gold} strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Phone input */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: navy, marginBottom: 8 }}>MoMo Phone Number</div>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: `1.5px solid ${momoNumber.length > 0 ? navy : '#ddd'}`,
              borderRadius: 10, overflow: 'hidden',
              transition: 'border-color 0.15s',
            }}>
              {/* Flag prefix */}
              <div style={{
                padding: '12px 12px', background: '#F5F6FA',
                display: 'flex', alignItems: 'center', gap: 6,
                borderRight: '1px solid #eee', flexShrink: 0,
              }}>
                {/* Ghana flag SVG */}
                <svg width="22" height="14" viewBox="0 0 22 14" style={{ borderRadius: 2 }}>
                  <rect width="22" height="5" fill="#006B3F"/>
                  <rect y="5" width="22" height="4" fill="#FCD116"/>
                  <rect y="9" width="22" height="5" fill="#CE1126"/>
                  <polygon points="11,6 12.2,8.7 15,8.7 12.9,10.3 13.7,13 11,11.4 8.3,13 9.1,10.3 7,8.7 9.8,8.7" fill="#000"/>
                </svg>
                <span style={{ fontFamily: '"DM Sans", monospace', fontSize: 13, fontWeight: 600, color: navy }}>+233</span>
              </div>
              <input
                type="tel"
                value={momoNumber}
                onChange={e => setMomoNumber(e.target.value.replace(/\D/g,'').slice(0,10))}
                placeholder="XX XXX XXXX"
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  padding: '12px 12px',
                  fontFamily: '"DM Sans", sans-serif', fontSize: 15,
                  color: navy, background: 'transparent', letterSpacing: '0.08em',
                }}
              />
            </div>
          </div>
        </div>

        {/* PAY NOW CTA */}
        <button
          onClick={handlePay}
          disabled={paying}
          style={{
            width: '100%', padding: '16px',
            border: 'none', borderRadius: 14,
            background: paying ? '#b8800a' : gold,
            color: '#fff',
            fontFamily: '"DM Sans", sans-serif', fontSize: 16, fontWeight: 900,
            cursor: paying ? 'default' : 'pointer',
            boxShadow: `0 6px 24px ${gold}55`,
            letterSpacing: '0.02em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.2s',
          }}
        >
          {paying ? (
            <>
              <div style={{
                width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.4)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }}/>
              Processing…
            </>
          ) : (
            <>PAY NOW — GH₵ 120.00</>
          )}
        </button>

        {/* Trust note */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          marginTop: 12, padding: '0 8px',
        }}>
          <svg width="12" height="14" viewBox="0 0 24 28" fill="none">
            <path d="M12 2L3 6v8c0 6 3.8 11.5 9 13 5.2-1.5 9-7 9-13V6L12 2z" stroke="#888" strokeWidth="2" fill="none"/>
          </svg>
          <span style={{ fontSize: 11, color: '#888', textAlign: 'center' }}>
            🔒 Secured by Paystack. Your payment is encrypted.
          </span>
        </div>

        <div style={{ height: 20 }}/>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

Object.assign(window, { CheckoutMobile });
