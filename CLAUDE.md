# YesterToday - Weather Comparison PWA

## Product
Compare yesterday's vs today's weather at user's location, and recommend running outfit based on feels-like temp & wind. Personal use, mobile-first PWA. Will be ported to native iOS (SwiftUI) in Phase 3.

## Stack
- Next.js 15 App Router, TypeScript strict
- Tailwind CSS + shadcn/ui (only: card, tabs, button, skeleton)
- Open-Meteo API (no key, CORS ok, call from client)
- PWA via Serwist
- No backend, no database. localStorage only.

## Architecture
- Two-tab layout: /compare (default), /running
- All weather fetching in `/lib/weather/` — pure functions, easy to port to Swift later
- Outfit rules in `/lib/outfit/rules.ts` — table-driven, not hardcoded in JSX
- Location: `/lib/location.ts` handles Geolocation + localStorage fallback

## Conventions
- Server Components by default, "use client" only for Geolocation/localStorage/tabs
- Types in `/types/weather.ts`, shared across fetcher + UI
- No Zustand/Redux. URL search params + React state only.
- Fetch with native fetch + Next.js cache. No SWR/React Query unless needed.
- Error states: show last cached data + toast, never blank screen

## Code Style
- 2-space indent, no semicolons, single quotes
- Named exports only
- File names kebab-case, components PascalCase
- Tailwind class order: layout → spacing → typography → color → state

## Scope Discipline
- Phase 1 = compare tab + running tab only
- DO NOT add: auth, database, multi-location, forecast beyond today, settings page
- DO NOT install: state management libs, date libs (use Intl), heavy chart libs
- If unsure whether a feature fits Phase 1, ask before coding

## Testing
- Manual testing on iPhone Safari is the bar
- No unit tests in Phase 1 (personal use, small scope)

## Design Language
- Minimal, high contrast, large numbers (temp should be hero)
- Comparison: show delta prominently (e.g., "+3°C than yesterday")
- Color-code: warmer=amber, colder=blue, similar=neutral
- Running tab: visual outfit list, not paragraphs

## Phase Roadmap
- Phase 1 (current): Web PWA MVP — compare + running tabs
- Phase 2: Last-location fallback polish, dark mode, favorites
- Phase 3: Native iOS port (SwiftUI + WidgetKit) after Mac acquisition
  - Keep business logic pure so it translates directly to Swift
