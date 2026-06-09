import { useState } from 'react'
import { Heart, X } from 'lucide-react'

export default function EnvelopeLetter({ opacity, pointerEvents }) {
  const [state, setState] = useState('closed') // closed | opening | open

  const handleClick = () => {
    if (state === 'closed') {
      setState('opening')
      setTimeout(() => setState('open'), 800)
    }
  }

  const cardStyle = {
    background: 'rgba(255, 241, 245, 0.92)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(249, 168, 212, 0.5)',
    boxShadow: '0 12px 60px rgba(190, 24, 93, 0.15)',
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 transition-opacity duration-300 pointer-events-none"
      style={{ opacity }}
    >
      {/* ── Closed envelope ── */}
      {state !== 'open' && (
        <div
          className="cursor-pointer select-none group pointer-events-auto"
          onClick={handleClick}
          style={{ perspective: '800px' }}
        >
          <div
            className="relative transition-transform duration-700"
            style={{
              transformStyle: 'preserve-3d',
              transform: state === 'opening' ? 'rotateY(90deg) scale(0.8)' : 'rotateY(0deg)',
            }}
          >
            {/* Envelope body */}
            <div className="relative" style={{ width: '280px' }}>
              {/* Back */}
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{
                width: '280px', height: '180px',
                background: 'linear-gradient(160deg, #fce7f3 0%, #fbcfe8 60%, #f9a8d4 100%)',
                border: '1.5px solid rgba(249,168,212,0.6)',
              }}>
                {/* Envelope flap (top triangle) */}
                <svg viewBox="0 0 280 100" className="absolute top-0 left-0 w-full" style={{ height: '90px' }}>
                  <polygon points="0,0 280,0 140,90" fill="#f9a8d4" opacity="0.7" />
                  <polygon points="0,0 280,0 140,90" fill="none" stroke="rgba(190,24,93,0.2)" strokeWidth="1" />
                </svg>
                {/* Envelope bottom V */}
                <svg viewBox="0 0 280 90" className="absolute bottom-0 left-0 w-full" style={{ height: '90px' }}>
                  <polygon points="0,0 140,90 280,0" fill="#fbcfe8" opacity="0.5" />
                </svg>
                {/* Wax seal */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: '40px' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #be185d, #9d174d)', border: '2px solid #f9a8d4' }}>
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
              </div>

              {/* Hover label */}
              <div className="mt-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.3em] text-rose-400/80 font-bold font-serif-lux
                  group-hover:text-rose-600 transition-colors">
                  {state === 'opening' ? 'Opening...' : '💌 Tap to open'}
                </p>
                <div className="mt-2 flex justify-center gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Open letter ── */}
      {state === 'open' && (
        <div className="max-w-xl w-full animate-fade-in-up">
          <div className="rounded-3xl p-8 sm:p-12" style={cardStyle}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-200/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">💌</span>
                <span className="text-[10px] text-rose-500/70 tracking-[0.2em] uppercase font-bold font-serif-lux">
                  A Birthday Letter For You
                </span>
              </div>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-300/50" />
            </div>

            <div className="text-rose-900/80 font-poetry text-[15px] sm:text-base leading-[1.9] space-y-5">
              <p>
                <span className="text-3xl text-rose-500 font-bold font-serif-lux mr-2 float-left mt-1">S</span>unny,
                You are the strongest, most independent, and most selfless person I know — the kind of woman who
                constantly sacrifices herself for others without ever asking for or needing anything in return.
                I want you to know that the deep care you pour into everyone else has a way of coming back to you.
              </p>
              <p>
                I wish and pray with all my heart for{' '}
                <span className="text-rose-600 font-semibold">እህተ ሚካዔል 😊</span> to have the absolute
                peace and love she deserves, because what you deserve transcends what you think you need right now.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-rose-200/40 text-center">
              <p className="text-lg sm:text-xl text-rose-800/80 font-poetry italic leading-[2.0]">
                "More than anything, I am just deeply grateful<br />
                that I have — and have had —<br />
                a friend like you in my life.<br /><br />
                And I am happy that I love you<br />
                with all my heart. 😊"
              </p>
            </div>

            <button
              onClick={() => setState('closed')}
              className="mt-6 mx-auto flex items-center gap-1.5 text-[10px] text-rose-400/60 hover:text-rose-500
                uppercase tracking-widest font-bold transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" /> Close letter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
