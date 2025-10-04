'use client'
import { useQuery } from '@tanstack/react-query'

export default function SummaryCard() {
  const { data, isLoading } = useQuery({
    queryKey: ['ai-summary'],
    queryFn: async () => {
      const res = await fetch('/api/summary', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load summary')
      return res.json() as Promise<{ summary: string, sources: {title: string, url: string}[] }>
    }
  })

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-300">정보 생성 중...</span>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div className="bg-gradient-to-r from-primary-900/10 to-primary-800/10 rounded-md p-4 border border-primary-700/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-primary-300 uppercase tracking-wide">정보</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
              {data?.summary ?? '사용 가능한 정보 데이터가 없습니다.'}
            </p>
          </div>
          
        
        </div>
      )}
    </div>
  )
}
