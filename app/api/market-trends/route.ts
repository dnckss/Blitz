import { NextResponse } from 'next/server'

interface MarketTrend {
  category: string
  change: number
  description: string
  trend: 'up' | 'down' | 'neutral'
}

// 실제 금융 데이터와 시뮬레이션 결합
export async function GET() {
  try {
    // 실제 원자재 가격 데이터와 시장 지수 가져오기
    const [wtiRes, brentRes, goldRes, indicesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/prices/WTI`).catch(() => null),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/prices/BRENT`).catch(() => null),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/prices/XAU`).catch(() => null),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/market-indices`).catch(() => null)
    ])

    const wtiData = wtiRes ? await wtiRes.json().catch(() => null) : null
    const brentData = brentRes ? await brentRes.json().catch(() => null) : null
    const goldData = goldRes ? await goldRes.json().catch(() => null) : null
    const indicesData = indicesRes ? await indicesRes.json().catch(() => null) : null

    // 실제 가격 변화율 계산
    const calculateChange = (data: any) => {
      if (!data?.points || data.points.length < 2) return 0
      const current = data.points[data.points.length - 1].y
      const previous = data.points[data.points.length - 2].y
      return ((current - previous) / previous) * 100
    }

    // 실제 시장 지수 데이터에서 S&P 500과 VIX 가져오기
    const sp500Index = indicesData?.find((idx: any) => idx.symbol === 'SPY')
    const vixIndex = indicesData?.find((idx: any) => idx.symbol === 'VIX')

    const trends: MarketTrend[] = [
      {
        category: 'S&P 500',
        change: sp500Index?.changePercent || Math.random() * 4 - 2,
        description: sp500Index ? getRealTimeIndexDescription('stocks', sp500Index.changePercent) : getDescription('global_stocks'),
        trend: (sp500Index?.changePercent || 0) >= 0 ? 'up' : 'down'
      },
      {
        category: 'WTI 원유',
        change: calculateChange(wtiData) || Math.random() * 6 - 3,
        description: wtiData ? getRealTimeDescription('oil', calculateChange(wtiData)) : getDescription('oil'),
        trend: calculateChange(wtiData) >= 0 ? 'up' : 'down'
      },
      {
        category: '브렌트 원유',
        change: calculateChange(brentData) || Math.random() * 6 - 3,
        description: brentData ? getRealTimeDescription('oil', calculateChange(brentData)) : getDescription('oil'),
        trend: calculateChange(brentData) >= 0 ? 'up' : 'down'
      },
      {
        category: '금 (XAU)',
        change: calculateChange(goldData) || Math.random() * 3 - 1.5,
        description: goldData ? getRealTimeDescription('gold', calculateChange(goldData)) : getDescription('gold'),
        trend: calculateChange(goldData) >= 0 ? 'up' : 'neutral'
      },
      {
        category: 'VIX 지수',
        change: vixIndex?.changePercent || Math.random() * 8 + 2,
        description: vixIndex ? getRealTimeIndexDescription('volatility', vixIndex.changePercent) : getDescription('volatility'),
        trend: 'up'
      }
    ]

    // 글로벌 이벤트 기반 동적 조정
    const globalEvents = await getGlobalEvents()
    adjustTrendsBasedOnEvents(trends, globalEvents)

    return NextResponse.json(trends, { 
      headers: { 
        'Cache-Control': 's-maxage=30, stale-while-revalidate=60' 
      } 
    })
  } catch (error) {
    console.error('Error fetching market trends:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch market trends' 
    }, { status: 500 })
  }
}

async function getGlobalEvents() {
  try {
    // 전쟁 지역 데이터 가져오기
    const warZonesRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/war-zones`)
    const warZones = await warZonesRes.json().catch(() => ({ features: [] }))
    
    const activeConflicts = warZones.features?.filter((f: any) => 
      f.properties.status === 'active_conflict' && f.properties.intensity > 7
    ).length || 0

    return { activeConflicts }
  } catch {
    return { activeConflicts: 0 }
  }
}

function adjustTrendsBasedOnEvents(trends: MarketTrend[], events: any) {
  if (events.activeConflicts > 2) {
    // 활성 분쟁이 많을 때
    const oilTrend = trends.find(t => t.category.includes('원유'))
    if (oilTrend) {
      oilTrend.change = Math.abs(oilTrend.change) + Math.random() * 3
      oilTrend.trend = 'up'
      oilTrend.description = '지정학적 리스크로 공급 우려 확대'
    }

    const goldTrend = trends.find(t => t.category.includes('금'))
    if (goldTrend) {
      goldTrend.change = Math.abs(goldTrend.change) + Math.random() * 2
      goldTrend.trend = 'up'
      goldTrend.description = '안전자산 선호 확대'
    }

    const vixTrend = trends.find(t => t.category.includes('VIX'))
    if (vixTrend) {
      vixTrend.change = Math.random() * 15 + 10
      vixTrend.description = '글로벌 불확실성으로 변동성 급증'
    }
  }
}

function getRealTimeDescription(category: string, change: number): string {
  const absChange = Math.abs(change)
  
  if (category === 'oil') {
    if (absChange > 3) return change > 0 ? '공급 우려로 급등' : '수요 감소 우려로 급락'
    if (absChange > 1) return change > 0 ? '지정학적 리스크 영향' : '경기 둔화 우려'
    return '안정적 거래'
  }
  
  if (category === 'gold') {
    if (absChange > 2) return change > 0 ? '안전자산 선호 급증' : '달러 강세 압력'
    if (absChange > 0.5) return change > 0 ? '인플레이션 헤지 수요' : '금리 상승 기대'
    return '안정적 거래'
  }
  
  return '시장 동향 분석 중'
}

function getRealTimeIndexDescription(category: string, change: number): string {
  const absChange = Math.abs(change)
  
  if (category === 'stocks') {
    if (absChange > 2) return change > 0 ? '강세 모멘텀 지속' : '리스크 오프 확산'
    if (absChange > 0.5) return change > 0 ? '안정적 상승세' : '신중한 거래'
    return '횡보 세력'
  }
  
  if (category === 'volatility') {
    if (absChange > 15) return '극도의 불안정성'
    if (absChange > 8) return '높은 변동성'
    if (absChange > 3) return '중간 변동성'
    return '낮은 변동성'
  }
  
  return '시장 지수 분석 중'
}

function getDescription(category: string): string {
  const descriptions = {
    global_stocks: [
      '지역 갈등 우려로 신중한 거래',
      '안전자산 선호 확대',
      '공급망 불안으로 변동성 증가',
      '중앙은행 정책 기대감'
    ],
    oil: [
      '공급 우려로 인한 변동성 증가',
      '지정학적 리스크 확대',
      '수요 회복 기대감',
      '재고 감소 우려'
    ],
    gold: [
      '인플레이션 헤지 수요 증가',
      '달러 강세로 하락 압력',
      '안전자산 선호 확대',
      '실질 금리 상승 우려'
    ],
    safe_assets: [
      '위험 회피 심리 확산',
      '금리 상승 기대감',
      '유동성 선호 증가',
      '안정성 추구'
    ],
    volatility: [
      '지정학적 불확실성 확대',
      '시장 변동성 증가',
      '리스크 프리미엄 상승',
      '투자자 불안 심리'
    ]
  }
  
  const categoryDescriptions = descriptions[category as keyof typeof descriptions] || ['시장 동향 분석 중']
  return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)]
}
