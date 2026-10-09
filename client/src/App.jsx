import { useEffect, useRef, useState } from 'react'
import './App.css'

const industries = ['All', 'Climate', 'Healthtech', 'Logistics', 'Fintech', 'Education', 'Consumer']
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')
const avatarColors = ['mint', 'lilac', 'peach', 'blue', 'yellow', 'rose']

function getStartupPresentation(startup, index) {
  return {
    ...startup,
    initials: startup.name.slice(0, 1).toUpperCase(),
    color: avatarColors[index % avatarColors.length],
  }
}

function formatMoney(amount) {
  return `$${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 2)}M`
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  )
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="FundFlow home">
        <BrandMark />
        <span>fundflow</span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a className="nav-link active" href="#discover" aria-current="page">Discover</a>
        <a className="nav-link" href="#investors">For Investors</a>
        <a className="nav-link" href="#startups">For Startups</a>
        <a className="nav-link" href="#dashboard">Dashboard</a>
      </nav>
      <a className="header-cta" href="#startups">
        Join the community <span aria-hidden="true">↗</span>
      </a>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  )
}

function Hero({ query, onQueryChange }) {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> A better way to find what&apos;s next</div>
        <h1>Back the ideas<br />shaping <span>tomorrow.</span></h1>
        <p className="hero-description">
          Meet ambitious founders building a brighter future. Find the opportunity that feels like you.
        </p>
        <form className="hero-search" onSubmit={(event) => event.preventDefault()} role="search">
          <label className="search-input-wrap">
            <SearchIcon />
            <span className="visually-hidden">Search startups</span>
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Try “climate” or “health”"
            />
          </label>
          <button type="submit">Explore startups <span aria-hidden="true">→</span></button>
        </form>
        <div className="hero-note"><span aria-hidden="true">✳</span> Discover ideas. Learn what makes them grow.</div>
      </div>
      <div className="hero-art" aria-label="Illustration of a growing green plant">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="art-sun" />
        <div className="art-plant">
          <div className="leaf leaf-left" />
          <div className="leaf leaf-right" />
          <div className="leaf leaf-top" />
          <div className="plant-stem" />
          <div className="plant-pot"><span /></div>
        </div>
        <div className="art-label"><span className="label-spark">✳</span><span>Ideas with<br />room to grow</span></div>
        <div className="art-caption">A little seed.<br /><strong>A big possibility.</strong></div>
      </div>
    </section>
  )
}

function DemoBanner() {
  return (
    <aside className="demo-banner" aria-label="Demo data notice">
      <span className="demo-icon" aria-hidden="true">i</span>
      <p><strong>Demo data</strong><span> These fictional companies and figures are for demonstration only—not investment opportunities.</span></p>
      <span className="demo-spark" aria-hidden="true">✳</span>
    </aside>
  )
}

function Stats() {
  const stats = [
    { value: '240+', label: 'Ideas to explore', detail: 'Across emerging industries', icon: '↗' },
    { value: '$18.6M', label: 'Raised together', detail: 'Community momentum', icon: '◈' },
    { value: '32', label: 'Industries', detail: 'Room for every kind of idea', icon: '✳' },
  ]

  return (
    <section className="stats-row" aria-label="Marketplace overview (demo values)">
      {stats.map((stat) => (
        <article className="stat-item" key={stat.label}>
          <span className="stat-icon" aria-hidden="true">{stat.icon}</span>
          <div>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-detail">{stat.detail}</p>
          </div>
        </article>
      ))}
    </section>
  )
}

function StartupCard({ startup }) {
  const progress = startup.fundingGoal > 0
    ? Math.min(Math.round((startup.amountRaised / startup.fundingGoal) * 100), 100)
    : 0

  return (
    <article className="startup-card">
      <button
        className="card-hit-area"
        type="button"
        aria-label={`View details for ${startup.name}`}
        onClick={() => startup.onOpen(startup)}
      />
      <div className="card-topline">
        <div className={`startup-avatar ${startup.color}`} aria-hidden="true">{startup.initials}</div>
        <span className="stage-badge">{startup.stage}</span>
      </div>
      <div className="startup-heading">
        <div>
          <h3>{startup.name}</h3>
          <span className="industry-label">{startup.industry}</span>
        </div>
        <button
          className="card-arrow"
          type="button"
          aria-label={`View details for ${startup.name}`}
          onClick={() => startup.onOpen(startup)}
        >
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p className="startup-description">{startup.description}</p>
      <div className="funding-meta">
        <span>Demo funding goal</span>
        <strong>{formatMoney(startup.fundingGoal)}</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={`${startup.name} demo funding progress`}
        aria-valuemin="0"
        aria-valuemax={startup.fundingGoal}
        aria-valuenow={startup.amountRaised}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="raised-meta">
        <span><strong>{formatMoney(startup.amountRaised)}</strong> demo raised</span>
        <span>{progress}%</span>
      </div>
    </article>
  )
}

function StartupDiscovery({
  startups,
  loading,
  error,
  selectedIndustry,
  onIndustryChange,
  onClear,
  onRetry,
  onStartupOpen,
}) {
  return (
    <section className="discovery-section" id="discover">
      <div className="section-heading">
        <div>
          <p className="section-kicker">THE DISCOVERY BOARD</p>
          <h2>Good ideas find their people.</h2>
          <p className="section-description">A few early-stage teams worth getting to know.</p>
        </div>
        <a className="text-link" href="#startups">How it works <span aria-hidden="true">↗</span></a>
      </div>
      <div className="filter-row" aria-label="Filter startups by industry">
        <span className="filter-label">Explore by</span>
        <div className="filter-options">
          {industries.map((industry) => (
            <button
              className={`filter-chip${selectedIndustry === industry ? ' selected' : ''}`}
              type="button"
              key={industry}
              onClick={() => onIndustryChange(industry)}
              aria-pressed={selectedIndustry === industry}
            >
              {industry}
            </button>
          ))}
        </div>
        <span className="results-count">
          {loading ? 'Loading' : `${startups.length} ${startups.length === 1 ? 'idea' : 'ideas'}`}
        </span>
      </div>
      {loading ? (
        <div className="request-state" role="status" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Finding thoughtful ideas for you…</p>
        </div>
      ) : error ? (
        <div className="request-state error-state" role="alert">
          <span className="error-state-icon" aria-hidden="true">!</span>
          <h3>We couldn&apos;t load startups</h3>
          <p>{error}</p>
          <button className="reset-button" type="button" onClick={onRetry}>Try again</button>
        </div>
      ) : startups.length > 0 ? (
        <div className="startup-grid">
          {startups.map((startup, index) => (
            <StartupCard
              startup={{
                ...getStartupPresentation(startup, index),
                onOpen: onStartupOpen,
              }}
              key={startup.id}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <span className="empty-icon" aria-hidden="true"><SearchIcon /></span>
          <h3>No ideas found just yet</h3>
          <p>Try another search or choose a different industry to keep exploring.</p>
          <button
            className="reset-button"
            type="button"
            onClick={onClear}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  )
}

function InvestorInterestForm({ startupId, startupName }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    const form = event.currentTarget
    const formData = new FormData(form)
    const request = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/startups/${encodeURIComponent(startupId)}/interests`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        },
      )

      if (!response.ok) {
        setError(response.status === 400
          ? 'Please check your name, email, and message, then try again.'
          : 'We could not send your interest right now. Please try again.')
        return
      }

      form.reset()
      setSuccess(true)
    } catch {
      setError('We could not reach FundFlow. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="interest-panel" aria-labelledby="interest-heading">
      <div>
        <p className="section-kicker">START A CONVERSATION</p>
        <h3 id="interest-heading">Interested in {startupName}?</h3>
        <p className="interest-intro">
          Share a note with the team. This is a request to connect, not an investment.
        </p>
      </div>
      {success ? (
        <div className="interest-success" role="status" aria-live="polite">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>Your interest was sent</strong>
            <p>Your note has been recorded. No investment has been made.</p>
          </div>
        </div>
      ) : (
        <form className="interest-form" onSubmit={handleSubmit}>
          <label>
            Your name
            <input name="name" autoComplete="name" required minLength="2" maxLength="100" />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength="254"
            />
          </label>
          <label>
            Short message
            <textarea
              name="message"
              required
              minLength="10"
              maxLength="1000"
              rows="4"
              placeholder="Tell the team what caught your attention…"
            />
          </label>
          {error && <p className="interest-error" role="alert">{error}</p>}
          <button className="interest-submit" type="submit" disabled={submitting} aria-busy={submitting}>
            {submitting ? 'Sending…' : 'Express interest'}
          </button>
          <p className="interest-privacy">Your contact details are shared only with this submission.</p>
        </form>
      )}
    </section>
  )
}

function StartupDetailDialog({ startup, dialogRef, onClose }) {
  if (!startup) return null

  const progress = startup.fundingGoal > 0
    ? Math.min(Math.round((startup.amountRaised / startup.fundingGoal) * 100), 100)
    : 0

  return (
    <dialog
      className="startup-dialog"
      ref={dialogRef}
      aria-labelledby="startup-detail-title"
      onClose={onClose}
    >
      <div className="detail-header">
        <div>
          <p className="section-kicker">STARTUP PROFILE · DEMO DATA</p>
          <h2 id="startup-detail-title">{startup.name}</h2>
        </div>
        <button className="dialog-close" type="button" onClick={() => dialogRef.current?.close()}>
          <span className="visually-hidden">Close startup profile</span>
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="detail-summary">
        <span className={`startup-avatar ${startup.color}`} aria-hidden="true">{startup.initials}</span>
        <div>
          <span className="industry-label">{startup.industry}</span>
          <span className="stage-badge">{startup.stage}</span>
        </div>
      </div>
      <p className="detail-description">{startup.description}</p>
      <div className="detail-funding">
        <div>
          <span>Demo funding goal</span>
          <strong>{formatMoney(startup.fundingGoal)}</strong>
        </div>
        <div>
          <span>Demo amount raised</span>
          <strong>{formatMoney(startup.amountRaised)}</strong>
        </div>
      </div>
      <div
        className="progress-track detail-progress"
        role="progressbar"
        aria-label={`${startup.name} demo funding progress`}
        aria-valuemin="0"
        aria-valuemax={startup.fundingGoal}
        aria-valuenow={startup.amountRaised}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="detail-progress-note">{progress}% of demo goal</p>
      <InvestorInterestForm startupId={startup.id} startupName={startup.name} />
    </dialog>
  )
}

function ClosingNote() {
  return (
    <section className="closing-note" id="investors">
      <div className="closing-mark" aria-hidden="true"><BrandMark /></div>
      <div>
        <p className="section-kicker">START WITH CURIOSITY</p>
        <h2>Every big thing starts somewhere.</h2>
        <p>Get to know the founders and ideas shaping what comes next.</p>
      </div>
      <a href="#discover">Keep exploring <span aria-hidden="true">↑</span></a>
    </section>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('All')
  const [startups, setStartups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [selectedStartup, setSelectedStartup] = useState(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (selectedStartup && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
    }
  }, [selectedStartup])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()
    if (query.trim()) params.set('search', query.trim())
    if (selectedIndustry !== 'All') params.set('industry', selectedIndustry)

    async function loadStartups() {
      setLoading(true)
      setError('')

      try {
        const queryString = params.toString()
        const response = await fetch(
          `${apiBaseUrl}/api/startups${queryString ? `?${queryString}` : ''}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error('Startup listings are temporarily unavailable. Please try again.')
        }

        const result = await response.json()
        if (!Array.isArray(result.data)) {
          throw new Error('The server returned an unexpected response. Please try again.')
        }
        setStartups(result.data)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setStartups([])
          setError(requestError.message || 'Something went wrong. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadStartups()
    return () => controller.abort()
  }, [query, selectedIndustry, retryCount])

  return (
    <div className="page-shell" id="startups">
      <Header />
      <main>
        <Hero query={query} onQueryChange={setQuery} />
        <DemoBanner />
        <Stats />
        <StartupDiscovery
          startups={startups}
          loading={loading}
          error={error}
          selectedIndustry={selectedIndustry}
          onIndustryChange={setSelectedIndustry}
          onStartupOpen={setSelectedStartup}
          onRetry={() => setRetryCount((count) => count + 1)}
          onClear={() => {
            setQuery('')
            setSelectedIndustry('All')
          }}
        />
        <StartupDetailDialog
          startup={selectedStartup}
          dialogRef={dialogRef}
          onClose={() => setSelectedStartup(null)}
        />
        <ClosingNote />
      </main>
      <footer className="site-footer" id="dashboard">
        <a className="brand footer-brand" href="#top"><BrandMark /><span>fundflow</span></a>
        <p>Built for the people building what&apos;s next. <span>Demo experience only.</span></p>
        <span className="footer-copyright">© 2026 FundFlow</span>
      </footer>
    </div>
  )
}

export default App
