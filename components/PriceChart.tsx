'use client'
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
      
    </div>
  )
}
