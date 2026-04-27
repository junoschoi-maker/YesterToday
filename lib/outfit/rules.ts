// Table-driven outfit recommendation engine
// Ported from design_handoff/reference_jsx/data.js

export type TopKind = 'singlet' | 'tee' | 'longtee' | 'jacket' | 'thermal'
export type BottomKind = 'shorts' | 'halftights' | 'tights' | 'thermalt'
export type AccessoryKind = 'cap' | 'sunglasses' | 'beanie' | 'gloves' | 'neckwarmer'
export type SuitabilityTone = 'good' | 'neutral' | 'bad'

export type OutfitRule = {
  minTemp: number
  top: TopKind
  bottom: BottomKind
  accessories: AccessoryKind[]
  topLabel: string
  bottomLabel: string
}

export type OutfitSuitability = {
  label: string
  tone: SuitabilityTone
  emoji: string
}

export type OutfitRecommendation = {
  rule: OutfitRule
  needsWindbreaker: boolean
  needsRainGear: boolean
  suitability: OutfitSuitability
  feelsLikeC: number
  windMs: number
  precipitationMm: number
  rationaleBits: string[]
}

const LAYER_RULES: OutfitRule[] = [
  {
    minTemp: 25,
    top: 'singlet',
    bottom: 'shorts',
    accessories: ['cap', 'sunglasses'],
    topLabel: '민소매',
    bottomLabel: '쇼츠',
  },
  {
    minTemp: 18,
    top: 'tee',
    bottom: 'shorts',
    accessories: ['sunglasses'],
    topLabel: '반팔 티',
    bottomLabel: '쇼츠',
  },
  {
    minTemp: 12,
    top: 'longtee',
    bottom: 'halftights',
    accessories: [],
    topLabel: '얇은 긴팔',
    bottomLabel: '7부 타이츠',
  },
  {
    minTemp: 7,
    top: 'longtee',
    bottom: 'tights',
    accessories: ['gloves'],
    topLabel: '얇은 긴팔',
    bottomLabel: '긴 타이츠',
  },
  {
    minTemp: 2,
    top: 'jacket',
    bottom: 'tights',
    accessories: ['gloves', 'beanie'],
    topLabel: '긴팔 + 얇은 재킷',
    bottomLabel: '긴 타이츠',
  },
  {
    minTemp: -99,
    top: 'thermal',
    bottom: 'thermalt',
    accessories: ['gloves', 'beanie', 'neckwarmer'],
    topLabel: '보온 + 바람막이',
    bottomLabel: '기모 타이츠',
  },
]

export function recommendOutfit(
  feelsLikeC: number,
  windMs: number,
  precipitationMm: number
): OutfitRecommendation {
  const rule =
    LAYER_RULES.find((r) => feelsLikeC >= r.minTemp) ??
    LAYER_RULES[LAYER_RULES.length - 1]

  const needsWindbreaker = windMs > 5
  const needsRainGear = precipitationMm > 0.3

  let score = 100
  if (feelsLikeC < -5 || feelsLikeC > 30) score -= 50
  else if (feelsLikeC < 0 || feelsLikeC > 26) score -= 25
  else if (feelsLikeC < 5 || feelsLikeC > 22) score -= 10
  if (windMs > 8) score -= 25
  else if (windMs > 5) score -= 10
  if (precipitationMm > 2) score -= 30
  else if (precipitationMm > 0.3) score -= 15

  const suitability: OutfitSuitability =
    score >= 80
      ? { label: '러닝 최적', tone: 'good', emoji: '🏃' }
      : score >= 55
        ? { label: '무난', tone: 'neutral', emoji: '👟' }
        : { label: '비추천', tone: 'bad', emoji: '⚠️' }

  const rationaleBits: string[] = [
    `체감 ${feelsLikeC}°`,
    windMs > 5 ? '바람 강함' : '바람 약함',
    precipitationMm > 0.3 ? '강수 있음' : null,
  ].filter(Boolean) as string[]

  return {
    rule,
    needsWindbreaker,
    needsRainGear,
    suitability,
    feelsLikeC,
    windMs,
    precipitationMm,
    rationaleBits,
  }
}
