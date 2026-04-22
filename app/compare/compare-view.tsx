'use client'

import { useEffect, useState } from 'react'
import { RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DeltaHero } from '@/components/features/weather/DeltaHero'
import { WeatherCard } from '@/components/features/weather/WeatherCard'
import {
  getCachedLocation,
  requestCurrentLocation,
  type SavedLocation,
} from '@/lib/location'
import { getCurrentWeather, getYesterdayWeather, compareWeather } from '@/lib/weather'
import type { WeatherComparison } from '@/types/weather'

const WEATHER_CACHE_KEY = 'yestertoday.weatherCache'

type CachedWeather = {
  comparison: WeatherComparison
  fetchedAt: string
}

function getCachedWeather(): CachedWeather | null {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY)
    return raw ? (JSON.parse(raw) as CachedWeather) : null
  } catch {
    return null
  }
}

function saveWeatherCache(comparison: WeatherComparison): void {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ comparison, fetchedAt: new Date().toISOString() }))
  } catch {
    // storage quota exceeded
  }
}

type FetchState = 'loading' | 'ready' | 'stale' | 'error'
type LocationState = 'loading' | 'denied' | 'unavailable' | 'ready'

export function CompareView() {
  const [locationState, setLocationState] = useState<LocationState>('loading')
  const [fetchState, setFetchState] = useState<FetchState>('loading')
  const [comparison, setComparison] = useState<WeatherComparison | null>(null)
  const [location, setLocation] = useState<SavedLocation | null>(null)

  async function fetchWeather(loc: SavedLocation) {
    setFetchState('loading')
    try {
      const [today, yesterday] = await Promise.all([
        getCurrentWeather(loc.lat, loc.lon),
        getYesterdayWeather(loc.lat, loc.lon),
      ])
      const c = compareWeather(yesterday, today)
      setComparison(c)
      saveWeatherCache(c)
      setFetchState('ready')
    } catch {
      const cached = getCachedWeather()
      if (cached) {
        setComparison(cached.comparison)
        setFetchState('stale')
      } else {
        setFetchState('error')
      }
    }
  }

  useEffect(() => {
    const cachedLoc = getCachedLocation()
    if (cachedLoc) {
      setLocation(cachedLoc)
      setLocationState('ready')
      fetchWeather(cachedLoc)
    }

    requestCurrentLocation()
      .then((loc) => {
        setLocation(loc)
        setLocationState('ready')
        fetchWeather(loc)
      })
      .catch((err) => {
        const kind = err.message === 'denied' ? 'denied' : 'unavailable'
        if (!cachedLoc) setLocationState(kind as LocationState)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleRetry() {
    setLocationState('loading')
    const cachedLoc = getCachedLocation()
    requestCurrentLocation()
      .then((loc) => {
        setLocation(loc)
        setLocationState('ready')
        fetchWeather(loc)
      })
      .catch((err) => {
        const kind = err.message === 'denied' ? 'denied' : 'unavailable'
        if (cachedLoc) {
          setLocationState('ready')
        } else {
          setLocationState(kind as LocationState)
        }
      })
  }

  if (locationState === 'denied' || locationState === 'unavailable') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <p className="text-base font-medium">위치 권한이 필요해요</p>
        <p className="text-sm text-muted-foreground">
          날씨 비교를 위해 현재 위치를 허용해주세요
        </p>
        <Button variant="outline" onClick={handleRetry}>
          다시 시도
        </Button>
      </div>
    )
  }

  const isDataLoading = fetchState === 'loading' && !comparison

  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {locationState === 'ready' ? '현재 위치' : '위치 불러오는 중...'}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => location && fetchWeather(location)}
          disabled={fetchState === 'loading'}
          aria-label="새로고침"
        >
          <RotateCw className={fetchState === 'loading' ? 'animate-spin' : ''} />
        </Button>
      </div>

      {fetchState === 'stale' && (
        <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          최신 정보를 불러올 수 없어요
        </div>
      )}

      {isDataLoading ? (
        <div className="flex flex-col items-center gap-2 py-6">
          <Skeleton className="h-20 w-32" />
          <Skeleton className="mt-1 h-5 w-24" />
        </div>
      ) : fetchState === 'error' ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-muted-foreground">날씨 정보를 불러오지 못했어요</p>
          <Button variant="outline" size="sm" onClick={() => location && fetchWeather(location)}>
            다시 시도
          </Button>
        </div>
      ) : comparison ? (
        <DeltaHero deltaC={comparison.tempDeltaC} />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        {isDataLoading ? (
          <>
            <Skeleton className="h-36 flex-1" />
            <Skeleton className="h-36 flex-1" />
          </>
        ) : comparison ? (
          <>
            <WeatherCard label="어제" snapshot={comparison.yesterday} />
            <WeatherCard label="오늘" snapshot={comparison.today} />
          </>
        ) : null}
      </div>
    </div>
  )
}
