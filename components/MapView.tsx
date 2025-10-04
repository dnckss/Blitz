'use client'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Map, Source, Layer, NavigationControl } from 'react-map-gl/maplibre'
import { useQuery } from '@tanstack/react-query'
import { useUI } from '@/stores/ui'
import { useState } from 'react'

const POINT_LAYER: any = {
  id: 'events',
  type: 'circle',
  paint: {
    'circle-radius': [
      'interpolate', ['linear'], ['get', 'severity'],
      0, 6,
      1, 8,
      2, 12
    ],
    'circle-color': [
      'interpolate', ['linear'], ['get', 'severity'],
      0, '#fca5a5',
      1, '#ef4444',
      2, '#dc2626'
    ],
    'circle-opacity': 0.8,
    'circle-stroke-color': '#ffffff',
    'circle-stroke-width': 2
  }
}

const HIGHLIGHT_LAYER: any = {
  id: 'events-highlight',
  type: 'circle',
  paint: {
    'circle-radius': [
      'interpolate', ['linear'], ['get', 'severity'],
      0, 10,
      1, 14,
      2, 20
    ],
    'circle-color': [
      'interpolate', ['linear'], ['get', 'severity'],
      0, '#fca5a5',
      1, '#ef4444',
      2, '#dc2626'
    ],
    'circle-opacity': 0.3
  }
}

// 전쟁 지역 폴리곤 레이어
const WAR_ZONE_LAYER: any = {
  id: 'war-zones',
  type: 'fill',
  paint: {
    'fill-color': [
      'interpolate', ['linear'], ['get', 'intensity'],
      0, 'rgba(220, 38, 38, 0.1)',
      3, 'rgba(220, 38, 38, 0.3)',
      5, 'rgba(220, 38, 38, 0.5)',
      7, 'rgba(220, 38, 38, 0.7)',
      10, 'rgba(220, 38, 38, 0.9)'
    ],
    'fill-opacity': 0.6
  }
}

// 전쟁 지역 테두리 레이어
const WAR_ZONE_OUTLINE: any = {
  id: 'war-zones-outline',
  type: 'line',
  paint: {
    'line-color': [
      'interpolate', ['linear'], ['get', 'intensity'],
      0, '#dc2626',
      5, '#ef4444',
      10, '#991b1b'
    ],
    'line-width': [
      'interpolate', ['linear'], ['get', 'intensity'],
      0, 1,
      5, 2,
      10, 3
    ],
    'line-opacity': 0.8
  }
}

// 전쟁 지역 펄스 효과 레이어
const WAR_ZONE_PULSE: any = {
  id: 'war-zones-pulse',
  type: 'fill',
  paint: {
    'fill-color': 'rgba(220, 38, 38, 0.2)',
    'fill-opacity': [
      'interpolate', ['linear'], ['get', 'intensity'],
      0, 0,
      5, 0.3,
      10, 0.5
    ]
  }
}

export default function MapView() {
  const { timeWindowHours } = useUI()
  const [selectedWarZone, setSelectedWarZone] = useState<any>(null)
  
  // 기존 이벤트 데이터
  const { data, isLoading } = useQuery({
    queryKey: ['war-events', timeWindowHours],
    queryFn: async () => {
      const res = await fetch(`/api/events?hours=${timeWindowHours}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('events error')
      return res.json() as Promise<{ type: 'FeatureCollection', features: any[] }>
    }
  })
  
  // 전쟁 지역 데이터
  const { data: warZonesData, isLoading: warZonesLoading } = useQuery({
    queryKey: ['war-zones'],
    queryFn: async () => {
      const res = await fetch('/api/war-zones', { cache: 'no-store' })
      if (!res.ok) throw new Error('war zones error')
      return res.json() as Promise<{ type: 'FeatureCollection', features: any[], totalZones: number, activeConflicts: number }>
    },
    refetchInterval: 30000 // 30초마다 업데이트
  })

  const eventCount = data?.features?.length || 0
  const warZoneCount = warZonesData?.totalZones || 0
  const activeConflicts = warZonesData?.activeConflicts || 0

  return (
    <div className="relative h-full bg-gray-950 overflow-hidden">
      {/* 팔란티어 스타일 지도 오버레이 */}
      <div className="absolute top-4 left-4 z-10 bg-gray-900/90 backdrop-blur-sm rounded px-3 py-2 border border-gray-700 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-200">
            {eventCount}개 활성 이벤트
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-red-200">
            {activeConflicts}개 활성 분쟁 지역
          </span>
        </div>
      </div>

      {/* 팔란티어 스타일 범례 */}
      <div className="absolute bottom-4 right-4 z-10 bg-gray-900/90 backdrop-blur-sm rounded px-3 py-2 space-y-3 border border-gray-700">
        <div className="text-xs font-semibold text-white mb-1">이벤트 심각도</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
            <span className="text-xs text-gray-300">낮음</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span className="text-xs text-gray-300">보통</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
            <span className="text-xs text-gray-300">높음</span>
          </div>
        </div>
        
        <div className="text-xs font-semibold text-white mb-1">분쟁 지역 강도</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-red-500/30 rounded"></div>
            <span className="text-xs text-gray-300">낮음</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-red-500/60 rounded"></div>
            <span className="text-xs text-gray-300">보통</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-300">높음</span>
          </div>
        </div>
      </div>

      {/* 로딩 상태 */}
      {(isLoading || warZonesLoading) && (
        <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-white">정보 데이터 로딩 중...</span>
          </div>
        </div>
      )}

      {/* 지도 */}
      <Map
        initialViewState={{ longitude: 37.5, latitude: 48.0, zoom: 5 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        cooperativeGestures
        onClick={(event) => {
          // 클릭 이벤트로 선택된 전쟁 지역 초기화
          setSelectedWarZone(null)
        }}
      >
        <NavigationControl 
          position="top-right" 
          style={{ 
            marginTop: '60px',
            marginRight: '10px',
            backgroundColor: '#1f2937',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            border: '1px solid #374151'
          }}
        />
        {/* 전쟁 지역 레이어 */}
        {warZonesData && (
          <Source id="war-zones" type="geojson" data={warZonesData}>
            <Layer {...WAR_ZONE_PULSE} />
            <Layer {...WAR_ZONE_LAYER} />
            <Layer {...WAR_ZONE_OUTLINE} 
              onClick={(event: any) => {
                const feature = event.features?.[0]
                if (feature) {
                  setSelectedWarZone(feature.properties)
                }
              }}
            />
          </Source>
        )}
        
        {/* 기존 이벤트 레이어 */}
        {data && (
          <Source id="events" type="geojson" data={data}>
            <Layer {...HIGHLIGHT_LAYER} />
            <Layer {...POINT_LAYER} />
          </Source>
        )}
      </Map>
      
      {/* 전쟁 지역 상세 정보 팝업 */}
      {selectedWarZone && (
        <div className="absolute top-20 left-4 z-20 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm">{selectedWarZone.region}</h3>
            <button 
              onClick={() => setSelectedWarZone(null)}
              className="text-gray-400 hover:text-white text-lg"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">국가:</span>
              <span className="text-gray-300 text-xs">{selectedWarZone.country}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">상태:</span>
              <span className={`text-xs font-medium ${
                selectedWarZone.status === 'active_conflict' ? 'text-red-400' :
                selectedWarZone.status === 'shelling' ? 'text-orange-400' :
                selectedWarZone.status === 'tension' ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {selectedWarZone.status === 'active_conflict' ? '활성 분쟁' :
                 selectedWarZone.status === 'shelling' ? '포격 중' :
                 selectedWarZone.status === 'tension' ? '긴장 고조' : '모니터링'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">강도:</span>
              <span className="text-gray-300 text-xs">{selectedWarZone.intensity}/10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">마지막 업데이트:</span>
              <span className="text-gray-300 text-xs">
                {new Date(selectedWarZone.lastUpdate).toLocaleTimeString('ko-KR')}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <p className="text-gray-300 text-xs leading-relaxed">
                {selectedWarZone.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
