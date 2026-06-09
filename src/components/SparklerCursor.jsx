import { useEffect, useRef } from 'react'

const COLORS = ['#f472b6','#fbbf24','#fb7185','#a78bfa','#f9a8d4','#ffe066','#be185d']

export default function SparklerCursor() {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const mouse = useRef({ x: -999, y: -999 })
  const rafId = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX
      const cy = e.touches ? e.touches[0].clientY : e.clientY
      mouse.current = { x: cx, y: cy }

      // Spawn sparkles on move
      for (let i = 0; i < 4; i++) {
        particles.current.push({
          x: cx,
          y: cy,
          vx: (Math.random() - 0.5) * 3.5,
          vy: (Math.random() - 0.5) * 3.5 - 1,
          life: 1,
          decay: 0.04 + Math.random() * 0.04,
          size: 3 + Math.random() * 5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          type: Math.random() > 0.5 ? 'star' : 'circle',
        })
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: true })

    const drawStar = (ctx, x, y, r, color, alpha) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.shadowColor = color
      ctx.shadowBlur = 8
      ctx.translate(x, y)
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
        const x1 = Math.cos(angle) * r
        const y1 = Math.sin(angle) * r
        i === 0 ? ctx.moveTo(x1, y1) : ctx.lineTo(x1, y1)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current = particles.current.filter(p => p.life > 0)
      for (const p of particles.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08 // gravity
        p.life -= p.decay

        if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.size * p.life, p.color, p.life)
        } else {
          ctx.save()
          ctx.globalAlpha = p.life
          ctx.fillStyle = p.color
          ctx.shadowColor = p.color
          ctx.shadowBlur = 10
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * p.life * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }
      rafId.current = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
