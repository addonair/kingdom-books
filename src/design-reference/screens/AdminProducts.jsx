
// Admin · Products & Inventory — Desktop View
function AdminProducts({ onNavigate }) {
  const navy = '#001a36';
  const navyDeep = '#000d1c';
  const gold = '#C9920A';
  const bg = '#F5F6FA';
  const blue = '#1a4a8a';

  const [activeNav, setActiveNav] = React.useState('Products');
  const [search, setSearch]       = React.useState('');
  const [filter, setFilter]       = React.useState('All');

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

  // Mixed books + stationery, with 2 low-stock rows
  const products = [
    { sku: 'KB-BK-1042', title: 'Financial Accounting: An Introduction', author: 'Pauline Weetman',  category: 'Business · Accounting',     format: 'Paperback',  price: 120, stock: 42, color: '#1a4a8a' },
    { sku: 'KB-BK-1098', title: 'Cost & Management Accounting',          author: 'Colin Drury',      category: 'Business · Accounting',     format: 'Hardcover',  price: 98,  stock: 3,  color: '#7c3d9e', low: true },
    { sku: 'KB-ST-2012', title: 'Casio FX-991EX Scientific Calculator',  author: 'Casio',            category: 'Stationery · Office',       format: 'Single',     price: 220, stock: 28, color: '#2a2a2a' },
    { sku: 'KB-ST-2034', title: 'Leuchtturm1917 A5 Dotted Notebook',     author: 'Leuchtturm',       category: 'Stationery · Notebooks',    format: 'Hardcover',  price: 95,  stock: 17, color: '#0d3060' },
    { sku: 'KB-BK-1156', title: 'Principles of Taxation',                author: 'Alan Melville',    category: 'Business · Accounting',     format: 'Paperback',  price: 92,  stock: 11, color: '#1a7a4a' },
    { sku: 'KB-ST-2078', title: 'Parker Jotter Ballpoint Pen',           author: 'Parker',           category: 'Stationery · Writing',      format: 'Single',     price: 145, stock: 4,  color: '#7a8290', low: true },
    { sku: 'KB-BK-1203', title: 'Auditing Today',                        author: 'Emile Woolf',      category: 'Business · Accounting',     format: 'Paperback',  price: 78,  stock: 22, color: '#c0392b' },
    { sku: 'KB-ST-2103', title: 'A4 Multipurpose Paper · 500 sheets',    author: 'Hi-Bright',        category: 'Stationery · Paper',        format: 'Ream',       price: 48,  stock: 156, color: '#f5f5f0' },
    { sku: 'KB-ST-2145', title: 'Staedtler Triplus Fineliner · 10-set',  author: 'Staedtler',        category: 'Stationery · Art',          format: 'Set',        price: 92,  stock: 38, color: '#c0392b' },
    { sku: 'KB-BK-1287', title: 'Marketing Management — 16th Edition',   author: 'Philip Kotler',    category: 'Business · Marketing',      format: 'Hardcover',  price: 185, stock: 9,  color: '#b7600e' },
  ];

  const filtered = products.filter(p => {
    if (search && !(p.title + p.author + p.sku).toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'Books'      && !p.sku.startsWith('KB-BK')) return false;
    if (filter === 'Stationery' && !p.sku.startsWith('KB-ST')) return false;
    if (filter === 'Low stock'  && p.stock >= 5)               return false;
    return true;
  });

  // Compact cover/thumbnail
  const Thumb = ({ p }) => {
    if (p.sku.startsWith('KB-ST')) {
      return (
        <div style={{ width: 36, height: 44, borderRadius: 5, background: `linear-gradient(145deg, ${p.color}, ${p.color}dd)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden', boxShadow: '1px 1px 3px rgba(0,0,0,0.15)' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 4px, transparent 4px 8px)' }}/>
          <span style={{ color: p.color === '#f5f5f0' ? '#888' : '#fff', fontSize: 8, fontWeight: 800, letterSpacing: '0.05em', position: 'relative' }}>
            {p.title.startsWith('Casio') ? 'FX' :
             p.title.startsWith('Leucht') ? 'L17' :
             p.title.startsWith('Parker') ? 'PEN' :
             p.title.startsWith('A4') ? 'A4' :
             p.title.startsWith('Staedt') ? 'STD' : 'ITEM'}
          </span>
        </div>
      );
    }
    // Book cover
    return (
      <div style={{ width: 32, height: 44, borderRadius: '1.5px 4px 4px 1.5px', background: `linear-gradient(145deg, ${p.color}, ${p.color}dd)`, position: 'relative', flexShrink: 0, boxShadow: '1px 1px 3px rgba(0,0,0,0.15)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'rgba(0,0,0,0.3)' }}/>
        <div style={{ position: 'absolute', left: 6, right: 3, top: 8, height: 1, background: 'rgba(255,255,255,0.4)' }}/>
        <div style={{ position: 'absolute', left: 6, right: 6, top: 12, height: 1, background: 'rgba(255,255,255,0.3)' }}/>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: '"DM Sans", sans-serif', background: bg }}>
      {/* SIDEBAR */}
      <div style={{ width: 220, background: navyDeep, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
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
        <div style={{ padding: '14px 10px', flex: 1, overflowY: 'auto' }}>
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
            <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: navy, lineHeight: 1.1 }}>Products & Inventory</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{products.length} SKUs · {products.filter(p => p.stock < 5).length} low-stock alerts</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ background: '#fff', color: navy, border: `1.5px solid ${navy}`, borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v14M5 10l7-7 7 7M3 21h18" stroke={navy} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Bulk Upload via CSV
            </button>
            <button style={{ background: blue, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(26,74,138,0.3)' }}>
              <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Add New Product
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 28px 28px' }}>
          {/* Search + filter row */}
          <div style={{ background: '#fff', border: '1px solid #eef0f4', borderRadius: 12, padding: '14px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: bg, borderRadius: 8, padding: '8px 12px' }}>
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="6" stroke="#888" strokeWidth="1.8"/>
                <path d="M12.5 12.5L16 16" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, author, or SKU…" style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 12, fontFamily: 'inherit', color: navy }}/>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'Books', 'Stationery', 'Low stock'].map(f => (
                <div key={f} onClick={() => setFilter(f)} style={{ padding: '7px 13px', borderRadius: 6, fontSize: 11, fontWeight: filter === f ? 700 : 500, cursor: 'pointer', background: filter === f ? navy : '#fff', color: filter === f ? '#fff' : '#666', border: `1px solid ${filter === f ? navy : '#e0e3ea'}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {f === 'Low stock' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: filter === f ? gold : '#c0392b' }}/>}
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eef0f4', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafbfd' }}>
                  {[
                    { label: '', width: 56 },
                    { label: 'Title / SKU' },
                    { label: 'Category' },
                    { label: 'Format', width: 100 },
                    { label: 'Price', width: 100 },
                    { label: 'Stock', width: 110 },
                    { label: 'Actions', width: 130 },
                  ].map(h => (
                    <th key={h.label} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', width: h.width }}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.sku} style={{ borderTop: '1px solid #f3f4f7', background: p.low ? '#fdf3f1' : 'transparent' }}>
                    <td style={{ padding: '12px 16px' }}><Thumb p={p}/></td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: navy, lineHeight: 1.3 }}>{p.title}</div>
                      <div style={{ fontSize: 10.5, color: '#888', marginTop: 2 }}>{p.author} · <span style={{ fontFamily: 'monospace', color: '#aaa' }}>{p.sku}</span></div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 11.5, color: '#444' }}>{p.category}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: navy, background: '#eef1f7', padding: '3px 8px', borderRadius: 4 }}>{p.format}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12.5, fontWeight: 700, color: gold }}>GH₵ {p.price}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.stock < 5 ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fde8e6', color: '#a83121', fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 12 }}>
                          <svg width="10" height="10" viewBox="0 0 12 12"><path d="M6 1L1 11h10L6 1zM6 5v3M6 9.5v.5" stroke="#a83121" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                          {p.stock} left
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: '#444', fontWeight: 600 }}>{p.stock}</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={{ background: '#fff', border: '1px solid #d4d8e0', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: navy, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <svg width="10" height="10" viewBox="0 0 16 16"><path d="M11 1l4 4-9 9H2v-4l9-9z" stroke={navy} strokeWidth="1.5" fill="none" strokeLinejoin="round"/></svg>
                          Edit
                        </button>
                        <button style={{ background: '#fff', border: '1px solid #f0c8c2', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: '#a83121', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <svg width="10" height="10" viewBox="0 0 16 16"><path d="M3 4h10M5 4V2h6v2M5 4v10h6V4M7 7v5M9 7v5" stroke="#a83121" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Footer pagination */}
            <div style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eef0f4', background: '#fafbfd' }}>
              <div style={{ fontSize: 11, color: '#888' }}>Showing <strong style={{ color: navy }}>{filtered.length}</strong> of {products.length} products</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['‹', '1', '2', '3', '4', '›'].map((p, i) => (
                  <div key={i} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: p === '1' ? navy : '#fff', color: p === '1' ? '#fff' : '#666', fontSize: 11, fontWeight: 600, border: `1px solid ${p === '1' ? navy : '#e0e3ea'}`, cursor: 'pointer' }}>{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminProducts });
