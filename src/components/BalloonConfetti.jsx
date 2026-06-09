import { useEffect, useRef, useState } from 'react'

const BALLOON_COLORS = ['#f472b6','#fb7185','#a78bfa','#60a5fa','#34d399','#fbbf24','#f9a8d4','#c084fc']
const CONFETTI_COLORS = ['#f472b6','#fbbf24','#a78bfa','#34d399','#fb7185','#60a5fa','#fce7f3','#be185d']

function randomBetween(a, b) { return a + Math.random() * (b - a) }

// ── Balloons ──────────────────────────────────────────────────────────────
function Balloon({ color, x, delay, size }) {
  const sway = `sway-${Math.floor(Math.random() * 3)}`
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        bottom: '-120px',
        animation: `balloonFloat ${randomBetween(7, 13)}s ease-in ${delay}s forwards`,
      }}
    >
      {/* String */}
      <svg width="2" height="60" style={{ display: 'block', margin: '0 auto' }}>
        <path d={`M1,0 Q${4 + Math.random()*6},30 1,60`} stroke={color} strokeWidth="1.2" fill="none" opacity="0.6" />
      </svg>
      {/* Balloon body */}
      <div style={{
        width: size,
        height: size * 1.2,
        background: `radial-gradient(circle at 35% 30%, ${color}ee, ${color}88)`,
        borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
        boxShadow: `inset -4px -6px 12px rgba(0,0,0,0.15), 0 0 ${size/3}px ${color}44`,
        position: 'relative',
      }}>
        {/* Highlight */}
        <div style={{
          position: 'absolute', top: '15%', left: '20%',
          width: '30%', height: '25%',
          background: 'rgba(255,255,255,0.45)',
          borderRadius: '50%',
          transform: 'rotate(-30deg)',
        }} />
        {/* Knot */}
        <div style={{
          position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)',
          width: '10px', height: '10px',
          background: color,
          borderRadius: '50%',
        }} />
      </div>
    </div>
  )
}

// ── Confetti piece ────────────────────────────────────────────────────────
function ConfettiPiece({ color, x, delay, shape }) {
  const style = {
    position: 'absolute',
    left: `${x}%`,
    top: '-20px',
    width: shape === 'circle' ? '10px' : shape === 'rect' ? '8px' : '12px',
    height: shape === 'circle' ? '10px' : shape === 'rect' ? '14px' : '6px',
    background: color,
    borderRadius: shape === 'circle' ? '50%' : shape === 'triangle' ? '0' : '2px',
    animation: `confettiFall ${randomBetween(2.5, 4.5)}s ease-in ${delay}s forwards`,
    opacity: 0,
    clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
  }
  return <div style={style} />
}

export default function BalloonConfetti({ showConfetti }) {
  const [balloons] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      x: randomBetween(3, 95),
      delay: randomBetween(0, 4),
      size: randomBetween(40, 70),
    }))
  )

  const [confettiPieces] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      x: randomBetween(0, 100),
      delay: randomBetween(0, 1.5),
      shape: ['circle','rect','triangle'][i % 3],
    }))
  )

  return (
    <>
      <style>{`
        @keyframes balloonFloat {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(${randomBetween(-15,15)}deg); opacity: 0; }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(${randomBetween(180,720)}deg); opacity: 0; }
        }
      `}</style>

      {/* Balloons — always floating */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-30">
        {balloons.map(b => <Balloon key={b.id} {...b} />)}
      </div>

      {/* Confetti burst — only when triggered */}
      {showConfetti && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
          {confettiPieces.map(c => <ConfettiPiece key={c.id} {...c} />)}
        </div>
      )}
    </>
  )
}
