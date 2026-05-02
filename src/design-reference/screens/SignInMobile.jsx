
// Screen 5: Sign In / Register — Mobile View (Kingdom Books)
function SignInMobile({ onNavigate }) {
  const navy = '#001a36';
  const gold = '#C9920A';
  const bg = '#F5F6FA';

  const [tab, setTab] = React.useState('signin');
  const [signinForm, setSigninForm] = React.useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = React.useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate && onNavigate('home');
    }, 1500);
  };

  const Field = ({ label, type = 'text', value, onChange, placeholder, last }) => {
    const [focused, setFocused] = React.useState(false);
    const isPwd = type === 'password';
    return (
      <div style={{ marginBottom: last ? 0 : 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: navy, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: `1.5px solid ${focused ? gold : '#e0e0e0'}`, borderRadius: 12, padding: '0 14px', transition: 'border 0.15s' }}>
          <input
            type={isPwd && !showPwd ? 'password' : 'text'}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            style={{ flex: 1, border: 'none', outline: 'none', padding: '14px 0', fontSize: 14, color: navy, fontFamily: 'inherit', background: 'transparent' }}
          />
          {isPwd && (
            <span onClick={() => setShowPwd(!showPwd)} style={{ cursor: 'pointer', color: '#888', fontSize: 11, fontWeight: 600, padding: '4px 6px' }}>
              {showPwd ? 'Hide' : 'Show'}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: bg, minHeight: '100%', fontFamily: '"DM Sans", sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Top hero with logo */}
      <div style={{ background: `linear-gradient(165deg, ${navy} 0%, #002a5c 100%)`, padding: '60px 24px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${gold}33 0%, transparent 70%)` }}/>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke={navy} strokeWidth="2.2"/>
              <path d="M19 3v18M9 8l3-2 3 2v6l-3-2-3 2V8z" stroke={navy} strokeWidth="2" strokeLinejoin="round" fill={navy}/>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 22, lineHeight: 1.1 }}>Kingdom Books</div>
            <div style={{ color: gold, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 4 }}>& Stationery · UG Legon</div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center', marginTop: 4 }}>Welcome back to your University Bookshop</div>
        </div>
      </div>

      {/* Card */}
      <div style={{ flex: 1, padding: '0 16px', marginTop: -20 }}>
        <div style={{ background: '#fff', borderRadius: 18, padding: 20, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: '#f5f6fa', borderRadius: 10, padding: 3, marginBottom: 22 }}>
            {[
              { id: 'signin', label: 'Sign In' },
              { id: 'register', label: 'Register' },
            ].map(t => (
              <div
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '10px 12px', textAlign: 'center',
                  borderRadius: 8, cursor: 'pointer',
                  background: tab === t.id ? '#fff' : 'transparent',
                  color: tab === t.id ? navy : '#888',
                  fontWeight: tab === t.id ? 700 : 500,
                  fontSize: 13,
                  boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                }}
              >{t.label}</div>
            ))}
          </div>

          {tab === 'signin' ? (
            <>
              <Field label="Email" value={signinForm.email} onChange={e => setSigninForm({...signinForm, email: e.target.value})} placeholder="you@ug.edu.gh" />
              <Field label="Password" type="password" value={signinForm.password} onChange={e => setSigninForm({...signinForm, password: e.target.value})} placeholder="••••••••" last />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 18 }}>
                <div onClick={() => setRemember(!remember)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${remember ? gold : '#ccc'}`, background: remember ? gold : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {remember && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3"/></svg>}
                  </div>
                  <span style={{ fontSize: 12, color: '#555' }}>Remember me</span>
                </div>
                <span style={{ fontSize: 12, color: gold, fontWeight: 600, cursor: 'pointer' }}>Forgot Password?</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: '100%', padding: '14px', border: 'none', borderRadius: 12, background: loading ? '#b8800a' : gold, color: '#fff', fontSize: 14, fontWeight: 800, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 16px ${gold}66`, letterSpacing: '0.02em' }}
              >{loading ? 'Signing in…' : 'Sign In'}</button>
            </>
          ) : (
            <>
              <Field label="Full Name" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} placeholder="Akua Mensah" />
              <Field label="Email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} placeholder="you@ug.edu.gh" />
              <Field label="Password" type="password" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} placeholder="At least 8 characters" />
              <Field label="Confirm Password" type="password" value={registerForm.confirm} onChange={e => setRegisterForm({...registerForm, confirm: e.target.value})} placeholder="Re-type your password" last />

              <div style={{ marginTop: 14, marginBottom: 18, fontSize: 11, color: '#777', lineHeight: 1.5 }}>
                By creating an account, you agree to Kingdom Books'{' '}
                <span style={{ color: gold, fontWeight: 600 }}>Terms of Service</span> and{' '}
                <span style={{ color: gold, fontWeight: 600 }}>Privacy Policy</span>.
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: '100%', padding: '14px', border: 'none', borderRadius: 12, background: loading ? '#b8800a' : gold, color: '#fff', fontSize: 14, fontWeight: 800, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 16px ${gold}66`, letterSpacing: '0.02em' }}
              >{loading ? 'Creating account…' : 'Create Account'}</button>
            </>
          )}

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: '#e5e5e5' }}/>
            <span style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: '#e5e5e5' }}/>
          </div>

          {/* Google */}
          <button
            style={{ width: '100%', padding: '12px', border: '1.5px solid #e0e0e0', borderRadius: 12, background: '#fff', color: navy, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.13 4.13 0 0 1-1.8 2.71v2.26h2.92a8.78 8.78 0 0 0 2.68-6.61z" fill="#4285F4"/>
              <path d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.92-2.26a5.4 5.4 0 0 1-3.04.86 5.31 5.31 0 0 1-5-3.69H.93v2.33A9 9 0 0 0 9 18z" fill="#34A853"/>
              <path d="M4 10.71a5.41 5.41 0 0 1 0-3.42V4.96H.93a9 9 0 0 0 0 8.08L4 10.71z" fill="#FBBC05"/>
              <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A8.6 8.6 0 0 0 9 0a9 9 0 0 0-8.07 4.96L4 7.29A5.31 5.31 0 0 1 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Switch tab footer */}
          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: '#777' }}>
            {tab === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
            <span onClick={() => setTab(tab === 'signin' ? 'register' : 'signin')} style={{ color: gold, fontWeight: 700, cursor: 'pointer' }}>
              {tab === 'signin' ? 'Register' : 'Sign In'}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0 36px', fontSize: 11, color: '#999' }}>
          🔒 Secured connection · UG Legon Campus
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SignInMobile });
