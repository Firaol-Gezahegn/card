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

// Particle burst canvas
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
      return { x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed,
        r: 3 + Math.random()*5, alpha: 1, gravity: 0.12 + Math.random()*0.1 }
    })
    let alive = true
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let any = false
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= 0.97; p.alpha -= 0.032
        if (p.alpha <= 0) return
        any = true
        ctx.save(); ctx.globalAlpha = p.alpha
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
        ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.fill()
        ctx.restore()
      })
      if (any && alive) requestAnimationFrame(tick)
      else { alive = false; onDone?.() }
    }
    tick()
    return () => { alive = false }
  }, [])
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 55 }} />
}

// Single balloon — only renders the balloon, reports pop to parent
function Balloon({ word, color, glow, x, y, size, sway, onPop }) {
  const [popped, setPopped] = useState(false)
  const [bursting, setBursting] = useState(false)
  const ref = useRef(null)

  const handleClick = () => {
    if (popped) return
    const rect = ref.current?.getBoundingClientRect()
    setBursting({ x: rect ? rect.left + rect.width/2 : 100, y: rect ? rect.top + rect.height/2 : 300 })
    setPopped(true)
    setTimeout(() => { onPop?.() }, 220)
    setTimeout(() => setBursting(null), 1200)
  }

  if (popped && !bursting) return null

  return (
    <>
      {bursting && <BurstParticles x={bursting.x} y={bursting.y} color={color} onDone={() => setBursting(null)} />}
      {!popped && (
        <div
          ref={ref}
          onClick={handleClick}
          className="absolute cursor-pointer select-none group"
          style={{ left: x, top: y, animation: `balloonFloat ${sway}s ease-in-out infinite alternate`, zIndex: 18, pointerEvents: 'auto' }}
        >
          <svg width="2" height={size * 0.8} className="block mx-auto" style={{ marginTop: 2 }}>
            <path d={'M1,0 Q' + (3 + Math.random()*4) + ',' + (size*0.4) + ' 1,' + (size*0.8)}
              stroke={color} strokeWidth="1.2" fill="none" opacity="0.5" />
          </svg>
          <div
            className="hover:scale-110 active:scale-95 transition-transform duration-200"
            style={{
              width: size, height: size * 1.25,
              background: 'radial-gradient(circle at 35% 30%, ' + glow + 'cc, ' + color + '99)',
              borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
              boxShadow: '0 0 ' + (size/2) + 'px ' + color + '66, inset -4px -6px 14px rgba(0,0,0,0.2)',
              position: 'relative', marginTop: -size * 0.8,
            }}
          >
            <div style={{ position:'absolute', top:'14%', left:'22%', width:'28%', height:'22%',
              background:'rgba(255,255,255,0.5)', borderRadius:'50%', transform:'rotate(-30deg)' }} />
            <div style={{ position:'absolute', bottom:-6, left:'50%', transform:'translateX(-50%)',
              width:9, height:9, background:color, borderRadius:'50%' }} />
          </div>
        </div>
      )}
    </>
  )
}

// Positions spread across screen — clear of top prompt (top 12%)
const POSITIONS = [
  { x: '4%',  y: '22%', size: 54, sway: 3.1 },
  { x: '18%', y: '42%', size: 60, sway: 2.8 },
  { x: '30%', y: '25%', size: 50, sway: 3.4 },
  { x: '44%', y: '48%', size: 66, sway: 2.6 },
  { x: '58%', y: '22%', size: 56, sway: 3.2 },
  { x: '70%', y: '44%', size: 52, sway: 2.9 },
  { x: '82%', y: '26%', size: 58, sway: 3.5 },
  { x: '10%', y: '62%', size: 48, sway: 2.7 },
  { x: '38%', y: '66%', size: 54, sway: 3.0 },
  { x: '68%', y: '63%', size: 50, sway: 2.8 },
]

export default function BurstBalloons({ opacity }) {
  // Track each popped word as an object so we can display them individually
  const [poppedWords, setPoppedWords] = useState([])
  const total = WORDS.length

  const handlePop = (index) => {
    setPoppedWords(prev => [...prev, { ...WORDS[index], id: Date.now() + index }])
  }

  const allPopped = poppedWords.length >= total

  return (
    <div className="absolute inset-0 transition-opacity duration-500"
      style={{ opacity, pointerEvents: opacity > 0.3 ? 'auto' : 'none' }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: 500, height: 500, borderRadius: '50%',
          background: '#be185d', filter: 'blur(180px)', opacity: 0.1 }} />
      </div>

      {/* Prompt — compact single line at very top */}
      <div className="absolute top-[2%] left-1/2 -translate-x-1/2 text-center pointer-events-none px-4 w-full">
        {!allPopped ? (
          <p className="text-xs sm:text-sm font-bold font-serif-lux"
            style={{ color: 'rgba(252,231,243,0.5)' }}>
            🎈 Pop each balloon — a word about you is inside
          </p>
        ) : (
          <p className="text-xs sm:text-base font-bold font-serif-lux animate-fade-in-up"
            style={{ color: '#f9a8d4', textShadow: '0 0 20px rgba(249,168,212,0.4)' }}>
            All of this — is who you are ✨
          </p>
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
          onPop={() => handlePop(i)}
        />
      ))}

      {/* Popped words — displayed as a flowing wrap of pills in the CENTER of screen */}
      {poppedWords.length > 0 && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 56,
            width: 'min(94vw, 520px)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {poppedWords.map((w) => (
            <div
              key={w.id}
              className="animate-scale-in"
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: 'clamp(11px, 3vw, 15px)',
                fontWeight: 700,
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.04em',
                color: w.glow,
                background: w.color + '1a',
                border: '1.5px solid ' + w.color + '55',
                boxShadow: '0 0 14px ' + w.color + '33',
                backdropFilter: 'blur(12px)',
                textShadow: '0 0 12px ' + w.color + '77',
                whiteSpace: 'nowrap',
              }}
            >
              {w.text}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
