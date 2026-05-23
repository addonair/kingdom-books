import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { verifyPayment } from '../api/payment.js'
import { useCart } from '../context/CartContext.jsx'

function PaymentVerifyPage() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference')
  const { clearCart } = useCart()
  const navigate = useNavigate()

  const [status, setStatus] = useState(reference ? 'loading' : 'error')
  const [order, setOrder] = useState(null)
  const [errorMessage, setErrorMessage] = useState(
    reference ? '' : 'Missing payment reference.',
  )
  const [secondsLeft, setSecondsLeft] = useState(5)
  const verifiedRef = useRef(false)

  useEffect(() => {
    if (!reference || verifiedRef.current) return
    verifiedRef.current = true

    verifyPayment(reference)
      .then((o) => {
        setOrder(o)
        setStatus('success')
        clearCart()
      })
      .catch((err) => {
        setErrorMessage(
          err?.response?.data?.message ||
            'We could not confirm your payment. If you were charged, please contact support.',
        )
        setStatus('error')
      })
  }, [reference, clearCart])

  useEffect(() => {
    if (status !== 'success') return
    const tick = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    const redirect = setTimeout(() => {
      navigate('/orders')
    }, 5000)
    return () => {
      clearInterval(tick)
      clearTimeout(redirect)
    }
  }, [status, navigate])

  if (status === 'loading') {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full border-4 border-brand-gold/20 border-t-brand-gold animate-spin" />
          <h1 className="font-serif text-2xl text-brand-navy mb-2">
            Verifying your payment…
          </h1>
          <p className="text-sm text-brand-navy/60">
            Hang tight while we confirm with Paystack.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-brand-page min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-sm border border-brand-line p-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-5">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 8v5M12 17h.01M10.3 3.86l-7.5 13A2 2 0 004.53 20h14.94a2 2 0 001.73-3.14l-7.5-13a2 2 0 00-3.4 0z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy mb-2">
            Payment failed
          </h1>
          <p className="text-sm text-brand-navy/60 mb-6">{errorMessage}</p>
          <Link
            to="/checkout"
            className="inline-block bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-6 py-3 rounded-lg"
          >
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  const orderNumber = order?.order_number || order?.id || '—'
  const total = Number(order?.total ?? order?.amount ?? 0)

  return (
    <div className="bg-brand-page min-h-[calc(100vh-64px)] py-8 md:py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <section className="bg-white rounded-2xl shadow-sm border border-brand-line p-6 md:p-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-success-bg text-success flex items-center justify-center mb-5">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12l5 5 9-11"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-brand-navy mb-2">
            Payment successful!
          </h1>
          <p className="text-sm text-brand-navy/60 mb-6">
            Thanks for your order. A confirmation has been sent to your email.
          </p>

          <div className="inline-flex flex-col items-center bg-brand-page rounded-xl px-6 py-4 mb-6">
            <span className="text-[11px] uppercase tracking-wider text-brand-navy/55 font-bold">
              Order number
            </span>
            <span className="font-mono font-bold text-brand-navy text-lg mt-0.5">
              {orderNumber}
            </span>
          </div>

          {total > 0 && (
            <div className="bg-brand-page rounded-xl p-4 mb-6 text-sm">
              <div className="flex justify-between font-bold text-brand-navy">
                <span>Total paid</span>
                <span className="text-brand-gold">GH₵ {total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="bg-brand-gold hover:bg-[#b7830a] transition-colors text-white font-bold text-sm px-6 h-12 inline-flex items-center justify-center rounded-xl"
            >
              View My Order
            </Link>
            <Link
              to="/shop"
              className="border border-brand-line hover:border-brand-gold transition-colors text-brand-navy font-bold text-sm px-6 h-12 inline-flex items-center justify-center rounded-xl"
            >
              Continue Shopping
            </Link>
          </div>

          <p className="mt-6 text-xs text-brand-navy/55">
            Redirecting to your orders in {secondsLeft} second
            {secondsLeft === 1 ? '' : 's'}...
          </p>
        </section>
      </div>
    </div>
  )
}

export default PaymentVerifyPage
