import type { TopKind, BottomKind, AccessoryKind } from '@/lib/outfit/rules'

// ── Body silhouettes ─────────────────────────────────────────
function BodyMale({ skin = '#e8c9a8' }: { skin?: string }) {
  return (
    <g>
      <ellipse cx="100" cy="54" rx="26" ry="29" fill={skin} />
      <rect x="92" y="78" width="16" height="14" fill={skin} />
      <path d="M60 100 Q100 90 140 100 L144 180 Q100 190 56 180 Z" fill={skin} />
      <path d="M60 100 L48 175 Q52 180 60 178 L70 108 Z" fill={skin} />
      <path d="M140 100 L152 175 Q148 180 140 178 L130 108 Z" fill={skin} />
      <circle cx="54" cy="182" r="7" fill={skin} />
      <circle cx="146" cy="182" r="7" fill={skin} />
      <path d="M58 180 L62 210 L138 210 L142 180 Z" fill={skin} opacity="0.95" />
      <path d="M64 210 L72 340 L90 340 L94 212 Z" fill={skin} />
      <path d="M106 212 L110 340 L128 340 L136 210 Z" fill={skin} />
      <ellipse cx="81" cy="348" rx="14" ry="6" fill="#2a2a30" />
      <ellipse cx="119" cy="348" rx="14" ry="6" fill="#2a2a30" />
      <path d="M76 40 Q100 18 124 40 Q126 52 122 56 Q100 45 78 56 Q74 52 76 40 Z" fill="#2c2018" />
    </g>
  )
}

function BodyFemale({ skin = '#edd0b3' }: { skin?: string }) {
  return (
    <g>
      <ellipse cx="100" cy="54" rx="25" ry="28" fill={skin} />
      <path d="M76 44 Q100 16 124 44 L130 90 Q128 100 122 92 L120 56 Q100 48 80 56 L78 92 Q72 100 70 90 Z" fill="#3a2a20" />
      <path d="M78 42 Q100 30 122 42 Q120 54 100 52 Q80 54 78 42 Z" fill="#3a2a20" />
      <rect x="93" y="76" width="14" height="14" fill={skin} />
      <path d="M66 100 Q100 92 134 100 L140 160 Q100 170 60 160 Z" fill={skin} />
      <path d="M60 160 Q100 170 140 160 L138 185 Q100 192 62 185 Z" fill={skin} />
      <path d="M66 100 L54 170 Q58 174 64 172 L74 106 Z" fill={skin} />
      <path d="M134 100 L146 170 Q142 174 136 172 L126 106 Z" fill={skin} />
      <circle cx="60" cy="177" r="6" fill={skin} />
      <circle cx="140" cy="177" r="6" fill={skin} />
      <path d="M60 185 L64 215 L136 215 L140 185 Z" fill={skin} />
      <path d="M66 215 L74 340 L90 340 L94 217 Z" fill={skin} />
      <path d="M106 217 L110 340 L126 340 L134 215 Z" fill={skin} />
      <ellipse cx="82" cy="348" rx="13" ry="5.5" fill="#2a2a30" />
      <ellipse cx="118" cy="348" rx="13" ry="5.5" fill="#2a2a30" />
    </g>
  )
}

// ── Top layers ───────────────────────────────────────────────
function TopSinglet({ primary = '#f5f5f7', shade = '#dadade' }: { primary?: string; shade?: string }) {
  return (
    <g>
      <path d="M74 102 L62 180 Q100 190 138 180 L126 102 Q114 108 100 108 Q86 108 74 102 Z" fill={primary} />
      <path d="M62 180 Q100 190 138 180 L138 184 Q100 194 62 184 Z" fill={shade} />
    </g>
  )
}
function TopTee({ primary = '#3b82c4', shade = '#2a63a0' }: { primary?: string; shade?: string }) {
  return (
    <g>
      <path d="M62 100 Q100 92 138 100 L146 140 Q140 146 134 142 L132 182 Q100 192 68 182 L66 142 Q60 146 54 140 Z" fill={primary} />
      <path d="M54 140 Q60 146 66 142 L70 155 Q60 150 54 145 Z" fill={shade} />
      <path d="M146 140 Q140 146 134 142 L130 155 Q140 150 146 145 Z" fill={shade} />
      <path d="M68 182 Q100 192 132 182 L132 188 Q100 198 68 188 Z" fill={shade} />
    </g>
  )
}
function TopLongTee({ primary = '#4b5563', shade = '#374151' }: { primary?: string; shade?: string }) {
  return (
    <g>
      <path d="M60 100 Q100 92 140 100 L152 175 Q146 180 140 178 L138 184 Q100 194 62 184 L60 178 Q54 180 48 175 Z" fill={primary} />
      <path d="M48 175 Q54 180 60 178 L62 184 Q54 184 48 180 Z" fill={shade} />
      <path d="M152 175 Q146 180 140 178 L138 184 Q146 184 152 180 Z" fill={shade} />
      <path d="M62 184 Q100 194 138 184 L138 190 Q100 200 62 190 Z" fill={shade} />
    </g>
  )
}
function TopJacket({ primary = '#1f2937', shade = '#0f172a', accent = '#60a5fa' }: { primary?: string; shade?: string; accent?: string }) {
  return (
    <g>
      <path d="M58 100 Q100 92 142 100 L154 178 Q148 182 141 180 L140 188 Q100 196 60 188 L59 180 Q52 182 46 178 Z" fill={primary} />
      <line x1="100" y1="100" x2="100" y2="188" stroke={accent} strokeWidth="1.5" />
      <path d="M46 178 Q52 182 59 180 L62 190 Q52 186 46 182 Z" fill={shade} />
      <path d="M154 178 Q148 182 141 180 L138 190 Q148 186 154 182 Z" fill={shade} />
      <path d="M84 96 Q100 92 116 96 L114 104 Q100 100 86 104 Z" fill={shade} />
    </g>
  )
}
function TopThermal({ primary = '#111827', shade = '#000', accent = '#ef4444' }: { primary?: string; shade?: string; accent?: string }) {
  return (
    <g>
      <path d="M56 98 Q100 90 144 98 L158 180 Q150 185 142 182 L140 192 Q100 200 60 192 L58 182 Q50 185 42 180 Z" fill={primary} />
      <path d="M42 180 L58 182 L62 194 Q50 189 42 184 Z" fill={shade} />
      <path d="M158 180 L142 182 L138 194 Q150 189 158 184 Z" fill={shade} />
      <path d="M74 96 Q100 82 126 96 Q100 88 74 96 Z" fill={shade} />
      <path d="M68 150 L132 150" stroke={accent} strokeWidth="1.5" strokeDasharray="2 3" />
    </g>
  )
}

// ── Bottom layers ────────────────────────────────────────────
function BottomShorts({ primary = '#1f2937', shade = '#0f172a' }: { primary?: string; shade?: string }) {
  return (
    <g>
      <path d="M58 188 L62 245 L94 245 L98 190 Z" fill={primary} />
      <path d="M102 190 L106 245 L138 245 L142 188 Z" fill={primary} />
      <path d="M58 188 Q100 198 142 188 L142 195 Q100 204 58 195 Z" fill={shade} />
    </g>
  )
}
function BottomHalfTights({ primary = '#111827', shade = '#000' }: { primary?: string; shade?: string }) {
  return (
    <g>
      <path d="M60 188 L68 280 L92 280 L96 190 Z" fill={primary} />
      <path d="M104 190 L108 280 L132 280 L140 188 Z" fill={primary} />
      <path d="M60 188 Q100 198 140 188 L140 195 Q100 205 60 195 Z" fill={shade} />
    </g>
  )
}
function BottomTights({ primary = '#0f172a', shade = '#000' }: { primary?: string; shade?: string }) {
  return (
    <g>
      <path d="M62 188 L72 340 L90 340 L94 192 Z" fill={primary} />
      <path d="M106 192 L110 340 L128 340 L138 188 Z" fill={primary} />
      <path d="M62 188 Q100 198 138 188 L138 195 Q100 205 62 195 Z" fill={shade} />
    </g>
  )
}
function BottomThermalT({ primary = '#18181b', shade = '#000', accent = '#3f3f46' }: { primary?: string; shade?: string; accent?: string }) {
  return (
    <g>
      <path d="M60 188 L70 340 L92 340 L94 192 Z" fill={primary} />
      <path d="M106 192 L108 340 L130 340 L140 188 Z" fill={primary} />
      <path d="M60 188 Q100 198 140 188 L140 195 Q100 205 60 195 Z" fill={shade} />
      <line x1="80" y1="260" x2="86" y2="260" stroke={accent} strokeWidth="1" />
      <line x1="114" y1="260" x2="120" y2="260" stroke={accent} strokeWidth="1" />
    </g>
  )
}

// ── Accessories ──────────────────────────────────────────────
function AccCap({ primary = '#1f2937' }: { primary?: string }) {
  return (
    <g>
      <path d="M74 38 Q100 22 126 38 Q128 48 124 52 Q100 44 76 52 Q72 48 74 38 Z" fill={primary} />
      <path d="M124 48 L144 52 Q142 58 122 56 Z" fill={primary} />
    </g>
  )
}
function AccBeanie({ primary = '#334155' }: { primary?: string }) {
  return (
    <g>
      <path d="M72 42 Q100 20 128 42 L130 58 Q100 52 70 58 Z" fill={primary} />
      <rect x="70" y="56" width="60" height="8" rx="2" fill={primary} opacity="0.85" />
      <circle cx="100" cy="26" r="5" fill={primary} opacity="0.9" />
    </g>
  )
}
function AccSunglasses() {
  return (
    <g>
      <rect x="76" y="50" width="20" height="9" rx="4" fill="#111" />
      <rect x="104" y="50" width="20" height="9" rx="4" fill="#111" />
      <line x1="96" y1="54" x2="104" y2="54" stroke="#111" strokeWidth="1.5" />
    </g>
  )
}
function AccGloves({ primary = '#1f2937' }: { primary?: string }) {
  return (
    <g>
      <circle cx="54" cy="182" r="8" fill={primary} />
      <circle cx="146" cy="182" r="8" fill={primary} />
    </g>
  )
}
function AccNeckwarmer({ primary = '#475569' }: { primary?: string }) {
  return (
    <g>
      <path d="M86 80 Q100 90 114 80 L118 100 Q100 108 82 100 Z" fill={primary} />
    </g>
  )
}

// ── Palette map ──────────────────────────────────────────────
const TOP_PALETTE: Record<TopKind, { primary: string; shade: string; accent?: string }> = {
  singlet: { primary: '#fafafa', shade: '#d4d4d8' },
  tee:     { primary: '#60a5fa', shade: '#3b82f6' },
  longtee: { primary: '#52525b', shade: '#27272a' },
  jacket:  { primary: '#1f2937', shade: '#0f172a', accent: '#60a5fa' },
  thermal: { primary: '#18181b', shade: '#000', accent: '#f59e0b' },
}
const BOT_PALETTE: Record<BottomKind, { primary: string; shade: string; accent?: string }> = {
  shorts:     { primary: '#27272a', shade: '#0f0f10' },
  halftights: { primary: '#18181b', shade: '#000' },
  tights:     { primary: '#0f172a', shade: '#000' },
  thermalt:   { primary: '#18181b', shade: '#000', accent: '#3f3f46' },
}

// ── Avatar composer ──────────────────────────────────────────
type AvatarProps = {
  gender?: 'male' | 'female'
  top?: TopKind
  bottom?: BottomKind
  accessories?: AccessoryKind[]
  size?: number
}

export function Avatar({
  gender = 'male',
  top = 'tee',
  bottom = 'shorts',
  accessories = [],
  size = 160,
}: AvatarProps) {
  const Body = gender === 'female' ? BodyFemale : BodyMale

  const tops: Record<TopKind, React.FC<{ primary?: string; shade?: string; accent?: string }>> = {
    singlet: TopSinglet,
    tee: TopTee,
    longtee: TopLongTee,
    jacket: TopJacket,
    thermal: TopThermal,
  }
  const bottoms: Record<BottomKind, React.FC<{ primary?: string; shade?: string; accent?: string }>> = {
    shorts: BottomShorts,
    halftights: BottomHalfTights,
    tights: BottomTights,
    thermalt: BottomThermalT,
  }

  const TopC = tops[top]
  const BotC = bottoms[bottom]
  const tp = TOP_PALETTE[top]
  const bp = BOT_PALETTE[bottom]

  return (
    <svg
      width={size}
      height={size * 1.9}
      viewBox="0 0 200 380"
      style={{ display: 'block' }}
    >
      <Body />
      {BotC && <BotC {...bp} />}
      {TopC && <TopC {...tp} />}
      {accessories.includes('gloves') && <AccGloves />}
      {accessories.includes('neckwarmer') && <AccNeckwarmer />}
      {accessories.includes('sunglasses') && <AccSunglasses />}
      {accessories.includes('cap') && <AccCap />}
      {accessories.includes('beanie') && <AccBeanie />}
    </svg>
  )
}
