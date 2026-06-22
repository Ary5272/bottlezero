import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchNearbyFountains } from '../lib/overpass'
import seedLocations from '../data/seedLocations.json'
import partners from '../data/partners.json'

const DEFAULT_CENTER = [35.7796, -78.6382]

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

function pinIcon(type) {
  const color = TYPE_COLORS[type] || '#71776f'
  return L.divIcon({
    html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.35)"></span>`,
    className: 'bg-transparent',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

function FlyTo({ center }) {
  const map = useMap()
  useEffect(() => { map.flyTo(center, 14) }, [center, map])
  return null
}

export default function MapView() {
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [locations, setLocations] = useState([...seedLocations, ...partners])
  const [loading, setLoading] = useState(true)

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
        {locations.map(loc => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={pinIcon(loc.type)}>
            <Popup>
              <span style={{ fontWeight: 600 }}>{loc.name}</span><br />
              <span style={{ fontSize: 12, color: '#71776f' }}>{TYPE_LABELS[loc.type] || loc.type}</span>
              {loc.perk && <><br /><span style={{ fontSize: 12, color: '#0a7d57' }}>{loc.perk}</span></>}
              {loc.address && <><br /><span style={{ fontSize: 12 }}>{loc.address}</span></>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
