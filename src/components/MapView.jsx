import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchNearbyFountains } from '../lib/overpass'
import { isSupabaseEnabled } from '../lib/supabase'
import { isRateable, summarize, fetchSummaries, fetchMyRatings, saveRating } from '../lib/ratings'
import { useAuth } from '../state/AuthContext'
import FountainRating from './FountainRating'
import seedLocations from '../data/seedLocations.json'
import partners from '../data/partners.json'

const DEFAULT_CENTER = [35.7796, -78.6382]

export const BROKEN_COLOR = '#a3a8a5'

export const TYPE_COLORS = {
  fountain: '#2f93cf',
  refill_station: '#0e9f6e',
  store: '#7c6cf0',
  cafe: '#d9892f',
  partner: '#0a7d57',
}

export const TYPE_LABELS = {
  fountain: 'Fountain',
  refill_station: 'Refill station',
  store: 'Eco store',
  cafe: 'Cafe',
  partner: 'Partner',
}

const iconCache = new Map()

function pinIcon(type, broken) {
  const color = broken ? BROKEN_COLOR : TYPE_COLORS[type] || '#71776f'
  if (!iconCache.has(color)) {
    iconCache.set(color, L.divIcon({
      html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.35)"></span>`,
      className: 'bg-transparent',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    }))
  }
  return iconCache.get(color)
}

function FlyTo({ center }) {
  const map = useMap()
  useEffect(() => { map.flyTo(center, 14) }, [center, map])
  return null
}

export default function MapView() {
  const { user } = useAuth()
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [locations, setLocations] = useState([...seedLocations, ...partners])
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState({})
  const [mine, setMine] = useState({ userId: null, ratings: {} })

  const rateableIds = useMemo(() => locations.filter(isRateable).map(l => l.id), [locations])
  const myRatings = user && mine.userId === user.id ? mine.ratings : {}

  useEffect(() => {
    let cancelled = false
    fetchSummaries(rateableIds).then(s => { if (!cancelled) setSummaries(s) })
    return () => { cancelled = true }
  }, [rateableIds])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    fetchMyRatings(user.id).then(ratings => { if (!cancelled) setMine({ userId: user.id, ratings }) })
    return () => { cancelled = true }
  }, [user])

  async function handleSave(fountainId, rating) {
    await saveRating(user.id, fountainId, rating)
    setMine(prev => ({
      userId: user.id,
      ratings: { ...(prev.userId === user.id ? prev.ratings : {}), [fountainId]: rating },
    }))
    const fresh = await fetchSummaries([fountainId])
    setSummaries(prev => ({ ...prev, ...fresh }))
  }

  useEffect(() => {
    let cancelled = false

    async function addFountains(lat, lng) {
      try {
        const fountains = await fetchNearbyFountains(lat, lng)
        if (cancelled) return
        setLocations(prev => {
          const ids = new Set(prev.map(l => l.id))
          return [...prev, ...fountains.filter(f => !ids.has(f.id))]
        })
      } catch { void 0 }
      if (!cancelled) setLoading(false)
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return
        setCenter([pos.coords.latitude, pos.coords.longitude])
        addFountains(pos.coords.latitude, pos.coords.longitude)
      },
      () => addFountains(DEFAULT_CENTER[0], DEFAULT_CENTER[1]),
      { timeout: 8000, maximumAge: 300000 }
    )

    return () => { cancelled = true }
  }, [])

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-surface border border-line px-3 py-1.5 rounded-full shadow-sm text-xs font-medium text-muted">
          Finding refill points near you…
        </div>
      )}
      <MapContainer center={center} zoom={13} className="h-full w-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyTo center={center} />
        {locations.map(loc => {
          const rateable = isRateable(loc)
          const broken = rateable && summarize(summaries[loc.id]).status === 'broken'
          return (
            <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={pinIcon(loc.type, broken)}>
              <Popup>
                {rateable ? (
                  <FountainRating
                    loc={loc}
                    typeLabel={TYPE_LABELS[loc.type] || loc.type}
                    summary={summaries[loc.id]}
                    mine={myRatings[loc.id]}
                    canRate={isSupabaseEnabled}
                    signedIn={!!user}
                    onSave={rating => handleSave(loc.id, rating)}
                  />
                ) : (
                  <>
                    <span style={{ fontWeight: 600 }}>{loc.name}</span><br />
                    <span style={{ fontSize: 12, color: '#71776f' }}>{TYPE_LABELS[loc.type] || loc.type}</span>
                    {loc.perk && <><br /><span style={{ fontSize: 12, color: '#0a7d57' }}>{loc.perk}</span></>}
                    {loc.address && <><br /><span style={{ fontSize: 12 }}>{loc.address}</span></>}
                  </>
                )}
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
