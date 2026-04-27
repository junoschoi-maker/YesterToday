import type { WeatherSnapshot, SunTimes, HourPoint, WeatherComparison } from './types'
import { codeForHour, injectSunEvents } from './derive'
import type { WeatherCode } from './types'

const BASE = 'https://api.open-meteo.com/v1'
const HIST = 'https://historical-forecast-api.open-meteo.com/v1'

// ── Current conditions ────────────────────────────────────────
export async function fetchCurrent(lat: number, lon: number): Promise<WeatherSnapshot> {
  const url = new URL(`${BASE}/forecast`)
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code,is_day'
  )
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString(), { next: { revalidate: 600 } })
  if (!res.ok) throw new Error(`Open-Meteo current: ${res.status}`)
  const json = await res.json()
  const c = json.current

  return {
    tempC: Math.round(c.temperature_2m),
    feelsLikeC: Math.round(c.apparent_temperature),
    windMs: Math.round(c.wind_speed_10m * 10) / 10,
    precipitationMm: Math.round(c.precipitation * 10) / 10,
    weatherCode: codeForHour(c.weather_code, c.is_day === 1),
  }
}

// ── Yesterday same hour ───────────────────────────────────────
export async function fetchYesterdaySameHour(lat: number, lon: number): Promise<WeatherSnapshot> {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const ymd = yesterday.toISOString().split('T')[0]

  const url = new URL(`${HIST}/forecast`)
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('start_date', ymd)
  url.searchParams.set('end_date', ymd)
  url.searchParams.set(
    'hourly',
    'temperature_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code,is_day'
  )
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString(), { next: { revalidate: 600 } })
  if (!res.ok) throw new Error(`Open-Meteo history: ${res.status}`)
  const json = await res.json()

  const currentHour = now.getHours()
  const h = json.hourly

  return {
    tempC: Math.round(h.temperature_2m[currentHour]),
    feelsLikeC: Math.round(h.apparent_temperature[currentHour]),
    windMs: Math.round(h.wind_speed_10m[currentHour] * 10) / 10,
    precipitationMm: Math.round(h.precipitation[currentHour] * 10) / 10,
    weatherCode: codeForHour(h.weather_code[currentHour], h.is_day[currentHour] === 1),
  }
}

// ── Sunrise / Sunset ──────────────────────────────────────────
export async function fetchSunTimes(lat: number, lon: number): Promise<SunTimes> {
  const today = new Date().toISOString().split('T')[0]
  const url = new URL(`${BASE}/forecast`)
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('daily', 'sunrise,sunset')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('start_date', today)
  url.searchParams.set('end_date', today)

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Open-Meteo sun: ${res.status}`)
  const json = await res.json()

  return {
    sunrise: json.daily.sunrise[0],
    sunset: json.daily.sunset[0],
  }
}

// ── 24h strip (−3h to +20h around now) ───────────────────────
export async function fetch24h(lat: number, lon: number): Promise<Extract<HourPoint, { kind: 'hour' }>[]> {
  const url = new URL(`${BASE}/forecast`)
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set(
    'hourly',
    'temperature_2m,precipitation_probability,weather_code,is_day'
  )
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '2')

  const res = await fetch(url.toString(), { next: { revalidate: 600 } })
  if (!res.ok) throw new Error(`Open-Meteo hourly: ${res.status}`)
  const json = await res.json()
  const h = json.hourly

  const nowH = new Date().getHours()
  const result: Extract<HourPoint, { kind: 'hour' }>[] = []

  for (let i = -3; i < 21; i++) {
    const idx = nowH + i
    if (idx < 0 || idx >= h.temperature_2m.length) continue
    const hour = (nowH + i + 24) % 24

    result.push({
      kind: 'hour',
      hour,
      label: `${hour}시`,
      isNow: i === 0,
      tempC: Math.round(h.temperature_2m[idx]),
      weather: codeForHour(h.weather_code[idx], h.is_day[idx] === 1) as WeatherCode,
      precipChance: h.precipitation_probability[idx] ?? 0,
    })
  }

  return result
}

// ── All-in-one fetch ──────────────────────────────────────────
export async function fetchAllWeather(
  lat: number,
  lon: number,
  location: string
): Promise<WeatherComparison> {
  const [today, yesterday, sunTimes, rawHours] = await Promise.all([
    fetchCurrent(lat, lon),
    fetchYesterdaySameHour(lat, lon),
    fetchSunTimes(lat, lon),
    fetch24h(lat, lon),
  ])

  const hours = injectSunEvents(rawHours, sunTimes)

  const temps = rawHours.map((h) => h.tempC)
  const nowIdx = rawHours.findIndex((h) => h.isNow)
  const futureTemps = temps.slice(nowIdx + 1)

  return {
    today,
    yesterday,
    deltaC: today.feelsLikeC - yesterday.feelsLikeC,
    diurnalRangeC: temps.length > 0 ? Math.max(...temps) - Math.min(...temps) : 8,
    laterMinC: futureTemps.length > 0 ? Math.min(...futureTemps) : today.tempC - 2,
    laterMaxC: futureTemps.length > 0 ? Math.max(...futureTemps) : today.tempC + 2,
    location,
    hours,
    sunTimes,
  }
}
