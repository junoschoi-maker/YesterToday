import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type GlassCardProps = {
  dark?: boolean
  pressable?: boolean
  className?: string
  children: ReactNode
  style?: React.CSSProperties
}

export function GlassCard({ dark = false, pressable = false, className, children, style }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card liquid-card',
        dark ? 'dark' : 'light',
        pressable && 'pressable',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}
