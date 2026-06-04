// Minimal markdown renderer for static legal-page content.
// Supports: # / ## / ### headings, **bold**, *italic*, paragraphs, blank-line breaks,
// unordered lists starting with "- ", and inline links [text](href).
// Sanitizes by escaping any HTML in the source first.

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function inline(text) {
  let s = escapeHtml(text)
  // Links — only http(s) and relative
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g,
    '<a href="$2" class="text-brand-gold hover:underline">$1</a>')
  // Bold then italic (order matters)
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  return s
}

function blocks(src) {
  const out = []
  const lines = src.split(/\r?\n/)
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }

    // Headings
    const h = /^(#{1,3})\s+(.*)$/.exec(line)
    if (h) {
      const level = h[1].length
      out.push({ type: 'h', level, text: h[2] })
      i++
      continue
    }

    // Unordered list
    if (/^- /.test(line)) {
      const items = []
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(lines[i].slice(2))
        i++
      }
      out.push({ type: 'ul', items })
      continue
    }

    // Paragraph (consume until blank line)
    const para = []
    while (i < lines.length && lines[i].trim() && !/^#{1,3}\s/.test(lines[i]) && !/^- /.test(lines[i])) {
      para.push(lines[i])
      i++
    }
    out.push({ type: 'p', text: para.join(' ') })
  }
  return out
}

export default function SimpleMarkdown({ source }) {
  if (!source) return null
  const tree = blocks(source)
  return (
    <div className="prose-like space-y-4">
      {tree.map((b, idx) => {
        if (b.type === 'h') {
          const sizes = { 1: 'text-3xl mt-6', 2: 'text-xl mt-5', 3: 'text-lg mt-4' }
          const Tag = `h${b.level}`
          return (
            <Tag
              key={idx}
              className={`font-serif text-brand-navy font-bold ${sizes[b.level]}`}
              dangerouslySetInnerHTML={{ __html: inline(b.text) }}
            />
          )
        }
        if (b.type === 'p') {
          return (
            <p
              key={idx}
              className="text-[14px] text-brand-navy/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: inline(b.text) }}
            />
          )
        }
        if (b.type === 'ul') {
          return (
            <ul key={idx} className="list-disc pl-6 space-y-1 text-[14px] text-brand-navy/80">
              {b.items.map((it, k) => (
                <li key={k} dangerouslySetInnerHTML={{ __html: inline(it) }} />
              ))}
            </ul>
          )
        }
        return null
      })}
    </div>
  )
}
