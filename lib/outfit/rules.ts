export type OutfitLayer = {
  top: string
  bottom: string
  accessories: string[]
  needsWindbreaker: boolean
  needsRainGear: boolean
}

export type OutfitRecommendation = {
  layer: OutfitLayer
  rationale: string  // 한국어, 예: "체감 15°C, 바람 약함"
  feelsLikeC: number
  windMs: number
}

type LayerRule = {
  minTemp: number
  top: string
  bottom: string
  accessories: string[]
}

const LAYER_RULES: LayerRule[] = [
  { minTemp: 25,         top: '민소매/싱글릿',                bottom: '쇼츠',               accessories: ['모자', '선글라스'] },
  { minTemp: 18,         top: '반팔 티',                     bottom: '쇼츠',               accessories: ['선글라스'] },
  { minTemp: 12,         top: '반팔 + 암슬리브 또는 얇은 긴팔', bottom: '쇼츠 또는 7부 타이츠', accessories: [] },
  { minTemp: 7,          top: '얇은 긴팔',                   bottom: '긴 타이츠',           accessories: ['얇은 장갑'] },
  { minTemp: 2,          top: '긴팔 + 얇은 재킷',             bottom: '긴 타이츠',           accessories: ['장갑', '비니'] },
  { minTemp: -Infinity,  top: '보온 긴팔 + 바람막이',          bottom: '기모 타이츠',          accessories: ['장갑', '비니', '넥워머'] },
]

export function recommendOutfit(
  feelsLikeC: number,
  windMs: number,
  precipitationMm: number,
): OutfitRecommendation {
  const rule =
    LAYER_RULES.find((r) => feelsLikeC >= r.minTemp) ?? LAYER_RULES[LAYER_RULES.length - 1]

  const needsWindbreaker = windMs > 5
  const needsRainGear = precipitationMm > 0.3

  const rationaleParts = [
    `체감 ${feelsLikeC}°C`,
    windMs > 5 ? '바람 강함' : '바람 약함',
  ]
  if (needsRainGear) rationaleParts.push('강수')

  return {
    layer: {
      top: rule.top,
      bottom: rule.bottom,
      accessories: rule.accessories,
      needsWindbreaker,
      needsRainGear,
    },
    rationale: rationaleParts.join(', '),
    feelsLikeC,
    windMs,
  }
}
