import { useState } from 'react'
import { Link } from 'react-router-dom'
import { summarize } from '../lib/ratings'

const C = {
  ink: '#15181a',
  muted: '#71776f',
  accent: '#0e9f6e',
  warn: '#d9892f',
  line: '#ebedec',
  broken: '#a3a8a5',
  unrated: '#c9cdca',
}

const STATUS_COLORS = {
  unrated: C.unrated,
  broken: C.broken,
  works: C.accent,
  good: C.accent,
  gross: C.warn,
}

const SAVE_MESSAGES = {
  saving: 'Saving…',
  saved: 'Saved. Thanks for rating!',
  error: "Couldn't save. Try again.",
}

function Choice({ active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      style={{
        flex: 1,
        padding: '6px 0',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? 'default' : 'pointer',
        border: `1px solid ${active ? C.accent : C.line}`,
        background: active ? C.accent : '#fff',
        color: active ? '#fff' : C.ink,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  )
}

export default function FountainRating({ loc, typeLabel, summary, mine, canRate, signedIn, onSave }) {
  const [draft, setDraft] = useState({})
  const [saveState, setSaveState] = useState('idle')
  const info = summarize(summary)
  const value = { ...mine, ...draft }
  const saving = saveState === 'saving'

  async function choose(next) {
    const rating = { works: value.works, wouldDrink: value.wouldDrink, ...next }
    if (rating.works === false) rating.wouldDrink = null
    setDraft(rating)
    setSaveState('saving')
    try {
      await onSave(rating)
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  return (
    <div style={{ minWidth: 200 }}>
      <span style={{ fontWeight: 600, color: C.ink }}>{loc.name}</span><br />
      <span style={{ fontSize: 12, color: C.muted }}>{typeLabel}</span>
      {loc.address && <><br /><span style={{ fontSize: 12 }}>{loc.address}</span></>}

      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.ink }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[info.status], flexShrink: 0 }} />
        {info.label}
      </div>
      {info.count > 0 && (
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
          {info.count} rating{info.count === 1 ? '' : 's'}
          {info.lastRated && ` · last checked ${info.lastRated.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
        </div>
      )}

      {canRate && (signedIn ? (
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.ink, marginBottom: 5 }}>Does it work?</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Choice active={value.works === true} disabled={saving} onClick={() => choose({ works: true })}>Works</Choice>
            <Choice active={value.works === false} disabled={saving} onClick={() => choose({ works: false })}>Broken</Choice>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: value.works === true ? C.ink : C.muted, margin: '8px 0 5px' }}>
            Would you drink from it?
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Choice active={value.wouldDrink === true} disabled={saving || value.works !== true} onClick={() => choose({ wouldDrink: true })}>Yes</Choice>
            <Choice active={value.wouldDrink === false} disabled={saving || value.works !== true} onClick={() => choose({ wouldDrink: false })}>Gross</Choice>
          </div>
          <div role="status" style={{ fontSize: 11, marginTop: 6, minHeight: 15, color: saveState === 'error' ? C.warn : C.muted }}>
            {saveState === 'idle' ? '' : SAVE_MESSAGES[saveState]}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 8, fontSize: 12 }}>
          <Link to="/auth" style={{ color: C.accent, fontWeight: 600 }}>Sign in</Link> to rate this fountain
        </div>
      ))}
    </div>
  )
}
