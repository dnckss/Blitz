'use client'
import { useState } from 'react'
import AuthGuard from '@/components/AuthGuard'
import UserProfile from '@/components/UserProfile'

export default function WarVideosPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState('우크라이나')

  const warVideos = [
    {
      url: '/video/war.mp4',
      title: '우크라이나 동부 전선',
      region: '우크라이나',
      location: '바흐무트',
      date: '2025-10-10',
      description: '바흐무트 인근 격전 상황'
    },
    {
      url: '/video/war2.mp4',
      title: '우크라이나 남부 전선',
      region: '우크라이나',
      location: '도네츠크',
      date: '2025-10-09',
      description: '도네츠크 시가전 영상'
    },
    {
      url: '/video/war3.mp4',
      title: '우크라이나 북부 방어선',
      region: '우크라이나',
      location: '하르키우',
      date: '2025-10-08',
      description: '하르키우 방어 작전'
    },
    {
        url: '/video/war4.mp4',
        title: '우크라이나 북부 방어선',
        region: '우크라이나',
        location: '하르키우',
        date: '2025-10-08',
        description: '하르키우 방어 작전'
      },
      {
        url: '/video/war5.mp4',
        title: '아프가니스탄 중국 국경',
        region: '아프가니스탄',
        location: '국경',
        date: '2025-10-08',
        description: '아프가니스탄 국경 방어 작전'
      }
  ]

  const currentVideo = warVideos[currentVideoIndex]

  return (
    <AuthGuard>
      <main className="h-screen bg-black flex flex-col">
        {/* 팔란티어 스타일 헤더 */}
        <header className="bg-gray-900 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between px-6 h-12">
            {/* 왼쪽 네비게이션 */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-6">
                <a href="/" className="text-gray-400 text-sm hover:text-white cursor-pointer transition-colors">글로벌 개요</a>
                <span className="text-white text-sm font-medium border-b-2 border-primary-500 pb-1">전쟁</span>
              </div>
            </div>
            
            {/* 오른쪽 사용자 프로필 */}
            <div className="flex items-center gap-4">
              <UserProfile />
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex min-h-0">
          {/* 왼쪽 사이드바 - 영상 목록 */}
          <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h1 className="text-white text-lg font-semibold mb-2">전쟁 영상 아카이브</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-200 text-xs font-medium">실시간 업데이트</span>
              </div>
            </div>

            {/* 영상 목록 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {warVideos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideoIndex(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    currentVideoIndex === index
                      ? 'bg-gray-800 border-primary-500'
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-12 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                        <polygon points="5,3 19,12 5,21 5,3"></polygon>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-sm font-medium mb-1">{video.title}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-400 text-xs">{video.location}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500 text-xs">{video.date}</span>
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-2">{video.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            
          </div>

          {/* 중앙 - 영상 플레이어 */}
          <div className="flex-1 bg-black flex flex-col min-h-0">
            {/* 영상 플레이어 - 전체 높이 사용 */}
            <div className="flex-1 flex items-center justify-center bg-black min-h-0">
              <video
                key={currentVideo.url}
                className="w-full h-full object-contain"
                controls
                autoPlay
              >
                <source src={currentVideo.url} type="video/mp4" />
                브라우저가 비디오를 지원하지 않습니다.
              </video>
            </div>

            {/* 영상 정보 하단 바 */}
            <div className="bg-gray-950/95 backdrop-blur-sm border-t border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-white text-sm font-semibold">{currentVideo.title}</h2>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-400">{currentVideo.location}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400">{currentVideo.date}</span>
                  
                 
                </div>
              </div>
              <p className="text-gray-400 text-xs max-w-md">
                {currentVideo.description}
              </p>
            </div>
          </div>

          {/* 오른쪽 패널 - 관련 정보 */}
          <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-white text-lg font-semibold mb-2">분석 정보</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* 전선 상황 */}
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-white text-sm font-medium mb-3">전선 상황</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-800 rounded border border-gray-600">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-xs">바흐무트</span>
                      <span className="text-red-400 text-xs font-medium">격전</span>
                    </div>
                    <p className="text-gray-400 text-xs">러시아군 공세 지속</p>
                  </div>
                  <div className="p-3 bg-gray-800 rounded border border-gray-600">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-xs">도네츠크</span>
                      <span className="text-orange-400 text-xs font-medium">포격</span>
                    </div>
                    <p className="text-gray-400 text-xs">시가전 진행 중</p>
                  </div>
                  <div className="p-3 bg-gray-800 rounded border border-gray-600">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-xs">하르키우</span>
                      <span className="text-yellow-400 text-xs font-medium">긴장</span>
                    </div>
                    <p className="text-gray-400 text-xs">방어선 강화 중</p>
                  </div>
                </div>
              </div>

              {/* 전략 분석 */}
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-white text-sm font-medium mb-3">전략 분석</h3>
                <div className="p-3 bg-gradient-to-r from-primary-900/10 to-primary-800/10 rounded border border-primary-700/20">
                  <p className="text-gray-300 text-xs leading-relaxed">
                    러시아군은 동부 전선에서 지속적인 공세를 펼치고 있으며, 
                    우크라이나군은 방어선을 강화하며 반격 기회를 모색하고 있습니다.
                  </p>
                </div>
              </div>

              {/* 시장 영향 */}
              <div>
                <h3 className="text-white text-sm font-medium mb-3">시장 영향</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-800/50 rounded border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">에너지 가격</span>
                      <span className="text-green-400 text-xs">↗ 상승</span>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-800/50 rounded border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">안전자산</span>
                      <span className="text-green-400 text-xs">↗ 수요 증가</span>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-800/50 rounded border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">변동성</span>
                      <span className="text-red-400 text-xs">↗ 급증</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
