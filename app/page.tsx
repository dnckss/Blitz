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
              <span className="text-white text-sm font-medium border-b-2 border-primary-500 pb-1">Global Overview</span>
              <span className="text-gray-400 text-sm hover:text-white cursor-pointer">Situations</span>
              <span className="text-gray-400 text-sm hover:text-white cursor-pointer">Ops</span>
              <span className="text-gray-400 text-sm hover:text-white cursor-pointer">Data</span>
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
              <span className="text-gray-400 text-xs">Search...</span>
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
        {/* 왼쪽 패널 - 상황 상세 */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-white text-lg font-semibold mb-2">Possible Conflict in Ukraine</h1>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-xs">Created 2 hours ago by Analyst Smith</span>
            </div>
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-red-900 border border-red-700 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-200 text-xs font-medium">Severity HIGH</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Details 섹션 */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white text-sm font-medium">Details</h3>
                <span className="text-gray-400 text-xs">></span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                Military tensions escalating in eastern regions. Multiple intelligence sources indicate 
                potential for significant conflict escalation within 48-72 hours. OSINT, HUMINT, and 
                SIGINT all reporting increased activity.
              </p>
            </div>

            {/* Intelligence Sources */}
            <div className="border-b border-gray-700 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white text-sm font-medium">Intelligence Sources</h3>
                <span className="text-gray-400 text-xs">></span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300 text-xs">OSINT - Satellite imagery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-xs">HUMINT - Ground reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-300 text-xs">SIGINT - Communications</span>
                </div>
              </div>
            </div>

            {/* Response Plans */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white text-sm font-medium">Response Plans</h3>
                <span className="text-gray-400 text-xs">></span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-gray-800 rounded border border-gray-600">
                  <span className="text-gray-300 text-xs">Evacuation Protocol Alpha</span>
                </div>
                <div className="p-2 bg-gray-800 rounded border border-gray-600">
                  <span className="text-gray-300 text-xs">Diplomatic Channels</span>
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

        {/* 오른쪽 패널 - 인텔 문서 */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-white text-lg font-semibold mb-2">Ukraine Conflict Intel Dossier</h2>
            <div className="space-y-1">
              <span className="text-gray-400 text-xs">Created 2 hours ago by CPT Morrison</span>
              <span className="text-gray-400 text-xs">Last Edited 3 minutes ago</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 인텔 요약 */}
            <div className="border-b border-gray-700 pb-4">
              <p className="text-gray-300 text-xs leading-relaxed">
                Intelligence reports indicate imminent military escalation in eastern Ukraine. 
                Multiple NATO and allied sources confirm increased Russian military activity. 
                Ukrainian forces reporting significant equipment movements near border regions.
              </p>
            </div>

            {/* 조직도 */}
            <div className="border-b border-gray-700 pb-4">
              <h3 className="text-white text-sm font-medium mb-3">Command Structure</h3>
              <div className="bg-gray-800 rounded p-3">
                <div className="text-center mb-3">
                  <div className="bg-gray-700 rounded px-3 py-2 mb-2">
                    <span className="text-white text-xs font-medium">Eastern Command</span>
                  </div>
                  <div className="w-px h-4 bg-gray-600 mx-auto"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-700 rounded px-2 py-1">
                    <span className="text-gray-300 text-xs">Gen. Petrov</span>
                  </div>
                  <div className="bg-gray-700 rounded px-2 py-1">
                    <span className="text-gray-300 text-xs">Col. Volkov</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 정보 카드 */}
            <div className="border-b border-gray-700 pb-4">
              <div className="bg-gray-800 rounded p-3 border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs">🛡</span>
                  <span className="text-white text-sm font-medium">Eastern Command</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Role:</span>
                    <span className="text-gray-300 text-xs">Regional Defense</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Troops:</span>
                    <span className="text-gray-300 text-xs">15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">HQ:</span>
                    <span className="text-gray-300 text-xs">Kiev, Ukraine</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 추가 인텔 */}
            <div>
              <p className="text-gray-300 text-xs leading-relaxed">
                Recent intelligence indicates significant military equipment has been 
                transported to border regions. Multiple armored divisions reported 
                moving into position.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 오버레이 배너 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm rounded px-4 py-2 border border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">K</span>
          <span className="text-white text-xs font-medium">INTELLIGENCE REPORTS LINK THE CONFLICT TO KEY ADVERSARIES</span>
          <span className="text-gray-400 text-xs">←</span>
        </div>
      </div>
    </main>
  )
}