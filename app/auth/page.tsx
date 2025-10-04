'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('비밀번호가 일치하지 않습니다')
        }
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) throw error
        
        alert('회원가입이 완료되었습니다. 이메일을 확인해주세요.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        router.push('/')
      }
    } catch (error: any) {
      setError(error.message || '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="h-screen bg-black text-gray-200 font-sans flex items-center justify-center">
      {/* 팔란티어 스타일 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900"></div>
      
      {/* 메인 컨테이너 */}
      <div className="relative z-10 w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-2xl font-semibold text-white tracking-tight">Blitz</h1>
          </div>
          <p className="text-sm text-gray-400">세계 전쟁 및 경제 실시간 확인</p>
        </div>

        {/* 인증 폼 */}
        <div className="bg-gray-950/90 backdrop-blur-sm border border-gray-800 rounded-lg p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              {isSignUp ? '계정 생성' : '로그인'}
            </h2>
            <p className="text-sm text-gray-400">
              {isSignUp ? '새 계정을 생성하여 시작하세요' : '로그인을 완료하세요'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wide mb-2">
                이메일 주소
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wide mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              />
            </div>

            {/* 비밀번호 확인 (회원가입 시에만) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wide mb-2">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>
            )}

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-md p-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  처리 중...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10,17 15,12 10,7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  {isSignUp ? '계정 생성' : '로그인'}
                </>
              )}
            </button>
          </form>

          {/* 전환 링크 */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setEmail('')
                setPassword('')
                setConfirmPassword('')
              }}
              className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
            >
              {isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
              <span className="ml-1 text-primary-400">
                {isSignUp ? '로그인' : '회원가입'}
              </span>
            </button>
          </div>

        </div>

        {/* 푸터 */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2025 Blitz Intelligence Platform. 모든 권리 보유.
          </p>
          <p className="text-xs text-gray-600 mt-1">
            정부 승인된 분석가만 접근 가능
          </p>
        </div>
      </div>

      {/* 배경 장식 요소들 */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-primary-500/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-gray-500/50 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-primary-400/20 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-20 w-1 h-1 bg-gray-400/30 rounded-full animate-pulse delay-500"></div>
    </main>
  )
}
