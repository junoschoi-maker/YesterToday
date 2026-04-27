'use client'

import { useEffect, useRef } from 'react'
import { pickWeatherIcon } from '@/components/ui/icons'
import type { HourPoint } from '@/lib/weather/types'

type Props = {
  hours: HourPoint[]
  dark: boolean
}

// Sunrise/sunset special column
function SunEventCell({ point, dark }: { point: Extract<HourPoint, { kind: 'sunrise' | 'sunset' }>; dark: boolean }) {
  const sc = dark ? 'rgba(255,255,255,0.62)' : 'rgba(20,24,36,0.58)'
  const sunColor = dark ? '#fbbf24' : '#d97706'
  const isRise = point.kind === 'sunrise'

  return (
    <div
      style={{
        minWidth: 56,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 4px',
        borderRadius: 22,
        background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.35)',
        border: dark
          ? '1px dashed rgba(255,255,255,0.12)'
          : '1px dashed rgba(20,24,36,0.14)',
        gap: 4,
      }}
    >
      <div style={{ fontSize: 11.5, fontWeight: 600, color: sc }}>{point.label}</div>
      {/* Sun event icon */}
      <svg
        width="28"
        height="22"
        viewBox="0 0 28 22"
        fill="none"
        className="sun-event-icon"
        style={{ color: sunColor }}
      >
        {/* Horizon line */}
        <line x1="2" y1="14" x2="26" y2="14" stroke={sunColor} strokeWidth="1.5" strokeLinecap="round" />
        {/* Half sun */}
        <path d="M14 14 A6 6 0 0 1 8 14" stroke={sunColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M14 14 A6 6 0 0 0 20 14" stroke={sunColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Arrow */}
        {isRise ? (
          <path d="M14 12 L14 4 M14 4 L11 7 M14 4 L17 7" stroke={sunColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M14 4 L14 12 M14 12 L11 9 M14 12 L17 9" stroke={sunColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        )}
      </svg>
      <div style={{ fontSize: 13, fontWeight: 600, color: sunColor, fontFeatureSettings: '"tnum" 1' }}>
        {point.time}
      </div>
    </div>
  )
}

const WEATHER_COLORS: Record<string, { light: string; dark: string }> = {
  clear:  { light: '#f59e0b', dark: '#fbbf24' },
  partly: { light: 'currentColor', dark: 'currentColor' },
  cloud:  { light: 'currentColor', dark: 'currentColor' },
  rain:   { light: '#4a7bc4', dark: '#8cc0ef' },
  snow:   { light: '#6a9fd4', dark: '#c7e6ff' },
  night:  { light: 'rgba(20,24,36,0.6)', dark: 'rgba(255,255,255,0.6)' },
}

export function HourStrip({ hours, dark }: Props) {
  const c = dark ? '#fff' : '#141824'
  const sc = dark ? 'rgba(255,255,255,0.62)' : 'rgba(20,24,36,0.58)'
  const scrollRef = useRef<HTMLDivElement>(null)

  // Temps for bar normalization
  const temps = hours
    .filter((h): h is Extract<HourPoint, { kind: 'hour' }> => h.kind === 'hour')
    .map((h) => h.tempC)
  const minT = Math.min(...temps)
  const maxT = Math.max(...temps)
  const range = Math.max(1, maxT - minT)

  // Scroll to "now" on mount
  useEffect(() => {
    if (!scrollRef.current) return
    const children = Array.from(scrollRef.current.children) as HTMLElement[]
    const nowIdx = hours.findIndex((h) => h.kind === 'hour' && h.isNow)
    if (nowIdx < 0) return
    const el = children[nowIdx]
    if (el) {
      const left =
        el.offsetLeft - scrollRef.current.clientWidth / 2 + el.clientWidth / 2
      scrollRef.current.scrollTo({ left, behavior: 'instant' })
    }
  }, [hours])

  return (
    <div
      className={`glass-card liquid-card ${dark ? 'dark' : 'light'}`}
      style={{ margin: '14px 16px 0', padding: '14px 0 12px' }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 18px 10px',
        }}
      >
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: sc,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          시간별 흐름
        </div>
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: sc,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>←</span>
          <span>스와이프</span>
          <span>→</span>
        </div>
      </div>

      {/* Scroll body */}
      <div
        ref={scrollRef}
        className="noscrollbar"
        style={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        {hours.map((h, i) => {
          // Sun event column
          if (h.kind !== 'hour') {
            return <SunEventCell key={`${h.kind}-${i}`} point={h} dark={dark} />
          }

          const pct = (h.tempC - minT) / range
          const active = h.isNow
          const iconColor = WEATHER_COLORS[h.weather]?.[dark ? 'dark' : 'light'] ?? c

          return (
            <div
              key={i}
              style={{
                scrollSnapAlign: 'center',
                minWidth: 58,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px 4px',
                borderRadius: 22,
                background: active
                  ? dark
                    ? 'rgba(255,255,255,0.18)'
                    : 'rgba(255,255,255,0.85)'
                  : 'transparent',
                outline: active
                  ? dark
                    ? '1px solid rgba(255,255,255,0.28)'
                    : '1px solid rgba(20,24,36,0.12)'
                  : 'none',
                boxShadow: active
                  ? dark
                    ? 'inset 0 0.5px 0 rgba(255,255,255,0.25), 0 2px 10px rgba(0,0,0,0.25)'
                    : 'inset 0 0.5px 0 rgba(255,255,255,0.95), 0 2px 10px rgba(15,23,42,0.08)'
                  : 'none',
              }}
              className={active ? 'now-pulse' : ''}
            >
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: active ? 800 : 600,
                  color: active ? c : sc,
                  marginBottom: 6,
                  letterSpacing: 0.2,
                }}
              >
                {active ? '지금' : h.label}
              </div>
              {pickWeatherIcon(h.weather, { size: 24, color: iconColor })}
              <div
                style={{
                  fontSize: 11.5,
                  color: sc,
                  marginTop: 4,
                  fontWeight: 600,
                  minHeight: 13,
                }}
              >
                {h.precipChance > 0 ? `${h.precipChance}%` : ''}
              </div>
              {/* Temperature bar */}
              <div
                style={{
                  width: 4,
                  height: 34,
                  marginTop: 4,
                  borderRadius: 4,
                  background: dark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(20,24,36,0.08)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${10 + pct * 85}%`,
                    borderRadius: 4,
                    background: `linear-gradient(180deg, ${dark ? '#f4a68a' : '#f07a5a'}, ${dark ? '#7eb4f4' : '#5a94e8'})`,
                    opacity: 0.9,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 15.5,
                  fontWeight: 700,
                  color: c,
                  marginTop: 8,
                  fontFeatureSettings: '"tnum" 1',
                  letterSpacing: -0.3,
                }}
              >
                {h.tempC}°
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
