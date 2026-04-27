// Custom icon set — hand-crafted SVGs ported from design handoff
// All accept { size?, color?, animate? }

export type IconProps = {
  size?: number
  color?: string
  animate?: boolean
}

export function IconSun({ size = 28, color = 'currentColor', animate = false }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={animate ? 'pulse-sun' : ''}
      style={{ transformOrigin: 'center' }}
    >
      <circle cx="16" cy="16" r="6" fill={color} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect
          key={a}
          x="15"
          y="2"
          width="2"
          height="5"
          rx="1"
          fill={color}
          transform={`rotate(${a} 16 16)`}
        />
      ))}
    </svg>
  )
}

export function IconCloud({ size = 28, color = 'currentColor', animate = false }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={animate ? 'cloud-drift' : ''}
      style={{ transformOrigin: 'center' }}
    >
      <path
        d="M9 22c-3 0-5-2-5-5s2-5 5-5c.5-3 3-5 6-5s5.5 2 6 5c3 0 5 2 5 5s-2 5-5 5H9z"
        fill={color}
      />
    </svg>
  )
}

export function IconPartly({
  size = 28,
  color = 'currentColor',
  accent,
}: IconProps & { accent?: string }) {
  const ac = accent || color
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="12" cy="12" r="5" fill={ac} opacity="0.9" />
      <path
        d="M12 25c-3 0-5-2-5-5s2-5 5-5c.5-3 3-5 6-5s5.5 2 6 5c3 0 5 2 5 5s-2 5-5 5H12z"
        fill={color}
      />
    </svg>
  )
}

export function IconRain({ size = 28, color = 'currentColor', animate = false }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M9 18c-3 0-5-2-5-5s2-5 5-5c.5-3 3-5 6-5s5.5 2 6 5c3 0 5 2 5 5s-2 5-5 5H9z"
        fill={color}
        opacity="0.9"
      />
      {[10, 16, 22].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy="23"
          r="1.5"
          fill={color}
          style={
            animate
              ? {
                  animation: `drop 1.2s ${i * 0.2}s ease-in infinite`,
                  transformOrigin: `${x}px 23px`,
                }
              : {}
          }
        />
      ))}
    </svg>
  )
}

export function IconWind({ size = 28, color = 'currentColor', animate = false }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={animate ? { animation: 'slowspin 8s linear infinite', transformOrigin: 'center' } : {}}
    >
      <path
        d="M3 11h14a3 3 0 1 0-3-3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M3 17h20a3 3 0 1 1-3 3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M3 23h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconSnow({ size = 28, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <line x1="16" y1="4" x2="16" y2="28" />
      <line x1="4" y1="16" x2="28" y2="16" />
      <line x1="7.5" y1="7.5" x2="24.5" y2="24.5" />
      <line x1="24.5" y1="7.5" x2="7.5" y2="24.5" />
    </svg>
  )
}

export function IconMoon({ size = 28, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M22 20A10 10 0 1 1 12 8a8 8 0 0 0 10 12z" fill={color} />
    </svg>
  )
}

export function IconArrow({
  dir = 'up',
  size = 20,
  color = 'currentColor',
}: {
  dir?: 'up' | 'down' | 'right'
  size?: number
  color?: string
}) {
  const rot = dir === 'up' ? 0 : dir === 'down' ? 180 : 90
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <path
        d="M12 5v14M12 5l-5 5M12 5l5 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconLocation({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"
        fill={color}
      />
      <circle cx="12" cy="9" r="2.5" fill="#fff" />
    </svg>
  )
}

export function IconRefresh({
  size = 18,
  color = 'currentColor',
  spinning = false,
}: IconProps & { spinning?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={
        spinning
          ? { animation: 'slowspin 1.2s linear infinite', transformOrigin: 'center' }
          : {}
      }
    >
      <path
        d="M4 12a8 8 0 0 1 14-5.3L20 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 4v5h-5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M20 12a8 8 0 0 1-14 5.3L4 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4 20v-5h5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export type WeatherCode = 'clear' | 'partly' | 'cloud' | 'rain' | 'snow' | 'night'

export function pickWeatherIcon(
  code: WeatherCode,
  opts: IconProps & { accent?: string } = {}
) {
  if (code === 'clear') return <IconSun {...opts} />
  if (code === 'night') return <IconMoon {...opts} />
  if (code === 'partly') return <IconPartly {...opts} />
  if (code === 'cloud') return <IconCloud {...opts} />
  if (code === 'rain') return <IconRain {...opts} />
  if (code === 'snow') return <IconSnow {...opts} />
  return <IconSun {...opts} />
}
