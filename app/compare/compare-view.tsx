'use client'

import { useEffect, useState, useCallback } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { TopBar } from '@/components/features/compare/TopBar'
import { DeltaHero } from '@/components/features/compare/DeltaHero'
import { TransitionCard } from '@/components/features/compare/TransitionCard'
import { HourStrip } from '@/components/features/compare/HourStrip'
import { useSystemDark } from '@/lib/hooks/use-system-dark'
import { bgClassFor } from '@/lib/weather/derive'
import { buildWeatherCopy } from '@/lib/weather/copy'
import { fetchAllWeather } from '@/lib/weather/fetcher'
import { saveLastWeather, loadLastWeather } from '@/lib/weather/cache'
import { getCurrentLocation, getCachedLocation, getLocationOrDefault } from '@/lib/location'
import type { WeatherComparison } from '@/lib/weather/types'

export function CompareView() {
  const dark = useSystemDark()
  const [data, setData] = useState<WeatherComparison | null>(null)
  const [loading, setLoading] = useState(true)
  const [stale, setStale] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshNonce, setRefreshNonce] = useState(0)
  const [location, setLocation] = useState(getLocationOrDefault())

  const load = useCallback(async (lat: number, lon: number, label: string) => {
    setLoading(true)
    setStale(false)
    try {
      const result = await fetchAllWeather(lat, lon, label)
      setData(result)
      saveLastWeather(result)
    } catch {
      const cached = loadLastWeather()
      if (cached) { setData(cached); setStale(true) }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const cached = loadLastWeather()
    if (cached) { setData(cached); setLoading(false); setStale(true) }
    const loc = getCachedLocation() ?? getLocationOrDefault()
    setLocation(loc)
    load(loc.lat, loc.lon, loc.label)
    getCurrentLocation()
      .then((freshLoc) => { setLocation(freshLoc); load(freshLoc.lat, freshLoc.lon, freshLoc.label) })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleRefresh() {
    setRefreshing(true)
    setRefreshNonce((n) => n + 1)
    load(location.lat, location.lon, location.label).finally(() => {
      setTimeout(() => setRefreshing(false), 900)
    })
  }

  const bgClass = data ? bgClassFor(data.deltaC, dark) : (dark ? 'bg-neutral-dark' : 'bg-neutral-light')
  const copy = data ? buildWeatherCopy({
    feelsLikeC: data.today.feelsLikeC, deltaC: data.deltaC,
    diurnalRangeC: data.diurnalRangeC, windMs: data.today.windMs,
    precipMm: data.today.precipitationMm, laterMinC: data.laterMinC,
    laterMaxC: data.laterMaxC, month: new Date().getMonth() + 1,
  }) : null

  return (
    <div className={`${bgClass} stagger`} style={{ minHeight: '100dvh', position: 'relative', transition: 'background 0.6s ease', fontFamily: 'var(--font-yt-sans)' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: dark ? 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.08), transparent 60%)' : 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.4), transparent 60%)' }} />
      {stale && !loading && (
        <div style={{ position: 'relative', zIndex: 10, margin: '8px 16px 0', padding: '8px 14px', borderRadius: 14, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(20,24,36,0.06)', fontSize: 13, color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(20,24,36,0.55)', fontWeight: 500 }}>
          최신 정보를 불러올 수 없어 이전 데이터를 표시해요
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 2, paddingBottom: 120 }}>
        <div style={{ '--d': 0 } as React.CSSProperties}>
          <TopBar dark={dark} location={location.label} refreshing={refreshing} onRefresh={handleRefresh} />
        </div>
        {loading && !data ? (
          <div style={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <Skeleton className="h-36 w-48 rounded-2xl" />
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-32 w-full rounded-3xl" style={{ marginTop: 8 }} />
            <Skeleton className="h-24 w-full rounded-3xl" />
          </div>
        ) : data && copy ? (
          <>
            <div style={{ '--d': 1 } as React.CSSProperties}>
              <DeltaHero delta={data.deltaC} dark={dark} copy={copy} refreshNonce={refreshNonce} />
            </div>
            <div style={{ '--d': 2 } as React.CSSProperties}>
              <div style={{ height: 14 }} />
              <TransitionCard yesterday={data.yesterday} today={data.today} dark={dark} />
            </div>
            <div style={{ '--d': 3 } as React.CSSProperties}>
              <HourStrip hours={data.hours} dark={dark} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
