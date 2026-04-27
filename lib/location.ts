'use client'

const STORAGE_KEY = 'yt.lastLocation'

// Seoul default fallback
const DEFAULT_LOCATION: SavedLocation = {
  lat: 37.5665,
  lon: 126.978,
  label: '서울',
  savedAt: new Date(0).toISOString(),
}

export type SavedLocation = {
  lat: number
  lon: number
  label: string
  savedAt: string // ISO
}

export function getCachedLocation(): SavedLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedLocation) : null
  } catch {
    return null
  }
}

export function saveLocation(loc: SavedLocation): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc))
  } catch {
    // quota exceeded
  }
}

// Reverse geocode via Open-Meteo geocoding API
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('lat', String(lat))
    url.searchParams.set('lon', String(lon))
    url.searchParams.set('format', 'json')
    url.searchParams.set('zoom', '14')
    url.searchParams.set('accept-language', 'ko')

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': 'YesterToday/1.0' },
    })
    if (!res.ok) return '현재 위치'

    const json = await res.json()
    const addr = json.address ?? {}

    // Build "동 · 시" style label
    const dong = addr.suburb ?? addr.neighbourhood ?? addr.quarter ?? addr.village ?? ''
    const city = addr.city ?? addr.town ?? addr.county ?? ''

    if (dong && city) return `${dong} · ${city}`
    return city || dong || '현재 위치'
  } catch {
    return '현재 위치'
  }
}

export async function getCurrentLocation(): Promise<SavedLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('unavailable'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        const label = await reverseGeocode(lat, lon)
        const loc: SavedLocation = { lat, lon, label, savedAt: new Date().toISOString() }
        saveLocation(loc)
        resolve(loc)
      },
      (err) => {
        reject(err.code === err.PERMISSION_DENIED ? new Error('denied') : new Error('unavailable'))
      },
      { timeout: 8000, enableHighAccuracy: false }
    )
  })
}

export function getLocationOrDefault(): SavedLocation {
  return getCachedLocation() ?? DEFAULT_LOCATION
}

// Legacy alias
export const requestCurrentLocation = getCurrentLocation
