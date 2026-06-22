const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

export async function fetchNearbyFountains(lat, lng, radiusMeters = 3000) {
  const query = `
    [out:json][timeout:10];
    (
      node["amenity"="drinking_water"](around:${radiusMeters},${lat},${lng});
      node["man_made"="water_tap"]["drinking_water"="yes"](around:${radiusMeters},${lat},${lng});
    );
    out body;
  `

  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  if (!res.ok) throw new Error('Overpass API error')

  const data = await res.json()

  return data.elements.map(el => ({
    id: `osm_${el.id}`,
    name: el.tags?.name || el.tags?.description || 'Water Fountain',
    type: 'fountain',
    lat: el.lat,
    lng: el.lon,
    source: 'osm',
    verified: true,
  }))
}
