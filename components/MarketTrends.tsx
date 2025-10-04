'use client'
import { useQuery } from '@tanstack/react-query'

interface MarketTrend {
  category: string
  change: number
  description: string
  trend: 'up' | 'down' | 'neutral'
}

export default function MarketTrends() {
  const { data: trends, isLoading } = useQuery({
    queryKey: ['market-trends'],
    queryFn: async () => {
      const res = await fetch('/api/market-trends', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load market trends')
      return res.json() as Promise<MarketTrend[]>
    },
    refetchInterval: 30000 // 30초마다 업데이트
  })

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="p-3 bg-gray-800 rounded border border-gray-600 animate-pulse">
          <div className="flex items-center justify-between mb-1">
            <div className="w-16 h-3 bg-gray-700 rounded"></div>
            <div className="w-12 h-3 bg-gray-700 rounded"></div>
          </div>
          <div className="w-24 h-3 bg-gray-700 rounded"></div>
        </div>
        <div className="p-3 bg-gray-800 rounded border border-gray-600 animate-pulse">
          <div className="flex items-center justify-between mb-1">
            <div className="w-16 h-3 bg-gray-700 rounded"></div>
            <div className="w-12 h-3 bg-gray-700 rounded"></div>
          </div>
          <div className="w-32 h-3 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!trends || trends.length === 0) {
    return (
      <div className="space-y-2">
        <div className="p-3 bg-gray-800 rounded border border-gray-600">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-300 text-xs">데이터 없음</span>
            <span className="text-gray-500 text-xs">--</span>
          </div>
          <p className="text-gray-500 text-xs">시장 데이터 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {trends.map((trend, index) => (
        <div key={index} className="p-3 bg-gray-800 rounded border border-gray-600 hover:bg-gray-800/80 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-300 text-xs">{trend.category}</span>
            <span className={`text-xs font-medium ${
              trend.trend === 'up' ? 'text-green-400' :
              trend.trend === 'down' ? 'text-red-400' :
              'text-gray-400'
            }`}>
              {trend.change >= 0 ? '+' : ''}{trend.change.toFixed(1)}%
            </span>
          </div>
          <p className="text-gray-400 text-xs">{trend.description}</p>
        </div>
      ))}
    </div>
  )
}
