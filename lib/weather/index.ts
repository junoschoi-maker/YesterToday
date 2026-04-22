// Usage:
//   import { getCurrentWeather, getYesterdayWeather, compareWeather } from '@/lib/weather'
//
//   const [today, yesterday] = await Promise.all([
//     getCurrentWeather(lat, lon),
//     getYesterdayWeather(lat, lon),
//   ])
//   const comparison = compareWeather(yesterday, today)

export { getCurrentWeather, getYesterdayWeather } from './open-meteo'
export { compareWeather } from './compare'
