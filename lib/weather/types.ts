export type WeatherCode = 'clear' | 'partly' | 'cloud' | 'rain' | 'snow' | 'night'

export type WeatherSnapshot = {
  tempC: number
  feelsLikeC: number
  windMs: number
  precipitationMm: number
  weatherCode: WeatherCode
}

export type HourPoint =
  | {
      kind: 'hour'
      hour: number
      label: string
      isNow: boolean
      tempC: number
      weather: WeatherCode
      precipChance: number
    }
  | {
      kind: 'sunrise' | 'sunset'
      label: string
      time: string // "06:12"
    }

export type SunTimes = {
  sunrise: string // ISO
  sunset: string  // ISO
}

export type WeatherComparison = {
  today: WeatherSnapshot
  yesterday: WeatherSnapshot
  deltaC: number          // today.feelsLikeC - yesterday.feelsLikeC
  diurnalRangeC: number
  laterMinC: number
  laterMaxC: number
  location: string
  hours: HourPoint[]
  sunTimes: SunTimes
}
