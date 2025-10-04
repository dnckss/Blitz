'use client'
import MapView from '@/components/MapView'
import PriceChart from '@/components/PriceChart'
import SummaryCard from '@/components/SummaryCard'
import { useUI } from '@/stores/ui'

export default function Page() {
  const { timeWindowHours, setTimeWindow } = useUI()
  return (
    <main className="h-screen bg-black flex flex-col">
      {/* 팔란티어 스타일 헤더 */}
      <header className="bg-gray-900 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between px-6 h-12">
          {/* 왼쪽 네비게이션 */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
              <span className="text-white text-sm font-medium border-b-2 border-primary-500 pb-1">글로벌 개요</span>
              <span className="text-gray-400 text-sm hover:text-white cursor-pointer">상황</span>
              <span className="text-gray-400 text-sm hover:text-white cursor-pointer">작전</span>
              <span className="text-gray-400 text-sm hover:text-white cursor-pointer">데이터</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 cursor-pointer">
                <span className="text-gray-300 text-xs">🔍</span>
              </div>
              <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 cursor-pointer">
                <span className="text-gray-300 text-xs">⚙</span>
              </div>
              <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 cursor-pointer">
                <span className="text-gray-300 text-xs">↻</span>
              </div>
            </div>
          </div>
          
          {/* 오른쪽 검색 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded border border-gray-600">
              <span className="text-gray-400 text-xs">검색...</span>
              <span className="text-gray-500 text-xs">Ctrl Space</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-600 rounded-full cursor-pointer hover:bg-gray-500"></div>
              <div className="w-3 h-3 bg-gray-600 rounded-full cursor-pointer hover:bg-gray-500"></div>
              <div className="w-3 h-3 bg-gray-600 rounded-full cursor-pointer hover:bg-gray-500"></div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 3패널 레이아웃 */}
      <div className="flex-1 flex min-h-0">
        {/* 왼쪽 패널 - 원자재 가격 모니터링 */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-white text-lg font-semibold mb-2">실시간 원자재 가격</h1>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-xs">마지막 업데이트: 방금 전</span>
            </div>
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-green-900 border border-green-700 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-200 text-xs font-medium">실시간</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 에너지 섹션 */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm font-medium">에너지</h3>
                <span className="text-gray-400 text-xs">⚡</span>
              </div>
              <div className="space-y-3">
                <PriceChart symbol="WTI" title="WTI 원유" />
                <PriceChart symbol="BRENT" title="브렌트 원유" />
              </div>
            </div>

            {/* 귀금속 섹션 */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm font-medium">귀금속</h3>
                <span className="text-gray-400 text-xs">🥇</span>
              </div>
              <div className="space-y-3">
                <PriceChart symbol="XAU" title="금 (XAU/USD)" />
              </div>
            </div>

            {/* 시장 요약 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm font-medium">시장 동향</h3>
                <span className="text-gray-400 text-xs">📊</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-gray-800 rounded border border-gray-600">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-xs">전체 시장</span>
                    <span className="text-green-400 text-xs font-medium">+2.3%</span>
                  </div>
                  <p className="text-gray-400 text-xs">지역 갈등 우려로 안전자산 선호</p>
                </div>
                <div className="p-3 bg-gray-800 rounded border border-gray-600">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-xs">원유 가격</span>
                    <span className="text-red-400 text-xs font-medium">-1.8%</span>
                  </div>
                  <p className="text-gray-400 text-xs">공급 우려로 인한 변동성 증가</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 중앙 패널 - 지도 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-gray-950 relative">
            <MapView />
          </div>
        </div>

        {/* 오른쪽 패널 - AI 시장 요약 */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-white text-lg font-semibold mb-2">AI 시장 인텔리전스</h2>
            <div className="space-y-1">
              <span className="text-gray-400 text-xs">AI 분석가 시스템</span>
              <span className="text-gray-400 text-xs">실시간 업데이트</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* AI 시장 요약 */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <h3 className="text-white text-sm font-medium">시장 요약</h3>
              </div>
              <SummaryCard />
            </div>

            {/* 주요 지표 */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm font-medium">주요 지표</h3>
                <span className="text-gray-400 text-xs">📈</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600">
                  <span className="text-gray-300 text-xs">글로벌 불안정성 지수</span>
                  <span className="text-red-400 text-xs font-medium">78.5</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600">
                  <span className="text-gray-300 text-xs">원자재 변동성</span>
                  <span className="text-yellow-400 text-xs font-medium">높음</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600">
                  <span className="text-gray-300 text-xs">시장 신뢰도</span>
                  <span className="text-green-400 text-xs font-medium">보통</span>
                </div>
              </div>
            </div>

            {/* 위험 요소 */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm font-medium">위험 요소</h3>
                <span className="text-gray-400 text-xs">⚠️</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-red-900/20 border border-red-700/30 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span className="text-red-300 text-xs font-medium">지역 갈등</span>
                  </div>
                  <p className="text-gray-400 text-xs">우크라이나 동부 긴장 고조</p>
                </div>
                <div className="p-2 bg-yellow-900/20 border border-yellow-700/30 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-300 text-xs font-medium">공급망 불안</span>
                  </div>
                  <p className="text-gray-400 text-xs">에너지 공급 우려</p>
                </div>
              </div>
            </div>

            {/* 시장 전망 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-sm font-medium">시장 전망</h3>
                <span className="text-gray-400 text-xs">🔮</span>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded border border-blue-700/30">
                <p className="text-gray-300 text-xs leading-relaxed">
                  AI 분석에 따르면 향후 48시간 내 원자재 시장의 변동성이 증가할 것으로 예상됩니다. 
                  안전자산인 금에 대한 수요가 증가하고, 에너지 자원의 공급 불안정성으로 인한 가격 상승 우려가 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 오버레이 배너 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm rounded px-4 py-2 border border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">K</span>
          <span className="text-white text-xs font-medium">정보 보고서가 갈등을 주요 적대국과 연관시킴</span>
          <span className="text-gray-400 text-xs">←</span>
        </div>
      </div>
    </main>
  )
}