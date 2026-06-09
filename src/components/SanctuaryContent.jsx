import { useEffect, useState } from "react"
import { Heart, Sparkles, ChevronDown, Cake } from "lucide-react"
import BirthdayCandles from "./BirthdayCandles"

export default function SanctuaryContent({ scrollProgress, onYouTubeActive, onWishMade }) {
  const [lyricsOpen, setLyricsOpen] = useState(false)
  
  const getSectionOpacity = (start, peak, end) => {
    if (scrollProgress < start || scrollProgress > end) return 0
    if (scrollProgress < peak) return (scrollProgress - start) / (peak - start)
    return 1 - (scrollProgress - peak) / (end - peak)
  }

  const coverOpacity   = getSectionOpacity(0,    0.02, 0.11)
  const letterOpacity  = getSectionOpacity(0.12, 0.22, 0.34)
  const wishOpacity    = getSectionOpacity(0.35, 0.47, 0.59)
  const galleryOpacity = getSectionOpacity(0.60, 0.72, 0.84)
  const youtubeOpacity = getSectionOpacity(0.85, 0.93, 1.01)

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

  const card = {
    background: "rgba(255,241,245,0.92)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(249,168,212,0.45)",
    boxShadow: "0 8px 40px rgba(120,0,40,0.12)",
  }

  const dots = [
    { t: 0,    label: "🌸" },
    { t: 0.22, label: "💌" },
    { t: 0.47, label: "🎂" },
    { t: 0.72, label: "📸" },
    { t: 0.93, label: "🎵" },
  ]

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">

      {/* INITIAL SPLASH: Happy Birthday (before scrolling) */}
      {scrollProgress === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-5xl">🎂</span>
            <span className="text-5xl">🎉</span>
            <span className="text-5xl">🎁</span>
          </div>
          <h1 className="text-7xl sm:text-9xl md:text-[12rem] font-bold tracking-wider mb-6 font-serif-lux"
            style={{ color: "#9b2459", textShadow: "0 2px 30px rgba(155,36,89,0.4)" }}>
            Happy Birthday
          </h1>
          <div className="flex items-center gap-3 mb-12">
            <span className="text-4xl">☀️</span>
            <h2 className="text-4xl sm:text-6xl font-bold font-serif-lux" style={{ color: "#be185d" }}>
              Sunny
            </h2>
            <span className="text-4xl">☀️</span>
          </div>
          <div className="flex flex-col items-center gap-3 animate-bounce [animation-duration:2s]">
            <span className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "#be185d" }}>
              Scroll to explore your celebration
            </span>
            <ChevronDown className="w-6 h-6" style={{ color: "#be185d" }} />
          </div>
        </div>
      )}

      {/* SECTION 1: COVER */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-opacity duration-300"
        style={{ opacity: coverOpacity, pointerEvents: coverOpacity > 0.3 ? "auto" : "none" }}>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🌸</span>
          <Sparkles className="w-4 h-4 text-rose-600 animate-pulse" />
          <span className="text-2xl">🌸</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">☀️</span>
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-wider font-serif-lux"
            style={{ color: "#9b2459", textShadow: "0 2px 20px rgba(155,36,89,0.3)" }}>Sunny</h1>
          <span className="text-3xl">☀️</span>
        </div>
        <div className="flex items-center gap-3 mb-10">
          <Cake className="w-5 h-5 text-rose-600" />
          <p className="text-base font-bold tracking-[0.3em] uppercase font-serif-lux" style={{ color: "#9b2459" }}>Happy Birthday</p>
          <Cake className="w-5 h-5 text-rose-600" />
        </div>
        <div className="flex flex-col items-center gap-2 animate-bounce [animation-duration:2s]">
          <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#be185d" }}>Scroll to begin</span>
          <ChevronDown className="w-5 h-5" style={{ color: "#be185d" }} />
        </div>
      </div>

      {/* SECTION 2: LETTER */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 transition-opacity duration-300"
        style={{ opacity: letterOpacity, pointerEvents: letterOpacity > 0.3 ? "auto" : "none" }}>
        
        {/* Side Panel for Lyrics */}
        {lyricsOpen && (
          <div className="absolute top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-lg shadow-2xl overflow-y-auto pointer-events-auto z-50 animate-slide-in-right"
            style={{ 
              borderLeft: '2px solid rgba(190,24,93,0.3)',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
            }}>
            <div className="p-6">
              <button
                onClick={() => setLyricsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
                style={{ background: 'rgba(190,24,93,0.1)', color: '#9b2459' }}
              >
                ✕
              </button>
              
              <p className="text-sm font-bold mb-4 font-serif-lux" style={{ color: "#9b2459" }}>
                🎵 Ocean Eyes - Billie Eilish
              </p>
              
              <div className="text-[13px] leading-relaxed space-y-4" style={{ color: "#7c2040" }}>
                <p>I've been watching you for some time<br />
                Can't stop staring at those ocean eyes<br />
                Burning cities and napalm skies<br />
                Fifteen flares inside those ocean eyes<br />
                Your ocean eyes</p>
                
                <p>No fair<br />
                You really know how to make me cry<br />
                When you give me those ocean eyes<br />
                I'm scared<br />
                I've never fallen from quite this high<br />
                Falling into your ocean eyes<br />
                Those ocean eyes</p>
                
                <p>I've been walking through a world gone blind<br />
                Can't stop thinking of your diamond mind<br />
                Careful creature made friends with time<br />
                He left her lonely with a diamond mind<br />
                And those ocean eyes</p>
                
                <p>No fair<br />
                You really know how to make me cry<br />
                When you give me those ocean eyes<br />
                I'm scared<br />
                I've never fallen from quite this high<br />
                Falling into your ocean eyes<br />
                Those ocean eyes</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-xl w-full">
          <div className="rounded-3xl p-8 sm:p-12" style={card}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-200/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">💌</span>
                <span className="text-[10px] uppercase font-bold font-serif-lux" style={{ color: "#9b2459" }}>
                  A Birthday Letter For You
                </span>
              </div>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-300/50" />
            </div>

            <div className="space-y-5" style={{ color: "#7c2040" }}>
              <p className="text-[15px] sm:text-base leading-relaxed">
                <span className="text-3xl font-bold font-serif-lux mr-2 float-left mt-1" style={{ color: "#be185d" }}>S</span>unny,
              </p>
              <p className="text-[15px] sm:text-base leading-relaxed">
                You are the strongest, most independent, and most selfless person I know — the kind of woman who
                constantly sacrifices herself for others without ever asking for or needing anything in return.
                I want you to know that the deep care you pour into everyone else has a way of coming back to you.
              </p>
              <p className="text-[15px] sm:text-base leading-relaxed">
                I wish and pray with all my heart for{' '}
                <span className="font-semibold" style={{ color: "#9b2459" }}>እህተ ሚካዔል 😊</span> to have the absolute
                peace and love she deserves, because what you deserve transcends what you think you need right now.
              </p>
              <p className="text-[15px] sm:text-base leading-relaxed">
                More than anything, I am just deeply grateful that I have — and have had — a friend like you in my life.
                And I am happy that I love you with all my heart.
              </p>
              <p className="text-[15px] sm:text-base leading-relaxed">
                If nothing else, at least I know that I am still capable of loving someone that deeply. 😊
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-rose-200/40 flex items-center justify-between">
              <button
                onClick={() => setLyricsOpen(true)}
                className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all hover:scale-105 pointer-events-auto"
                style={{ 
                  background: 'rgba(190,24,93,0.1)', 
                  color: '#9b2459',
                  border: '1px solid rgba(190,24,93,0.2)'
                }}
              >
                🎵 Song Lyrics
              </button>
              
              <div className="text-right">
                <p className="text-sm" style={{ color: "#7c2040" }}>With all my love,</p>
                <p className="text-lg font-bold font-serif-lux mt-1" style={{ color: "#9b2459" }}>Firaol</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: BIRTHDAY CANDLES */}
      <div className="absolute inset-0 transition-opacity duration-300" 
        style={{ opacity: wishOpacity, pointerEvents: wishOpacity > 0.5 ? "auto" : "none", zIndex: 40 }}>
        <BirthdayCandles opacity={wishOpacity} pointerEvents="auto" onWishMade={onWishMade} />
      </div>

      {/* SECTION 4: PHOTO GALLERY */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 transition-opacity duration-300"
        style={{ opacity: galleryOpacity, pointerEvents: galleryOpacity > 0.3 ? "auto" : "none", zIndex: 30 }}>
        <div className="max-w-2xl w-full">
          <div className="rounded-3xl p-6 sm:p-8" style={card}>
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-6 text-center font-serif-lux" style={{ color: "#9b2459" }}>
              Beautiful Moments
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-square group pointer-events-auto">
                  <img src={photo.url} alt={photo.caption}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-[10px] text-white tracking-wider font-semibold">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: YOUTUBE + FAREWELL */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 transition-opacity duration-300"
        style={{ opacity: youtubeOpacity, pointerEvents: youtubeOpacity > 0.3 ? "auto" : "none", zIndex: 20 }}>
        <div className="max-w-xl w-full">
          <div className="rounded-3xl p-6 sm:p-8" style={card}>
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4 text-center font-serif-lux" style={{ color: "#9b2459" }}>
              A Song For You
            </p>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 pointer-events-auto"
              style={{ border: '1px solid rgba(190,24,93,0.2)' }}>
              <iframe src="https://www.youtube.com/embed/mZdVMepojvE" title="A Song For Sunny"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen />
            </div>

            <div className="text-center pt-4 border-t" style={{ borderColor: 'rgba(190,24,93,0.15)' }}>
              <p className="font-poetry text-sm leading-relaxed mt-4 mb-5" style={{ color: "#7c2040" }}>
                No matter where things stand or what happens next, I wanted to tell you this with absolute clarity.
                You deserve to hear it exactly as it is.
              </p>

              {/* Rumi quote */}
              <div className="my-5 py-4 px-5 rounded-2xl" style={{ background: 'rgba(190,24,93,0.06)', border: '1px solid rgba(190,24,93,0.12)' }}>
                <p className="font-poetry italic text-sm leading-relaxed mb-1" style={{ color: "#9b2459" }}>
                  "Like the wind, some things are meant to be felt, not held."
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#be185d" }}>
                  — Adapted from Rumi
                </p>
              </div>

              <div className="w-16 h-px mx-auto mb-5" style={{ background: 'linear-gradient(to right, transparent, #be185d77, transparent)' }} />
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 font-serif-lux" style={{ color: "#be185d" }}>With all my love,</p>
              <p className="text-2xl font-serif-lux tracking-wider mb-4" style={{ color: "#9b2459" }}>Firaol</p>
              <Heart className="w-5 h-5 mx-auto animate-pulse" style={{ color: "#be185d", fill: 'rgba(190,24,93,0.3)' }} />
              <p className="text-[10px] tracking-widest uppercase mt-4" style={{ color: "#be185d" }}>ልደትሽ የተባረከ ይሁን!</p>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL DOTS */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-50 pointer-events-none">
        {dots.map((dot, i) => (
          <div key={i} className={"transition-all duration-500 " + (scrollProgress >= dot.t ? "text-sm scale-125" : "text-xs opacity-40")}>
            {dot.label}
          </div>
        ))}
      </div>

    </div>
  )
}
