import { useState } from 'react'
import { Gift } from 'lucide-react'

const CANDLE_COLORS = ['#fb923c','#a78bfa','#34d399','#f472b6','#60a5fa']
const WISHES = ['Peace', 'Love', 'Tranquility', 'Happiness']

export default function BirthdayCandles({ opacity, pointerEvents, onWishMade }) {
  const [blown, setBlown] = useState([false, false, false, false, false])
  const [wishState, setWishState] = useState('idle') // idle | blown | countdown | message | celebration
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
        
        // Countdown sequence: 3... 2... 1...
        setTimeout(() => setCountdown(2), 1000)
        setTimeout(() => setCountdown(1), 2000)
        setTimeout(() => {
          setWishState('message')
          setTimeout(() => {
            setWishState('celebration')
            onWishMade?.()
            
            // Create wish bubbles with wrapper effect
            const bubbles = WISHES.map((wish, idx) => ({
              id: idx,
              text: wish,
              x: 15 + (idx * 20) + Math.random() * 10,
              delay: idx * 0.4,
              duration: 4 + Math.random() * 1.5
            }))
            setWishBubbles(bubbles)
          }, 2000) // Show message for 2 seconds before bubbles
        }, 3000) // After countdown
      }, 700)
    }
  }

  const cardStyle = {
    background: 'rgba(255,241,245,0.92)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(249,168,212,0.5)',
    boxShadow: '0 12px 60px rgba(190,24,93,0.15)',
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 transition-opacity duration-300"
      style={{ opacity, pointerEvents: opacity > 0.3 ? pointerEvents : 'none' }}>
      
      {/* Countdown Display */}
      {wishState === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-9xl font-bold font-serif-lux animate-pulse" 
            style={{ 
              color: '#be185d', 
              textShadow: '0 0 40px rgba(190,24,93,0.6)',
              animation: 'pulse 1s ease-in-out'
            }}>
            {countdown}
          </div>
        </div>
      )}

      {/* Message Display */}
      {wishState === 'message' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 px-6">
          <div className="text-center animate-fade-in-up">
            <p className="text-2xl sm:text-4xl font-bold font-serif-lux" 
              style={{ 
                color: '#9b2459',
                textShadow: '0 2px 20px rgba(155,36,89,0.3)'
              }}>
              My wish for this birthday is...
            </p>
          </div>
        </div>
      )}

      {/* Wish Bubbles with Wrapper - Floating wishes after message */}
      {wishState === 'celebration' && wishBubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute pointer-events-none animate-float-up z-50"
          style={{
            left: `${bubble.x}%`,
            bottom: '15%',
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
          }}
        >
          {/* Wrapper/Badge container */}
          <div className="relative">
            {/* Decorative wrapper ribbons */}
            <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full animate-pulse" 
              style={{ background: '#f472b6', opacity: 0.6 }} />
            <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full animate-pulse" 
              style={{ background: '#a78bfa', opacity: 0.6, animationDelay: '0.3s' }} />
            <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full animate-pulse" 
              style={{ background: '#34d399', opacity: 0.6, animationDelay: '0.6s' }} />
            <div className="absolute -bottom-2 -right-2 w-3 h-3 rounded-full animate-pulse" 
              style={{ background: '#fb923c', opacity: 0.6, animationDelay: '0.9s' }} />
            
            {/* Main wish bubble */}
            <div className="px-6 py-4 rounded-2xl text-base font-bold font-serif-lux tracking-wider shadow-2xl relative"
              style={{
                background: 'linear-gradient(135deg, rgba(249,168,212,0.98), rgba(251,207,232,0.98))',
                border: '3px solid rgba(190,24,93,0.5)',
                color: '#9b2459',
                boxShadow: '0 8px 32px rgba(190,24,93,0.4), inset 0 2px 8px rgba(255,255,255,0.3)',
              }}>
              <span className="relative z-10">{bubble.text} ✨</span>
              
              {/* Sparkle overlay */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse" />
                <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-50 animate-pulse" 
                  style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-2 left-3 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse" 
                  style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="max-w-md w-full text-center">
        <div className="rounded-3xl p-8 sm:p-10" style={cardStyle}>
          <h3 className="text-xl font-bold font-serif-lux tracking-wider mb-6" style={{ color: '#9b2459' }}>
            Make a Birthday Wish
          </h3>

          {/* Cake */}
          <div className="relative mx-auto mb-6" style={{ width: '200px', height: '165px' }}>
            {/* Bottom tier */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
              width: '180px', height: '55px',
              background: 'linear-gradient(180deg, #f472b6, #be185d)',
              borderRadius: '8px 8px 4px 4px',
              boxShadow: '0 4px 12px rgba(190,24,93,0.3)',
            }}>
              <div className="absolute top-0 left-0 right-0 h-2 rounded-t-lg" style={{ background: 'rgba(255,255,255,0.55)' }} />
              <div className="absolute bottom-2 left-0 right-0 text-center" style={{ fontSize: '8px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.2em', fontWeight: 700 }}>
                HAPPY BIRTHDAY
              </div>
            </div>
            {/* Middle tier */}
            <div className="absolute left-1/2 -translate-x-1/2" style={{
              bottom: '52px', width: '140px', height: '45px',
              background: 'linear-gradient(180deg, #fb7185, #f472b6)',
              borderRadius: '8px 8px 4px 4px',
              boxShadow: '0 4px 12px rgba(244,114,182,0.3)',
            }}>
              <div className="absolute top-0 left-0 right-0 h-2 rounded-t-lg" style={{ background: 'rgba(255,255,255,0.5)' }} />
            </div>
            {/* Top tier */}
            <div className="absolute left-1/2 -translate-x-1/2" style={{
              bottom: '94px', width: '100px', height: '38px',
              background: 'linear-gradient(180deg, #fce7f3, #f9a8d4)',
              borderRadius: '8px 8px 4px 4px',
              boxShadow: '0 4px 12px rgba(249,168,212,0.3)',
            }}>
              <div className="absolute top-0 left-0 right-0 h-2 rounded-t-lg" style={{ background: 'rgba(255,255,255,0.55)' }} />
            </div>

            {/* Candles */}
            {CANDLE_COLORS.map((color, i) => {
              const x = 55 + i * 22
              return (
                <div key={i}
                  className="absolute cursor-pointer transition-transform hover:scale-125 active:scale-95"
                  style={{ left: `${x}px`, bottom: '130px', transform: 'translateX(-50%)' }}
                  onClick={() => blowCandle(i)}
                  title="Click to blow out"
                >
                  <div style={{
                    width: '10px', height: '28px', margin: '0 auto',
                    background: `linear-gradient(180deg, ${color}, ${color}aa)`,
                    borderRadius: '3px 3px 2px 2px',
                    boxShadow: `0 0 8px ${color}88`,
                  }} />
                  {!blown[i] ? (
                    <div className="relative" style={{ marginTop: '-2px' }}>
                      <div className="animate-pulse" style={{
                        width: '13px', height: '20px', margin: '0 auto',
                        background: 'linear-gradient(180deg, #fffde7, #ffe066, #ffaa00, #ff6600)',
                        borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
                        boxShadow: '0 0 16px #ffaa0099',
                        filter: 'blur(0.4px)',
                      }} />
                    </div>
                  ) : (
                    <div style={{ height: '20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div style={{
                        width: '2px', height: '12px',
                        background: 'linear-gradient(to top, rgba(120,120,120,0.4), transparent)',
                        borderRadius: '2px',
                      }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-4">
            {blown.map((b, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${b ? 'scale-125' : ''}`}
                style={{ background: b ? CANDLE_COLORS[i] : '#fce7f3', boxShadow: b ? `0 0 6px ${CANDLE_COLORS[i]}` : 'none' }} />
            ))}
          </div>

          {wishState === 'idle' && (
            <p className="text-sm leading-relaxed" style={{ color: '#9b2459' }}>
              {blown.filter(Boolean).length === 0
                ? 'Close your eyes, make a wish, and click each candle...'
                : `${blown.filter(Boolean).length} of 5 out — keep going!`}
            </p>
          )}
          {wishState === 'blown' && (
            <p className="text-sm leading-relaxed animate-fade-in-up" style={{ color: '#9b2459' }}>
              ✨ Your wish is taking flight...
            </p>
          )}
          {wishState === 'celebration' && (
            <div className="space-y-3 animate-fade-in-up">
              <p className="text-sm font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 font-serif-lux" style={{ color: '#9b2459' }}>
                <Gift className="w-4 h-4" /> Wish Made! <Gift className="w-4 h-4" />
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#7c3055' }}>
                "May the love you give the world find its way back to you, Sunny.<br />
                ልደትሽ የተባረከ ይሁን! 🎂✨"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
