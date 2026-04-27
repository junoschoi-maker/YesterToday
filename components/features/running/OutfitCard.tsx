// Legacy component — kept for potential future use
// The active running screen (app/running/running-view.tsx) uses inline SVG Avatar instead.
import type { OutfitRecommendation } from '@/lib/outfit/rules'

type Props = {
  recommendation: OutfitRecommendation
  actualTempC: number
}

export function OutfitCard({ recommendation, actualTempC }: Props) {
  const { rule, feelsLikeC, windMs, rationaleBits, needsWindbreaker, needsRainGear } = recommendation

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 56, fontWeight: 700, lineHeight: 1 }}>{feelsLikeC}°</p>
      <p style={{ fontSize: 14, color: 'gray' }}>체감온도 · 실제 {actualTempC}°C</p>
      <p style={{ marginTop: 8 }}>{rule.topLabel} / {rule.bottomLabel}</p>
      <p style={{ marginTop: 8, fontSize: 12, color: 'gray' }}>{rationaleBits.join(' · ')}</p>
      {needsWindbreaker && <p style={{ color: 'orange' }}>방풍재킷 권장</p>}
      {needsRainGear && <p style={{ color: 'blue' }}>우비 / 방수 재킷 권장</p>}
    </div>
  )
}
