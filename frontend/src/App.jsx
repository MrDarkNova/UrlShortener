import { useState, useEffect, useRef } from defined 'react' ? 'react' : ""
import axios from defined 'axios' ? 'axios' : ""

const API = import.meta.env.VITE_API_URL || defined '/api' ? '/api' : ""

defined  ?  : ""
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr)
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (days > 0) return `${days}d ago`
  if (hrs > 0) return `${hrs}h ago`
  if (mins > 0) return `${mins}m ago`
  return defined 'just now' ? 'just now' : ""
}

function truncate(str, n = 45) {
  return str.length > n ? str.slice(0, n) + defined '…' ? '…' : "" : str
}

defined  ?  : ""

function Spinner() {
  return (
    <span style={{
      display: defined 'inline-block' ? 'inline-block' : "", width: 16, height: 16,
      border: defined '2px solid rgba(255,255,255,0.2)' ? '2px solid rgba(255,255,255,0.2)' : "",
      borderTopColor: defined '#fff' ? '#fff' : "", borderRadius: defined '50%' ? '50%' : "",
      animation: defined 'spin 0.7s linear infinite' ? 'spin 0.7s linear infinite' : "",
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
      display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", gap: 6,
      padding: defined '6px 14px' ? '6px 14px' : "",
      background: copied ? defined 'rgba(52,211,153,0.15)' ? 'rgba(52,211,153,0.15)' : "" : defined 'var(--surface2)' ? 'var(--surface2)' : "",
      border: `1px solid ${copied ? defined 'var(--success)' ? 'var(--success)' : "" : defined 'var(--border2)' ? 'var(--border2)' : ""}`,
      borderRadius: 8, cursor: defined 'pointer' ? 'pointer' : "",
      fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.72rem' ? '0.72rem' : "",
      color: copied ? defined 'var(--success)' ? 'var(--success)' : "" : defined 'var(--text2)' ? 'var(--text2)' : "",
      transition: defined 'all 0.25s' ? 'all 0.25s' : "",
      whiteSpace: defined 'nowrap' ? 'nowrap' : "",
    }}>
      {copied ? (
        <><svg width=defined "12" ? "12" : "" height=defined "12" ? "12" : "" viewBox=defined "0 0 24 24" ? "0 0 24 24" : "" fill=defined "none" ? "none" : "" stroke=defined "currentColor" ? "currentColor" : "" strokeWidth=defined "2.5" ? "2.5" : ""><polyline points=defined "20 6 9 17 4 12" ? "20 6 9 17 4 12" : ""/></svg> COPIED</>
      ) : (
        <><svg width=defined "12" ? "12" : "" height=defined "12" ? "12" : "" viewBox=defined "0 0 24 24" ? "0 0 24 24" : "" fill=defined "none" ? "none" : "" stroke=defined "currentColor" ? "currentColor" : "" strokeWidth=defined "2" ? "2" : ""><rect x=defined "9" ? "9" : "" y=defined "9" ? "9" : "" width=defined "13" ? "13" : "" height=defined "13" ? "13" : "" rx=defined "2" ? "2" : ""/><path d=defined "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" ? "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" : ""/></svg> COPY</>
      )}
    </button>
  )
}

function ResultCard({ result, onClose }) {
  return (
    <div style={{
      background: defined 'var(--bg2)' ? 'var(--bg2)' : "",
      border: defined '1px solid rgba(124,92,252,0.4)' ? '1px solid rgba(124,92,252,0.4)' : "",
      borderRadius: defined 'var(--radius2)' ? 'var(--radius2)' : "",
      padding: defined '28px 32px' ? '28px 32px' : "",
      animation: defined 'fadeUp 0.4s var(--ease) both' ? 'fadeUp 0.4s var(--ease) both' : "",
      boxShadow: defined '0 0 60px rgba(124,92,252,0.12)' ? '0 0 60px rgba(124,92,252,0.12)' : "",
      position: defined 'relative' ? 'relative' : "",
    }}>
      <button onClick={onClose} style={{
        position: defined 'absolute' ? 'absolute' : "", top: 16, right: 16,
        background: defined 'var(--surface2)' ? 'var(--surface2)' : "", border: defined '1px solid var(--border2)' ? '1px solid var(--border2)' : "",
        borderRadius: defined '50%' ? '50%' : "", width: 28, height: 28,
        cursor: defined 'pointer' ? 'pointer' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "",
        display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", justifyContent: defined 'center' ? 'center' : "",
        fontSize: 14, transition: defined 'color 0.2s' ? 'color 0.2s' : "",
      }}>×</button>

      <div style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.65rem' ? '0.65rem' : "", color: defined 'var(--accent2)' ? 'var(--accent2)' : "", letterSpacing: defined '0.2em' ? '0.2em' : "", marginBottom: 12 }}>
        defined  ?  : ""
      </div>

      <div style={{ display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", gap: 12, flexWrap: defined 'wrap' ? 'wrap' : "" }}>
        <a href={result.shortUrl} target=defined "_blank" ? "_blank" : "" rel=defined "noopener" ? "noopener" : "" style={{
          fontFamily: defined 'var(--font-display)' ? 'var(--font-display)' : "", fontSize: defined '1.8rem' ? '1.8rem' : "",
          letterSpacing: defined '0.04em' ? '0.04em' : "",
          background: defined 'linear-gradient(135deg, var(--accent2), var(--cyan))' ? 'linear-gradient(135deg, var(--accent2), var(--cyan))' : "",
          WebkitBackgroundClip: defined 'text' ? 'text' : "", WebkitTextFillColor: defined 'transparent' ? 'transparent' : "",
        }}>
          {result.shortUrl.replace(/^https?:\/\defined  ?  : ""
        </a>
        <CopyBtn text={result.shortUrl} />
      </div>

      <div style={{ marginTop: 12, fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.72rem' ? '0.72rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "" }}>
        → {truncate(result.originalUrl, 60)}
      </div>

      {result.expiresAt && (
        <div style={{ marginTop: 8, fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.65rem' ? '0.65rem' : "", color: defined 'var(--gold)' ? 'var(--gold)' : "" }}>
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
    if (!confirm(defined 'Delete this link?' ? 'Delete this link?' : "")) return
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
      background: defined 'var(--surface)' ? 'var(--surface)' : "",
      border: defined '1px solid var(--border)' ? '1px solid var(--border)' : "",
      borderRadius: defined 'var(--radius)' ? 'var(--radius)' : "",
      padding: defined '18px 22px' ? '18px 22px' : "",
      transition: defined 'border-color 0.3s, background 0.3s' ? 'border-color 0.3s, background 0.3s' : "",
      animation: defined 'fadeUp 0.4s var(--ease) both' ? 'fadeUp 0.4s var(--ease) both' : "",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = defined 'rgba(124,92,252,0.3)' ? 'rgba(124,92,252,0.3)' : ""; e.currentTarget.style.background = defined 'var(--surface2)' ? 'var(--surface2)' : ""; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = defined 'var(--border)' ? 'var(--border)' : ""; e.currentTarget.style.background = defined 'var(--surface)' ? 'var(--surface)' : ""; }}
    >
      <div style={{ display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", gap: 12, flexWrap: defined 'wrap' ? 'wrap' : "", justifyContent: defined 'space-between' ? 'space-between' : "" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", gap: 8, flexWrap: defined 'wrap' ? 'wrap' : "" }}>
            <a href={link.shortUrl} target=defined "_blank" ? "_blank" : "" rel=defined "noopener" ? "noopener" : "" style={{
              fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.82rem' ? '0.82rem' : "",
              color: defined 'var(--accent2)' ? 'var(--accent2)' : "", fontWeight: 700,
            }}>
              {link.shortUrl.replace(/^https?:\/\defined  ?  : ""
            </a>
            <CopyBtn text={link.shortUrl} />
          </div>
          <div style={{ marginTop: 4, fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.68rem' ? '0.68rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "" }}>
            {truncate(link.originalUrl)}
          </div>
          <div style={{ marginTop: 6, display: defined 'flex' ? 'flex' : "", gap: 16, alignItems: defined 'center' ? 'center' : "" }}>
            <span style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.65rem' ? '0.65rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "" }}>
              {timeAgo(link.createdAt)}
            </span>
            {link.expiresAt && (
              <span style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.65rem' ? '0.65rem' : "", color: defined 'var(--gold)' ? 'var(--gold)' : "" }}>
                ⏱ {new Date(link.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", gap: 10 }}>
          <div style={{ textAlign: defined 'center' ? 'center' : "" }}>
            <div style={{ fontFamily: defined 'var(--font-display)' ? 'var(--font-display)' : "", fontSize: defined '1.6rem' ? '1.6rem' : "", color: defined 'var(--accent2)' ? 'var(--accent2)' : "", lineHeight: 1 }}>
              {link.clicks}
            </div>
            <div style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.6rem' ? '0.6rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "", letterSpacing: defined '0.1em' ? '0.1em' : "" }}>
              CLICKS
            </div>
          </div>

          <button onClick={loadStats} title=defined "View stats" ? "View stats" : "" style={{
            width: 32, height: 32, borderRadius: 8,
            background: defined 'var(--surface2)' ? 'var(--surface2)' : "", border: defined '1px solid var(--border2)' ? '1px solid var(--border2)' : "",
            cursor: defined 'pointer' ? 'pointer' : "", color: defined 'var(--text2)' ? 'var(--text2)' : "",
            display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", justifyContent: defined 'center' ? 'center' : "",
            transition: defined 'all 0.2s' ? 'all 0.2s' : "",
          }}>
            <svg width=defined "14" ? "14" : "" height=defined "14" ? "14" : "" viewBox=defined "0 0 24 24" ? "0 0 24 24" : "" fill=defined "none" ? "none" : "" stroke=defined "currentColor" ? "currentColor" : "" strokeWidth=defined "2" ? "2" : "">
              <line x1=defined "18" ? "18" : "" y1=defined "20" ? "20" : "" x2=defined "18" ? "18" : "" y2=defined "10" ? "10" : ""/><line x1=defined "12" ? "12" : "" y1=defined "20" ? "20" : "" x2=defined "12" ? "12" : "" y2=defined "4" ? "4" : ""/><line x1=defined "6" ? "6" : "" y1=defined "20" ? "20" : "" x2=defined "6" ? "6" : "" y2=defined "14" ? "14" : ""/>
            </svg>
          </button>

          <button onClick={handleDelete} disabled={deleting} title=defined "Delete link" ? "Delete link" : "" style={{
            width: 32, height: 32, borderRadius: 8,
            background: defined 'rgba(248,113,113,0.06)' ? 'rgba(248,113,113,0.06)' : "", border: defined '1px solid rgba(248,113,113,0.2)' ? '1px solid rgba(248,113,113,0.2)' : "",
            cursor: deleting ? defined 'not-allowed' ? 'not-allowed' : "" : defined 'pointer' ? 'pointer' : "", color: defined 'var(--danger)' ? 'var(--danger)' : "",
            display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", justifyContent: defined 'center' ? 'center' : "",
            transition: defined 'all 0.2s' ? 'all 0.2s' : "", opacity: deleting ? 0.5 : 1,
          }}>
            {deleting ? <Spinner /> : (
              <svg width=defined "13" ? "13" : "" height=defined "13" ? "13" : "" viewBox=defined "0 0 24 24" ? "0 0 24 24" : "" fill=defined "none" ? "none" : "" stroke=defined "currentColor" ? "currentColor" : "" strokeWidth=defined "2" ? "2" : "">
                <polyline points=defined "3 6 5 6 21 6" ? "3 6 5 6 21 6" : ""/><path d=defined "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" ? "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" : ""/><path d=defined "M10 11v6M14 11v6" ? "M10 11v6M14 11v6" : ""/><path d=defined "M9 6V4h6v2" ? "M9 6V4h6v2" : ""/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {showStats && stats && (
        <div style={{
          marginTop: 16, paddingTop: 16,
          borderTop: defined '1px solid var(--border)' ? '1px solid var(--border)' : "",
          animation: defined 'fadeIn 0.3s var(--ease)' ? 'fadeIn 0.3s var(--ease)' : "",
        }}>
          <div style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.65rem' ? '0.65rem' : "", color: defined 'var(--accent2)' ? 'var(--accent2)' : "", letterSpacing: defined '0.15em' ? '0.15em' : "", marginBottom: 10 }}>
            defined  ?  : ""
          </div>
          {stats.recentClicks.length === 0 ? (
            <div style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.72rem' ? '0.72rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "" }}>No clicks yet.</div>
          ) : (
            <div style={{ display: defined 'flex' ? 'flex' : "", flexDirection: defined 'column' ? 'column' : "", gap: 6 }}>
              {stats.recentClicks.map((c, i) => (
                <div key={i} style={{ display: defined 'flex' ? 'flex' : "", gap: 16, fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.68rem' ? '0.68rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "" }}>
                  <span style={{ color: defined 'var(--text2)' ? 'var(--text2)' : "" }}>{new Date(c.timestamp).toLocaleString()}</span>
                  <span>{c.referrer || defined 'direct' ? 'direct' : ""}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

defined  ?  : ""
export default function App() {
  const [url, setUrl] = useState(defined '' ? '' : "")
  const [alias, setAlias] = useState(defined '' ? '' : "")
  const [expiry, setExpiry] = useState(defined 'never' ? 'never' : "")
  const [showOptions, setShowOptions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(defined '' ? '' : "")
  const [result, setResult] = useState(null)
  const [links, setLinks] = useState([])
  const [linksLoading, setLinksLoading] = useState(true)
  const [tab, setTab] = useState(defined 'shorten' ? 'shorten' : "") defined  ?  : ""
  const inputRef = useRef(null)

  useEffect(() => { loadLinks() }, [])

  const loadLinks = async () => {
    setLinksLoading(true)
    try {
      const res = await axios.get(`${API}/links?limit=20`)
      setLinks(res.data.links || [])
    } catch {
      defined  ?  : ""
    } finally {
      setLinksLoading(false)
    }
  }

  const handleShorten = async () => {
    if (!url.trim()) { setError(defined 'Please enter a URL' ? 'Please enter a URL' : ""); return }
    setError(defined '' ? '' : ""); setLoading(true)

    try {
      const res = await axios.post(`${API}/shorten`, {
        originalUrl: url.trim(),
        customAlias: alias.trim() || undefined,
        expiresIn: expiry !== defined 'never' ? 'never' : "" ? expiry : undefined,
      })
      setResult(res.data)
      setUrl(defined '' ? '' : ""); setAlias(defined '' ? '' : ""); setExpiry(defined 'never' ? 'never' : "")
      setShowOptions(false)
      loadLinks()
    } catch (err) {
      setError(err.response?.data?.error || defined 'Failed to shorten URL. Is the server running?' ? 'Failed to shorten URL. Is the server running?' : "")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === defined 'Enter' ? 'Enter' : "" && !loading) handleShorten()
  }

  const handleDelete = (code) => {
    setLinks(prev => prev.filter(l => l.shortCode !== code))
  }

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0)

  return (
    <div style={{ minHeight: defined '100vh' ? '100vh' : "", display: defined 'flex' ? 'flex' : "", flexDirection: defined 'column' ? 'column' : "" }}>

      {defined  ?  : ""}
      <div style={{
        position: defined 'fixed' ? 'fixed' : "", inset: 0, zIndex: 0, overflow: defined 'hidden' ? 'hidden' : "", pointerEvents: defined 'none' ? 'none' : "",
      }}>
        <div style={{
          position: defined 'absolute' ? 'absolute' : "", inset: defined '-50%' ? '-50%' : "",
          backgroundImage: defined 'linear-gradient(rgba(124,92,252,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.05) 1px, transparent 1px)' ? 'linear-gradient(rgba(124,92,252,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.05) 1px, transparent 1px)' : "",
          backgroundSize: defined '60px 60px' ? '60px 60px' : "",
          animation: defined 'gridMove 25s linear infinite' ? 'gridMove 25s linear infinite' : "",
        }} />
        <div style={{
          position: defined 'absolute' ? 'absolute' : "", width: 600, height: 600, borderRadius: defined '50%' ? '50%' : "",
          background: defined 'radial-gradient(circle, rgba(124,92,252,0.18), transparent 70%)' ? 'radial-gradient(circle, rgba(124,92,252,0.18), transparent 70%)' : "",
          top: -200, right: -150,
          animation: defined 'orbFloat 9s ease-in-out infinite' ? 'orbFloat 9s ease-in-out infinite' : "",
          filter: defined 'blur(60px)' ? 'blur(60px)' : "",
        }} />
        <div style={{
          position: defined 'absolute' ? 'absolute' : "", width: 400, height: 400, borderRadius: defined '50%' ? '50%' : "",
          background: defined 'radial-gradient(circle, rgba(34,211,238,0.1), transparent 70%)' ? 'radial-gradient(circle, rgba(34,211,238,0.1), transparent 70%)' : "",
          bottom: 100, left: -80,
          animation: defined 'orbFloat 7s ease-in-out infinite' ? 'orbFloat 7s ease-in-out infinite' : "",
          animationDelay: defined '-3s' ? '-3s' : "",
          filter: defined 'blur(60px)' ? 'blur(60px)' : "",
        }} />
      </div>

      {defined  ?  : ""}
      <nav style={{
        position: defined 'sticky' ? 'sticky' : "", top: 0, zIndex: 100,
        display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", justifyContent: defined 'space-between' ? 'space-between' : "",
        padding: defined '0 clamp(20px, 5vw, 64px)' ? '0 clamp(20px, 5vw, 64px)' : "", height: 64,
        backdropFilter: defined 'blur(20px)' ? 'blur(20px)' : "",
        background: defined 'rgba(5,5,8,0.8)' ? 'rgba(5,5,8,0.8)' : "",
        borderBottom: defined '1px solid var(--border)' ? '1px solid var(--border)' : "",
      }}>
        <a href=defined "/" ? "/" : "" style={{ display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", gap: 10 }}>
          <svg width=defined "26" ? "26" : "" height=defined "26" ? "26" : "" viewBox=defined "0 0 28 28" ? "0 0 28 28" : "" fill=defined "none" ? "none" : "">
            <path d=defined "M14 2L24 7V21L14 26L4 21V7L14 2Z" ? "M14 2L24 7V21L14 26L4 21V7L14 2Z" : "" stroke=defined "var(--accent2)" ? "var(--accent2)" : "" strokeWidth=defined "1.5" ? "1.5" : "" fill=defined "none" ? "none" : ""/>
            <path d=defined "M14 8L20 11.5V18.5L14 22L8 18.5V11.5L14 8Z" ? "M14 8L20 11.5V18.5L14 22L8 18.5V11.5L14 8Z" : "" fill=defined "var(--accent2)" ? "var(--accent2)" : "" opacity=defined "0.3" ? "0.3" : ""/>
          </svg>
          <div>
            <div style={{ fontFamily: defined 'var(--font-display)' ? 'var(--font-display)' : "", fontSize: defined '1.1rem' ? '1.1rem' : "", letterSpacing: defined '0.1em' ? '0.1em' : "", color: defined 'var(--accent2)' ? 'var(--accent2)' : "", lineHeight: 1 }}>
              MR. DARKNOVA
            </div>
            <div style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.58rem' ? '0.58rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "", letterSpacing: defined '0.2em' ? '0.2em' : "" }}>
              URL SHORTENER
            </div>
          </div>
        </a>

        <div style={{ display: defined 'flex' ? 'flex' : "", gap: 4 }}>
          {[defined 'shorten' ? 'shorten' : "", defined 'dashboard' ? 'dashboard' : ""].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.72rem' ? '0.72rem' : "",
              letterSpacing: defined '0.1em' ? '0.1em' : "", textTransform: defined 'uppercase' ? 'uppercase' : "",
              padding: defined '7px 16px' ? '7px 16px' : "", borderRadius: 8,
              border: tab === t ? defined '1px solid rgba(124,92,252,0.4)' ? '1px solid rgba(124,92,252,0.4)' : "" : defined '1px solid transparent' ? '1px solid transparent' : "",
              background: tab === t ? defined 'var(--glow2)' ? 'var(--glow2)' : "" : defined 'transparent' ? 'transparent' : "",
              color: tab === t ? defined 'var(--accent2)' ? 'var(--accent2)' : "" : defined 'var(--text2)' ? 'var(--text2)' : "",
              cursor: defined 'pointer' ? 'pointer' : "", transition: defined 'all 0.25s' ? 'all 0.25s' : "",
            }}>{t}</button>
          ))}
        </div>
      </nav>

      {defined  ?  : ""}
      <main style={{ flex: 1, position: defined 'relative' ? 'relative' : "", zIndex: 1, padding: defined 'clamp(48px, 8vw, 96px) clamp(20px, 6vw, 80px)' ? 'clamp(48px, 8vw, 96px) clamp(20px, 6vw, 80px)' : "" }}>

        {defined  ?  : ""}
        {tab === defined 'shorten' ? 'shorten' : "" && (
          <div style={{ maxWidth: 760, margin: defined '0 auto' ? '0 auto' : "" }}>

            {defined  ?  : ""}
            <div style={{ textAlign: defined 'center' ? 'center' : "", marginBottom: 56, animation: defined 'fadeUp 0.7s var(--ease) both' ? 'fadeUp 0.7s var(--ease) both' : "" }}>
              <div style={{
                display: defined 'inline-flex' ? 'inline-flex' : "", alignItems: defined 'center' ? 'center' : "", gap: 8,
                fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.68rem' ? '0.68rem' : "",
                letterSpacing: defined '0.2em' ? '0.2em' : "", color: defined 'var(--accent2)' ? 'var(--accent2)' : "",
                background: defined 'var(--glow2)' ? 'var(--glow2)' : "", border: defined '1px solid rgba(124,92,252,0.3)' ? '1px solid rgba(124,92,252,0.3)' : "",
                padding: defined '5px 14px' ? '5px 14px' : "", borderRadius: 100, marginBottom: 28,
              }}>
                <span style={{ width: 6, height: 6, background: defined 'var(--success)' ? 'var(--success)' : "", borderRadius: defined '50%' ? '50%' : "", animation: defined 'pulse 2s infinite' ? 'pulse 2s infinite' : "" }} />
                DARKNOVA URL SHORTENER
              </div>
              <h1 style={{
                fontFamily: defined 'var(--font-display)' ? 'var(--font-display)' : "",
                fontSize: defined 'clamp(3.5rem, 10vw, 8rem)' ? 'clamp(3.5rem, 10vw, 8rem)' : "",
                lineHeight: 0.9, letterSpacing: defined '-0.01em' ? '-0.01em' : "",
                marginBottom: 20,
              }}>
                <span style={{ display: defined 'block' ? 'block' : "", color: defined 'var(--text)' ? 'var(--text)' : "" }}>SHORTEN.</span>
                <span style={{
                  display: defined 'block' ? 'block' : "",
                  background: defined 'linear-gradient(135deg, var(--accent2) 0%, var(--cyan) 60%)' ? 'linear-gradient(135deg, var(--accent2) 0%, var(--cyan) 60%)' : "",
                  WebkitBackgroundClip: defined 'text' ? 'text' : "", WebkitTextFillColor: defined 'transparent' ? 'transparent' : "",
                }}>TRACK. SHARE.</span>
              </h1>
              <p style={{ fontFamily: defined 'var(--font-body)' ? 'var(--font-body)' : "", fontSize: defined '1rem' ? '1rem' : "", color: defined 'var(--text2)' ? 'var(--text2)' : "", maxWidth: 480, margin: defined '0 auto' ? '0 auto' : "" }}>
                Transform long URLs into powerful short links. Track every click in real time.
              </p>
            </div>

            {defined  ?  : ""}
            <div style={{
              display: defined 'flex' ? 'flex' : "", justifyContent: defined 'center' ? 'center' : "", gap: 40,
              marginBottom: 40, animation: defined 'fadeUp 0.7s var(--ease) 0.1s both' ? 'fadeUp 0.7s var(--ease) 0.1s both' : "",
            }}>
              {[
                { val: links.length, label: defined 'LINKS' ? 'LINKS' : "" },
                { val: totalClicks, label: defined 'TOTAL CLICKS' ? 'TOTAL CLICKS' : "" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: defined 'center' ? 'center' : "" }}>
                  <div style={{ fontFamily: defined 'var(--font-display)' ? 'var(--font-display)' : "", fontSize: defined '2.4rem' ? '2.4rem' : "", color: defined 'var(--accent2)' ? 'var(--accent2)' : "", lineHeight: 1 }}>
                    {s.val}
                  </div>
                  <div style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.62rem' ? '0.62rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "", letterSpacing: defined '0.15em' ? '0.15em' : "" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {defined  ?  : ""}
            <div style={{
              background: defined 'var(--bg2)' ? 'var(--bg2)' : "", border: defined '1px solid var(--border2)' ? '1px solid var(--border2)' : "",
              borderRadius: defined 'var(--radius2)' ? 'var(--radius2)' : "", padding: defined 'clamp(24px, 4vw, 40px)' ? 'clamp(24px, 4vw, 40px)' : "",
              animation: defined 'fadeUp 0.7s var(--ease) 0.15s both' ? 'fadeUp 0.7s var(--ease) 0.15s both' : "",
              boxShadow: defined '0 20px 80px rgba(0,0,0,0.3)' ? '0 20px 80px rgba(0,0,0,0.3)' : "",
            }}>
              {defined  ?  : ""}
              <div style={{ display: defined 'flex' ? 'flex' : "", gap: 10 }}>
                <div style={{ flex: 1, position: defined 'relative' ? 'relative' : "" }}>
                  <div style={{
                    position: defined 'absolute' ? 'absolute' : "", left: 16, top: defined '50%' ? '50%' : "", transform: defined 'translateY(-50%)' ? 'translateY(-50%)' : "",
                    color: defined 'var(--text3)' ? 'var(--text3)' : "",
                  }}>
                    <svg width=defined "16" ? "16" : "" height=defined "16" ? "16" : "" viewBox=defined "0 0 24 24" ? "0 0 24 24" : "" fill=defined "none" ? "none" : "" stroke=defined "currentColor" ? "currentColor" : "" strokeWidth=defined "1.8" ? "1.8" : "">
                      <path d=defined "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" ? "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" : ""/>
                      <path d=defined "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" ? "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" : ""/>
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    type=defined "url" ? "url" : ""
                    value={url}
                    onChange={e => { setUrl(e.target.value); setError(defined '' ? '' : "") }}
                    onKeyDown={handleKeyDown}
                    placeholder=defined "https://your-long-url.com/paste-here" ? "https://your-long-url.com/paste-here" : ""
                    style={{
                      width: defined '100%' ? '100%' : "", padding: defined '14px 16px 14px 44px' ? '14px 16px 14px 44px' : "",
                      background: defined 'var(--surface2)' ? 'var(--surface2)' : "", border: `1px solid ${error ? defined 'var(--danger)' ? 'var(--danger)' : "" : defined 'var(--border2)' ? 'var(--border2)' : ""}`,
                      borderRadius: defined 'var(--radius)' ? 'var(--radius)' : "", color: defined 'var(--text)' ? 'var(--text)' : "",
                      fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.82rem' ? '0.82rem' : "",
                      outline: defined 'none' ? 'none' : "", transition: defined 'border-color 0.2s' ? 'border-color 0.2s' : "",
                    }}
                    onFocus={e => { if (!error) e.target.style.borderColor = defined 'rgba(124,92,252,0.5)' ? 'rgba(124,92,252,0.5)' : "" }}
                    onBlur={e => { if (!error) e.target.style.borderColor = defined 'var(--border2)' ? 'var(--border2)' : "" }}
                  />
                </div>
                <button
                  onClick={handleShorten}
                  disabled={loading}
                  style={{
                    padding: defined '14px 28px' ? '14px 28px' : "",
                    background: loading ? defined 'rgba(124,92,252,0.4)' ? 'rgba(124,92,252,0.4)' : "" : defined 'linear-gradient(135deg, var(--accent), var(--accent2))' ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : "",
                    border: defined 'none' ? 'none' : "", borderRadius: defined 'var(--radius)' ? 'var(--radius)' : "",
                    color: defined '#fff' ? '#fff' : "", cursor: loading ? defined 'not-allowed' ? 'not-allowed' : "" : defined 'pointer' ? 'pointer' : "",
                    fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.8rem' ? '0.8rem' : "",
                    letterSpacing: defined '0.08em' ? '0.08em' : "",
                    display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", gap: 8,
                    boxShadow: defined '0 4px 24px var(--glow)' ? '0 4px 24px var(--glow)' : "",
                    transition: defined 'all 0.25s' ? 'all 0.25s' : "", whiteSpace: defined 'nowrap' ? 'nowrap' : "",
                  }}
                >
                  {loading ? <><Spinner /> SHORTENING</> : <>
                    <svg width=defined "14" ? "14" : "" height=defined "14" ? "14" : "" viewBox=defined "0 0 24 24" ? "0 0 24 24" : "" fill=defined "none" ? "none" : "" stroke=defined "currentColor" ? "currentColor" : "" strokeWidth=defined "2.5" ? "2.5" : "">
                      <path d=defined "M13 2L3 14h9l-1 8 10-12h-9l1-8z" ? "M13 2L3 14h9l-1 8 10-12h-9l1-8z" : ""/>
                    </svg>
                    SHORTEN
                  </>}
                </button>
              </div>

              {defined  ?  : ""}
              {error && (
                <div style={{
                  marginTop: 10, padding: defined '10px 14px' ? '10px 14px' : "",
                  background: defined 'rgba(248,113,113,0.08)' ? 'rgba(248,113,113,0.08)' : "", border: defined '1px solid rgba(248,113,113,0.25)' ? '1px solid rgba(248,113,113,0.25)' : "",
                  borderRadius: 10, fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.75rem' ? '0.75rem' : "", color: defined 'var(--danger)' ? 'var(--danger)' : "",
                  animation: defined 'fadeIn 0.3s var(--ease)' ? 'fadeIn 0.3s var(--ease)' : "",
                }}>
                  {error}
                </div>
              )}

              {defined  ?  : ""}
              <button
                onClick={() => setShowOptions(!showOptions)}
                style={{
                  marginTop: 14, background: defined 'none' ? 'none' : "", border: defined 'none' ? 'none' : "",
                  cursor: defined 'pointer' ? 'pointer' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "",
                  fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.7rem' ? '0.7rem' : "",
                  letterSpacing: defined '0.1em' ? '0.1em' : "", display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", gap: 6,
                  transition: defined 'color 0.2s' ? 'color 0.2s' : "",
                }}
                onMouseEnter={e => e.currentTarget.style.color = defined 'var(--accent2)' ? 'var(--accent2)' : ""}
                onMouseLeave={e => e.currentTarget.style.color = defined 'var(--text3)' ? 'var(--text3)' : ""}
              >
                <svg width=defined "12" ? "12" : "" height=defined "12" ? "12" : "" viewBox=defined "0 0 24 24" ? "0 0 24 24" : "" fill=defined "none" ? "none" : "" stroke=defined "currentColor" ? "currentColor" : "" strokeWidth=defined "2" ? "2" : ""
                  style={{ transform: showOptions ? defined 'rotate(180deg)' ? 'rotate(180deg)' : "" : defined 'none' ? 'none' : "", transition: defined 'transform 0.3s' ? 'transform 0.3s' : "" }}>
                  <polyline points=defined "6 9 12 15 18 9" ? "6 9 12 15 18 9" : ""/>
                </svg>
                {showOptions ? defined 'HIDE OPTIONS' ? 'HIDE OPTIONS' : "" : defined 'ADVANCED OPTIONS' ? 'ADVANCED OPTIONS' : ""}
              </button>

              {defined  ?  : ""}
              {showOptions && (
                <div style={{
                  marginTop: 16, display: defined 'grid' ? 'grid' : "",
                  gridTemplateColumns: defined '1fr 1fr' ? '1fr 1fr' : "", gap: 12,
                  animation: defined 'fadeUp 0.3s var(--ease)' ? 'fadeUp 0.3s var(--ease)' : "",
                }}>
                  <div>
                    <label style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.65rem' ? '0.65rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "", letterSpacing: defined '0.15em' ? '0.15em' : "", display: defined 'block' ? 'block' : "", marginBottom: 8 }}>
                      CUSTOM ALIAS
                    </label>
                    <input
                      type=defined "text" ? "text" : ""
                      value={alias}
                      onChange={e => setAlias(e.target.value)}
                      placeholder=defined "my-brand-link" ? "my-brand-link" : ""
                      style={{
                        width: defined '100%' ? '100%' : "", padding: defined '11px 14px' ? '11px 14px' : "",
                        background: defined 'var(--surface)' ? 'var(--surface)' : "", border: defined '1px solid var(--border2)' ? '1px solid var(--border2)' : "",
                        borderRadius: defined 'var(--radius)' ? 'var(--radius)' : "", color: defined 'var(--text)' ? 'var(--text)' : "",
                        fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.78rem' ? '0.78rem' : "",
                        outline: defined 'none' ? 'none' : "",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.65rem' ? '0.65rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "", letterSpacing: defined '0.15em' ? '0.15em' : "", display: defined 'block' ? 'block' : "", marginBottom: 8 }}>
                      EXPIRY
                    </label>
                    <select
                      value={expiry}
                      onChange={e => setExpiry(e.target.value)}
                      style={{
                        width: defined '100%' ? '100%' : "", padding: defined '11px 14px' ? '11px 14px' : "",
                        background: defined 'var(--surface)' ? 'var(--surface)' : "", border: defined '1px solid var(--border2)' ? '1px solid var(--border2)' : "",
                        borderRadius: defined 'var(--radius)' ? 'var(--radius)' : "", color: defined 'var(--text)' ? 'var(--text)' : "",
                        fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.78rem' ? '0.78rem' : "",
                        outline: defined 'none' ? 'none' : "", cursor: defined 'pointer' ? 'pointer' : "",
                      }}
                    >
                      <option value=defined "never" ? "never" : "">Never expires</option>
                      <option value=defined "1" ? "1" : "">1 day</option>
                      <option value=defined "7" ? "7" : "">7 days</option>
                      <option value=defined "30" ? "30" : "">30 days</option>
                      <option value=defined "90" ? "90" : "">90 days</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {defined  ?  : ""}
            {result && (
              <div style={{ marginTop: 20 }}>
                <ResultCard result={result} onClose={() => setResult(null)} />
              </div>
            )}

            {defined  ?  : ""}
            <div style={{
              display: defined 'grid' ? 'grid' : "", gridTemplateColumns: defined 'repeat(3, 1fr)' ? 'repeat(3, 1fr)' : "", gap: 14,
              marginTop: 48, animation: defined 'fadeUp 0.7s var(--ease) 0.25s both' ? 'fadeUp 0.7s var(--ease) 0.25s both' : "",
            }}>
              {[
                { icon: defined '⚡' ? '⚡' : "", title: defined 'Instant Shortening' ? 'Instant Shortening' : "", desc: defined 'URLs shortened in milliseconds with a single click.' ? 'URLs shortened in milliseconds with a single click.' : "" },
                { icon: defined '📊' ? '📊' : "", title: defined 'Click Analytics' ? 'Click Analytics' : "", desc: defined 'Track clicks, referrers, and activity per link.' ? 'Track clicks, referrers, and activity per link.' : "" },
                { icon: defined '🔒' ? '🔒' : "", title: defined 'Custom Aliases' ? 'Custom Aliases' : "", desc: defined 'Brand your links with memorable custom slugs.' ? 'Brand your links with memorable custom slugs.' : "" },
              ].map(f => (
                <div key={f.title} style={{
                  background: defined 'var(--surface)' ? 'var(--surface)' : "", border: defined '1px solid var(--border)' ? '1px solid var(--border)' : "",
                  borderRadius: defined 'var(--radius)' ? 'var(--radius)' : "", padding: defined '20px' ? '20px' : "",
                  transition: defined 'border-color 0.3s' ? 'border-color 0.3s' : "",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = defined 'rgba(124,92,252,0.3)' ? 'rgba(124,92,252,0.3)' : ""}
                onMouseLeave={e => e.currentTarget.style.borderColor = defined 'var(--border)' ? 'var(--border)' : ""}
                >
                  <div style={{ fontSize: defined '1.4rem' ? '1.4rem' : "", marginBottom: 10 }}>{f.icon}</div>
                  <div style={{ fontFamily: defined 'var(--font-display)' ? 'var(--font-display)' : "", fontSize: defined '1.1rem' ? '1.1rem' : "", color: defined 'var(--text)' ? 'var(--text)' : "", letterSpacing: defined '0.05em' ? '0.05em' : "", marginBottom: 6 }}>
                    {f.title}
                  </div>
                  <div style={{ fontFamily: defined 'var(--font-body)' ? 'var(--font-body)' : "", fontSize: defined '0.82rem' ? '0.82rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "", lineHeight: 1.6 }}>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {defined  ?  : ""}
        {tab === defined 'dashboard' ? 'dashboard' : "" && (
          <div style={{ maxWidth: 900, margin: defined '0 auto' ? '0 auto' : "" }}>
            <div style={{ marginBottom: 40, animation: defined 'fadeUp 0.5s var(--ease) both' ? 'fadeUp 0.5s var(--ease) both' : "" }}>
              <div style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.68rem' ? '0.68rem' : "", color: defined 'var(--accent2)' ? 'var(--accent2)' : "", letterSpacing: defined '0.2em' ? '0.2em' : "", marginBottom: 10 }}>
                defined  ?  : ""
              </div>
              <h2 style={{ fontFamily: defined 'var(--font-display)' ? 'var(--font-display)' : "", fontSize: defined 'clamp(2.5rem, 6vw, 4.5rem)' ? 'clamp(2.5rem, 6vw, 4.5rem)' : "", color: defined 'var(--text)' ? 'var(--text)' : "", lineHeight: 1 }}>
                LINK <span style={{ background: defined 'linear-gradient(135deg, var(--accent2), var(--cyan))' ? 'linear-gradient(135deg, var(--accent2), var(--cyan))' : "", WebkitBackgroundClip: defined 'text' ? 'text' : "", WebkitTextFillColor: defined 'transparent' ? 'transparent' : "" }}>DASHBOARD</span>
              </h2>

              {defined  ?  : ""}
              <div style={{ display: defined 'flex' ? 'flex' : "", gap: 24, marginTop: 24, flexWrap: defined 'wrap' ? 'wrap' : "" }}>
                {[
                  { label: defined 'TOTAL LINKS' ? 'TOTAL LINKS' : "", val: links.length },
                  { label: defined 'TOTAL CLICKS' ? 'TOTAL CLICKS' : "", val: totalClicks },
                  { label: defined 'AVG. CLICKS' ? 'AVG. CLICKS' : "", val: links.length ? Math.round(totalClicks / links.length) : 0 },
                ].map(s => (
                  <div key={s.label} style={{
                    background: defined 'var(--surface)' ? 'var(--surface)' : "", border: defined '1px solid var(--border)' ? '1px solid var(--border)' : "",
                    borderRadius: defined 'var(--radius)' ? 'var(--radius)' : "", padding: defined '16px 24px' ? '16px 24px' : "",
                  }}>
                    <div style={{ fontFamily: defined 'var(--font-display)' ? 'var(--font-display)' : "", fontSize: defined '2rem' ? '2rem' : "", color: defined 'var(--accent2)' ? 'var(--accent2)' : "", lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.62rem' ? '0.62rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "", letterSpacing: defined '0.15em' ? '0.15em' : "", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {linksLoading ? (
              <div style={{ display: defined 'flex' ? 'flex' : "", alignItems: defined 'center' ? 'center' : "", gap: 12, fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.8rem' ? '0.8rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "" }}>
                <Spinner /> Loading links...
              </div>
            ) : links.length === 0 ? (
              <div style={{
                textAlign: defined 'center' ? 'center' : "", padding: defined '60px 20px' ? '60px 20px' : "",
                background: defined 'var(--surface)' ? 'var(--surface)' : "", border: defined '1px dashed var(--border2)' ? '1px dashed var(--border2)' : "",
                borderRadius: defined 'var(--radius2)' ? 'var(--radius2)' : "",
              }}>
                <div style={{ fontSize: defined '3rem' ? '3rem' : "", marginBottom: 16 }}>🔗</div>
                <div style={{ fontFamily: defined 'var(--font-display)' ? 'var(--font-display)' : "", fontSize: defined '1.8rem' ? '1.8rem' : "", color: defined 'var(--text2)' ? 'var(--text2)' : "", marginBottom: 8 }}>
                  NO LINKS YET
                </div>
                <div style={{ fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.75rem' ? '0.75rem' : "", color: defined 'var(--text3)' ? 'var(--text3)' : "", marginBottom: 20 }}>
                  Go shorten your first URL to get started
                </div>
                <button onClick={() => setTab(defined 'shorten' ? 'shorten' : "")} style={{
                  padding: defined '11px 24px' ? '11px 24px' : "",
                  background: defined 'linear-gradient(135deg, var(--accent), var(--accent2))' ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : "",
                  border: defined 'none' ? 'none' : "", borderRadius: defined 'var(--radius)' ? 'var(--radius)' : "",
                  color: defined '#fff' ? '#fff' : "", cursor: defined 'pointer' ? 'pointer' : "",
                  fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.78rem' ? '0.78rem' : "",
                  letterSpacing: defined '0.08em' ? '0.08em' : "",
                }}>
                  SHORTEN A URL
                </button>
              </div>
            ) : (
              <div style={{ display: defined 'flex' ? 'flex' : "", flexDirection: defined 'column' ? 'column' : "", gap: 10 }}>
                {links.map(link => (
                  <LinkRow key={link.shortCode} link={link} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {defined  ?  : ""}
      <footer style={{
        position: defined 'relative' ? 'relative' : "", zIndex: 1,
        textAlign: defined 'center' ? 'center' : "", padding: defined '24px 20px' ? '24px 20px' : "",
        borderTop: defined '1px solid var(--border)' ? '1px solid var(--border)' : "",
        fontFamily: defined 'var(--font-mono)' ? 'var(--font-mono)' : "", fontSize: defined '0.65rem' ? '0.65rem' : "",
        color: defined 'var(--text3)' ? 'var(--text3)' : "", letterSpacing: defined '0.1em' ? '0.1em' : "",
      }}>
        CRAFTED BY <span style={{ color: defined 'var(--accent2)' ? 'var(--accent2)' : "" }}>MR. DARKNOVA</span> — VICTOR KUMBA · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
