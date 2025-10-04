import { NextRequest } from 'next/server'
import { openai, isOpenAIConfigured } from '@/lib/openai'

// Creates a short market brief using sources from our own endpoints.
// Requires OPENAI_API_KEY. If you don't want AI yet, return a static stub.

export async function GET(req: NextRequest) {
  try {
    const [eventsRes, relRes] = await Promise.all([
      fetch(`${req.nextUrl.origin}/api/events?hours=24`),
      fetch(`${req.nextUrl.origin}/api/reliefweb/reports`)
    ])
    const events = await eventsRes.json().catch(() => ({ features: [] }))
    const reports = await relRes.json().catch(() => ({ reports: [] }))

    const sources = [
      ...(reports?.reports ?? []).slice(0,3)
    ]

    // ---- OpenAI call (commented if key not set) ----
    if (!isOpenAIConfigured()) {
      return Response.json({
        summary: '📊 실시간 시장 분석\n\n• 전쟁 상황 모니터링: 글로벌 핫스팟 추적 중\n• 원자재 가격 변동: 금, 원유 등 주요 상품 실시간 추적\n• 시장 영향 분석: 지리적 리스크 요인 모니터링\n\n🔍 현재 데이터 수집 중...',
        sources
      })
    }

    const sys = 'You are a cautious market analyst. Write concise Korean bullet points (max 5). Include concrete numbers/dates. Avoid investment advice.'
    const user = `다음 전쟁 이벤트(GeoJSON 축약)와 리포트 타이틀을 참고해 오늘의 요약 작성:
events=${JSON.stringify((events.features ?? []).slice(0,30).map((f:any)=>({c:f.properties?.country??'', m:f.properties?.mentioncount??0, t:f.properties?.seendate??''})))}
reports=${JSON.stringify(sources)}`

    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
      temperature: 0.3
    })
    const text = resp.choices[0]?.message?.content ?? '요약 생성 실패'

    return Response.json({ summary: text, sources })
  } catch (e) {
    console.error('OpenAI API Error:', e)
    return Response.json({ 
      summary: '📊 실시간 시장 분석\n\n• 전쟁 상황 모니터링: 글로벌 핫스팟 추적 중\n• 원자재 가격 변동: 금, 원유 등 주요 상품 실시간 추적\n• 시장 영향 분석: 지리적 리스크 요인 모니터링\n\n🔍 API 연결 중...', 
      sources: [] 
    })
  }
}
