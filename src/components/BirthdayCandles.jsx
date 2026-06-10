import { useState } from 'react'
import { Gift } from 'lucide-react'

const CANDLE_COLORS = ['#fb923c','#a78bfa','#34d399','#f472b6','#60a5fa']
const WISHES = ['Peace', 'Love', 'Tranquility', 'Happiness']
const WISH_COLORS = ['#f9a8d4','#c084fc','#6ee7b7','#93c5fd']

const glass = {
  background: 'rgba(255,240,248,0.07)',
  backdropFilter: 'blur(28px)',
  border: '1px solid rgba(249,168,212,0.22)',
  boxShadow: '0 8px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
}

export default function BirthdayCandles({ opacity, pointerEvents, onWishMade }) {
  const [blown, setBlown] = useState([false, false, false, false, false])
  const [wishState, setWishState] = useState('idle')
  const [countdown, setCountdown] = useState(3)
  const [wishBubbles, setWishBubbles] = useState([])

  const blowCandle = (i) => {
    if (blown[i] || wishState !== 'idle') return
    const next = [...blown]
    next[i] = true
    setBlown(next)
    if (next.every(Boolean)) {
      setWishState('blown')
      setTimeout(() => {
        setWishState('countdown')
        setCountdown(3)
        setTimeout(() => setCountdown(2), 1000)
        setTimeout(() => setCountdown(1), 2000)
        setTimeout(() => {
          setWishState('message')
          setTimeout(() => {
            setWishState('celebration')
            onWishMade?.()
            setWishBubbles(WISHES.map((wish, idx) => ({
              id: idx, text: wish,
              x: 12 + idx * 22,
              delay: idx * 0.45,
              color: WISH_COLORS[idx],
            })))
          }, 2200)
        }, 3000)
      }, 600)
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 transition-opacity duration-500"
      style={{ opacity, pointerEvents: opacity > 0.3 ? pointerEvents : 'none' }}>

      {/* Glow orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: 500, height: 500, borderRadius: '50%', background: '#be185d', filter: 'blur(200px)', opacity: 0.18 }} />
      </div>

      {/* ── Countdown ── */}
      {wishState === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div key={countdown} className="animate-count-pop font-bold font-serif-lux"
            style={{
              fontSize: '10rem',
              color: '#f9a8d4',
              textShadow: '0 0 60px rgba(249,168,212,0.8), 0 0 120px rgba(190,24,93,0.5)',
            }}>
            {countdown}
          </div>
        </div>
      )}

      {/* ── Message ── */}
      {wishState === 'message' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 px-6">
          <div className="text-center animate-scale-in">
            <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(249,168,212,0.5)' }}>✨ your birthday wish ✨</p>
            <p className="text-3xl sm:text-5xl font-bold font-serif-lux"
              style={{ color: '#fce7f3', textShadow: '0 0 40px rgba(249,168,212,0.6)' }}>
              My wish for this<br />birthday is...
            </p>
          </div>
        </div>
      )}

      {/* ── Wish Bubbles ── */}
      {wishState === 'celebration' && wishBubbles.map((bubble) => (
        <div key={bubble.id} className="absolute pointer-events-none animate-float-up z-50"
          style={{ left: `${bubble.x}%`, bottom: '15%', animationDelay: `${bubble.delay}s` }}>
          <div className="relative">
            {/* Orbiting sparkle dots */}
            {[0,1,2,3].map(j => (
              <div key={j} className="absolute w-2 h-2 rounded-full animate-ping"
                style={{
                  background: bubble.color,
                  top: j < 2 ? '-6px' : 'calc(100% + 2px)',
                  left: j % 2 === 0 ? '-6px' : 'calc(100% + 2px)',
                  animationDelay: `${j * 0.2}s`,
                  opacity: 0.7,
                }} />
            ))}
            {/* Bubble */}
            <div className="px-7 py-4 rounded-2xl text-base font-bold font-serif-lux tracking-wide shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${bubble.color}28, ${bubble.color}12)`,
                border: `2px solid ${bubble.color}66`,
                color: '#fce7f3',
                boxShadow: `0 8px 32px ${bubble.color}44, inset 0 1px 0 rgba(255,255,255,0.15)`,
                backdropFilter: 'blur(20px)',
                whiteSpace: 'nowrap',
              }}>
              <span style={{ color: bubble.color }}>{bubble.text}</span>
              <span className="ml-2 text-sm">✨</span>
            </div>
          </div>
        </div>
      ))}

      {/* ── Card ── */}
      <div className="max-w-md w-full text-center relative z-10">
        <div className="rounded-3xl p-8 sm:p-10" style={glass}>

          <h3 className="text-xl font-bold font-serif-lux tracking-wider mb-7" style={{ color: '#fce7f3' }}>
            Make a Birthday Wish
          </h3>

          {/* ── Cake ── */}
          <div className="relative mx-auto mb-7" style={{ width: '210px', height: '170px' }}>
            {/* Glow under cake */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(190,24,93,0.35) 0%, transparent 70%)', filter: 'blur(8px)' }} />

            {/* Bottom tier */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
              width: '188px', height: '58px',
              background: 'linear-gradient(180deg, #f472b6 0%, #be185d 100%)',
              borderRadius: '10px 10px 6px 6px',
              boxShadow: '0 6px 20px rgba(190,24,93,0.5)',
            }}>
              <div className="absolute top-0 left-0 right-0 h-2 rounded-t-lg" style={{ background: 'rgba(255,255,255,0.3)' }} />
              <div className="absolute bottom-3 left-0 right-0 text-center"
                style={{ fontSize: '7px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.22em', fontWeight: 700 }}>
                HAPPY BIRTHDAY
              </div>
            </div>

            {/* Middle tier */}
            <div className="absolute left-1/2 -translate-x-1/2" style={{
              bottom: '55px', width: '146px', height: '48px',
              background: 'linear-gradient(180deg, #fb7185 0%, #f472b6 100%)',
              borderRadius: '10px 10px 6px 6px',
              boxShadow: '0 4px 14px rgba(244,114,182,0.45)',
            }}>
              <div className="absolute top-0 left-0 right-0 h-2 rounded-t-lg" style={{ background: 'rgba(255,255,255,0.25)' }} />
            </div>

            {/* Top tier */}
            <div className="absolute left-1/2 -translate-x-1/2" style={{
              bottom: '100px', width: '104px', height: '40px',
              background: 'linear-gradient(180deg, #fce7f3 0%, #f9a8d4 100%)',
              borderRadius: '10px 10px 6px 6px',
              boxShadow: '0 4px 14px rgba(249,168,212,0.4)',
            }}>
              <div className="absolute top-0 left-0 right-0 h-2 rounded-t-lg" style={{ background: 'rgba(255,255,255,0.4)' }} />
            </div>

            {/* Candles */}
            {CANDLE_COLORS.map((color, i) => {
              const x = 50 + i * 24
              return (
                <div key={i}
                  className="absolute cursor-pointer group"
                  style={{ left: `${x}px`, bottom: '138px', transform: 'translateX(-50%)' }}
                  onClick={() => blowCandle(i)}>
                  {/* Candle body */}
                  <div className="transition-transform duration-200 group-hover:scale-125 group-active:scale-95"
                    style={{
                      width: '11px', height: '30px', margin: '0 auto',
                      background: `linear-gradient(180deg, ${color}ff, ${color}99)`,
                      borderRadius: '4px 4px 3px 3px',
                      boxShadow: `0 0 12px ${color}88`,
                    }} />
                  {!blown[i] ? (
                    <>
                      {/* Flame */}
                      <div className="animate-pulse mx-auto"
                        style={{
                          width: '14px', height: '22px',
                          marginTop: '-3px',
                          background: 'linear-gradient(180deg, #fffde7 0%, #ffe066 30%, #ffaa00 65%, #ff6600 100%)',
                          borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
                          boxShadow: `0 0 12px #ffaa00cc, 0 0 24px ${color}66`,
                        }} />
                      {/* Glow halo */}
                      <div className="absolute -inset-3 rounded-full pointer-events-none"
                        style={{ background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`, top: '-20px' }} />
                    </>
                  ) : (
                    /* Smoke wisp */
                    <div style={{
                      width: '2px', height: '18px', margin: '0 auto', marginTop: '-2px',
                      background: 'linear-gradient(to top, rgba(180,180,200,0.5), transparent)',
                      borderRadius: '2px',
                    }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-3 mb-5">
            {blown.map((b, i) => (
              <div key={i} className="transition-all duration-400 rounded-full"
                style={{
                  width: b ? '14px' : '10px',
                  height: b ? '14px' : '10px',
                  background: b ? CANDLE_COLORS[i] : 'rgba(249,168,212,0.15)',
                  boxShadow: b ? `0 0 10px ${CANDLE_COLORS[i]}` : 'none',
                  border: `1px solid ${b ? CANDLE_COLORS[i] : 'rgba(249,168,212,0.2)'}`,
                }} />
            ))}
          </div>

          {wishState === 'idle' && (
            <p className="text-sm" style={{ color: 'rgba(252,231,243,0.55)' }}>
              {blown.filter(Boolean).length === 0
                ? '✨ Make a wish — click each flame to blow it out'
                : `${blown.filter(Boolean).length} of 5 blown — keep going!`}
            </p>
          )}
          {wishState === 'blown' && (
            <p className="text-sm animate-fade-in-up" style={{ color: 'rgba(249,168,212,0.8)' }}>
              ✨ Your wish is taking flight...
            </p>
          )}
          {wishState === 'celebration' && (
            <div className="space-y-3 animate-fade-in-up">
              <p className="text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 font-serif-lux"
                style={{ color: '#f9a8d4' }}>
                <Gift className="w-4 h-4" /> Wish Made! <Gift className="w-4 h-4" />
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(252,231,243,0.7)' }}>
                May the love you give the world find its way back to you, Sunny.<br />
                ልደትሽ የተባረከ ይሁን! 🎂✨
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
