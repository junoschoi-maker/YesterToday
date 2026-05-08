// YesterToday Widget — Scriptable
// 어제 대비 오늘 실제 기온 차이
// https://github.com/junoschoi-maker/YesterToday

const BASE = 'https://api.open-meteo.com/v1'
const HIST = 'https://historical-forecast-api.open-meteo.com/v1'
const CACHE_KEY = 'yt_widget_cache'

// ── 위치 가져오기 ─────────────────────────────────────────────
async function getLocation() {
  try {
    Location.setAccuracyToHundredMeters()
    const loc = await Location.current()
    return { lat: loc.latitude, lon: loc.longitude }
  } catch {
    return { lat: 37.5665, lon: 126.978 } // 서울 fallback
  }
}

// ── 오늘 현재 기온 ────────────────────────────────────────────
async function fetchToday(lat, lon) {
  const url =
    `${BASE}/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m&timezone=auto`
  const req = new Request(url)
  const json = await req.loadJSON()
  return Math.round(json.current.temperature_2m)
}

// ── 어제 같은 시각 기온 ───────────────────────────────────────
async function fetchYesterday(lat, lon) {
  const now = new Date()
  const yest = new Date(now)
  yest.setDate(now.getDate() - 1)
  const ymd = yest.toISOString().split('T')[0]
  const hour = now.getHours()

  const url =
    `${HIST}/forecast?latitude=${lat}&longitude=${lon}` +
    `&start_date=${ymd}&end_date=${ymd}&hourly=temperature_2m&timezone=auto`
  const req = new Request(url)
  const json = await req.loadJSON()
  return Math.round(json.hourly.temperature_2m[hour])
}

// ── 캐시 (오프라인 대비) ──────────────────────────────────────
function saveCache(data) {
  Keychain.set(CACHE_KEY, JSON.stringify(data))
}
function loadCache() {
  try { return JSON.parse(Keychain.get(CACHE_KEY)) }
  catch { return null }
}

// ── 위젯 그리기 ───────────────────────────────────────────────
function buildWidget(todayC, yesterdayC, isStale = false) {
  const delta  = todayC - yesterdayC
  const sign   = delta > 0 ? '+' : delta < 0 ? '−' : ''
  const absD   = Math.abs(delta)
  const isWarm = delta >= 0

  const widget = new ListWidget()
  widget.setPadding(16, 18, 14, 18)

  // 배경 그라데이션 (앱과 동일 톤)
  const grad = new LinearGradient()
  if (isWarm) {
    grad.colors  = [new Color('#1c0e04'), new Color('#2e1600')]
  } else {
    grad.colors  = [new Color('#040c1c'), new Color('#001030')]
  }
  grad.locations  = [0.0, 1.0]
  grad.startPoint = new Point(0, 0)
  grad.endPoint   = new Point(1, 1)
  widget.backgroundGradient = grad

  // 라벨
  const lbl = widget.addText('어제 대비')
  lbl.font      = Font.boldSystemFont(11)
  lbl.textColor = new Color('#ffffff', 0.55)

  widget.addSpacer(4)

  // 대형 델타 숫자
  const big = widget.addText(`${sign}${absD}°`)
  big.font               = Font.boldSystemFont(56)
  big.textColor          = isWarm ? new Color('#f4a68a') : new Color('#8cc0ef')
  big.minimumScaleFactor = 0.5

  widget.addSpacer(2)

  // 오늘 / 어제 실제 기온
  const sub = widget.addText(`오늘 ${todayC}°  어제 ${yesterdayC}°`)
  sub.font      = Font.mediumSystemFont(11)
  sub.textColor = new Color('#ffffff', 0.55)

  // stale 표시
  if (isStale) {
    widget.addSpacer(4)
    const st = widget.addText('⚠ 캐시 데이터')
    st.font      = Font.systemFont(9)
    st.textColor = new Color('#f59e0b', 0.8)
  }

  // 30분 후 갱신
  widget.refreshAfterDate = new Date(Date.now() + 30 * 60 * 1000)

  return widget
}

// ── 메인 ─────────────────────────────────────────────────────
let todayC, yesterdayC, stale = false

try {
  const { lat, lon } = await getLocation()
  ;[todayC, yesterdayC] = await Promise.all([
    fetchToday(lat, lon),
    fetchYesterday(lat, lon),
  ])
  saveCache({ todayC, yesterdayC })
} catch (e) {
  const cache = loadCache()
  if (cache) {
    todayC     = cache.todayC
    yesterdayC = cache.yesterdayC
    stale      = true
  } else {
    const w = new ListWidget()
    const t = w.addText('날씨 로딩 실패')
    t.textColor = Color.white()
    Script.setWidget(w)
    Script.complete()
  }
}

const widget = buildWidget(todayC, yesterdayC, stale)

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  await widget.presentSmall()
}

Script.complete()
