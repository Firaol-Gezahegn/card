import { useState, useRef, useEffect } from 'react'

const WORDS = [
  { text: 'Strength',     color: '#f472b6', glow: '#f9a8d4' },
  { text: 'Grace',        color: '#c084fc', glow: '#e879f9' },
  { text: 'Peace',        color: '#60a5fa', glow: '#93c5fd' },
  { text: 'Resilience',   color: '#f472b6', glow: '#f9a8d4' },
  { text: 'Kindness',     color: '#34d399', glow: '#6ee7b7' },
  { text: 'Beloved',      color: '#fb7185', glow: '#fda4af' },
  { text: 'Thank you',    color: '#fbbf24', glow: '#fde68a' },
  { text: 'Proud of you', color: '#a78bfa', glow: '#c4b5fd' },
  { text: 'Matter to me', color: '#f472b6', glow: '#f9a8d4' },
  { text: 'Loved',        color: '#fb7185', glow: '#fda4af' },
]

// Particle burst on pop
function BurstParticles({ x, y, color, onDone }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 28 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 2.5 + Math.random() * 5
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 3 + Math.random() * 5,
        alpha: 1,
        gravity: 0.12 + Math.random() * 0.1,
      }
    })

    let alive = true
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let anyAlive = false
      particles.forEach(p => {
        p.x  += p.vx
        p.y  += p.vy
        p.vy += p.gravity
        p.vx *= 0.97
        p.alpha -= 0.032
        if (p.alpha <= 0) return
        anyAlive = true
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.restore()
      })
      if (anyAlive && alive) requestAnimationFrame(tick)
      else { alive = false; onDone?.() }
    }
    tick()
    return () => { alive = false }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 55 }}
    />
  )
}

// A single clickable balloon
function Balloon({ word, color, glow, x, y, size, sway, onPop }) {
  const [popped, setPopped] = useState(false)
  const [showWord, setShowWord] = useState(false)
  const [burst, setBurst] = useState(null)
  const ref = useRef(null)

  const handleClick = () => {
    if (popped) return
    const rect = ref.current?.getBoundingClientRect()
    const cx = rect ? rect.left + rect.width / 2 : x
    const cy = rect ? rect.top  + rect.height / 2 : y
    setPopped(true)
    setBurst({ x: cx, y: cy })
    setTimeout(() => { setShowWord(true); onPop?.() }, 250)
    setTimeout(() => setBurst(null), 1200)
  }

  return (
    <>
      {burst && (
        <BurstParticles x={burst.x} y={burst.y} color={color} onDone={() => setBurst(null)} />
      )}

      {!popped ? (
        /* Balloon */
        <div
          ref={ref}
          onClick={handleClick}
          className="absolute cursor-pointer select-none"
          style={{
            left: x, top: y,
            animation: `balloonFloat ${sway}s ease-in-out infinite alternate`,
          }}
        >
          {/* String */}
          <svg width="2" height={size * 0.8} className="block mx-auto" style={{ marginTop: 2 }}>
            <path
              d={'M1,0 Q' + (3 + Math.random() * 4) + ',' + (size * 0.4) + ' 1,' + (size * 0.8)}
              stroke={color} strokeWidth="1.2" fill="none" opacity="0.5"
            />
          </svg>
          {/* Body */}
          <div
            className="transition-transform duration-200 hover:scale-110 active:scale-95"
            style={{
              width: size, height: size * 1.25,
              background: 'radial-gradient(circle at 35% 30%, ' + glow + 'cc, ' + color + '99)',
              borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
              boxShadow: '0 0 ' + (size / 2) + 'px ' + color + '66, inset -4px -6px 14px rgba(0,0,0,0.2)',
              position: 'relative',
              marginTop: -size * 0.8,
            }}
          >
            {/* Highlight */}
            <div style={{
              position: 'absolute', top: '14%', left: '22%',
              width: '28%', height: '22%',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '50%',
              transform: 'rotate(-30deg)',
            }} />
            {/* Knot */}
            <div style={{
              position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
              width: 9, height: 9,
              background: color, borderRadius: '50%',
            }} />
          </div>
        </div>
      ) : showWord ? (
        /* Revealed word — centered in viewport, never clips off edge */
        <div
          className="fixed pointer-events-none animate-scale-in"
          style={{
            left: '50%',
            top: '42%',
            transform: 'translate(-50%, -50%)',
            zIndex: 56,
          }}
        >
          <div
            className="px-5 py-3 rounded-2xl font-bold font-serif-lux tracking-wider text-base sm:text-lg text-center"
            style={{
              background: color + '20',
              border: '2px solid ' + color + '66',
              color: glow,
              boxShadow: '0 0 40px ' + color + '55, inset 0 1px 0 rgba(255,255,255,0.15)',
              backdropFilter: 'blur(16px)',
              textShadow: '0 0 20px ' + color + '99',
              minWidth: '120px',
              maxWidth: '80vw',
            }}
          >
            {word} ✨
          </div>
        </div>
      ) : null}
    </>
  )
}

// Positions: scattered organically around the screen
const POSITIONS = [
  { x: '8%',  y: '55%', size: 64, sway: 3.2 },
  { x: '22%', y: '65%', size: 54, sway: 2.8 },
  { x: '36%', y: '70%', size: 70, sway: 3.6 },
  { x: '50%', y: '60%', size: 58, sway: 2.5 },
  { x: '64%', y: '68%', size: 66, sway: 3.1 },
  { x: '78%', y: '58%', size: 52, sway: 2.9 },
  { x: '88%', y: '66%', size: 62, sway: 3.4 },
  { x: '15%', y: '72%', size: 48, sway: 2.6 },
  { x: '44%', y: '75%', size: 56, sway: 3.0 },
  { x: '72%', y: '72%', size: 60, sway: 2.7 },
]

export default function BurstBalloons({ opacity }) {
  const [poppedCount, setPoppedCount] = useState(0)
  const total = WORDS.length

  return (
    <div
      className="absolute inset-0 transition-opacity duration-500"
      style={{ opacity, pointerEvents: opacity > 0.3 ? 'auto' : 'none' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{
          width: 500, height: 500, borderRadius: '50%',
          background: '#be185d', filter: 'blur(180px)', opacity: 0.12,
        }} />
      </div>

      {/* Prompt */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 text-center pointer-events-none px-4 w-full max-w-xs sm:max-w-sm">
        {poppedCount < total ? (
          <>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] mb-2"
              style={{ color: 'rgba(249,168,212,0.45)' }}>
              Pop each balloon
            </p>
            <p className="text-sm sm:text-xl font-bold font-serif-lux"
              style={{ color: 'rgba(252,231,243,0.7)', textShadow: '0 0 30px rgba(249,168,212,0.3)' }}>
              These words describe who you are 🎈
            </p>
          </>
        ) : (
          <>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] mb-2"
              style={{ color: 'rgba(249,168,212,0.45)' }}>This is you</p>
            <p className="text-sm sm:text-xl font-bold font-serif-lux animate-fade-in-up"
              style={{ color: '#f9a8d4', textShadow: '0 0 30px rgba(249,168,212,0.5)' }}>
              All of this — is who you are ✨
            </p>
          </>
        )}
      </div>

      {/* Balloons */}
      {WORDS.map((w, i) => (
        <Balloon
          key={i}
          word={w.text}
          color={w.color}
          glow={w.glow}
          x={POSITIONS[i % POSITIONS.length].x}
          y={POSITIONS[i % POSITIONS.length].y}
          size={POSITIONS[i % POSITIONS.length].size}
          sway={POSITIONS[i % POSITIONS.length].sway}
          onPop={() => setPoppedCount(n => n + 1)}
        />
      ))}
    </div>
  )
}
