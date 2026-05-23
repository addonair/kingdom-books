function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ text, query }) {
  const t = text == null ? '' : String(text)
  const q = (query || '').trim()
  if (!q) return <>{t}</>
  const parts = t.split(new RegExp(`(${escapeRegex(q)})`, 'ig'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark
            key={i}
            className="bg-brand-gold-soft text-brand-navy rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export default Highlight
