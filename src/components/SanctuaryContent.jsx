import { useEffect, useState, useMemo } from "react"
import { Heart, Sparkles, ChevronDown, Cake, Music, X } from "lucide-react"
import BirthdayCandles from "./BirthdayCandles"
import BurstBalloons from "./BurstBalloons"

// Floating petal layer
function PetalLayer() {
  const petals = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${4 + i * 6.5}%`,
    delay: `${i * 0.8}s`,
    duration: `${11 + (i % 5) * 2}s`,
    size: 8 + (i % 4) * 3,
    emoji: ['🌸','🌺','✨','💮','🌷'][i % 5],
  })), [])
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {petals.map(p => (
        <span key={p.id} className="petal absolute" style={{
          left: p.left, bottom: '-40px',
          fontSize: `${p.size}px`,
          animationDuration: p.duration,
          animationDelay: p.delay,
          opacity: 0,
        }}>{p.emoji}</span>
      ))}
    </div>
  )
}

const glass = {
  background: 'rgba(255,240,248,0.07)',
  backdropFilter: 'blur(28px)',
  border: '1px solid rgba(249,168,212,0.22)',
  boxShadow: '0 8px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
}

function GlowOrb({ color = '#be185d', size = 500, opacity = 0.18 }) {
  const blur = size * 0.4
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div style={{ width: size, height: size, borderRadius: '50%', background: color, filter: 'blur(' + blur + 'px)', opacity }} />
    </div>
  )
}

export default function SanctuaryContent({ scrollProgress, onYouTubeActive, onWishMade }) {
  const [lyricsOpen, setLyricsOpen] = useState(false)

  const getSectionOpacity = (start, peak, end) => {
    if (scrollProgress < start || scrollProgress > end) return 0
    if (scrollProgress < peak) return (scrollProgress - start) / (peak - start)
    return 1 - (scrollProgress - peak) / (end - peak)
  }

  const coverOpacity   = getSectionOpacity(0,    0.02, 0.10)
  const letterOpacity  = getSectionOpacity(0.11, 0.20, 0.30)
  const galleryOpacity = getSectionOpacity(0.31, 0.41, 0.51)
  const wishOpacity    = getSectionOpacity(0.52, 0.61, 0.70)
  const collageOpacity = getSectionOpacity(0.71, 0.81, 0.88)
  const youtubeOpacity = getSectionOpacity(0.89, 0.95, 1.01)

  useEffect(() => { onYouTubeActive?.(youtubeOpacity > 0.4) }, [youtubeOpacity > 0.4])

  const photos = [
    { url: "/assets/seni-2.jpeg", caption: "Beautiful Sunny" },
    { url: "/assets/seni-3.jpeg", caption: "Radiant Smile" },
    { url: "/assets/seni-4.jpeg", caption: "Golden Moments" },
    { url: "/assets/seni-5.jpeg", caption: "Precious Memory" },
    { url: "/assets/seni-6.jpeg", caption: "Glowing Spirit" },
    { url: "/assets/seni-7.jpeg", caption: "Forever Cherished" },
    { url: "/assets/seni-8.jpeg", caption: "Sunshine Moments" },
  ]

  const dots = [
    { t: 0,    label: "🌸" },
    { t: 0.20, label: "💌" },
    { t: 0.41, label: "🎈" },
    { t: 0.61, label: "🎂" },
    { t: 0.81, label: "🖼️" },
    { t: 0.95, label: "🎵" },
  ]

  return (
    <>
      <PetalLayer />

      {/* ── LYRICS PANEL — fixed, always on top, persists through scroll ── */}
      {lyricsOpen && (
        <div className="fixed top-0 right-0 h-full z-[60] animate-slide-in-right"
          style={{
            width: 'min(320px, 88vw)',
            background: 'rgba(12,2,22,0.97)',
            backdropFilter: 'blur(30px)',
            borderLeft: '1px solid rgba(192,132,252,0.3)',
            boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
          }}>
          <div className="flex flex-col h-full">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(192,132,252,0.15)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(192,132,252,0.15)' }}>
                  <Music className="w-3 h-3" style={{ color: '#c084fc' }} />
                </div>
                <div>
                  <p className="text-xs font-bold font-serif-lux" style={{ color: '#c084fc' }}>Ocean Eyes</p>
                  <p className="text-[10px]" style={{ color: 'rgba(192,132,252,0.45)' }}>Billie Eilish</p>
                </div>
              </div>
              <button onClick={() => setLyricsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110 pointer-events-auto"
                style={{ background: 'rgba(192,132,252,0.12)', border: '1px solid rgba(192,132,252,0.25)' }}>
                <X className="w-4 h-4" style={{ color: '#c084fc' }} />
              </button>
            </div>
            {/* Scrollable lyrics */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="text-[13px] leading-[2.1] space-y-5" style={{ color: 'rgba(252,231,243,0.78)' }}>
                <p>I've been watching you for some time<br />Can't stop staring at those ocean eyes<br />Burning cities and napalm skies<br />Fifteen flares inside those ocean eyes<br />Your ocean eyes</p>
                <p>No fair<br />You really know how to make me cry<br />When you give me those ocean eyes<br />I'm scared<br />I've never fallen from quite this high<br />Falling into your ocean eyes<br />Those ocean eyes</p>
                <p>I've been walking through a world gone blind<br />Can't stop thinking of your diamond mind<br />Careful creature made friends with time<br />He left her lonely with a diamond mind<br />And those ocean eyes</p>
                <p>No fair<br />You really know how to make me cry<br />When you give me those ocean eyes<br />I'm scared<br />I've never fallen from quite this high<br />Falling into your ocean eyes<br />Those ocean eyes</p>
                <p style={{ color: 'rgba(252,231,243,0.4)', fontStyle: 'italic' }}>Da, da-da, da-da<br />Da-da-da, da, da<br />Da, da, da, da, da-da-da-da<br />Mm mm mm</p>
                <p>No fair<br />You really know how to make me cry<br />When you give me those ocean eyes<br />I'm scared<br />I've never fallen from quite this high<br />Falling into your ocean eyes<br />Those ocean eyes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">

        {/* ── SPLASH ── */}
        {scrollProgress === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
            <GlowOrb color="#be185d" size={500} opacity={0.2} />
            <GlowOrb color="#7c3aed" size={300} opacity={0.09} />
            <div className="relative mb-8 flex items-center justify-center">
              <div className="animate-halo absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-rose-400/20" />
              <div className="animate-halo absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-fuchsia-400/15" style={{ animationDelay: '1s' }} />
              <div className="flex items-center gap-3 sm:gap-5">
                <span className="text-3xl sm:text-5xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎂</span>
                <span className="text-3xl sm:text-5xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎉</span>
                <span className="text-3xl sm:text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎁</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-7xl md:text-9xl font-bold tracking-wider mb-4 animate-shimmer font-serif-lux leading-tight">
              Happy Birthday
            </h1>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl sm:text-4xl">☀️</span>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold font-serif-lux animate-fade-in-up"
                style={{ color: '#fce7f3', textShadow: '0 0 40px rgba(249,168,212,0.7)' }}>Sunny</h2>
              <span className="text-2xl sm:text-4xl">☀️</span>
            </div>
            <div className="flex flex-col items-center gap-2 animate-bounce [animation-duration:2s]">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'rgba(249,168,212,0.6)' }}>Scroll to explore</span>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-rose-300/60" />
            </div>
          </div>
        )}

        {/* ── SECTION 1: COVER ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 transition-opacity duration-500"
          style={{ opacity: coverOpacity, pointerEvents: coverOpacity > 0.3 ? "auto" : "none" }}>
          <GlowOrb color="#9d174d" size={440} opacity={0.22} />
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-rose-300 animate-pulse" />
            <span className="text-lg">🌸</span>
            <Sparkles className="w-4 h-4 text-fuchsia-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 mb-4">
            <span className="text-2xl sm:text-3xl">☀️</span>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-wider font-serif-lux animate-shimmer">Sunny</h1>
            <span className="text-2xl sm:text-3xl">☀️</span>
          </div>
          <div className="flex items-center gap-2 mb-8">
            <Cake className="w-4 h-4 text-rose-300" />
            <p className="text-xs sm:text-sm font-bold tracking-[0.35em] uppercase font-serif-lux" style={{ color: 'rgba(249,168,212,0.85)' }}>Happy Birthday</p>
            <Cake className="w-4 h-4 text-rose-300" />
          </div>
          <div className="flex flex-col items-center gap-2 animate-bounce [animation-duration:2.2s]">
            <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: 'rgba(249,168,212,0.5)' }}>Scroll to begin</span>
            <ChevronDown className="w-4 h-4 text-rose-300/50" />
          </div>
        </div>

        {/* ── SECTION 2: LETTER ── */}
        <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-8 transition-opacity duration-500"
          style={{ opacity: letterOpacity, pointerEvents: letterOpacity > 0.3 ? "auto" : "none" }}>
          <GlowOrb color="#7c3aed" size={400} opacity={0.13} />
          <div className="w-full max-w-xl">
            <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-10 relative overflow-hidden" style={glass}>
              <div className="absolute top-3 left-3 text-rose-400/25 text-xl sm:text-2xl">❧</div>
              <div className="absolute top-3 right-3 text-rose-400/25 text-xl sm:text-2xl" style={{ transform: 'scaleX(-1)' }}>❧</div>

              <div className="flex items-center justify-between mb-5 pb-4"
                style={{ borderBottom: '1px solid rgba(249,168,212,0.15)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #be185d, #7c3aed)' }}>
                    <span className="text-xs">💌</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold font-serif-lux tracking-widest"
                    style={{ color: 'rgba(249,168,212,0.7)' }}>A Birthday Letter</span>
                </div>
                <Heart className="w-3.5 h-3.5 animate-pulse flex-shrink-0" style={{ color: '#f9a8d4', fill: 'rgba(249,168,212,0.3)' }} />
              </div>

              <div className="space-y-3 sm:space-y-4" style={{ color: 'rgba(252,231,243,0.88)' }}>
                <p className="text-sm sm:text-base leading-relaxed">
                  <span className="text-3xl sm:text-5xl font-bold font-serif-lux float-left mr-2 sm:mr-3 mt-1 leading-none animate-ink-drop"
                    style={{ color: '#f9a8d4', textShadow: '0 0 20px rgba(249,168,212,0.5)' }}>S</span>
                  unny,
                </p>
                <p className="text-sm sm:text-base leading-[1.8]">
                  You are the strongest, most independent, and most selfless person I know — the kind of woman who
                  constantly sacrifices herself for others without ever asking for anything in return.
                  The deep care you pour into everyone else has a way of coming back to you.
                </p>
                <p className="text-sm sm:text-base leading-[1.8]">
                  I wish and pray with all my heart for{' '}
                  <span className="font-semibold" style={{ color: '#f9a8d4' }}>እህተ ሚካዔል 😊</span>{' '}
                  to have the absolute peace and love she deserves.
                </p>
                <p className="text-sm sm:text-base leading-[1.8]">
                  More than anything, I am deeply grateful that I have — and have had — a friend like you.
                  And I am happy that I love you with all my heart. 😊
                </p>
              </div>

              <div className="mt-5 sm:mt-7 pt-4 sm:pt-5 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(249,168,212,0.12)' }}>
                <button onClick={() => setLyricsOpen(v => !v)}
                  className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 sm:px-4 py-2 rounded-xl transition-all hover:scale-105 pointer-events-auto"
                  style={{ background: 'rgba(192,132,252,0.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.25)' }}>
                  <Music className="w-3 h-3" /> {lyricsOpen ? 'Close Lyrics' : 'Song Lyrics'}
                </button>
                <div className="text-right">
                  <p className="text-[10px] sm:text-xs" style={{ color: 'rgba(249,168,212,0.5)' }}>With all my love,</p>
                  <p className="text-sm sm:text-base font-bold font-serif-lux mt-0.5" style={{ color: '#f9a8d4' }}>Firaol</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: BURST BALLOONS ── */}
        <div className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: galleryOpacity, pointerEvents: galleryOpacity > 0.3 ? "auto" : "none", zIndex: 30 }}>
          <BurstBalloons opacity={galleryOpacity} />
        </div>

        {/* ── SECTION 4: BIRTHDAY CANDLES ── */}
        <div className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: wishOpacity, pointerEvents: wishOpacity > 0.5 ? "auto" : "none", zIndex: 40 }}>
          <BirthdayCandles opacity={wishOpacity} pointerEvents="auto" onWishMade={onWishMade} />
        </div>

        {/* ── SECTION 5: COLLAGE ── */}
        <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-8 transition-opacity duration-500"
          style={{ opacity: collageOpacity, pointerEvents: collageOpacity > 0.3 ? "auto" : "none", zIndex: 30 }}>
          <GlowOrb color="#f472b6" size={420} opacity={0.15} />
          <div className="w-full max-w-xl">
            <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-7 relative overflow-hidden" style={glass}>
              <div className="text-center mb-4">
                <h3 className="text-base sm:text-xl font-bold font-serif-lux" style={{ color: '#fce7f3' }}>A Portrait of Sunny 🌟</h3>
                <div className="mt-2 w-16 h-px mx-auto" style={{ background: 'linear-gradient(to right, transparent, rgba(249,168,212,0.5), transparent)' }} />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="col-span-2 polaroid relative rounded-xl overflow-hidden cursor-pointer"
                  style={{ aspectRatio: '4/3', border: '1px solid rgba(249,168,212,0.25)', boxShadow: '0 6px 28px rgba(0,0,0,0.4)' }}>
                  <img src="/assets/seni-2.jpeg" alt="Sunny" className="w-full h-full object-cover" style={{ opacity: 0.9 }} loading="lazy" />
                </div>
                <div className="flex flex-col gap-2">
                  {['/assets/seni-5.jpeg', '/assets/seni-8.jpeg'].map((url, i) => (
                    <div key={i} className="polaroid relative rounded-xl overflow-hidden flex-1 cursor-pointer"
                      style={{ border: '1px solid rgba(249,168,212,0.2)', boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }}>
                      <img src={url} alt="Sunny" className="w-full h-full object-cover" style={{ opacity: 0.85 }} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['/assets/seni-3.jpeg', '/assets/seni-4.jpeg', '/assets/seni-6.jpeg', '/assets/seni-7.jpeg'].map((url, i) => (
                  <div key={i} className="polaroid relative rounded-xl overflow-hidden cursor-pointer"
                    style={{ aspectRatio: '1', border: '1px solid rgba(249,168,212,0.18)', boxShadow: '0 3px 12px rgba(0,0,0,0.3)' }}>
                    <img src={url} alt="Sunny" className="w-full h-full object-cover" style={{ opacity: 0.85 }} loading="lazy" />
                  </div>
                ))}
              </div>
              <p className="text-center mt-4 text-xs font-poetry italic" style={{ color: 'rgba(249,168,212,0.5)' }}>
                Every picture holds a thousand words ✨
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 6: YOUTUBE + FAREWELL ── */}
        <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-8 transition-opacity duration-500"
          style={{ opacity: youtubeOpacity, pointerEvents: youtubeOpacity > 0.3 ? "auto" : "none", zIndex: 20 }}>
          <GlowOrb color="#7c3aed" size={440} opacity={0.17} />
          <div className="w-full max-w-xl">
            <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-8 relative overflow-hidden" style={glass}>

              {/* Vinyl header */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                  <div className="animate-glow-spin absolute inset-0 rounded-full"
                    style={{ background: 'conic-gradient(#f472b6, #a78bfa, #60a5fa, #f472b6)', padding: '2px' }}>
                    <div className="w-full h-full rounded-full bg-[#1a0010]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-vinyl w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'radial-gradient(circle, #2d0022 30%, #1a0010 60%, #2d0022 100%)' }}>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: 'rgba(249,168,212,0.45)' }}>Now Playing</p>
                  <p className="text-xs font-bold font-serif-lux" style={{ color: '#fce7f3' }}>A Song For You</p>
                </div>
              </div>

              {/* Video */}
              <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden mb-5 pointer-events-auto"
                style={{ aspectRatio: '16/9', border: '1px solid rgba(249,168,212,0.2)', boxShadow: '0 0 40px rgba(190,24,93,0.22)' }}>
                <iframe src="https://www.youtube.com/embed/mZdVMepojvE" title="A Song For Sunny"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen />
              </div>

              <div className="text-center" style={{ borderTop: '1px solid rgba(249,168,212,0.1)', paddingTop: '1.25rem' }}>
                <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'rgba(252,231,243,0.65)' }}>
                  No matter where things stand, I wanted to tell you this with absolute clarity.
                  You deserve to hear it exactly as it is.
                </p>

                <div className="py-4 px-4 sm:px-5 rounded-xl sm:rounded-2xl relative overflow-hidden mb-4"
                  style={{ background: 'rgba(192,132,252,0.07)', border: '1px solid rgba(192,132,252,0.18)' }}>
                  <div className="absolute top-1 left-2 text-purple-400/20 text-2xl font-serif">"</div>
                  <p className="text-xs sm:text-sm leading-relaxed font-poetry italic relative z-10"
                    style={{ color: 'rgba(252,231,243,0.82)' }}>
                    Like the wind, some things are meant to be felt, not held.
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-2" style={{ color: 'rgba(192,132,252,0.55)' }}>
                    — Adapted from Rumi
                  </p>
                </div>

                <div className="w-12 h-px mx-auto mb-4"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(249,168,212,0.35), transparent)' }} />
                <p className="text-[9px] uppercase tracking-[0.3em] font-bold mb-1" style={{ color: 'rgba(249,168,212,0.45)' }}>With all my love,</p>
                <p className="text-xl sm:text-2xl font-serif-lux mb-3" style={{ color: '#fce7f3' }}>Firaol</p>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mx-auto animate-pulse" style={{ color: '#f9a8d4', fill: 'rgba(249,168,212,0.25)' }} />
                <p className="text-[9px] tracking-widest uppercase mt-3" style={{ color: 'rgba(249,168,212,0.4)' }}>ልደትሽ የተባረከ ይሁን!</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCROLL DOTS ── */}
        <div className="fixed bottom-4 sm:bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-50 pointer-events-none">
          {dots.map((dot, i) => {
            const active = scrollProgress >= dot.t
            return (
              <div key={i} className="flex flex-col items-center gap-0.5 transition-all duration-500"
                style={{ transform: active ? 'scale(1.3)' : 'scale(0.8)', opacity: active ? 1 : 0.3 }}>
                <span className="text-[10px] sm:text-xs">{dot.label}</span>
                <div className="w-1 h-1 rounded-full" style={{ background: active ? '#f9a8d4' : 'rgba(249,168,212,0.25)' }} />
              </div>
            )
          })}
        </div>

      </div>
    </>
  )
}
