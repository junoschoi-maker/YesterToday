'use client'

import { IconLocation, IconRefresh } from '@/components/ui/icons'

type TopBarProps = {
  dark: boolean
  location: string
  refreshing: boolean
  onRefresh: () => void
}

export function TopBar({ dark, location, refreshing, onRefresh }: TopBarProps) {
  const c = dark ? 'rgba(255,255,255,0.95)' : 'rgba(20,24,36,0.95)'
  const pillStyle = {
    background: dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    boxShadow: dark
      ? 'inset 0 0.5px 0 rgba(255,255,255,0.18), inset 0 -0.5px 0 rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.2)'
      : 'inset 0 0.5px 0 rgba(255,255,255,0.85), inset 0 -0.5px 0 rgba(0,0,0,0.04), 0 1px 2px rgba(15,23,42,0.06)',
    border: dark
      ? '0.5px solid rgba(255,255,255,0.14)'
      : '0.5px solid rgba(255,255,255,0.6)',
  } as const

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 22px 12px',
      }}
    >
      {/* Location pill */}
      <div
        className="liquid-pill"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          color: c,
          padding: '8px 14px',
          borderRadius: 9999,
          ...pillStyle,
        }}
      >
        <IconLocation size={15} color={c} />
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>
          {location}
        </span>
      </div>

      {/* Refresh button */}
      <button
        onClick={onRefresh}
        aria-label="새로고침"
        className="liquid-pill"
        style={{
          width: 38,
          height: 38,
          borderRadius: 9999,
          border: 'none',
          color: c,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...pillStyle,
        }}
      >
        <IconRefresh size={17} color={c} spinning={refreshing} />
      </button>
    </div>
  )
}
