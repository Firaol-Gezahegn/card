import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Play, Pause, Music, Volume2, VolumeX } from 'lucide-react'

const AudioPlayer = forwardRef(function AudioPlayer({ onPlayStateChange }, ref) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showPrompt, setShowPrompt] = useState(true)
  const audioRef = useRef(null)

  const trackUrl = '/assets/background-music.m4a'

  useEffect(() => {
    audioRef.current = new Audio(trackUrl)
    audioRef.current.loop = true
    audioRef.current.volume = 0.5

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Expose pause/play to parent via ref
  useImperativeHandle(ref, () => ({
    pause: () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        onPlayStateChange?.(false)
      }
    },
    play: () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true)
          onPlayStateChange?.(true)
        }).catch(() => {})
      }
    }
  }), [isPlaying, onPlayStateChange])

  const startMusic = () => {
    setShowPrompt(false)
    if (!audioRef.current) return
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true)
        onPlayStateChange?.(true)
      })
      .catch(err => console.error("Audio playback failed:", err))
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      onPlayStateChange?.(false)
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          onPlayStateChange?.(true)
        })
        .catch(err => console.error("Audio playback failed:", err))
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <>
      {/* Auto-play prompt modal on first load */}
      {showPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
              <Music className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-serif-lux tracking-wider">
              🎵 Background Music
            </h3>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">
              This experience is best with music. Would you like to play the background soundtrack?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={startMusic}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-lg cursor-pointer"
              >
                Play Music
              </button>
              <button
                onClick={dismissPrompt}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/50 text-xs font-bold uppercase tracking-widest rounded-full border border-white/10 transition-all cursor-pointer"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating player widget */}
      <div className="fixed top-4 right-4 z-40">
        <div className="bg-black/40 backdrop-blur-xl rounded-full pl-3 pr-2 py-1.5 flex items-center gap-3 border border-white/10 shadow-lg">
          
          <div className="flex items-center gap-0.5 h-4 w-5 px-1 justify-center">
            {isPlaying ? (
              <>
                <span className="w-[2px] bg-amber-400 rounded-full animate-bounce [animation-duration:0.6s]" />
                <span className="w-[2px] bg-amber-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                <span className="w-[2px] bg-amber-400 rounded-full animate-bounce [animation-duration:0.5s] [animation-delay:0.4s]" />
              </>
            ) : (
              <Music className="w-3.5 h-3.5 text-white/30" />
            )}
          </div>

          <div className="hidden sm:flex flex-col text-left pr-2 border-r border-white/10">
            <span className="text-[10px] font-semibold text-white/70 tracking-wider">Atmosphere</span>
            <span className="text-[8px] font-medium text-amber-400/60 uppercase tracking-widest">Seni's Song</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center transition-all transform active:scale-95 shadow cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            {isPlaying && (
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
})

export default AudioPlayer
