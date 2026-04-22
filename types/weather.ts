// Usage:
//   import type { WeatherSnapshot, WeatherComparison, WeatherError } from '@/types/weather'

export type WeatherSnapshot = {
  tempC: number
  feelsLikeC: number
  windMs: number
  windGustMs: number
  precipitationMm: number
  humidityPct: number
  weatherCode: number  // Open-Meteo WMO code
  timestamp: string    // ISO 8601
}

export type WeatherComparison = {
  yesterday: WeatherSnapshot
  today: WeatherSnapshot
  tempDeltaC: number       // today - yesterday
  feelsLikeDeltaC: number
}

export type WeatherError =
  | { kind: 'network' }
  | { kind: 'invalid-location' }
  | { kind: 'api-error'; status: number }
