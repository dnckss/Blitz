'use client'
import { ResponsiveLine } from '@nivo/line'
import { useQuery } from '@tanstack/react-query'

type Props = { symbol: 'WTI' | 'BRENT' | 'XAU', title?: string }
export default function PriceChart({ symbol, title }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['price', symbol],
    queryFn: async () => {
      const res = await fetch(`/api/prices/${symbol}`)
      if (!res.ok) throw new Error('price fetch failed')
      return res.json() as Promise<{ points: { x: string, y: number }[] }>
    }
  })

  const currentPrice = data?.points?.[data.points.length - 1]?.y
  const previousPrice = data?.points?.[data.points.length - 2]?.y
  const change = currentPrice && previousPrice ? currentPrice - previousPrice : 0
  const changePercent = currentPrice && previousPrice ? ((change / previousPrice) * 100) : 0

  const getSymbolColor = (symbol: string) => {
    switch (symbol) {
      case 'XAU': return '#f59e0b' // 금색
      case 'WTI': return '#ef4444' // 빨간색
      case 'BRENT': return '#dc2626' // 진한 붉은색
      default: return '#6b7280'
    }
  }

  const symbolColor = getSymbolColor(symbol)

  return (
    <div className="bg-gray-900/30 rounded-md border border-gray-800/50 p-3 hover:bg-gray-900/50 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: symbolColor }}
          ></div>
          <h3 className="font-medium text-white text-xs uppercase tracking-wide">{title ?? symbol}</h3>
        </div>
        
        {currentPrice && (
          <div className="text-right">
            <div className="text-sm font-semibold text-white">
              ${currentPrice.toFixed(2)}
            </div>
            <div className={`text-xs font-medium flex items-center gap-1 ${
              change >= 0 ? 'text-success' : 'text-danger'
            }`}>
              {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
            </div>
          </div>
        )}
      </div>
      
      <div className="h-16">
        {isLoading ? (
          <div className="flex items-center justify-center h-full bg-gray-800/30 rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-gray-300">Loading...</span>
            </div>
          </div>
        ) : data?.points?.length ? (
          <ResponsiveLine
            data={[{ id: symbol, data: data?.points ?? [] }]}
            margin={{ top: 10, right: 20, bottom: 20, left: 40 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', stacked: false }}
            colors={[symbolColor]}
            lineWidth={2}
            axisBottom={{ 
              tickSize: 0, 
              tickPadding: 5,
              tickValues: [],
              domainLine: { stroke: '#e2e8f0', strokeWidth: 1 }
            }}
            axisLeft={{ 
              tickSize: 0, 
              tickPadding: 5,
              domainLine: { stroke: '#e2e8f0', strokeWidth: 1 },
              tickColor: '#94a3b8'
            }}
            enablePoints={false}
            useMesh
            enableGridX={false}
            enableGridY={true}
            gridYValues={4}
            animate
            theme={{
              grid: {
                line: {
                  stroke: '#f1f5f9',
                  strokeWidth: 1
                }
              },
              axis: {
                ticks: {
                  text: {
                    fontSize: 10,
                    fill: '#94a3b8'
                  }
                }
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-800/30 rounded-md">
            <div className="text-center">
              <div className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center mx-auto mb-1">
                <span className="text-gray-300 text-xs">📊</span>
              </div>
              <span className="text-xs text-gray-400">No data</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
