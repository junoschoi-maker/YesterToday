// Usage:
//   import { compareWeather } from '@/lib/weather'
//   const comparison = compareWeather(yesterday, today)

import type { WeatherSnapshot, WeatherComparison } from '@/types/weather'

export function compareWeather(
  yesterday: WeatherSnapshot,
  today: WeatherSnapshot,
): WeatherComparison {
  return {
    yesterday,
    today,
    tempDeltaC: round1(today.tempC - yesterday.tempC),
    feelsLikeDeltaC: round1(today.feelsLikeC - yesterday.feelsLikeC),
  }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}
