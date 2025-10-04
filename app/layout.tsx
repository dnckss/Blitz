import './globals.css'
import RQProvider from '@/providers/query-client'
import { ReactNode } from 'react'

export const metadata = {
  title: 'WarMap | 전쟁 & 원자재 모니터링',
  description: '실시간 전쟁 상황과 원자재 가격을 한눈에 확인하세요.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-toss-900 text-toss-100 dark">
        <RQProvider>{children}</RQProvider>
      </body>
    </html>
  )
}
