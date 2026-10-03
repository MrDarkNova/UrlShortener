import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'

const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')
const PAGE_SIZE = 12
const numberFormat = new Intl.NumberFormat()

const iconPaths = {
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
  spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.1L19 22l-1.1-2.9L15 18l2.9-1.2L19 14Z"/></>,
  chart: <><path d="M4 19V5"/><path d="M4 19h17"/><path d="m7 14 4-4 3 3 6-7"/><path d="M16 6h4v4"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  external: <><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/></>,
  trash: <><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></>,
  chevron: <path d="m6 9 6 6 6-6"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  refresh: <><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2"/></>,
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  bolt: <path d="m13 2-3 8h7l-6 12 2-9H6l7-11Z"/>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
}

function Icon({ name, size = 18, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name] || iconPaths.link}</svg>
}

function Spinner({ small = false }) {
  return <span className={'spinner' + (small ? ' spinner--small' : '')} aria-hidden="true" />
}

function timeAgo(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently'
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000))
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return minutes + 'm ago'
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours + 'h ago'
  const days = Math.floor(hours / 24)
  if (days < 30) return days + 'd ago'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function hostOf(value) {
  try { return new URL(value).hostname.replace(/^www\./, '') } catch { return value || 'Destination' }
}

function shortAddress(value) {
  try {
    const parsed = new URL(value)
    return parsed.host + (parsed.pathname === '/' ? '' : parsed.pathname)
  } catch { return value }
}

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value)
    return
  }
  const field = document.createElement('textarea')
  field.value = value
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(field)
  if (!copied) throw new Error('Clipboard access is unavailable')
}

function CopyButton({ text, onError, prominent = false }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleCopy = async () => {
    try {
      await copyText(text)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      onError('Could not copy automatically. Select and copy the link instead.')
    }
  }

  return (
    <button className={'copy-button' + (prominent ? ' copy-button--prominent' : '') + (copied ? ' is-copied' : '')} type="button" onClick={handleCopy} aria-label={copied ? 'Link copied' : 'Copy short link'}>
      <Icon name={copied ? 'check' : 'copy'} size={16} />
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

function ResultCard({ result, onError, onDismiss }) {
  if (!result) return null
  return (
    <section className="result-card" aria-live="polite" aria-label="Short link created">
      <div className="result-mark"><Icon name="check" size={17} /></div>
      <div className="result-content">
        <div className="result-kicker">Your link is ready</div>
        <a className="result-url" href={result.shortUrl} target="_blank" rel="noopener noreferrer">
          {shortAddress(result.shortUrl)} <Icon name="external" size={15} />
        </a>
        <div className="result-destination"><Icon name="arrow" size={15} /><span title={result.originalUrl}>{result.originalUrl}</span></div>
        {result.expiresAt && <div className="result-expiry"><Icon name="clock" size={14} /> Expires {formatDate(result.expiresAt)}</div>}
      </div>
      <div className="result-actions">
        <CopyButton text={result.shortUrl} onError={onError} prominent />
        <button className="icon-button result-dismiss" type="button" onClick={onDismiss} aria-label="Dismiss result"><Icon name="close" /></button>
      </div>
    </section>
  )
}

function ClickDetails({ stats, loading, error }) {
  if (loading) return <div className="stats-feedback"><Spinner small /> Loading click activity…</div>
  if (error) return <div className="stats-feedback stats-feedback--error">{error}</div>
  if (!stats) return null
  const clicks = Array.isArray(stats.recentClicks) ? stats.recentClicks : []
  return (
    <div className="click-details">
      <div className="click-details-head"><span>Recent activity</span><span>{numberFormat.format(stats.clicks || 0)} total clicks</span></div>
      {clicks.length === 0 ? <p className="muted-note">No clicks yet. Your activity will show up here.</p> : (
        <div className="activity-list">
          {clicks.map((click, index) => <div className="activity-row" key={click.timestamp + '-' + index}>
            <span className="activity-dot" />
            <span>{formatDate(click.timestamp) || 'Recent click'}</span>
            <span className="activity-referrer">{click.referrer === 'direct' ? 'Direct' : hostOf(click.referrer)}</span>
          </div>)}
        </div>
      )}
    </div>
  )
}

function LinkCard({ link, onDelete, onError }) {
  const [expanded, setExpanded] = useState(false)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const expired = link.expiresAt && new Date(link.expiresAt).getTime() < Date.now()

  const toggleStats = async () => {
    if (expanded) { setExpanded(false); return }
    setExpanded(true)
    if (stats) return
    setStatsLoading(true)
    setStatsError('')
    try {
      const response = await axios.get(API + '/stats/' + encodeURIComponent(link.shortCode))
      setStats(response.data)
    } catch {
      setStatsError('Could not load activity right now. Try again.')
    } finally {
      setStatsLoading(false)
    }
  }

  const removeLink = async () => {
    if (!window.confirm('Delete this short link? This cannot be undone.')) return
    setDeleting(true)
    try {
      await axios.delete(API + '/links/' + encodeURIComponent(link.shortCode))
      await onDelete(link.shortCode)
    } catch {
      onError('The link could not be deleted. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <article className="link-card">
      <div className="link-card-main">
        <div className="link-destination"><span className="destination-icon"><Icon name="globe" size={15} /></span><span title={link.originalUrl}>{hostOf(link.originalUrl)}</span></div>
        <div className="link-card-bottom">
          <a className="link-short" href={link.shortUrl} target="_blank" rel="noopener noreferrer">{shortAddress(link.shortUrl)} <Icon name="external" size={13} /></a>
          <span className="link-created">{timeAgo(link.createdAt)}</span>
          {link.expiresAt && <span className={'expiry-pill' + (expired ? ' expiry-pill--expired' : '')}><Icon name="clock" size={12} />{expired ? 'Expired' : 'Until ' + formatDate(link.expiresAt)}</span>}
        </div>
      </div>
      <div className="link-card-actions">
        <div className="click-count"><strong>{numberFormat.format(link.clicks || 0)}</strong><span>clicks</span></div>
        <CopyButton text={link.shortUrl} onError={onError} />
        <button className={'icon-button' + (expanded ? ' icon-button--active' : '')} type="button" onClick={toggleStats} aria-label="Toggle click activity" aria-expanded={expanded} title="Click activity"><Icon name="chart" size={17} /></button>
        <button className="icon-button icon-button--danger" type="button" onClick={removeLink} disabled={deleting} aria-label="Delete short link" title="Delete link">{deleting ? <Spinner small /> : <Icon name="trash" size={16} />}</button>
      </div>
      {expanded && <ClickDetails stats={stats} loading={statsLoading} error={statsError} />}
    </article>
  )
}

function MetricCard({ icon, label, value, detail, delay = 0 }) {
  return <article className="metric-card" style={{ animationDelay: delay + 'ms' }}>
    <div className="metric-top"><span className="metric-icon"><Icon name={icon} size={18} /></span><span className="metric-label">{label}</span></div>
    <div className="metric-value">{numberFormat.format(value)}</div>
    <div className="metric-detail">{detail}</div>
  </article>
}

export default function App() {
  const [tab, setTab] = useState('shorten')
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [expiry, setExpiry] = useState('never')
  const [showOptions, setShowOptions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [links, setLinks] = useState([])
  const [linksLoading, setLinksLoading] = useState(true)
  const [linksError, setLinksError] = useState('')
  const [filter, setFilter] = useState('')
  const [meta, setMeta] = useState({ total: 0, totalClicks: 0, page: 1, pages: 1 })
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const routeNotice = useMemo(() => {
    const code = new URLSearchParams(window.location.search).get('error')
    if (code === 'expired') return 'That short link has expired.'
    if (code === 'not_found') return 'That short link could not be found.'
    return ''
  }, [])

  useEffect(() => { loadLinks(1) }, [])
  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const announce = (message, tone = 'success') => {
    setToast({ message, tone })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }

  const loadLinks = async (page = 1) => {
    setLinksLoading(true)
    setLinksError('')
    try {
      const response = await axios.get(API + '/links', { params: { page, limit: PAGE_SIZE } })
      const data = response.data || {}
      setLinks(Array.isArray(data.links) ? data.links : [])
      setMeta({
        total: Number(data.total) || 0,
        totalClicks: Number(data.totalClicks) || 0,
        page: Number(data.page) || page,
        pages: Math.max(1, Number(data.pages) || 1),
      })
    } catch {
      setLinksError('We could not reach the link service. Check your connection and try again.')
    } finally {
      setLinksLoading(false)
    }
  }

  const handleShorten = async (event) => {
    event.preventDefault()
    const originalUrl = url.trim()
    if (!originalUrl) { setError('Add a link to get started.'); return }
    let parsed
    try { parsed = new URL(originalUrl) } catch { setError('Enter a complete URL, including https://'); return }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') { setError('Use a link that starts with http:// or https://'); return }
    setError('')
    setLoading(true)
    try {
      const response = await axios.post(API + '/shorten', {
        originalUrl,
        customAlias: alias.trim() || undefined,
        expiresIn: expiry !== 'never' ? expiry : undefined,
      })
      setResult(response.data)
      setUrl('')
      setAlias('')
      setExpiry('never')
      setShowOptions(false)
      announce('Your short link is ready.')
      loadLinks(1)
    } catch (requestError) {
      const serverMessage = requestError.response && requestError.response.data && requestError.response.data.error
      const messages = {
        'Alias taken': 'That alias is already in use. Try another one.',
        'Invalid URL': 'Check the URL and try again.',
        'Custom alias must be 3–32 characters using letters, numbers, hyphens, or underscores.': 'Use 3–32 letters, numbers, hyphens, or underscores for the custom alias.',
      }
      setError(messages[serverMessage] || serverMessage || 'We could not shorten that link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (code) => {
    const nextPage = links.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page
    await loadLinks(nextPage)
    announce('Short link deleted.')
  }

  const visibleLinks = useMemo(() => {
    const query = filter.trim().toLowerCase()
    if (!query) return links
    return links.filter((link) => (link.originalUrl + ' ' + link.shortUrl + ' ' + link.shortCode).toLowerCase().includes(query))
  }, [filter, links])
  const averageClicks = meta.total ? Math.round(meta.totalClicks / meta.total) : 0

  return (
    <div className="app-shell">
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); setTab('shorten') }} aria-label="Nova Link home">
          <span className="brand-mark"><Icon name="link" size={21} /></span>
          <span className="brand-copy"><strong>NOVA<span>LINK</span></strong><small>SHORT LINK STUDIO</small></span>
        </a>
        <nav className="top-nav" aria-label="Main navigation">
          <button className={'nav-link' + (tab === 'shorten' ? ' nav-link--active' : '')} type="button" onClick={() => setTab('shorten')} aria-current={tab === 'shorten' ? 'page' : undefined}><Icon name="plus" size={15} /><span>Create link</span></button>
          <button className={'nav-link' + (tab === 'dashboard' ? ' nav-link--active' : '')} type="button" onClick={() => setTab('dashboard')} aria-current={tab === 'dashboard' ? 'page' : undefined}><Icon name="chart" size={15} /><span>Dashboard</span>{meta.total > 0 && <span className="nav-count">{meta.total}</span>}</button>
        </nav>
      </header>

      <main className="page-content">
        {routeNotice && <div className="route-notice" role="status"><Icon name="info" size={17} />{routeNotice}</div>}
        {tab === 'shorten' ? <>
          <section className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> LESS URL. MORE YOU.</div>
              <h1>Make every<br /><span>link count.</span></h1>
              <p className="hero-description">Turn long links into something worth sharing. Create, customize, and keep an eye on every click.</p>
              <div className="hero-points">
                <div><span className="point-icon"><Icon name="bolt" size={16} /></span><span>Short links, instantly</span></div>
                <div><span className="point-icon"><Icon name="chart" size={16} /></span><span>Click activity at a glance</span></div>
              </div>
            </div>

            <section className="shorten-card" aria-labelledby="create-heading">
              <div className="card-heading">
                <div><span className="card-overline">START WITH A URL</span><h2 id="create-heading">Create a short link</h2></div>
                <span className="card-icon"><Icon name="spark" size={21} /></span>
              </div>
              <form onSubmit={handleShorten} noValidate>
                <label className="field-label" htmlFor="long-url">Paste your long link</label>
                <div className={'url-input-wrap' + (error ? ' url-input-wrap--error' : '')}>
                  <Icon name="link" size={18} />
                  <input id="long-url" className="url-input" type="url" inputMode="url" autoComplete="url" placeholder="https://example.com/your-long-link" value={url} onChange={(event) => { setUrl(event.target.value); if (error) setError('') }} aria-invalid={!!error} aria-describedby={error ? 'url-error' : 'url-helper'} />
                  {url && <button className="clear-input" type="button" onClick={() => { setUrl(''); setError('') }} aria-label="Clear URL"><Icon name="close" size={16} /></button>}
                </div>
                {error ? <div className="form-error" id="url-error" role="alert">{error}</div> : <div className="field-hint" id="url-helper">Your destination stays exactly as you entered it.</div>}
                <button className="advanced-toggle" type="button" onClick={() => setShowOptions(!showOptions)} aria-expanded={showOptions} aria-controls="advanced-options"><span className="advanced-toggle-left"><Icon name="spark" size={15} /> Make it yours</span><span className="advanced-toggle-right">{showOptions ? 'Hide options' : 'Custom alias & expiry'}<Icon name="chevron" size={15} className={showOptions ? 'rotate-180' : ''} /></span></button>
                {showOptions && <div className="advanced-fields" id="advanced-options">
                  <div className="field-group"><label className="field-label" htmlFor="custom-alias">Custom alias <span className="optional-label">OPTIONAL</span></label><div className="text-input-wrap"><span className="input-prefix">/</span><input id="custom-alias" className="text-input" type="text" autoComplete="off" maxLength={32} placeholder="your-name" value={alias} onChange={(event) => setAlias(event.target.value)} /></div><span className="field-hint">3–32 letters, numbers, - or _</span></div>
                  <div className="field-group"><label className="field-label" htmlFor="expiry">Link expiry</label><select id="expiry" className="select-input" value={expiry} onChange={(event) => setExpiry(event.target.value)}><option value="never">Never expires</option><option value="1">After 1 day</option><option value="7">After 7 days</option><option value="30">After 30 days</option><option value="90">After 90 days</option></select><span className="field-hint">Choose how long it stays active.</span></div>
                </div>}
                <button className="button-primary create-button" type="submit" disabled={loading || !url.trim()}>{loading ? <><Spinner small /> Creating your link…</> : <>Create short link <Icon name="arrow" size={17} /></>}</button>
              </form>
              <div className="privacy-note"><Icon name="shield" size={14} /><span>Your links, ready to share. No account required.</span></div>
            </section>
          </section>

          <ResultCard result={result} onError={(message) => announce(message, 'error')} onDismiss={() => setResult(null)} />

          <section className="overview-strip" aria-label="Link overview">
            <div className="overview-intro"><span className="overview-label">YOUR LINK ACTIVITY</span><span className="overview-subtitle">A quick look at your workspace</span></div>
            <div className="overview-stat"><span className="overview-stat-icon"><Icon name="link" size={17} /></span><span className="overview-stat-value">{numberFormat.format(meta.total)}</span><span className="overview-stat-label">links created</span></div>
            <div className="overview-divider" />
            <div className="overview-stat"><span className="overview-stat-icon overview-stat-icon--mint"><Icon name="chart" size={17} /></span><span className="overview-stat-value">{numberFormat.format(meta.totalClicks)}</span><span className="overview-stat-label">total clicks</span></div>
            <button className="overview-link" type="button" onClick={() => setTab('dashboard')}>View dashboard <Icon name="arrow" size={15} /></button>
          </section>

          <section className="benefit-grid" aria-label="Why Nova Link">
            <article className="benefit-card"><span className="benefit-icon benefit-icon--violet"><Icon name="bolt" size={19} /></span><h3>Fast by default</h3><p>Go from a sprawling URL to a clean, shareable link in a moment.</p></article>
            <article className="benefit-card"><span className="benefit-icon benefit-icon--mint"><Icon name="chart" size={19} /></span><h3>Know what lands</h3><p>See click totals and recent activity for every link you create.</p></article>
            <article className="benefit-card"><span className="benefit-icon benefit-icon--blue"><Icon name="spark" size={19} /></span><h3>Make it memorable</h3><p>Add a custom alias and set an expiry when the link is temporary.</p></article>
          </section>
        </> : <section className="dashboard-view">
          <div className="dashboard-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> YOUR WORKSPACE</div><h1>Your links,<br /><span>in one place.</span></h1><p>Manage every short link and see how it’s performing.</p></div>
            <button className="button-primary dashboard-create" type="button" onClick={() => { setTab('shorten'); setResult(null) }}><Icon name="plus" size={17} /> Create a link</button>
          </div>

          <div className="metrics-grid">
            <MetricCard icon="link" label="TOTAL LINKS" value={meta.total} detail="Active short links" delay={0} />
            <MetricCard icon="chart" label="TOTAL CLICKS" value={meta.totalClicks} detail="Across all your links" delay={60} />
            <MetricCard icon="spark" label="AVG. CLICKS" value={averageClicks} detail="Clicks per link" delay={120} />
          </div>

          <section className="links-section" aria-labelledby="links-heading">
            <div className="links-section-head"><div><div className="section-overline">YOUR COLLECTION</div><h2 id="links-heading">All links <span className="section-count">{numberFormat.format(meta.total)}</span></h2></div><button className="icon-button refresh-button" type="button" onClick={() => loadLinks(meta.page)} disabled={linksLoading} aria-label="Refresh links" title="Refresh"><Icon name="refresh" size={17} /></button></div>
            <div className="links-toolbar"><div className="search-box"><Icon name="search" size={17} /><input type="search" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter this page…" aria-label="Filter links on this page" /></div><div className="toolbar-caption">{meta.total === 0 ? 'No links yet' : 'Page ' + meta.page + ' of ' + meta.pages}</div></div>
            {linksError && links.length > 0 && <div className="inline-alert" role="alert"><span>{linksError}</span><button type="button" onClick={() => loadLinks(meta.page)}>Retry</button></div>}
            {linksLoading && links.length === 0 ? <div className="loading-panel"><Spinner /><span>Loading your links…</span></div> : linksError && links.length === 0 ? <div className="empty-state"><span className="empty-icon"><Icon name="refresh" size={23} /></span><h3>Your links didn’t load.</h3><p>Check your connection and try again. Your links are still safe.</p><button className="button-secondary" type="button" onClick={() => loadLinks(meta.page)}>Try again <Icon name="refresh" size={14} /></button></div> : visibleLinks.length > 0 ? <div className="link-list">{visibleLinks.map((link) => <LinkCard key={link.shortCode} link={link} onDelete={handleDelete} onError={(message) => announce(message, 'error')} />)}</div> : filter ? <div className="empty-state"><span className="empty-icon"><Icon name="search" size={23} /></span><h3>No matches on this page</h3><p>Try another search, or move to a different page.</p><button className="button-secondary" type="button" onClick={() => setFilter('')}>Clear filter</button></div> : linksLoading ? <div className="loading-panel"><Spinner /><span>Refreshing your links…</span></div> : <div className="empty-state"><span className="empty-icon"><Icon name="link" size={23} /></span><h3>Your next great link starts here.</h3><p>Create your first short link and it’ll show up here.</p><button className="button-secondary" type="button" onClick={() => setTab('shorten')}>Create a short link <Icon name="arrow" size={15} /></button></div>}
            {meta.pages > 1 && <div className="pagination"><span>Showing {links.length ? ((meta.page - 1) * PAGE_SIZE + 1) : 0}–{Math.min(meta.page * PAGE_SIZE, meta.total)} of {numberFormat.format(meta.total)}</span><div className="pagination-actions"><button className="button-secondary pagination-button" type="button" onClick={() => loadLinks(meta.page - 1)} disabled={linksLoading || meta.page <= 1}><Icon name="arrow" size={15} className="arrow-reverse" /> Previous</button><button className="button-secondary pagination-button" type="button" onClick={() => loadLinks(meta.page + 1)} disabled={linksLoading || meta.page >= meta.pages}>Next <Icon name="arrow" size={15} /></button></div></div>}
          </section>
        </section>}
      </main>

      <footer className="site-footer"><a className="footer-brand" href="/" onClick={(event) => { event.preventDefault(); setTab('shorten') }}><span className="brand-mark brand-mark--small"><Icon name="link" size={16} /></span><span>NOVA LINK</span></a><span className="footer-note">A little less link. A lot more focus.</span><span className="footer-credit">BY MR. DARKNOVA</span></footer>

      {toast && <div className={'toast toast--' + toast.tone} role={toast.tone === 'error' ? 'alert' : 'status'}><span className="toast-icon"><Icon name={toast.tone === 'error' ? 'close' : 'check'} size={16} /></span>{toast.message}<button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification"><Icon name="close" size={15} /></button></div>}
    </div>
  )
}
