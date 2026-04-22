'use client'

import { useEffect, useState } from 'react'
import { RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { OutfitCard } from '@/components/features/running/OutfitCard'
import { getCachedLocation, requestCurrentLocation, type SavedLocation } from '@/lib/location'
import { getCurrentWeather } from '@/lib/weather'
import { recommendOutfit, type OutfitRecommendation } from '@/lib/outfit/rules'
import type { WeatherSnapshot } from '@/types/weather'

const CURRENT_WEATHER_KEY = 'yestertoday.currentWeather'

type CachedCurrent = {
  snapshot: WeatherSnapshot
  fetchedAt: string
}

function getCachedCurrent(): CachedCurrent | null {
  try {
    const raw = localStorage.getItem(CURRENT_WEATHER_KEY)
    return raw ? (JSON.parse(raw) as CachedCurrent) : null
  } catch {
    return null
  }
}

function saveCachedCurrent(snapshot: WeatherSnapshot): void {
  try {
    localStorage.setItem(CURRENT_WEATHER_KEY, JSON.stringify({ snapshot, fetchedAt: new Date().toISOString() }))
  } catch {
    // storage quota exceeded
  }
}

type FetchState = 'loading' | 'ready' | 'stale' | 'error'
type LocationState = 'loading' | 'denied' | 'unavailable' | 'ready'

export function RunningView() {
  const [locationState, setLocationState] = useState<LocationState>('loading')
  const [fetchState, setFetchState] = useState<FetchState>('loading')
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null)
  const [actualTempC, setActualTempC] = useState<number | null>(null)
  const [location, setLocation] = useState<SavedLocation | null>(null)

  async function fetchWeather(loc: SavedLocation) {
    setFetchState('loading')
    try {
      const snapshot = await getCurrentWeather(loc.lat, loc.lon)
      saveCachedCurrent(snapshot)
      setActualTempC(snapshot.tempC)
      setRecommendation(recommendOutfit(snapshot.feelsLikeC, snapshot.windMs, snapshot.precipitationMm))
      setFetchState('ready')
    } catch {
      const cached = getCachedCurrent()
      if (cached) {
        const s = cached.snapshot
        setActualTempC(s.tempC)
        setRecommendation(recommendOutfit(s.feelsLikeC, s.windMs, s.precipitationMm))
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
        setLocationState(cachedLoc ? 'ready' : (kind as LocationState))
      })
  }

  if (locationState === 'denied' || locationState === 'unavailable') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <p className="text-base font-medium">위치 권한이 필요해요</p>
        <p className="text-sm text-muted-foreground">
          날씨 기반 착장 추천을 위해 현재 위치를 허용해주세요
        </p>
        <Button variant="outline" onClick={handleRetry}>
          다시 시도
        </Button>
      </div>
    )
  }

  const isDataLoading = fetchState === 'loading' && !recommendation

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {locationState === 'ready' ? '오늘 러닝 착장' : '위치 불러오는 중...'}
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
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : fetchState === 'error' ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-muted-foreground">날씨 정보를 불러오지 못했어요</p>
          <Button variant="outline" size="sm" onClick={() => location && fetchWeather(location)}>
            다시 시도
          </Button>
        </div>
      ) : recommendation && actualTempC !== null ? (
        <OutfitCard recommendation={recommendation} actualTempC={actualTempC} />
      ) : null}
    </div>
  )
}
