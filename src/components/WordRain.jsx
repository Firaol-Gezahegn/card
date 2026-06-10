import { useEffect, useRef, useState, useCallback } from 'react'

const SACRED = [
  { text: 'Strength',     color: '#f472b6', glow: '#fda4af' },
  { text: 'Grace',        color: '#c084fc', glow: '#e879f9' },
  { text: 'Peace',        color: '#60a5fa', glow: '#93c5fd' },
  { text: 'Resilience',   color: '#f472b6', glow: '#f9a8d4' },
  { text: 'Kindness',     color: '#34d399', glow: '#6ee7b7' },
  { text: 'Beloved',      color: '#fb7185', glow: '#fda4af' },
  { text: 'Thank you',    color: '#fbbf24', glow: '#fde68a' },
  { text: 'Proud of you', color: '#a78bfa', glow: '#c4b5fd' },
  { text: 'Matter to me', color: '#f472b6', glow: '#f9a8d4' },
  { text: 'Loved',        color: '#fb7185', glow: '#fda4af' },
  { text: 'Seen',         color: '#60a5fa', glow: '#93c5fd' },
  { text: 'Healing',      color: '#34d399', glow: '#6ee7b7' },
]

function rand(a, b) { return a + Math.random() * (b - a) }

// ── Bubble component ──────────────────────────────────────────────────────
function Bubble({ item, index, onBurst }) {
  const [state, setState] = useState('alive') // alive | bursting | word
  const [wordPos, setWordPos] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  // staggered entry: delay appearance
  const entryDelay = index * 0.18

  const handleClick = useCallback(() => {
    if (state !== 'alive') return
    const rect = ref.current?.getBoundingClientRect()
    setWordPos({ x: rect?.left ?? 80, y: rect?.top ?? 200 })
    setState('bursting')
    setTimeout(() => { setState('word'); onBurst(index) }, 260)
    setTimeout(() => setState('done'), 3500)
  }, [state, index, onBurst])

  if (state === 'done') return null

  const size = 54 + (index % 4) * 10   // 54, 64, 74, 84 px cycling

  // Vertical position: spread evenly with a little randomness
  const topPct = 8 + (index / SACRED.length) * 78 + rand(-3, 3)

  return (
    <>
      {/* ── Soap bubble ── */}
      {(state === 'alive' || state === 'bursting') && (
        <div
          ref={ref}
          onClick={handleClick}
          className="absolute cursor-pointer group select-none"
          style={{
            left: rand(6, 18) + '%',
            top: topPct + '%',
            width: size,
            height: size,
            animationDelay: entryDelay + 's',
            animation: state === 'bursting'
              ? 'bubblePop 0.25s ease-out forwards'
              : 'bubbleSway ' + (3.5 + index * 0.3) + 's ease-in-out infinite alternate',
            zIndex: 18,
            pointerEvents: 'auto',
          }}
        >
          {/* Soap film: multiple iridescent layers */}
          <svg viewBox="0 0 100 100" width={size} height={size} className="absolute inset-0">
            <defs>
              <radialGradient id={'bg' + index} cx="40%" cy="35%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.25)" />
                <stop offset="40%"  stopColor={item.color + '22'} />
                <stop offset="100%" stopColor={item.color + '44'} />
              </radialGradient>
              <radialGradient id={'sh' + index} cx="30%" cy="28%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            {/* Base sphere */}
            <circle cx="50" cy="50" r="46"
              fill={'url(#bg' + index + ')'}
              stroke={item.color}
              strokeWidth="0.8"
              strokeOpacity="0.45"
            />
            {/* Iridescent rim */}
            <circle cx="50" cy="50" r="46"
              fill="none"
              stroke={'url(#sh' + index + ')'}
              strokeWidth="6"
              strokeOpacity="0.6"
            />
            {/* Main highlight */}
            <ellipse cx="36" cy="30" rx="12" ry="8"
              fill="rgba(255,255,255,0.45)"
              transform="rotate(-20,36,30)"
            />
            {/* Small secondary highlight */}
            <ellipse cx="62" cy="65" rx="5" ry="3"
              fill="rgba(255,255,255,0.22)"
              transform="rotate(10,62,65)"
            />
          </svg>

          {/* Word inside bubble */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="font-bold font-serif-lux text-center leading-tight px-1"
              style={{
                fontSize: size > 70 ? '10px' : '8.5px',
                color: item.glow,
                textShadow: '0 0 8px ' + item.color + 'aa',
                letterSpacing: '0.03em',
              }}>
              {item.text}
            </span>
          </div>

          {/* Hover glow ring */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ boxShadow: '0 0 20px ' + item.color + '88, 0 0 40px ' + item.color + '44' }} />
        </div>
      )}

      {/* ── Released word flies right ── */}
      {state === 'word' && (
        <div
          className="fixed pointer-events-none animate-word-fly"
          style={{
            left: wordPos.x,
            top: wordPos.y,
            zIndex: 55,
          }}
        >
          <span
            className="font-bold font-serif-lux tracking-wide whitespace-nowrap"
            style={{
              fontSize: '1.1rem',
              color: item.glow,
              textShadow: '0 0 18px ' + item.color + 'cc, 0 0 36px ' + item.color + '66',
            }}
          >
            {item.text} ✨
          </span>
        </div>
      )}
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function WordRain() {
  const [burstedCount, setBurstedCount] = useState(0)

  const handleBurst = useCallback(() => {
    setBurstedCount(n => n + 1)
  }, [])

  return (
    <>
      <style>{`
        @keyframes bubbleSway {
          0%   { transform: translateX(-5px) translateY(0px) scale(1); }
          100% { transform: translateX(5px)  translateY(-10px) scale(1.03); }
        }
        @keyframes bubblePop {
          0%   { transform: scale(1);    opacity: 1; }
          60%  { transform: scale(1.35); opacity: 0.4; }
          100% { transform: scale(1.6);  opacity: 0; }
        }
        @keyframes wordFly {
          0%   { transform: translateX(0)    translateY(0)   scale(0.7); opacity: 0; }
          15%  { transform: translateX(20px) translateY(-10px) scale(1.1); opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translateX(260px) translateY(-40px) scale(1); opacity: 0; }
        }
        .animate-word-fly {
          animation: wordFly 3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {/* Left-side bubble strip */}
      <div className="fixed inset-0" style={{ zIndex: 17, pointerEvents: 'none' }}>
        {SACRED.map((item, i) => (
          <Bubble
            key={i}
            item={item}
            index={i}
            onBurst={handleBurst}
          />
        ))}
      </div>
    </>
  )
}
