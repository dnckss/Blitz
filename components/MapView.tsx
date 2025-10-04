'use client'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Map, Source, Layer, NavigationControl } from 'react-map-gl/maplibre'
import { useQuery } from '@tanstack/react-query'
import { useUI } from '@/stores/ui'

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

export default function MapView() {
  const { timeWindowHours } = useUI()
  const { data, isLoading } = useQuery({
    queryKey: ['war-events', timeWindowHours],
    queryFn: async () => {
      const res = await fetch(`/api/events?hours=${timeWindowHours}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('events error')
      return res.json() as Promise<{ type: 'FeatureCollection', features: any[] }>
    }
  })

  const eventCount = data?.features?.length || 0

  return (
    <div className="relative h-full bg-gray-950 overflow-hidden">
      {/* 팔란티어 스타일 지도 오버레이 */}
      <div className="absolute top-4 left-4 z-10 bg-gray-900/90 backdrop-blur-sm rounded px-3 py-2 border border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-200">
            {eventCount}개 활성 이벤트
          </span>
        </div>
      </div>

      {/* 팔란티어 스타일 범례 */}
      <div className="absolute bottom-4 right-4 z-10 bg-gray-900/90 backdrop-blur-sm rounded px-3 py-2 space-y-2 border border-gray-700">
        <div className="text-xs font-semibold text-white mb-1">심각도</div>
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
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-white">정보 데이터 로딩 중...</span>
          </div>
        </div>
      )}

      {/* 지도 */}
      <Map
        initialViewState={{ longitude: 127.5, latitude: 36.4, zoom: 3 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        cooperativeGestures
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
        {data && (
          <Source id="events" type="geojson" data={data}>
            <Layer {...HIGHLIGHT_LAYER} />
            <Layer {...POINT_LAYER} />
          </Source>
        )}
      </Map>
    </div>
  )
}
