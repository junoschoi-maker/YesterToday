'use client'

import { useAnimatedNumber } from '@/lib/hooks/use-animated-number'
import { pickWeatherIcon } from '@/components/ui/icons'
import { weatherLabel } from '@/lib/weather/derive'
import type { WeatherSnapshot } from '@/lib/weather/types'

type Props = {
  yesterday: WeatherSnapshot
  today: WeatherSnapshot
  dark: boolean
}

function DeltaArrow({ d, sc, size = 11 }: { d: number; sc: string; size?: number }) {
  if (Math.abs(d) < 0.05) return <span style={{ fontSize: size - 2, color: sc }}>·</span>
  return (
    <span style={{ fontSize: size, fontWeight: 800, lineHeight: 1 }}>
      {d > 0 ? '▲' : '▼'}
    </span>
  )
}

function DeltaStat({
  label,
  todayVal,
  unit,
  delta,
  dark,
  invert = false,
}: {
  label: string
  todayVal: number
  unit: string
  delta: number
  dark: boolean
  invert?: boolean
}) {
  const c = dark ? '#fff' : '#141824'
  const sc = dark ? 'rgba(255,255,255,0.6)' : 'rgba(20,24,36,0.54)'
  const warmAccent = dark ? '#f4a68a' : '#c9502a'
  const coolAccent = dark ? '#8cc0ef' : '#2b66b8'

  const eq = Math.abs(delta) < 0.05
  const isUp = delta > 0
  const color = eq ? sc : (isUp !== invert) ? warmAccent : coolAccent

  const animatedToday = useAnimatedNumber(todayVal, { duration: 600, decimals: unit === 'm/s' ? 1 : 0 })
  const animatedDelta = useAnimatedNumber(Math.abs(delta), { duration: 600, decimals: unit === 'm/s' ? 1 : 0 })

  const todayDisplay = unit === '°'
    ? `${Math.round(animatedToday)}°`
    : unit === 'm/s'
      ? animatedToday.toFixed(1)
      : animatedToday.toFixed(1)

  return (
    <div
      className="pressable"
      style={{
        padding: '10px 11px',
        borderRadius: 14,
        background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(20,24,36,0.04)',
      }}
    >
      <div
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          color: sc,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span
          style={{
            fontSize: 17.5,
            fontWeight: 700,
            color: c,
            fontFeatureSettings: '"tnum" 1',
            letterSpacing: -0.3,
          }}
        >
          {todayDisplay}
        </span>
        {unit !== '°' && (
          <span style={{ fontSize: 10.5, color: sc, fontWeight: 600 }}>{unit}</span>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          marginTop: 4,
          color,
          fontSize: 11.5,
          fontWeight: 700,
        }}
      >
        {eq ? (
          <span style={{ color: sc }}>— 동일</span>
        ) : (
          <>
            <DeltaArrow d={delta} sc={sc} />
            <span style={{ fontFeatureSettings: '"tnum" 1' }}>
              {delta > 0 ? '+' : '−'}{animatedDelta.toFixed(unit === 'm/s' ? 1 : 0)}{unit}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export function TransitionCard({ yesterday, today, dark }: Props) {
  const c = dark ? '#fff' : '#141824'
  const sc = dark ? 'rgba(255,255,255,0.62)' : 'rgba(20,24,36,0.58)'
  const ghostC = dark ? 'rgba(255,255,255,0.44)' : 'rgba(20,24,36,0.4)'

  const deltaT = today.tempC - yesterday.tempC
  const deltaFeel = +(today.feelsLikeC - yesterday.feelsLikeC).toFixed(1)
  const deltaWind = +(today.windMs - yesterday.windMs).toFixed(1)
  const deltaRain = +(today.precipitationMm - yesterday.precipitationMm).toFixed(1)

  return (
    <div
      className={`glass-card liquid-card pressable ${dark ? 'dark' : 'light'}`}
      style={{ margin: '0 16px', padding: '16px 18px' }}
    >
      {/* Row 1: 어제 → 오늘 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* 어제 */}
        <div style={{ textAlign: 'left', flex: '0 0 auto', minWidth: 80 }}>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: ghostC,
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            어제
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {pickWeatherIcon(yesterday.weatherCode, { size: 26, color: ghostC })}
            <span
              style={{
                fontSize: 30,
                fontWeight: 300,
                color: ghostC,
                letterSpacing: -1,
                lineHeight: 1,
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              {yesterday.tempC}°
            </span>
          </div>
          <div style={{ fontSize: 12, color: ghostC, marginTop: 4, fontWeight: 500 }}>
            {weatherLabel(yesterday.weatherCode)}
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: deltaT >= 0
                ? (dark ? '#f4a68a' : '#c9502a')
                : (dark ? '#8cc0ef' : '#2b66b8'),
              letterSpacing: 0.3,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <DeltaArrow d={deltaT} sc={sc} size={11} />
            <span>
              {deltaT > 0 ? '+' : deltaT < 0 ? '−' : ''}{Math.abs(deltaT)}°
            </span>
          </div>
          {/* Animated dashed arrow */}
          <svg width="66" height="8" viewBox="0 0 66 8" fill="none">
            <line
              x1="2"
              y1="4"
              x2="58"
              y2="4"
              stroke={sc}
              strokeWidth="1.5"
              strokeDasharray="2 3"
              strokeLinecap="round"
              style={{
                strokeDashoffset: 24,
                animation: 'dashFlow 2s linear infinite',
              }}
            />
            <path d="M58 1.5 L63.5 4 L58 6.5 Z" fill={sc} />
          </svg>
        </div>

        {/* 오늘 */}
        <div style={{ textAlign: 'right', flex: '0 0 auto', minWidth: 100 }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 800,
              color: c,
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            오늘
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            {pickWeatherIcon(today.weatherCode, { size: 36, color: c })}
            <span
              style={{
                fontSize: 44,
                fontWeight: 300,
                color: c,
                letterSpacing: -2,
                lineHeight: 1,
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              {today.tempC}°
            </span>
          </div>
          <div style={{ fontSize: 13, color: c, marginTop: 4, fontWeight: 700 }}>
            {weatherLabel(today.weatherCode)}
          </div>
        </div>
      </div>

      {/* Row 2: 3-grid delta stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8,
          marginTop: 14,
        }}
      >
        <DeltaStat label="체감" todayVal={today.feelsLikeC} unit="°" delta={deltaFeel} dark={dark} />
        <DeltaStat label="바람" todayVal={today.windMs} unit="m/s" delta={deltaWind} dark={dark} invert />
        <DeltaStat label="강수" todayVal={today.precipitationMm} unit="mm" delta={deltaRain} dark={dark} invert />
      </div>

      <style>{`
        @keyframes dashFlow {
          from { stroke-dashoffset: 24; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}
