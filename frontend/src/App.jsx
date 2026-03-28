import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

// ── Utility ───────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr)
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (days > 0) return `${days}d ago`
  if (hrs > 0) return `${hrs}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'just now'
}

function truncate(str, n = 45) {
  return str.length > n ? str.slice(0, n) + '…' : str
}

// ── Components ────────────────────────────────────────────

function Spinner() {
  return (
    <span style={{
      display: 'inline-block', width: 16, height: 16,
      border: '2px solid rgba(255,255,255,0.2)',
      borderTopColor: '#fff', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 14px',
      background: copied ? 'rgba(52,211,153,0.15)' : 'var(--surface2)',
      border: `1px solid ${copied ? 'var(--success)' : 'var(--border2)'}`,
      borderRadius: 8, cursor: 'pointer',
      fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
      color: copied ? 'var(--success)' : 'var(--text2)',
      transition: 'all 0.25s',
      whiteSpace: 'nowrap',
    }}>
      {copied ? (
        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> COPIED</>
      ) : (
        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> COPY</>
      )}
    </button>
  )
}

function ResultCard({ result, onClose }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid rgba(124,92,252,0.4)',
      borderRadius: 'var(--radius2)',
      padding: '28px 32px',
      animation: 'fadeUp 0.4s var(--ease) both',
      boxShadow: '0 0 60px rgba(124,92,252,0.12)',
      position: 'relative',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: 16, right: 16,
        background: 'var(--surface2)', border: '1px solid var(--border2)',
        borderRadius: '50%', width: 28, height: 28,
        cursor: 'pointer', color: 'var(--text3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, transition: 'color 0.2s',
      }}>×</button>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent2)', letterSpacing: '0.2em', marginBottom: 12 }}>
        // LINK CREATED
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <a href={result.shortUrl} target="_blank" rel="noopener" style={{
          fontFamily: 'var(--font-display)', fontSize: '1.8rem',
          letterSpacing: '0.04em',
          background: 'linear-gradient(135deg, var(--accent2), var(--cyan))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {result.shortUrl.replace(/^https?:\/\//, '')}
        </a>
        <CopyBtn text={result.shortUrl} />
      </div>

      <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text3)' }}>
        → {truncate(result.originalUrl, 60)}
      </div>

      {result.expiresAt && (
        <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold)' }}>
          ⏱ Expires {new Date(result.expiresAt).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}

function LinkRow({ link, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState(null)

  const handleDelete = async () => {
    if (!confirm('Delete this link?')) return
    setDeleting(true)
    try {
      await axios.delete(`${API}/links/${link.shortCode}`)
      onDelete(link.shortCode)
    } catch {
      setDeleting(false)
    }
  }

  const loadStats = async () => {
    if (stats) { setShowStats(!showStats); return }
    try {
      const res = await axios.get(`${API}/stats/${link.shortCode}`)
      setStats(res.data)
      setShowStats(true)
    } catch {}
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '18px 22px',
      transition: 'border-color 0.3s, background 0.3s',
      animation: 'fadeUp 0.4s var(--ease) both',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,92,252,0.3)'; e.currentTarget.style.background = 'var(--surface2)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <a href={link.shortUrl} target="_blank" rel="noopener" style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
              color: 'var(--accent2)', fontWeight: 700,
            }}>
              {link.shortUrl.replace(/^https?:\/\//, '')}
            </a>
            <CopyBtn text={link.shortUrl} />
          </div>
          <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text3)' }}>
            {truncate(link.originalUrl)}
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text3)' }}>
              {timeAgo(link.createdAt)}
            </span>
            {link.expiresAt && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold)' }}>
                ⏱ {new Date(link.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--accent2)', lineHeight: 1 }}>
              {link.clicks}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text3)', letterSpacing: '0.1em' }}>
              CLICKS
            </div>
          </div>

          <button onClick={loadStats} title="View stats" style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--surface2)', border: '1px solid var(--border2)',
            cursor: 'pointer', color: 'var(--text2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </button>

          <button onClick={handleDelete} disabled={deleting} title="Delete link" style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)',
            cursor: deleting ? 'not-allowed' : 'pointer', color: 'var(--danger)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', opacity: deleting ? 0.5 : 1,
          }}>
            {deleting ? <Spinner /> : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {showStats && stats && (
        <div style={{
          marginTop: 16, paddingTop: 16,
          borderTop: '1px solid var(--border)',
          animation: 'fadeIn 0.3s var(--ease)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent2)', letterSpacing: '0.15em', marginBottom: 10 }}>
            // RECENT CLICKS
          </div>
          {stats.recentClicks.length === 0 ? (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text3)' }}>No clicks yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {stats.recentClicks.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text3)' }}>
                  <span style={{ color: 'var(--text2)' }}>{new Date(c.timestamp).toLocaleString()}</span>
                  <span>{c.referrer || 'direct'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────
export default function App() {
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [expiry, setExpiry] = useState('never')
  const [showOptions, setShowOptions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [links, setLinks] = useState([])
  const [linksLoading, setLinksLoading] = useState(true)
  const [tab, setTab] = useState('shorten') // shorten | dashboard
  const inputRef = useRef(null)

  useEffect(() => { loadLinks() }, [])

  const loadLinks = async () => {
    setLinksLoading(true)
    try {
      const res = await axios.get(`${API}/links?limit=20`)
      setLinks(res.data.links || [])
    } catch {
      // Backend might be offline in preview — show empty state
    } finally {
      setLinksLoading(false)
    }
  }

  const handleShorten = async () => {
    if (!url.trim()) { setError('Please enter a URL'); return }
    setError(''); setLoading(true)

    try {
      const res = await axios.post(`${API}/shorten`, {
        originalUrl: url.trim(),
        customAlias: alias.trim() || undefined,
        expiresIn: expiry !== 'never' ? expiry : undefined,
      })
      setResult(res.data)
      setUrl(''); setAlias(''); setExpiry('never')
      setShowOptions(false)
      loadLinks()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) handleShorten()
  }

  const handleDelete = (code) => {
    setLinks(prev => prev.filter(l => l.shortCode !== code))
  }

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* BG Grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', inset: '-50%',
          backgroundImage: 'linear-gradient(rgba(124,92,252,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'gridMove 25s linear infinite',
        }} />
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,92,252,0.18), transparent 70%)',
          top: -200, right: -150,
          animation: 'orbFloat 9s ease-in-out infinite',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.1), transparent 70%)',
          bottom: 100, left: -80,
          animation: 'orbFloat 7s ease-in-out infinite',
          animationDelay: '-3s',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px, 5vw, 64px)', height: 64,
        backdropFilter: 'blur(20px)',
        background: 'rgba(5,5,8,0.8)',
        borderBottom: '1px solid var(--border)',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L24 7V21L14 26L4 21V7L14 2Z" stroke="var(--accent2)" strokeWidth="1.5" fill="none"/>
            <path d="M14 8L20 11.5V18.5L14 22L8 18.5V11.5L14 8Z" fill="var(--accent2)" opacity="0.3"/>
          </svg>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.1em', color: 'var(--accent2)', lineHeight: 1 }}>
              MR. DARKNOVA
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text3)', letterSpacing: '0.2em' }}>
              URL SHORTENER
            </div>
          </div>
        </a>

        <div style={{ display: 'flex', gap: 4 }}>
          {['shorten', 'dashboard'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '7px 16px', borderRadius: 8,
              border: tab === t ? '1px solid rgba(124,92,252,0.4)' : '1px solid transparent',
              background: tab === t ? 'var(--glow2)' : 'transparent',
              color: tab === t ? 'var(--accent2)' : 'var(--text2)',
              cursor: 'pointer', transition: 'all 0.25s',
            }}>{t}</button>
          ))}
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, padding: 'clamp(48px, 8vw, 96px) clamp(20px, 6vw, 80px)' }}>

        {/* SHORTEN TAB */}
        {tab === 'shorten' && (
          <div style={{ maxWidth: 760, margin: '0 auto' }}>

            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 56, animation: 'fadeUp 0.7s var(--ease) both' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                letterSpacing: '0.2em', color: 'var(--accent2)',
                background: 'var(--glow2)', border: '1px solid rgba(124,92,252,0.3)',
                padding: '5px 14px', borderRadius: 100, marginBottom: 28,
              }}>
                <span style={{ width: 6, height: 6, background: 'var(--success)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                DARKNOVA URL SHORTENER
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                lineHeight: 0.9, letterSpacing: '-0.01em',
                marginBottom: 20,
              }}>
                <span style={{ display: 'block', color: 'var(--text)' }}>SHORTEN.</span>
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, var(--accent2) 0%, var(--cyan) 60%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>TRACK. SHARE.</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text2)', maxWidth: 480, margin: '0 auto' }}>
                Transform long URLs into powerful short links. Track every click in real time.
              </p>
            </div>

            {/* Stats bar */}
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 40,
              marginBottom: 40, animation: 'fadeUp 0.7s var(--ease) 0.1s both',
            }}>
              {[
                { val: links.length, label: 'LINKS' },
                { val: totalClicks, label: 'TOTAL CLICKS' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--accent2)', lineHeight: 1 }}>
                    {s.val}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: '0.15em' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Card */}
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border2)',
              borderRadius: 'var(--radius2)', padding: 'clamp(24px, 4vw, 40px)',
              animation: 'fadeUp 0.7s var(--ease) 0.15s both',
              boxShadow: '0 20px 80px rgba(0,0,0,0.3)',
            }}>
              {/* URL input row */}
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text3)',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={e => { setUrl(e.target.value); setError('') }}
                    onKeyDown={handleKeyDown}
                    placeholder="https://your-long-url.com/paste-here"
                    style={{
                      width: '100%', padding: '14px 16px 14px 44px',
                      background: 'var(--surface2)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border2)'}`,
                      borderRadius: 'var(--radius)', color: 'var(--text)',
                      fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
                      outline: 'none', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(124,92,252,0.5)' }}
                    onBlur={e => { if (!error) e.target.style.borderColor = 'var(--border2)' }}
                  />
                </div>
                <button
                  onClick={handleShorten}
                  disabled={loading}
                  style={{
                    padding: '14px 28px',
                    background: loading ? 'rgba(124,92,252,0.4)' : 'linear-gradient(135deg, var(--accent), var(--accent2))',
                    border: 'none', borderRadius: 'var(--radius)',
                    color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: '0 4px 24px var(--glow)',
                    transition: 'all 0.25s', whiteSpace: 'nowrap',
                  }}
                >
                  {loading ? <><Spinner /> SHORTENING</> : <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    SHORTEN
                  </>}
                </button>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  marginTop: 10, padding: '10px 14px',
                  background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
                  borderRadius: 10, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--danger)',
                  animation: 'fadeIn 0.3s var(--ease)',
                }}>
                  {error}
                </div>
              )}

              {/* Advanced Options toggle */}
              <button
                onClick={() => setShowOptions(!showOptions)}
                style={{
                  marginTop: 14, background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text3)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent2)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: showOptions ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
                {showOptions ? 'HIDE OPTIONS' : 'ADVANCED OPTIONS'}
              </button>

              {/* Advanced options */}
              {showOptions && (
                <div style={{
                  marginTop: 16, display: 'grid',
                  gridTemplateColumns: '1fr 1fr', gap: 12,
                  animation: 'fadeUp 0.3s var(--ease)',
                }}>
                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text3)', letterSpacing: '0.15em', display: 'block', marginBottom: 8 }}>
                      CUSTOM ALIAS
                    </label>
                    <input
                      type="text"
                      value={alias}
                      onChange={e => setAlias(e.target.value)}
                      placeholder="my-brand-link"
                      style={{
                        width: '100%', padding: '11px 14px',
                        background: 'var(--surface)', border: '1px solid var(--border2)',
                        borderRadius: 'var(--radius)', color: 'var(--text)',
                        fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text3)', letterSpacing: '0.15em', display: 'block', marginBottom: 8 }}>
                      EXPIRY
                    </label>
                    <select
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      style={{
                        width: '100%', padding: '11px 14px',
                        background: 'var(--surface)', border: '1px solid var(--border2)',
                        borderRadius: 'var(--radius)', color: 'var(--text)',
                        fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                        outline: 'none', cursor: 'pointer',
                      }}
                    >
                      <option value="never">Never expires</option>
                      <option value="1">1 day</option>
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Result */}
            {result && (
              <div style={{ marginTop: 20 }}>
                <ResultCard result={result} onClose={() => setResult(null)} />
              </div>
            )}

            {/* Features */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
              marginTop: 48, animation: 'fadeUp 0.7s var(--ease) 0.25s both',
            }}>
              {[
                { icon: '⚡', title: 'Instant Shortening', desc: 'URLs shortened in milliseconds with a single click.' },
                { icon: '📊', title: 'Click Analytics', desc: 'Track clicks, referrers, and activity per link.' },
                { icon: '🔒', title: 'Custom Aliases', desc: 'Brand your links with memorable custom slugs.' },
              ].map(f => (
                <div key={f.title} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '20px',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,92,252,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ fontSize: '1.4rem', marginBottom: 10 }}>{f.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text)', letterSpacing: '0.05em', marginBottom: 6 }}>
                    {f.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text3)', lineHeight: 1.6 }}>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: 40, animation: 'fadeUp 0.5s var(--ease) both' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent2)', letterSpacing: '0.2em', marginBottom: 10 }}>
                // YOUR LINKS
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--text)', lineHeight: 1 }}>
                LINK <span style={{ background: 'linear-gradient(135deg, var(--accent2), var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DASHBOARD</span>
              </h2>

              {/* Summary stats */}
              <div style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
                {[
                  { label: 'TOTAL LINKS', val: links.length },
                  { label: 'TOTAL CLICKS', val: totalClicks },
                  { label: 'AVG. CLICKS', val: links.length ? Math.round(totalClicks / links.length) : 0 },
                ].map(s => (
                  <div key={s.label} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '16px 24px',
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--accent2)', lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text3)', letterSpacing: '0.15em', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {linksLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text3)' }}>
                <Spinner /> Loading links...
              </div>
            ) : links.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 20px',
                background: 'var(--surface)', border: '1px dashed var(--border2)',
                borderRadius: 'var(--radius2)',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔗</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text2)', marginBottom: 8 }}>
                  NO LINKS YET
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 20 }}>
                  Go shorten your first URL to get started
                </div>
                <button onClick={() => setTab('shorten')} style={{
                  padding: '11px 24px',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  border: 'none', borderRadius: 'var(--radius)',
                  color: '#fff', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                }}>
                  SHORTEN A URL
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(link => (
                  <LinkRow key={link.shortCode} link={link} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center', padding: '24px 20px',
        borderTop: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        color: 'var(--text3)', letterSpacing: '0.1em',
      }}>
        CRAFTED BY <span style={{ color: 'var(--accent2)' }}>MR. DARKNOVA</span> — VICTOR KUMBA · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
