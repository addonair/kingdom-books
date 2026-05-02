
// Admin · Reports & Analytics — Desktop View
function AdminReports({ onNavigate }) {
  const navy = '#001a36';
  const navyDeep = '#000d1c';
  const gold = '#C9920A';
  const bg = '#F5F6FA';

  const [activeNav, setActiveNav] = React.useState('Reports');
  const [dateRange, setDateRange] = React.useState('This Month');

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

  // Monthly revenue — last 6 months, GH₵ '000
  const monthlyData = [
    { month: 'Nov', current: 38.4, previous: 32.1 },
    { month: 'Dec', current: 52.6, previous: 41.8 },
    { month: 'Jan', current: 64.2, previous: 47.3 },
    { month: 'Feb', current: 49.8, previous: 38.9 },
    { month: 'Mar', current: 58.7, previous: 44.2 },
    { month: 'Apr', current: 71.3, previous: 51.6 },
  ];
  const monthMax = Math.max(...monthlyData.map(d => d.current));

  // Donut data — Best Selling Categories
  const categories = [
    { name: 'Business',      pct: 38, color: navy },
    { name: 'Stationery',    pct: 24, color: gold },
    { name: 'Science',       pct: 16, color: '#1a4a8a' },
    { name: 'General Books', pct: 14, color: '#7c3d9e' },
    { name: 'Gifts',         pct:  8, color: '#1a7a4a' },
  ];

  // Donut SVG paths — calculate cumulative arcs
  const donutSize = 180;
  const cx = donutSize / 2;
  const cy = donutSize / 2;
  const rOuter = 78;
  const rInner = 50;
  let cumulative = 0;
  const donutSegments = categories.map(c => {
    const startAngle = (cumulative / 100) * 360;
    const endAngle   = ((cumulative + c.pct) / 100) * 360;
    cumulative += c.pct;
    const toXY = (angleDeg, r) => {
      const a = (angleDeg - 90) * Math.PI / 180;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    };
    const [x1, y1] = toXY(startAngle, rOuter);
    const [x2, y2] = toXY(endAngle,   rOuter);
    const [x3, y3] = toXY(endAngle,   rInner);
    const [x4, y4] = toXY(startAngle, rInner);
    const largeArc = c.pct > 50 ? 1 : 0;
    return {
      ...c,
      path: `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`,
    };
  });

  // Top 5 products
  const topProducts = [
    { rank: 1, title: 'Financial Accounting',         author: 'Pauline Weetman', category: 'Business',   sold: 142, revenue: 17040, color: '#1a4a8a' },
    { rank: 2, title: 'Cost & Mgmt Accounting',       author: 'Colin Drury',     category: 'Business',   sold: 118, revenue: 11564, color: '#7c3d9e' },
    { rank: 3, title: 'Casio FX-991EX Calculator',    author: 'Casio',           category: 'Stationery', sold: 96,  revenue: 21120, color: '#2a2a2a' },
    { rank: 4, title: 'Principles of Taxation',       author: 'Alan Melville',   category: 'Business',   sold: 84,  revenue:  7728, color: '#1a7a4a' },
    { rank: 5, title: 'Leuchtturm A5 Notebook',       author: 'Leuchtturm1917',  category: 'Stationery', sold: 71,  revenue:  6745, color: '#0d3060' },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: '"DM Sans", sans-serif', background: bg }}>
      {/* SIDEBAR */}
      <div style={{ width: 220, background: navyDeep, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 18px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: 30, height: 30, borderRadius: 6, background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        <div style={{ padding: '14px 10px', flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 10px 6px' }}>Main</div>
          {navItems.map(item => {
            const active = activeNav === item.id;
            return (
              <div key={item.id} onClick={() => setActiveNav(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 10px', borderRadius: 7, cursor: 'pointer', marginBottom: 1, background: active ? 'rgba(201,146,10,0.14)' : 'transparent', position: 'relative' }}>
                {active && <div style={{ position: 'absolute', left: -10, top: 6, bottom: 6, width: 3, background: gold, borderRadius: '0 2px 2px 0' }}/>}
                <NavIcon name={item.icon} color={active ? gold : 'rgba(255,255,255,0.6)'} />
                <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? '#fff' : 'rgba(255,255,255,0.75)' }}>{item.id}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '12px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #C9920A, #9c700a)', color: '#fff', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>EA</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>Esi Adjei</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>Store Manager</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', background: '#fff', borderBottom: '1px solid #eef0f4' }}>
          <div>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: navy, lineHeight: 1.1 }}>Reports & Analytics</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Sales performance · category breakdown · top products</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', background: bg, borderRadius: 8, padding: 3 }}>
              {['This Week', 'This Month', 'This Year'].map(d => (
                <div key={d} onClick={() => setDateRange(d)} style={{ padding: '7px 14px', borderRadius: 6, fontSize: 11.5, fontWeight: dateRange === d ? 700 : 500, cursor: 'pointer', background: dateRange === d ? '#fff' : 'transparent', color: dateRange === d ? navy : '#666', boxShadow: dateRange === d ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>{d}</div>
              ))}
            </div>
            <button style={{ background: navy, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 16 16"><path d="M8 1v10M3 8l5 5 5-5M2 14h12" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Export PDF
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 28px 28px' }}>
          {/* MONTHLY REVENUE BAR CHART */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eef0f4', padding: '18px 22px 22px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: navy }}>Monthly Revenue</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Last 6 months · GH₵ '000</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: navy, fontFamily: '"DM Serif Display", serif', lineHeight: 1 }}>GH₵ 335,000</div>
                <div style={{ fontSize: 11, color: '#1a7a4a', fontWeight: 700, marginTop: 4 }}>▲ 28.1% vs prior 6 months</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 11, height: 11, borderRadius: 2, background: gold }}/>
                <span style={{ color: '#666' }}>Current period</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 11, height: 11, borderRadius: 2, background: navy }}/>
                <span style={{ color: '#666' }}>Previous period</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, height: 200, padding: '0 12px', borderBottom: '1px solid #eef0f4', position: 'relative' }}>
              {/* Y-axis grid */}
              {[0, 25, 50, 75, 100].map(p => (
                <div key={p} style={{ position: 'absolute', left: 0, right: 0, bottom: 1 + (p/100) * 178, height: 1, background: '#f3f4f7', zIndex: 0 }}>
                  <span style={{ position: 'absolute', left: -32, top: -7, fontSize: 9, color: '#aaa' }}>{Math.round((p/100) * monthMax)}k</span>
                </div>
              ))}
              {monthlyData.map(d => {
                const ch = (d.current  / monthMax) * 178;
                const ph = (d.previous / monthMax) * 178;
                return (
                  <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'absolute', top: 178 - ch - 18, fontSize: 10.5, fontWeight: 700, color: navy }}>{d.current}k</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: '100%' }}>
                      <div style={{ width: 22, height: ph, background: navy, opacity: 0.85, borderRadius: '4px 4px 0 0' }}/>
                      <div style={{ width: 22, height: ch, background: `linear-gradient(180deg, ${gold}, #b3800a)`, borderRadius: '4px 4px 0 0', boxShadow: '0 -2px 8px rgba(201,146,10,0.3)' }}/>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 32, padding: '10px 12px 0' }}>
              {monthlyData.map(d => (
                <div key={d.month} style={{ flex: 1, textAlign: 'center', fontSize: 11.5, color: '#666', fontWeight: 600 }}>{d.month}</div>
              ))}
            </div>
          </div>

          {/* TWO PANELS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16 }}>
            {/* DONUT — Best Selling Categories */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eef0f4', padding: '18px 22px' }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: navy }}>Best Selling Categories</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Share of total revenue · {dateRange.toLowerCase()}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                {/* Donut */}
                <div style={{ position: 'relative', width: donutSize, height: donutSize, flexShrink: 0 }}>
                  <svg width={donutSize} height={donutSize}>
                    {donutSegments.map((s, i) => (
                      <path key={s.name} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2"/>
                    ))}
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 10, color: '#888' }}>Total</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: navy, fontFamily: '"DM Serif Display", serif', lineHeight: 1 }}>GH₵ 71k</div>
                    <div style={{ fontSize: 10, color: '#aaa', marginTop: 3 }}>5 categories</div>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {donutSegments.map(s => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 11, height: 11, borderRadius: 3, background: s.color, flexShrink: 0 }}/>
                      <div style={{ flex: 1, fontSize: 12, color: navy, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: gold }}>{s.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TOP 5 PRODUCTS */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eef0f4', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 12px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: navy }}>Top 5 Products by Units Sold</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Best performers · {dateRange.toLowerCase()}</div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafbfd' }}>
                    {['#', 'Product', 'Category', 'Units', 'Revenue'].map(h => (
                      <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 9.5, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map(p => (
                    <tr key={p.rank} style={{ borderTop: '1px solid #f3f4f7' }}>
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ width: 22, height: 22, borderRadius: 5, background: p.rank === 1 ? gold : '#eef1f7', color: p.rank === 1 ? '#fff' : navy, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.rank}</div>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 26, height: 36,
                            background: `linear-gradient(145deg, ${p.color}, ${p.color}dd)`,
                            borderRadius: '1.5px 3px 3px 1.5px', position: 'relative', flexShrink: 0,
                            boxShadow: '1px 1px 3px rgba(0,0,0,0.15)',
                          }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2.5, background: 'rgba(0,0,0,0.3)' }}/>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: navy, lineHeight: 1.2 }}>{p.title}</div>
                            <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{p.author}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: navy, background: '#eef1f7', padding: '3px 8px', borderRadius: 4 }}>{p.category}</span>
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 700, color: navy }}>{p.sold}</td>
                      <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 700, color: gold }}>GH₵ {p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminReports });
