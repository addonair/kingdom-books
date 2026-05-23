import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] caught render error', error, info?.componentStack)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleHome = () => {
    window.location.assign('/')
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="bg-brand-page min-h-screen flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-md">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold mb-3">
            Something went wrong
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-brand-navy mb-3">
            We hit an unexpected error
          </h1>
          <p className="text-brand-navy/70 text-sm md:text-base mb-6">
            The page failed to render. Try reloading — if the issue persists,
            head back home and contact support.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="bg-brand-navy hover:bg-brand-navy-deep text-white text-[13px] font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-colors"
            >
              Reload page
            </button>
            <button
              type="button"
              onClick={this.handleHome}
              className="border border-brand-line hover:border-brand-gold hover:text-brand-gold text-brand-navy text-[13px] font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-colors"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
