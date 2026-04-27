// Korean weather copy engine — ported from design_handoff/reference_jsx/copy.js

export type CopyInput = {
  feelsLikeC: number
  deltaC: number
  diurnalRangeC: number
  windMs: number
  precipMm: number
  laterMinC?: number
  laterMaxC?: number
  month?: number // 1-12
}

export type CopyOutput = {
  head: string
  general: string
  sub: string | null
  feelLabel: string
  deltaLabel: string
  feelLevel: number
  deltaDir: number
}

function feelLevel(feelsLikeC: number): number {
  if (feelsLikeC <= -5) return 0
  if (feelsLikeC <= 4) return 1
  if (feelsLikeC <= 11) return 2
  if (feelsLikeC <= 17) return 3
  if (feelsLikeC <= 24) return 4
  return 5
}

const FEEL_LABELS = ['혹한', '추위', '쌀쌀함', '선선함', '따뜻함', '더위']

function deltaDir(deltaC: number): number {
  if (deltaC <= -5) return 0
  if (deltaC <= -2) return 1
  if (deltaC < 2) return 2
  if (deltaC < 5) return 3
  return 4
}

const DELTA_LABELS = [
  '크게 떨어졌어요',
  '조금 떨어졌어요',
  '어제와 비슷해요',
  '조금 올랐어요',
  '크게 올랐어요',
]

const HEAD_MATRIX: string[][] = [
  // feel=0 혹한
  [
    '어제보다 훨씬 더 추워졌어요',
    '어제보다 추워졌어요. 단단히 챙겨 입으세요',
    '어제와 비슷하게 매우 추워요',
    '어제보단 조금 풀렸지만 여전히 추워요',
    '많이 풀렸지만 여전히 추운 날씨예요',
  ],
  // feel=1 추위
  [
    '어제보다 기온이 크게 떨어졌어요',
    '어제보다 추워졌어요',
    '어제와 비슷하게 추운 편이에요',
    '어제보단 조금 풀렸지만 추운 하루예요',
    '많이 풀렸지만 아직 쌀쌀해요',
  ],
  // feel=2 쌀쌀
  [
    '어제보다 기온이 뚝 떨어졌어요',
    '어제보다 쌀쌀해졌어요',
    '어제와 비슷한 쌀쌀한 날씨예요',
    '어제보단 풀렸지만 아직 쌀쌀해요',
    '어제보다 훨씬 풀려 선선해졌어요',
  ],
  // feel=3 선선
  [
    '어제보다 크게 떨어져 선선해졌어요',
    '어제보다 조금 서늘해졌어요',
    '어제와 비슷한 선선한 날씨예요',
    '어제보다 조금 포근해졌어요',
    '어제보다 훨씬 따뜻해졌어요',
  ],
  // feel=4 따뜻
  [
    '어제보단 떨어졌지만 여전히 포근해요',
    '어제보단 선선하지만 포근한 편이에요',
    '어제와 비슷하게 포근한 날씨예요',
    '어제보다 더 따뜻해졌어요',
    '어제보다 훨씬 따뜻해졌어요',
  ],
  // feel=5 더위
  [
    '어제보단 내려갔지만 여전히 더워요',
    '어제보다 조금 누그러졌지만 더워요',
    '어제와 비슷하게 더운 날씨예요',
    '어제보다 더 더워졌어요',
    '어제보다 훨씬 더 더워졌어요',
  ],
]

type Season = 'spring' | 'summer' | 'autumn' | 'winter'

function season(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

function generalLevelText(feelsLikeC: number, month: number): string {
  const s = season(month)
  if (feelsLikeC <= -10) return '한파 수준의 강추위예요'
  if (feelsLikeC <= -5) return '한겨울 강추위예요'
  if (feelsLikeC <= 0) {
    return s === 'winter' ? '전형적인 겨울 날씨예요' : '겨울처럼 추운 날씨예요'
  }
  if (feelsLikeC <= 5) {
    if (s === 'winter') return '평년 겨울 수준이에요'
    if (s === 'spring' || s === 'autumn') return '늦가을·초겨울 수준이에요'
    return '계절에 비해 쌀쌀해요'
  }
  if (feelsLikeC <= 11) {
    if (s === 'spring') return '초봄에 가까운 쌀쌀함이에요'
    if (s === 'autumn') return '늦가을 같은 날씨예요'
    if (s === 'summer') return '여름에 드문 서늘함이에요'
    return '겨울치고는 포근한 편이에요'
  }
  if (feelsLikeC <= 17) {
    if (s === 'spring') return '화창한 봄날 수준이에요'
    if (s === 'autumn') return '선선한 가을 날씨예요'
    if (s === 'summer') return '여름 같지 않게 서늘해요'
    return '겨울에 드물게 따뜻해요'
  }
  if (feelsLikeC <= 22) {
    if (s === 'spring') return '따뜻한 봄날이에요'
    if (s === 'autumn') return '초가을 같은 포근함이에요'
    if (s === 'summer') return '여름치고 쾌적한 편이에요'
    return '겨울이 맞나 싶은 날씨예요'
  }
  if (feelsLikeC <= 26) {
    if (s === 'summer') return '초여름에 가까운 날씨예요'
    return '계절에 비해 더운 편이에요'
  }
  if (feelsLikeC <= 30) return '한여름에 가까운 더위예요'
  if (feelsLikeC <= 33) return '한여름 무더위예요'
  return '폭염 수준의 더위예요'
}

function diurnalLevel(d: number): number {
  if (d < 8) return 0
  if (d < 12) return 1
  return 2
}
const DIURNAL_TEXT = [
  null,
  '일교차가 커요. 겉옷을 챙기세요',
  '일교차가 매우 커요. 얇은 옷 여러 벌이 유리해요',
]

function windLevel(w: number): number {
  if (w < 3) return 0
  if (w < 6) return 1
  if (w < 9) return 2
  return 3
}
const WIND_TEXT = [
  null,
  '바람이 조금 불어요',
  '바람이 강해 체감이 더 낮아요',
  '바람이 매우 강하니 주의하세요',
]

function precipLevel(p: number): number {
  if (p < 0.3) return 0
  if (p < 2) return 1
  if (p < 8) return 2
  return 3
}
const PRECIP_TEXT = [
  null,
  '약한 비가 예보되어 있어요',
  '비 소식이 있어요. 우산을 챙기세요',
  '많은 비가 예상돼요. 외출 시 주의하세요',
]

function forecastHint({
  feelsLikeC,
  laterMinC,
  laterMaxC,
}: {
  feelsLikeC: number
  laterMinC?: number
  laterMaxC?: number
}): string | null {
  if (laterMinC !== undefined && laterMinC < feelsLikeC - 4)
    return `밤에는 ${laterMinC}°까지 내려가요`
  if (laterMaxC !== undefined && laterMaxC > feelsLikeC + 4)
    return `낮에는 ${laterMaxC}°까지 올라가요`
  return null
}

export function buildWeatherCopy({
  feelsLikeC,
  deltaC,
  diurnalRangeC,
  windMs,
  precipMm,
  laterMinC,
  laterMaxC,
  month,
}: CopyInput): CopyOutput {
  const fl = feelLevel(feelsLikeC)
  const dd = deltaDir(deltaC)
  const currentMonth = month ?? new Date().getMonth() + 1

  const head = HEAD_MATRIX[fl][dd]
  const general = generalLevelText(feelsLikeC, currentMonth)

  // sub priority: 강수 > 일교차 > 바람 > 예보힌트
  const p = PRECIP_TEXT[precipLevel(precipMm)]
  const d = DIURNAL_TEXT[diurnalLevel(diurnalRangeC)]
  const w = WIND_TEXT[windLevel(windMs)]
  const sub =
    p ?? d ?? w ?? forecastHint({ feelsLikeC, laterMinC, laterMaxC })

  return {
    head,
    general,
    sub,
    feelLabel: FEEL_LABELS[fl],
    deltaLabel: DELTA_LABELS[dd],
    feelLevel: fl,
    deltaDir: dd,
  }
}
