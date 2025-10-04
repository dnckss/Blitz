# War & Commodities MVP (Next.js + Supabase)

**무료 티어만 사용(오픈AI 제외)** 기준의 스타터.  
지도: MapLibre(데모 타일) · 전쟁이벤트: GDELT · 금: Metals-API · 유가: EIA API.

## 0) 빠른 시작

```bash
pnpm i   # 또는 npm i / yarn
cp .env.example .env.local
# 위 .env.local 에 키를 채워 넣으세요 (EIA / METALS / OPENAI 등)
pnpm dev
```

## 1) 환경변수(.env.local)

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase 프로젝트 생성 후 대시보드에서 복사
- `EIA_API_KEY` — 무료: https://www.eia.gov/opendata/
- `METALS_API_KEY` — 무료: https://metals-api.com/
- `RELIEFWEB_APPNAME` — 무료 appname 필수(2025/11부터 의무). https://apidoc.reliefweb.int/
- `OPENAI_API_KEY` — 이미 보유
- `TWELVEDATA_API_KEY` — (선택)

> 요청하신 대로 **키 관련 질문은 코드 내 주석**으로 표시했습니다.

## 2) 포함된 기능

- `/api/events` — GDELT GEO 2.0을 GeoJSON으로 프록시 (24h 기본, `?hours=`)
- `/api/prices/{WTI|BRENT|XAU}` — EIA(유가, 일간) + Metals-API(금)
- `/api/reliefweb/reports` — 최근 리포트 5건 (출처 카드용)
- `/api/summary` — OpenAI 기반 마켓 브리프(키 없으면 스텁 반환)
- 프론트: 6:3:1 레이아웃(맵 / 가격 / 요약), React Query, Zustand
- 지도: MapLibre 데모 스타일(키 필요없음)
- 차트: Nivo Line

## 3) Supabase

- `supabase/schema.sql`, `supabase/policies.sql` 를 SQL Editor에서 실행
- 커뮤니티 테이블(posts/comments)과 요약/이벤트/가격의 최소 스키마

## 4) 크론(선택)

Vercel Cron으로 `/api/events`·`/api/prices/*`를 주기적으로 호출 → Supabase에 적재하는 잡을 추가해도 됩니다(서버리스 함수 or Edge).

## 5) 라이선스/주의

- OSM/데모 타일은 트래픽 제한이 있으니 상용화 전에는 MapTiler 등의 키 기반 타일로 교체 권장.
- 금융/전쟁 데이터는 지연/오류 가능. **출처 표기와 면책 안내** 포함 권장.
