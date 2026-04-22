// Usage:
//   import { getCurrentWeather, getYesterdayWeather } from '@/lib/weather'
//   const today = await getCurrentWeather(37.5665, 126.9780)
//   const yesterday = await getYesterdayWeather(37.5665, 126.9780)

import type { WeatherSnapshot, WeatherError } from '@/types/weather'

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast'
const ARCHIVE_BASE = 'https://archive-api.open-meteo.com/v1/archive'

const CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'wind_speed_10m',
  'wind_gusts_10m',
  'precipitation',
  'relative_humidity_2m',
  'weather_code',
].join(',')

const HOURLY_FIELDS = CURRENT_FIELDS

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

async function safeFetch(url: string): Promise<unknown> {
  let res: Response
  try {
    res = await fetch(url)
  } catch {
    const err: WeatherError = { kind: 'network' }
    throw err
  }
  if (!res.ok) {
    const err: WeatherError = { kind: 'api-error', status: res.status }
    throw err
  }
  return res.json()
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherSnapshot> {
  if (!isFinite(lat) || !isFinite(lon)) {
    const err: WeatherError = { kind: 'invalid-location' }
    throw err
  }

  const url = new URL(FORECAST_BASE)
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('current', CURRENT_FIELDS)
  url.searchParams.set('wind_speed_unit', 'ms')
  url.searchParams.set('timezone', 'auto')

  const data = await safeFetch(url.toString()) as {
    current: {
      time: string
      temperature_2m: number
      apparent_temperature: number
      wind_speed_10m: number
      wind_gusts_10m: number
      precipitation: number
      relative_humidity_2m: number
      weather_code: number
    }
  }

  const c = data.current
  return {
    tempC: c.temperature_2m,
    feelsLikeC: c.apparent_temperature,
    windMs: c.wind_speed_10m,
    windGustMs: c.wind_gusts_10m,
    precipitationMm: c.precipitation,
    humidityPct: c.relative_humidity_2m,
    weatherCode: c.weather_code,
    timestamp: c.time,
  }
}

export async function getYesterdayWeather(lat: number, lon: number): Promise<WeatherSnapshot> {
  if (!isFinite(lat) || !isFinite(lon)) {
    const err: WeatherError = { kind: 'invalid-location' }
    throw err
  }

  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const yesterdayStr = toDateString(yesterday)
  const targetHour = now.getHours()

  // Try archive API first
  const archiveSnapshot = await tryArchive(lat, lon, yesterdayStr, targetHour)
  if (archiveSnapshot) return archiveSnapshot

  // Fallback: forecast API with past_days=1
  return getForecastPastDay(lat, lon, targetHour)
}

async function tryArchive(
  lat: number,
  lon: number,
  dateStr: string,
  targetHour: number,
): Promise<WeatherSnapshot | null> {
  const url = new URL(ARCHIVE_BASE)
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('start_date', dateStr)
  url.searchParams.set('end_date', dateStr)
  url.searchParams.set('hourly', HOURLY_FIELDS)
  url.searchParams.set('wind_speed_unit', 'ms')
  url.searchParams.set('timezone', 'auto')

  let data: {
    hourly: {
      time: string[]
      temperature_2m: number[]
      apparent_temperature: number[]
      wind_speed_10m: number[]
      wind_gusts_10m: number[]
      precipitation: number[]
      relative_humidity_2m: number[]
      weather_code: number[]
    }
  }

  try {
    data = await safeFetch(url.toString()) as typeof data
  } catch {
    return null
  }

  const times = data.hourly.time
  if (!times || times.length === 0) return null

  // Find the index closest to targetHour
  let idx = times.findIndex((t) => new Date(t).getHours() === targetHour)
  if (idx === -1) idx = Math.min(targetHour, times.length - 1)

  // Archive may have null values for recent hours
  if (data.hourly.temperature_2m[idx] == null) return null

  const h = data.hourly
  return {
    tempC: h.temperature_2m[idx],
    feelsLikeC: h.apparent_temperature[idx],
    windMs: h.wind_speed_10m[idx],
    windGustMs: h.wind_gusts_10m[idx],
    precipitationMm: h.precipitation[idx],
    humidityPct: h.relative_humidity_2m[idx],
    weatherCode: h.weather_code[idx],
    timestamp: h.time[idx],
  }
}

async function getForecastPastDay(
  lat: number,
  lon: number,
  targetHour: number,
): Promise<WeatherSnapshot> {
  const url = new URL(FORECAST_BASE)
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('hourly', HOURLY_FIELDS)
  url.searchParams.set('past_days', '1')
  url.searchParams.set('forecast_days', '0')
  url.searchParams.set('wind_speed_unit', 'ms')
  url.searchParams.set('timezone', 'auto')

  const data = await safeFetch(url.toString()) as {
    hourly: {
      time: string[]
      temperature_2m: number[]
      apparent_temperature: number[]
      wind_speed_10m: number[]
      wind_gusts_10m: number[]
      precipitation: number[]
      relative_humidity_2m: number[]
      weather_code: number[]
    }
  }

  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const yesterdayDate = toDateString(yesterday)

  const times = data.hourly.time
  let idx = times.findIndex(
    (t) => t.startsWith(yesterdayDate) && new Date(t).getHours() === targetHour,
  )
  if (idx === -1) {
    idx = times.findLastIndex((t) => t.startsWith(yesterdayDate))
  }
  if (idx === -1) {
    const err: WeatherError = { kind: 'api-error', status: 0 }
    throw err
  }

  const h = data.hourly
  return {
    tempC: h.temperature_2m[idx],
    feelsLikeC: h.apparent_temperature[idx],
    windMs: h.wind_speed_10m[idx],
    windGustMs: h.wind_gusts_10m[idx],
    precipitationMm: h.precipitation[idx],
    humidityPct: h.relative_humidity_2m[idx],
    weatherCode: h.weather_code[idx],
    timestamp: h.time[idx],
  }
}
