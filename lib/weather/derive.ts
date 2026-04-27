import type { WeatherCode, HourPoint, SunTimes } from './types'

// WMO weather code → our WeatherCode
// https://open-meteo.com/en/docs — "WMO Weather interpretation codes"
export function codeForHour(wmoCode: number, isDay: boolean): WeatherCode {
  if (!isDay) return 'night'
  // Clear
  if (wmoCode === 0) return 'clear'
  // Mainly clear, partly cloudy
  if (wmoCode <= 2) return 'partly'
  // Overcast
  if (wmoCode === 3) return 'cloud'
  // Fog
  if (wmoCode >= 45 && wmoCode <= 48) return 'cloud'
  // Drizzle
  if (wmoCode >= 51 && wmoCode <= 57) return 'rain'
  // Rain
  if (wmoCode >= 61 && wmoCode <= 67) return 'rain'
  // Snow
  if (wmoCode >= 71 && wmoCode <= 77) return 'snow'
  // Rain showers
  if (wmoCode >= 80 && wmoCode <= 82) return 'rain'
  // Snow showers
  if (wmoCode >= 85 && wmoCode <= 86) return 'snow'
  // Thunderstorm
  if (wmoCode >= 95) return 'rain'
  return 'partly'
}

export function warmthFrom(deltaC: number): number {
  if (deltaC > 1) return Math.min(1, deltaC / 6)
  if (deltaC < -1) return Math.max(-1, deltaC / 6)
  return 0
}

export function bgClassFor(deltaC: number, dark: boolean): string {
  const w = warmthFrom(deltaC)
  const suffix = dark ? 'dark' : 'light'
  if (w > 0.1) return `bg-warm-${suffix}`
  if (w < -0.1) return `bg-cold-${suffix}`
  return `bg-neutral-${suffix}`
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function injectSunEvents(
  hours: Extract<HourPoint, { kind: 'hour' }>[],
  sunTimes: SunTimes
): HourPoint[] {
  const sunriseH = new Date(sunTimes.sunrise).getHours()
  const sunsetH = new Date(sunTimes.sunset).getHours()
  const result: HourPoint[] = []

  for (let i = 0; i < hours.length; i++) {
    const h = hours[i]
    const nextH = hours[i + 1]

    result.push(h)

    // Insert sunrise between hour 5→6 range (around actual sunrise hour)
    if (
      nextH &&
      h.hour === sunriseH - 1 &&
      nextH.hour === sunriseH
    ) {
      result.push({
        kind: 'sunrise',
        label: '일출',
        time: formatTime(sunTimes.sunrise),
      })
    }

    // Insert sunset between hour 17→18 range (around actual sunset hour)
    if (
      nextH &&
      h.hour === sunsetH - 1 &&
      nextH.hour === sunsetH
    ) {
      result.push({
        kind: 'sunset',
        label: '일몰',
        time: formatTime(sunTimes.sunset),
      })
    }
  }

  return result
}

export function weatherLabel(code: WeatherCode): string {
  const map: Record<WeatherCode, string> = {
    clear: '맑음',
    partly: '구름조금',
    cloud: '흐림',
    rain: '비',
    snow: '눈',
    night: '맑음',
  }
  return map[code]
}
