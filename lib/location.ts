'use client'

const STORAGE_KEY = 'yestertoday.lastLocation'

export type SavedLocation = {
  lat: number
  lon: number
  label?: string
  savedAt: string // ISO
}

export type LocationResult =
  | { kind: 'ready'; location: SavedLocation; isFresh: boolean }
  | { kind: 'denied' }
  | { kind: 'unavailable' }
  | { kind: 'loading' }

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
    // storage quota exceeded — silently ignore
  }
}

export function requestCurrentLocation(): Promise<SavedLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('unavailable'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: SavedLocation = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          savedAt: new Date().toISOString(),
        }
        saveLocation(loc)
        resolve(loc)
      },
      (err) => {
        reject(err.code === err.PERMISSION_DENIED ? new Error('denied') : new Error('unavailable'))
      },
      { timeout: 8000, enableHighAccuracy: false },
    )
  })
}

/*
Usage pattern in a client component:

useEffect(() => {
  const cached = getCachedLocation()
  if (cached) setLocation({ kind: 'ready', location: cached, isFresh: false })

  requestCurrentLocation()
    .then((loc) => setLocation({ kind: 'ready', location: loc, isFresh: true }))
    .catch((err) => {
      const kind = err.message === 'denied' ? 'denied' : 'unavailable'
      if (!cached) setLocation({ kind })
      // else: keep cached data, show banner
    })
}, [])
*/
