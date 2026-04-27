'use client'

import { useEffect, useState, useCallback } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { TopBar } from '@/components/features/compare/TopBar'
import { Avatar } from '@/components/features/running/Avatar'
import { IconWind, IconRain, IconArrow } from '@/components/ui/icons'
import { useSystemDark } from '@/lib/hooks/use-system-dark'
import { fetchAllWeather } from '@/lib/weather/fetcher'
import { saveLastWeather, loadLastWeather } from '@/lib/weather/cache'
import { getCurrentLocation, getCachedLocation, getLocationOrDefault } from '@/lib/location'
import { recommendOutfit } from '@/lib/outfit/rules'
import type { OutfitRecommendation, AccessoryKind } from '@/lib/outfit/rules'

const ACC_LABELS: Record<AccessoryKind, string> = {
  cap: '모자',
  sunglasses: '선글라스',
  beanie: '비니',
  gloves: '장갑',
  neckwarmer: '넥워머',
}

type Tone = 'good' | 'neutral' | 'bad'

function SuitabilityBadge({
  suitability,
  dark,
}: {
  suitability: OutfitRecommendation['suitability']
  dark: boolean
}) {
  const toneMap: Record<Tone, { bg: string; c: string; ring: string }> = {
    good: {
      bg: dark ? 'rgba(52,211,153,0.22)' : 'rgba(16,185,129,0.16)',
      c: dark ? '#6ee7b7' : '#047857',
      ring: dark ? 'rgba(110,231,183,0.35)' : 'rgba(16,185,129,0.3)',
    },
    neutral: {
      bg: dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.55)',
      c: dark ? '#fff' : '#141824',
      ring: dark ? 'rgba(255,255,255,0.2)' : 'rgba(20,24,36,0.1)',
    },
    bad: {
      bg: dark ? 'rgba(248,113,113,0.22)' : 'rgba(239,68,68,0.12)',
      c: dark ? '#fca5a5' : '#b91c1c',
      ring: dark ? 'rgba(252,165,165,0.35)' : 'rgba(239,68,68,0.3)',
    },
  }
  const t = toneMap[suitability.tone]
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: t.bg,
        color: t.c,
        padding: '8px 16px',
        borderRadius: 9999,
        border: `0.5px solid ${t.ring}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        fontSize: 16.5,
        fontWeight: 700,
        letterSpacing: -0.2,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 18.5 }}>{suitability.emoji}</span>
      {suitability.label}
    </div>
  )
}

function RunningScreen({
  recommendation,
  dark,
  location,
  refreshing,
  onRefresh,
}: {
  recommendation: OutfitRecommendation
  dark: boolean
  location: string
  refreshing: boolean
  onRefresh: () => void
}) {
  const c = dark ? '#fff' : '#141824'
  const sc = dark ? 'rgba(255,255,255,0.7)' : 'rgba(20,24,36,0.62)'
  const cellBg = dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.55)'
  const {
    rule,
    suitability,
    feelsLikeC,
    windMs,
    precipitationMm,
    rationaleBits,
    needsWindbreaker,
    needsRainGear,
  } = recommendation

  const outfitItems = [
    { label: '상의', value: rule.topLabel, dot: '#60a5fa' },
    { label: '하의', value: rule.bottomLabel, dot: '#a78bfa' },
    ...(rule.accessories.length > 0
      ? [
          {
            label: '액세서리',
            value: rule.accessories.map((a) => ACC_LABELS[a]).join(', '),
            dot: '#fbbf24',
          },
        ]
      : []),
  ]

  const warnColor = dark ? '#fde68a' : '#92400e'

  return (
    <div style={{ minHeight: '100%', paddingBottom: 100 }}>
      <TopBar dark={dark} location={location} refreshing={refreshing} onRefresh={onRefresh} />
      <div className="fade-in" style={{ textAlign: 'center', padding: '14px 20px 4px' }}>
        <div style={{ marginBottom: 12 }}>
          <SuitabilityBadge suitability={suitability} dark={dark} />
        </div>
        <div className="hero-num" style={{ fontSize: 110, color: c, margin: '0 -8px' }}>
          {feelsLikeC}°
        </div>
        <div style={{ fontSize: 14.5, color: sc, fontWeight: 500, marginTop: 4 }}>체감온도</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '16px 16px 0' }}>
        {[
          { icon: <IconWind size={20} color={c} animate={windMs > 3} />, label: '바람', value: windMs.toFixed(1), unit: 'm/s', warn: needsWindbreaker },
          { icon: <IconRain size={20} color={c} animate={precipitationMm > 0.3} />, label: '강수', value: precipitationMm.toFixed(1), unit: 'mm', warn: needsRainGear },
          { icon: <IconArrow dir={feelsLikeC > 20 ? 'up' : 'down'} size={18} color={c} />, label: '체감', value: String(feelsLikeC), unit: '°', warn: false },
        ].map((cell, i) => (
          <div key={i} style={{ background: cellBg, borderRadius: 22, backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)', padding: '12px 10px', border: dark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
            {cell.warn && <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: 99, background: '#f59e0b' }} />}
            <div style={{ color: c }}>{cell.icon}</div>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, color: sc, textTransform: 'uppercase' }}>{cell.label}</div>
            <div style={{ fontSize: 21.5, fontWeight: 600, color: c, letterSpacing: -0.5, fontFeatureSettings: '"tnum" 1' }}>
              {cell.value}<span style={{ fontSize: 12.5, fontWeight: 500, color: sc, marginLeft: 2 }}>{cell.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={`glass-card ${dark ? 'dark' : 'light'}`} style={{ margin: '16px 16px 0', padding: '12px 14px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: '0 0 auto', background: dark ? 'radial-gradient(circle at 50% 70%, rgba(255,255,255,0.12), transparent 70%)' : 'radial-gradient(circle at 50% 70%, rgba(255,255,255,0.6), transparent 70%)', borderRadius: 20, paddingTop: 6 }}>
            <Avatar gender="male" top={rule.top} bottom={rule.bottom} accessories={rule.accessories} size={150} />
          </div>
          <div style={{ flex: 1, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {outfitItems.map((it, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: it.dot }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: sc, letterSpacing: 0.8, textTransform: 'uppercase' }}>{it.label}</span>
                </div>
                <div style={{ fontSize: 15.5, fontWeight: 600, color: c, letterSpacing: -0.2 }}>{it.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ margin: '4px -14px 0', padding: '10px 18px', borderTop: dark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(20,24,36,0.08)', fontSize: 13.5, fontWeight: 500, color: dark ? 'rgba(255,255,255,0.62)' : 'rgba(20,24,36,0.55)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {rationaleBits.map((b, i) => <span key={i}>· {b}</span>)}
        </div>
      </div>
      {(needsWindbreaker || needsRainGear) && (
        <div style={{ margin: '12px 16px 0', padding: '10px 14px', borderRadius: 20, background: 'rgba(251,191,36,0.14)', border: dark ? '0.5px solid rgba(251,191,36,0.28)' : '0.5px solid rgba(251,191,36,0.4)', color: warnColor, fontSize: 14.5, fontWeight: 600, letterSpacing: -0.1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {needsWindbreaker && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IconWind size={16} color={warnColor} /> 방풍 재킷 챙기자 · 체감 더 춥게 느껴질 거야</div>}
          {needsRainGear && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IconRain size={16} color={warnColor} /> 우비나 방수 재킷 필수 · 비 와</div>}
        </div>
      )}
    </div>
  )
}

export function RunningView() {
  const dark = useSystemDark()
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null)
  const [loading, setLoading] = useState(true)
  const [stale, setStale] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [location, setLocation] = useState(getLocationOrDefault())

  const load = useCallback(async (lat: number, lon: number, label: string) => {
    setLoading(true)
    setStale(false)
    try {
      const result = await fetchAllWeather(lat, lon, label)
      saveLastWeather(result)
      setRecommendation(recommendOutfit(result.today.feelsLikeC, result.today.windMs, result.today.precipitationMm))
    } catch {
      const cached = loadLastWeather()
      if (cached) {
        setRecommendation(recommendOutfit(cached.today.feelsLikeC, cached.today.windMs, cached.today.precipitationMm))
        setStale(true)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const cached = loadLastWeather()
    if (cached) {
      setRecommendation(recommendOutfit(cached.today.feelsLikeC, cached.today.windMs, cached.today.precipitationMm))
      setLoading(false)
      setStale(true)
    }
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
    load(location.lat, location.lon, location.label).finally(() => setTimeout(() => setRefreshing(false), 900))
  }

  const bgClass = recommendation
    ? recommendation.suitability.tone === 'good'
      ? dark ? 'bg-warm-dark' : 'bg-warm-light'
      : recommendation.suitability.tone === 'bad'
        ? dark ? 'bg-cold-dark' : 'bg-cold-light'
        : dark ? 'bg-neutral-dark' : 'bg-neutral-light'
    : dark ? 'bg-neutral-dark' : 'bg-neutral-light'

  return (
    <div className={`${bgClass} stagger`} style={{ minHeight: '100dvh', position: 'relative', transition: 'background 0.6s ease', fontFamily: 'var(--font-yt-sans)' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: dark ? 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.08), transparent 60%)' : 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.4), transparent 60%)' }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {stale && !loading && (
          <div style={{ margin: '8px 16px 0', padding: '8px 14px', borderRadius: 14, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(20,24,36,0.06)', fontSize: 13, color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(20,24,36,0.55)', fontWeight: 500 }}>
            최신 정보를 불러올 수 없어 이전 데이터를 표시해요
          </div>
        )}
        {loading && !recommendation ? (
          <div style={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <Skeleton className="h-28 w-40 rounded-2xl" />
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-48 w-full rounded-3xl" style={{ marginTop: 8 }} />
          </div>
        ) : recommendation ? (
          <RunningScreen recommendation={recommendation} dark={dark} location={location.label} refreshing={refreshing} onRefresh={handleRefresh} />
        ) : null}
      </div>
    </div>
  )
}
