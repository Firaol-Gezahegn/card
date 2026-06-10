import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { ShieldAlert, LockKeyhole } from 'lucide-react'

export default function LoginScreen({ onLoginSuccess }) {
  const [accessDenied, setAccessDenied] = useState(false)
  const [deniedEmail, setDeniedEmail] = useState('')

  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      const email = decoded.email?.toLowerCase()

      // Whitelist check
      const whitelist = ['snasefa@gmail.com', 'firaolg@gmail.com']
      
      if (whitelist.includes(email)) {
        setAccessDenied(false)
        onLoginSuccess({
          email,
          name: decoded.name || 'Sanctuary Guest',
          picture: decoded.picture || ''
        })
      } else {
        setDeniedEmail(email)
        setAccessDenied(true)
      }
    } catch (error) {
      console.error('Error decoding credential:', error)
    }
  }

  const handleFailure = () => {
    console.error('Login Failed')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a0010 0%, #0d0018 50%, #1a0010 100%)' }}>
      {/* Deep glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(190,24,93,0.18) 0%, transparent 70%)' }} />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />
      {/* Floating emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🎂', '🎁', '🕯️', '🌸', '💕', '🎀', '🌺', '✨'].map((emoji, i) => (
          <span key={i} className="absolute text-xl opacity-10 animate-pulse-slow"
            style={{ left: `${10 + i * 11}%`, top: `${15 + (i % 3) * 25}%`, animationDelay: `${i * 0.5}s` }}>
            {emoji}
          </span>
        ))}
      </div>
      
      <div className="w-full max-w-md p-9 mx-4 text-center relative overflow-hidden rounded-3xl"
        style={{
          background: 'rgba(255,240,248,0.06)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(249,168,212,0.18)',
          boxShadow: '0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>
        
        {!accessDenied ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 animate-pulse-slow relative"
              style={{ background: 'rgba(249,168,212,0.1)', border: '1px solid rgba(249,168,212,0.25)' }}>
              <div className="absolute inset-0 rounded-full animate-halo"
                style={{ border: '1px solid rgba(249,168,212,0.2)' }} />
              <LockKeyhole className="w-7 h-7" style={{ color: '#f9a8d4' }} />
            </div>

            <h1 className="text-3xl font-bold tracking-widest mb-2 font-serif-lux animate-shimmer">
              Private Sanctuary
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] mb-10" style={{ color: 'rgba(249,168,212,0.4)' }}>
              Authorized Access Only
            </p>

            <div className="relative group transition-all duration-300 transform hover:scale-[1.02] mb-6">
              <div className="absolute -inset-0.5 rounded-lg blur opacity-40 group-hover:opacity-70 transition duration-500"
                style={{ background: 'linear-gradient(to right, #f472b6, #a78bfa)' }} />
              <div className="relative rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', padding: '2px' }}>
                <GoogleLogin onSuccess={handleSuccess} onError={handleFailure}
                  useOneTap={false} theme="filled_black" shape="pill" text="signin" />
              </div>
            </div>

            <p className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(249,168,212,0.25)' }}>
              Protected by Google OAuth 2.0
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <ShieldAlert className="w-7 h-7 text-red-400" />
            </div>

            <h1 className="text-2xl font-bold mb-2 font-serif-lux" style={{ color: '#fca5a5' }}>
              Access Denied
            </h1>
            
            <p className="text-xs font-mono break-all px-4 py-2 rounded-lg border max-w-xs text-center mb-6"
              style={{ color: 'rgba(252,165,165,0.7)', background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}>
              {deniedEmail}
            </p>

            <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: 'rgba(252,231,243,0.5)' }}>
              This sanctuary is restricted. Your account does not have access.
            </p>

            <button onClick={() => setAccessDenied(false)}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer hover:scale-105"
              style={{
                background: 'rgba(249,168,212,0.08)',
                color: '#f9a8d4',
                border: '1px solid rgba(249,168,212,0.2)',
              }}>
              Try Another Account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
