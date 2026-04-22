# YesterToday

어제와 오늘의 날씨를 비교하고, 현재 체감온도·바람·강수를 기반으로 러닝 착장을 추천하는 모바일 퍼스트 PWA. Open-Meteo API를 사용하며 백엔드·데이터베이스 없이 localStorage만으로 동작한다.

## 로컬 개발

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 (→ `/compare` 자동 리다이렉트).

## Vercel 배포

1. 이 저장소를 GitHub에 push
2. [vercel.com](https://vercel.com) → **Add New Project** → GitHub 저장소 선택
3. Framework: **Next.js** 자동 감지 확인 후 **Deploy**
4. 배포 완료 후 생성된 URL로 접속

## iPhone 홈 화면 설치 (PWA)

1. Safari에서 배포된 URL 접속
2. 하단 **공유** 버튼 탭
3. **홈 화면에 추가** 선택 → **추가**
4. 홈 화면의 YesterToday 아이콘으로 앱처럼 실행

> **아이콘 교체**: `public/icon-192.png`, `public/icon-512.png` 파일을 실제 아이콘으로 교체하면 된다 (현재는 slate-900 배경 + Y 텍스트 placeholder).

## 로드맵

| 단계 | 내용 |
|------|------|
| Phase 1 (현재) | 날씨 비교 탭 + 러닝 착장 탭, PWA 설치 가능 |
| Phase 2 | 다크 모드, 마지막 위치 폴백 개선, 즐겨찾기 위치 |
| Phase 3 | SwiftUI 네이티브 iOS 앱 + WidgetKit (Mac 구매 후) |
