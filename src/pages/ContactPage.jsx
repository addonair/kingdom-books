import { useState } from 'react'
import { useBrand } from '../context/BrandContext.jsx'

const subjects = [
  'General enquiry',
  'Order status',
  'Bulk / institutional order',
  'Stationery & gifts',
  'Returns & refunds',
  'Other',
]

const PhoneIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
)

const PinIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
)

const ClockIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const WhatsAppIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.5 3.5A11 11 0 003.6 17.3L2 22l4.8-1.6a11 11 0 0013.7-16.9zM12 20.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-2.8.9.9-2.7-.2-.3A8.2 8.2 0 1112 20.2zm4.7-6.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8.9-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.2a.4.4 0 000-.4c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2c0 1.3.9 2.5 1 2.7s1.8 2.8 4.5 3.9a14.4 14.4 0 001.5.6 3.6 3.6 0 001.6.1 2.7 2.7 0 001.7-1.2 2.1 2.1 0 00.2-1.2c-.1-.1-.3-.2-.6-.3z" />
  </svg>
)

function ContactPage() {
  const brand = useBrand()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(subjects[0])
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setSent(true)
    setName('')
    setEmail('')
    setSubject(subjects[0])
    setMessage('')
    setTimeout(() => setSent(false), 4000)
  }

  const inputBase =
    'w-full border border-brand-line rounded-xl px-4 h-11 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors'

  return (
    <div className="bg-brand-page">
      {/* Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(120deg, #001a36 0%, #002a5c 60%, #003a7c 100%)' }}
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,146,10,0.18) 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 w-[260px] h-[260px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,146,10,0.10) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 sm:py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="text-brand-gold text-[11px] md:text-xs uppercase tracking-[0.2em] mb-3">
              Get in touch
            </div>
            <h1 className="font-serif leading-[1.1] text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-5">
              We'd love to hear from you
            </h1>
            <p className="text-white/75 text-sm md:text-base max-w-xl">
              Questions about a course book, a bulk order, or your delivery? Send us a message and a
              member of our team will get back to you within one working day.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-8">
            <div className="mb-6">
              <div className="text-brand-gold text-[11px] uppercase tracking-[0.16em] font-bold mb-2">
                Send a message
              </div>
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy">
                Drop us a line
              </h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[12px] font-semibold text-brand-navy mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ama Mensah"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[12px] font-semibold text-brand-navy mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-[12px] font-semibold text-brand-navy mb-1.5"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`${inputBase} bg-white pr-10 appearance-none bg-no-repeat`}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23001a36' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '12px',
                  }}
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[12px] font-semibold text-brand-navy mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full border border-brand-line rounded-xl px-4 py-3 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-colors resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-8 h-11 rounded-xl mt-2"
              >
                Send Message
              </button>

              {sent && (
                <p className="text-[13px] text-brand-gold font-semibold mt-2">
                  Thanks — your message is on its way. We'll be in touch soon.
                </p>
              )}
            </form>
          </div>

          {/* Info */}
          <aside className="lg:col-span-2 space-y-4">
            <div className="bg-brand-navy text-white rounded-2xl p-6 md:p-7">
              <div className="text-brand-gold text-[11px] uppercase tracking-[0.16em] font-bold mb-4">
                Visit the shop
              </div>

              <div className="flex gap-3 mb-5">
                <div className="text-brand-gold shrink-0 mt-0.5">{PinIcon}</div>
                <div className="text-[13.5px] leading-relaxed">
                  <div className="font-semibold mb-0.5">{brand.contactStoreName}</div>
                  <div className="text-white/75">
                    {brand.pickupAddress}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-5">
                <div className="text-brand-gold shrink-0 mt-0.5">{PhoneIcon}</div>
                <div className="text-[13.5px] leading-relaxed">
                  <div className="font-semibold mb-0.5">Call us</div>
                  <a
                    href="tel:+233302500244"
                    className="block text-white/75 hover:text-brand-gold transition-colors"
                  >
                    +233 302 500 244
                  </a>
                  <a
                    href="tel:+233501440492"
                    className="block text-white/75 hover:text-brand-gold transition-colors"
                  >
                    +233 501 440 492
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-brand-gold shrink-0 mt-0.5">{ClockIcon}</div>
                <div className="text-[13.5px] leading-relaxed">
                  <div className="font-semibold mb-0.5">Opening hours</div>
                  <div className="text-white/75">
                    Mon – Fri: 8:00 AM – 6:00 PM
                    <br />
                    Saturday: 9:00 AM – 4:00 PM
                    <br />
                    Sunday: Closed
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/233501440492"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 bg-brand-gold hover:bg-[#b7830a] transition-colors text-white rounded-2xl p-5 md:p-6 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  {WhatsAppIcon}
                </div>
                <div>
                  <div className="font-bold text-[15px]">Chat on WhatsApp</div>
                  <div className="text-white/85 text-[12.5px]">Fastest way to reach us</div>
                </div>
              </div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0 group-hover:translate-x-1 transition-transform"
              >
                <path
                  d="M5 12h14m-6-6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
