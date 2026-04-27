import type { WeatherComparison } from './types'

const CACHE_KEY = 'yt.lastWeather'

export function saveLastWeather(payload: WeatherComparison): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    // quota exceeded — silently ignore
  }
}

export function loadLastWeather(): WeatherComparison | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as WeatherComparison) : null
  } catch {
    return null
  }
}
