import { NextRequest } from 'next/server'
import { openai, isOpenAIConfigured } from '@/lib/openai'

// Creates a short market brief using sources from our own endpoints.
// Requires OPENAI_API_KEY. If you don't want AI yet, return a static stub.

export async function GET(req: NextRequest) {
  try {
    const [eventsRes, relRes] = await Promise.all([
      fetch(`${req.nextUrl.origin}/api/events?hours=72`),
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

    // 현재 시간 KST 계산
    const now = new Date()
    const kst = new Date(now.getTime() + (9 * 60 * 60 * 1000)) // UTC+9
    const todayKST = kst.toISOString().split('T')[0] // YYYY-MM-DD

    const sys = "당신은 최신 분쟁 이슈만 반영하는 거시·금융 애널리스트로서, 최근 72시간 내 진행 중 분쟁의 글로벌 시장 함의를 한국어 3~4문장으로 간단 요약하되 전쟁 서사는 생략하고 **자산군(에너지·해운·금리·FX·주식)**의 **방향성(상승 압력/약세/변동성 확대 등)**만 명확히 서술하며 숫자·지표·링크·불릿 금지, 투자 조언 금지, 한국 시장 한 줄 함의 포함, 문단 끝에 자료 기준: YYYY-MM-DD KST 표기하지말기."
    
    const user = `근 72시간 기준 진행 중인 분쟁 데이터를 분석해 에너지·해운·금리·FX·주식의 방향성만 3~4문장으로 아주 간단히 요약해줘(예: "러-우 전쟁→에너지 상승 압력, 중동 리스크→운임·안전자산 선호 확대"처럼); 전쟁 설명은 생략하고 한국 시장 영향 1문장 포함, 숫자/지표/출처/링크 제외, 투자 조언 금지, 마지막 줄에 자료 기준: ${todayKST} KST만 표기하지말기.`

    const tools = [{
      type: "function" as const,
      function: {
        name: "search_recent_geopolitics",
        description: "지난 72시간 내 전쟁/분쟁과 시장 영향 데이터 검색 후 핵심 포인트를 반환",
        parameters: {
          type: "object",
          properties: {
            queries: { 
              type: "array", 
              items: { type: "string" },
              description: "검색할 분쟁 지역 또는 키워드 목록"
            },
            hours: { 
              type: "integer", 
              default: 72,
              description: "검색 대상 시간 범위(시간 단위)"
            }
          },
          required: ["queries"]
        }
      }
    }]

    const resp = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user }
      ],
      tools: tools,
      tool_choice: "auto",
      temperature: 0.2,
      max_tokens: 220
    })

    let finalText = resp.choices[0]?.message?.content ?? '요약 생성 실패'

    // 함수 호출이 있는 경우 처리
    if (resp.choices[0]?.message?.tool_calls) {
      const toolCall = resp.choices[0].message.tool_calls[0]
      
      if (toolCall.function.name === "search_recent_geopolitics") {
        try {
          const args = JSON.parse(toolCall.function.arguments)
          const queries = args.queries || ['Ukraine conflict', 'Middle East tensions', 'China Taiwan']
          const hours = args.hours || 72
          
          // 실제 지오폴리틱스 데이터 검색 (현재는 이벤트 데이터 사용)
          const geopoliticsData = events.features?.slice(0, 10).map((f: any) => ({
            location: f.properties?.country || 'Unknown',
            severity: f.properties?.severity || 0,
            date: f.properties?.seendate || new Date().toISOString()
          })) || []
          
          // 추가 분석을 위한 두 번째 API 호출
          const followUpResp = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: sys },
              { role: "user", content: user },
              { role: "assistant", content: finalText },
              { role: "user", content: `다음 지오폴리틱스 데이터를 바탕으로 시장 영향 분석을 보완해주세요: ${JSON.stringify(geopoliticsData)}` }
            ],
            temperature: 0.2,
            max_tokens: 220
          })
          
          finalText = followUpResp.choices[0]?.message?.content ?? finalText
        } catch (error) {
          console.error('Tool call processing error:', error)
        }
      }
    }

    return Response.json({ summary: finalText, sources })
  } catch (e) {
    console.error('OpenAI API Error:', e)
    return Response.json({ 
      summary: '📊 실시간 시장 분석\n\n• 전쟁 상황 모니터링: 글로벌 핫스팟 추적 중\n• 원자재 가격 변동: 금, 원유 등 주요 상품 실시간 추적\n• 시장 영향 분석: 지리적 리스크 요인 모니터링\n\n🔍 API 연결 중...', 
      sources: [] 
    })
  }
}
