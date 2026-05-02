
// Admin Dashboard — Desktop View (Kingdom Books staff panel)
function AdminDashboard({ onNavigate }) {
  const navy = '#001a36';
  const navyDeep = '#000d1c';
  const gold = '#C9920A';
  const bg = '#F5F6FA';

  const [activeNav, setActiveNav] = React.useState('Dashboard');
  const navItems = [
    { id: 'Dashboard',   icon: 'dashboard' },
    { id: 'Products',    icon: 'box' },
    { id: 'Orders',      icon: 'cart' },
    { id: 'Customers',   icon: 'users' },
    { id: 'Categories',  icon: 'tag' },
    { id: 'Promotions',  icon: 'percent' },
    { id: 'Reports',     icon: 'chart' },
    { id: 'Settings',    icon: 'gear' },
  ];

  const NavIcon = ({ name, color }) => {
    const props = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    switch (name) {
      case 'dashboard': return <svg {...props}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>;
      case 'box':       return <svg {...props}><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>;
      case 'cart':      return <svg {...props}><path d="M2 3h3l2 11h12l2-9H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/></svg>;
      case 'users':     return <svg {...props}><circle cx="9" cy="8" r="4"/><path d="M2 21c0-3 3-6 7-6s7 3 7 6"/><path d="M16 4a4 4 0 010 8M22 21c0-2-1-4-3-5"/></svg>;
      case 'tag':       return <svg {...props}><path d="M3 12V3h9l9 9-9 9-9-9z"/><circle cx="8" cy="8" r="1.5"/></svg>;
      case 'percent':   return <svg {...props}><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/><path d="M19 5L5 19"/></svg>;
      case 'chart':     return <svg {...props}><path d="M3 21h18M6 17v-6M11 17V7M16 17v-9M21 17v-3"/></svg>;
      case 'gear':      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>;
      default: return null;
    }
  };

  // Metric cards
  const metrics = [
    { label: 'Total Revenue', value: 'GH₵ 48,200',  delta: '+12.4%', trend: 'up',   sub: 'vs last week',     accent: gold,    icon: 'revenue' },
    { label: 'Orders Today',  value: '34',          delta: '+8',     trend: 'up',   sub: 'vs yesterday',     accent: '#1a7a4a', icon: 'orders' },
    { label: 'Low Stock',     value: '12',          delta: 'Action needed', trend: 'warn', sub: 'SKUs below threshold', accent: '#c0392b', icon: 'alert' },
    { label: 'Active Customers', value: '1,204',    delta: '+34',    trend: 'up',   sub: 'this month',       accent: '#1a4a8a', icon: 'users' },
  ];

  const MetricIcon = ({ name, color }) => {
    const p = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    if (name === 'revenue') return <svg {...p}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
    if (name === 'orders')  return <svg {...p}><path d="M2 3h3l2 11h12l2-9H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/></svg>;
    if (name === 'alert')   return <svg {...p}><path d="M12 2L2 21h20L12 2zM12 9v6M12 18v.5"/></svg>;
    if (name === 'users')   return <svg {...p}><circle cx="9" cy="8" r="4"/><path d="M2 21c0-3 3-6 7-6s7 3 7 6"/><path d="M16 4a4 4 0 010 8"/></svg>;
    return null;
  };

  // Recent orders
  const orders = [
    { id: '#KB-10482', customer: 'Akosua Mensah',     items: 3, total: 'GH₵ 312', status: 'Delivered',  date: 'Today, 09:14' },
    { id: '#KB-10481', customer: 'Kwame Asante',      items: 1, total: 'GH₵ 120', status: 'Processing', date: 'Today, 08:52' },
    { id: '#KB-10480', customer: 'Nana Yaa Boateng',  items: 5, total: 'GH₵ 487', status: 'Pending',    date: 'Today, 08:31' },
    { id: '#KB-10479', customer: 'Daniel Osei',       items: 2, total: 'GH₵ 198', status: 'Delivered',  date: 'Yesterday' },
    { id: '#KB-10478', customer: 'Ama Serwaa',        items: 4, total: 'GH₵ 245', status: 'Processing', date: 'Yesterday' },
    { id: '#KB-10477', customer: 'Ibrahim Issah',     items: 1, total: 'GH₵ 65',  status: 'Delivered',  date: '2 days ago' },
  ];
  const statusStyle = (s) => {
    if (s === 'Delivered')  return { bg: '#e6f4ec', color: '#1a7a4a', dot: '#1a7a4a' };
    if (s === 'Processing') return { bg: '#fef4e0', color: '#a87100', dot: gold };
    if (s === 'Pending')    return { bg: '#fde8e6', color: '#a83121', dot: '#c0392b' };
    return { bg: '#eee', color: '#444', dot: '#888' };
  };

  // Top selling products
  const topProducts = [
    { id: 1, title: 'Financial Accounting',     author: 'Pauline Weetman', sold: 142, color: '#1a4a8a' },
    { id: 2, title: 'Cost & Mgmt Accounting',   author: 'Colin Drury',     sold: 118, color: '#7c3d9e' },
    { id: 3, title: 'Casio FX-991EX',           author: 'Casio',           sold: 96,  color: '#2a2a2a' },
    { id: 4, title: 'Principles of Taxation',   author: 'Alan Melville',   sold: 84,  color: '#1a7a4a' },
    { id: 5, title: 'Leuchtturm A5 Notebook',   author: 'Leuchtturm1917',  sold: 71,  color: '#0d3060' },
  ];

  // Revenue chart — Mon..Sun, GH₵ thousands
  const chartData = [
    { day: 'Mon', value: 5.2 },
    { day: 'Tue', value: 7.8 },
    { day: 'Wed', value: 6.1 },
    { day: 'Thu', value: 9.4 },
    { day: 'Fri', value: 11.2 },
    { day: 'Sat', value: 8.6 },
    { day: 'Sun', value: 4.8 },
  ];
  const chartMax = Math.max(...chartData.map(d => d.value));

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: '"DM Sans", sans-serif', background: bg }}>
      {/* ───────── SIDEBAR ───────── */}
      <div style={{ width: 220, background: navyDeep, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '20px 18px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: 30, height: 30, borderRadius: 6, background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z" stroke={navy} strokeWidth="2.2"/>
              <path d="M19 3v18M9 8l3-2 3 2v6l-3-2-3 2V8z" stroke={navy} strokeWidth="2" strokeLinejoin="round" fill={navy}/>
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontFamily: '"DM Serif Display", serif', fontSize: 14, lineHeight: 1.1 }}>Kingdom Books</div>
            <div style={{ color: gold, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 2 }}>Admin · UG</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ padding: '14px 10px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 10px 6px' }}>Main</div>
          {navItems.map(item => {
            const active = activeNav === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '9px 10px', borderRadius: 7, cursor: 'pointer', marginBottom: 1,
                  background: active ? 'rgba(201,146,10,0.14)' : 'transparent',
                  position: 'relative',
                }}
              >
                {active && <div style={{ position: 'absolute', left: -10, top: 6, bottom: 6, width: 3, background: gold, borderRadius: '0 2px 2px 0' }}/>}
                <NavIcon name={item.icon} color={active ? gold : 'rgba(255,255,255,0.6)'} />
                <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? '#fff' : 'rgba(255,255,255,0.75)' }}>{item.id}</span>
              </div>
            );
          })}
        </div>

        {/* Staff avatar */}
        <div style={{ padding: '12px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #C9920A, #9c700a)', color: '#fff', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>EA</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Esi Adjei</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>Store Manager</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ cursor: 'pointer' }}>
            <path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* ───────── MAIN AREA ───────── */}
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', background: '#fff', borderBottom: '1px solid #eef0f4' }}>
          <div>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: navy, lineHeight: 1.1 }}>Dashboard</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Welcome back, Esi · Saturday, 2 May 2026</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: bg, borderRadius: 8, padding: '8px 12px', width: 240, gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="6" stroke="#888" strokeWidth="1.8"/>
                <path d="M12.5 12.5L16 16" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 12, color: '#999' }}>Search orders, products, customers…</span>
            </div>
            <div style={{ position: 'relative', cursor: 'pointer', width: 34, height: 34, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 004 0" stroke={navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: '#c0392b', border: '2px solid #fff' }}/>
            </div>
            <button style={{ background: navy, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 400, lineHeight: 1 }}>+</span> New Product
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 28px 28px' }}>
          {/* ───── METRICS ───── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {metrics.map(m => (
              <div key={m.label} style={{ background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #eef0f4' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: m.accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MetricIcon name={m.icon} color={m.accent}/>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 12,
                    background: m.trend === 'warn' ? '#fde8e6' : '#e6f4ec',
                    color: m.trend === 'warn' ? '#c0392b' : '#1a7a4a',
                  }}>
                    {m.trend === 'up'   && '▲ '}
                    {m.trend === 'warn' && '⚠ '}
                    {m.delta}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: navy, lineHeight: 1.1, fontFamily: '"DM Serif Display", serif', letterSpacing: '-0.01em' }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* ───── RECENT ORDERS TABLE ───── */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eef0f4', marginBottom: 24, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef0f4' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: navy }}>Recent Orders</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Last 6 orders across all channels</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['All', 'Pending', 'Processing', 'Delivered'].map((f, i) => (
                  <div key={f} style={{
                    padding: '5px 11px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                    background: i === 0 ? navy : '#fff',
                    color:      i === 0 ? '#fff' : '#666',
                    border: `1px solid ${i === 0 ? navy : '#e0e3ea'}`,
                    fontWeight: i === 0 ? 600 : 400,
                  }}>{f}</div>
                ))}
                <div style={{ fontSize: 11, color: gold, fontWeight: 600, alignSelf: 'center', marginLeft: 6, cursor: 'pointer' }}>View all →</div>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafbfd' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => {
                  const s = statusStyle(o.status);
                  return (
                    <tr key={o.id} style={{ borderTop: '1px solid #f3f4f7' }}>
                      <td style={{ padding: '12px 20px', fontSize: 12, fontWeight: 700, color: navy }}>{o.id}</td>
                      <td style={{ padding: '12px 20px', fontSize: 12, color: '#333' }}>{o.customer}</td>
                      <td style={{ padding: '12px 20px', fontSize: 12, color: '#666' }}>{o.items}</td>
                      <td style={{ padding: '12px 20px', fontSize: 12, fontWeight: 700, color: gold }}>{o.total}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: s.bg, color: s.color, fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 12 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }}/>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: 11, color: '#888' }}>{o.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ───── BOTTOM PANELS ───── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
            {/* Top selling */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eef0f4', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: navy }}>Top Selling Products</div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>This month · by units sold</div>
                </div>
                <div style={{ fontSize: 11, color: gold, fontWeight: 600, cursor: 'pointer' }}>View all →</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topProducts.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700, width: 18 }}>0{i+1}</div>
                    <div style={{
                      width: 28, height: 38,
                      background: `linear-gradient(145deg, ${p.color}, ${p.color}dd)`,
                      borderRadius: '1.5px 3px 3px 1.5px',
                      flexShrink: 0, position: 'relative',
                      boxShadow: '1.5px 1.5px 3px rgba(0,0,0,0.15)',
                    }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,0.3)' }}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                      <div style={{ fontSize: 10, color: '#888' }}>{p.author}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: gold, whiteSpace: 'nowrap' }}>{p.sold} sold</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue chart */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eef0f4', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: navy }}>Revenue This Week</div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>Daily revenue · GH₵ '000</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: gold }}/>
                    <span style={{ color: '#666' }}>This week</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: navy, opacity: 0.4 }}/>
                    <span style={{ color: '#666' }}>Last week</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: navy, fontFamily: '"DM Serif Display", serif' }}>GH₵ 53,100</div>
              <div style={{ fontSize: 10, color: '#1a7a4a', fontWeight: 700, marginBottom: 14 }}>▲ 18.2% vs previous week</div>

              {/* Chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 130, padding: '0 6px', borderBottom: '1px solid #eef0f4' }}>
                {chartData.map((d, i) => {
                  const h = (d.value / chartMax) * 110;
                  // last week comparison — dummy slightly lower
                  const lwH = h * (0.6 + (i % 3) * 0.1);
                  return (
                    <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: -16, fontSize: 10, fontWeight: 700, color: navy }}>
                        {d.value}k
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: '100%' }}>
                        <div style={{ width: 14, height: lwH, background: navy, opacity: 0.25, borderRadius: '3px 3px 0 0' }}/>
                        <div style={{ width: 14, height: h, background: `linear-gradient(180deg, ${gold}, #b3800a)`, borderRadius: '3px 3px 0 0', boxShadow: '0 -2px 6px rgba(201,146,10,0.3)' }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 14, padding: '8px 6px 0' }}>
                {chartData.map(d => (
                  <div key={d.day} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#888', fontWeight: 600 }}>{d.day}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminDashboard });
