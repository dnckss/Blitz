import './globals.css'
import RQProvider from '@/providers/query-client'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Blitz'
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
