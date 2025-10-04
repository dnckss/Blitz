'use client'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function UserProfile() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="relative">
      {/* 프로필 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
      >
        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-medium">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <span className="text-sm text-gray-300 hidden md:block">
          {user.email?.split('@')[0] || 'User'}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <>
          {/* 백드롭 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 메뉴 */}
          <div className="absolute right-0 top-full mt-1 w-64 bg-gray-950 border border-gray-800 rounded-md shadow-xl z-20">
            {/* 사용자 정보 */}
            <div className="px-4 py-3 border-b border-gray-800">
              <p className="text-sm font-medium text-white">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                {user.email_confirmed_at ? '인증됨' : '인증 대기 중'}
              </p>
            </div>

            {/* 메뉴 항목들 */}
            <div className="py-2">
              <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                프로필 설정
              </button>
              
              <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                </svg>
                알림 설정
              </button>
              
              <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                  <path d="M5.6 5.6l.8.8"></path>
                  <path d="M18.4 5.6l-.8.8"></path>
                  <path d="M17.7 17.7l-.8-.8"></path>
                  <path d="M6.3 17.7l.8-.8"></path>
                </svg>
                시스템 설정
              </button>
            </div>

            {/* 로그아웃 */}
            <div className="border-t border-gray-800 py-2">
              <button 
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors text-left flex items-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                시스템 로그아웃
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
