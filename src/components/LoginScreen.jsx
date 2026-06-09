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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fff0f7 0%, #ffe4f0 40%, #ffd6e8 70%, #f9a8d4 100%)' }}>
      {/* Soft birthday glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-rose-400/15 rounded-full blur-[120px] pointer-events-none" />
      {/* Floating birthday emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🎂', '🎁', '🕯️', '🌸', '💕', '🎀', '🌺', '✨'].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl opacity-20 animate-pulse-slow"
            style={{ left: `${10 + i * 11}%`, top: `${15 + (i % 3) * 25}%`, animationDelay: `${i * 0.5}s` }}
          >
            {emoji}
          </span>
        ))}
      </div>
      
      <div className="w-full max-w-md p-8 mx-4 bg-white/70 backdrop-blur-xl rounded-3xl border border-pink-200/60 text-center relative overflow-hidden shadow-2xl shadow-pink-200/40">
        
        {!accessDenied ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-pink-100 border border-pink-300/50 flex items-center justify-center mb-6 animate-pulse-slow">
              <LockKeyhole className="w-7 h-7 text-rose-500" />
            </div>

            <h1 className="text-3xl font-bold tracking-widest text-rose-700 mb-2 font-serif-lux">
              Private Sanctuary
            </h1>
            <p className="text-[10px] text-rose-400/70 uppercase tracking-[0.2em] mb-10">
              Authorized Access Only
            </p>

            <div className="relative group transition-all duration-300 transform hover:scale-[1.02] mb-6">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-lg blur opacity-40 group-hover:opacity-70 transition duration-500" />
              <div className="relative bg-white p-0.5 rounded-lg">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleFailure}
                  useOneTap={false}
                  theme="outline"
                  shape="pill"
                  text="signin"
                />
              </div>
            </div>

            <p className="text-[9px] text-rose-300/70 mt-6 tracking-wider uppercase">
              Protected by Google OAuth 2.0
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-6">
              <ShieldAlert className="w-7 h-7 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-red-600 mb-2 font-serif-lux">
              Access Denied
            </h1>
            
            <p className="text-xs text-red-500/70 font-mono break-all px-4 py-2 bg-red-50 rounded border border-red-200 max-w-xs text-center mb-6">
              {deniedEmail}
            </p>

            <p className="text-sm text-rose-500/70 mb-8 max-w-xs leading-relaxed">
              This sanctuary is restricted. Your account does not have access.
            </p>

            <button
              onClick={() => setAccessDenied(false)}
              className="px-6 py-2.5 bg-pink-50 hover:bg-pink-100 text-rose-600 text-xs font-semibold uppercase tracking-widest rounded-lg border border-pink-200 transition-all duration-300 cursor-pointer"
            >
              Try Another Account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
