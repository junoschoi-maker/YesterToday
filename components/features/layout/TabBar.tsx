'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSystemDark } from '@/lib/hooks/use-system-dark'

const TABS = [
  { href: '/compare', label: '비교' },
  { href: '/running', label: '러닝' },
]

export function TabBar() {
  const pathname = usePathname()
  const dark = useSystemDark()

  const c = dark ? '#fff' : '#141824'
  const sc = dark ? 'rgba(255,255,255,0.6)' : 'rgba(20,24,36,0.6)'
  const bg = dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.6)'
  const ring = dark ? 'rgba(255,255,255,0.16)' : 'rgba(20,24,36,0.08)'

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        display: 'flex',
        gap: 4,
        padding: 4,
        background: bg,
        borderRadius: 9999,
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: `0.5px solid ${ring}`,
        boxShadow: dark
          ? '0 10px 30px rgba(0,0,0,0.35)'
          : '0 10px 30px rgba(15,23,42,0.12)',
      }}
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              padding: '8px 22px',
              borderRadius: 9999,
              background: active
                ? dark
                  ? 'rgba(255,255,255,0.22)'
                  : 'rgba(255,255,255,0.95)'
                : 'transparent',
              color: active ? c : sc,
              fontSize: 14.5,
              fontWeight: 700,
              letterSpacing: -0.1,
              boxShadow: active ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
              transition: 'all .2s',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
            }}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
