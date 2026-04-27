'use client'

import { useAnimatedNumber } from '@/lib/hooks/use-animated-number'
import type { CopyOutput } from '@/lib/weather/copy'

type DeltaHeroProps = {
  delta: number
  dark: boolean
  copy: CopyOutput
  refreshNonce: number
}

export function DeltaHero({ delta, dark, copy, refreshNonce }: DeltaHeroProps) {
  const animatedDelta = useAnimatedNumber(delta, { duration: 600, decimals: 0 })

  const c = dark ? '#fff' : '#141824'
  const sc = dark ? 'rgba(255,255,255,0.74)' : 'rgba(20,24,36,0.64)'
  const sc2 = dark ? 'rgba(255,255,255,0.56)' : 'rgba(20,24,36,0.5)'

  // Aurora colors react to delta sign
  const warmA = dark ? 'rgba(244,166,138,0.55)' : 'rgba(255,184,148,0.7)'
  const warmB = dark ? 'rgba(201,120,130,0.4)' : 'rgba(240,150,170,0.55)'
  const coolA = dark ? 'rgba(140,192,239,0.45)' : 'rgba(170,210,245,0.7)'
  const coolB = dark ? 'rgba(152,140,220,0.4)' : 'rgba(200,190,240,0.55)'

  const isWarm = delta >= 0
  const a1 = isWarm ? warmA : coolA
  const a2 = isWarm ? warmB : coolB

  const sign = animatedDelta > 0 ? '+' : animatedDelta < 0 ? '−' : ''
  const absD = Math.abs(Math.round(animatedDelta))

  return (
    <div
      className="fade-in"
      style={{
        textAlign: 'center',
        padding: '14px 20px 6px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Aurora behind hero */}
      <div
        className={`aurora ${dark ? 'dark' : ''}`}
        style={{
          background: `radial-gradient(40% 50% at 30% 40%, ${a1}, transparent 70%), radial-gradient(40% 50% at 70% 60%, ${a2}, transparent 70%)`,
          transition: 'opacity 0.9s ease',
        }}
      />
      <div className={`hero-glow ${dark ? 'dark' : ''}`} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12.5,
            fontWeight: 700,
            color: sc,
            textTransform: 'uppercase',
            letterSpacing: 1.6,
            marginBottom: 4,
            padding: '4px 11px',
            borderRadius: 9999,
            background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: dark
              ? 'inset 0 0.5px 0 rgba(255,255,255,0.14)'
              : 'inset 0 0.5px 0 rgba(255,255,255,0.8)',
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: 99,
              background: isWarm ? '#f4a68a' : '#7eb4f4',
            }}
          />
          어제 대비
        </div>

        {/* Hero number */}
        <div
          key={refreshNonce}
          className="hero-num hero-bounce"
          aria-label={`어제보다 ${Math.abs(delta)}도 ${delta >= 0 ? '높음' : '낮음'}`}
          style={{
            fontSize: 148,
            color: c,
            margin: '0 -10px',
          }}
        >
          {sign}{absD}°
        </div>

        {/* Copy */}
        <div
          style={{
            marginTop: 10,
            lineHeight: 1.45,
            padding: '0 10px',
            textWrap: 'pretty',
          }}
        >
          <div style={{ fontSize: 18.5, fontWeight: 700, color: c, letterSpacing: -0.3 }}>
            {copy.head}
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, color: sc, marginTop: 4 }}>
            {copy.general}
          </div>
          {copy.sub && (
            <div style={{ fontSize: 13, fontWeight: 500, color: sc2, marginTop: 6 }}>
              {copy.sub}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
