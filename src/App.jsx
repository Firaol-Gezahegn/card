import { useState, useEffect, useRef, useCallback } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import emailjs from '@emailjs/browser'
import LoginScreen from './components/LoginScreen'
import AudioPlayer from './components/AudioPlayer'
import StarTunnel from './components/ParticleField'
import CosmicObjects from './components/CosmicObjects'
import SanctuaryContent from './components/SanctuaryContent'
import SparklerCursor from './components/SparklerCursor'
import BalloonConfetti from './components/BalloonConfetti'
import WordRain from './components/WordRain'

const GOOGLE_CLIENT_ID = "803885932571-hfni9gnvscf0sqsi77bl4lie75o7j7s8.apps.googleusercontent.com"

function FlightCamera({ scrollProgress }) {
  const totalDistance = 270

  useFrame((state) => {
    const targetZ = -(scrollProgress * totalDistance)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08)
    const time = state.clock.getElapsedTime()
    state.camera.position.x = Math.sin(time * 0.15) * 0.3
    state.camera.position.y = Math.cos(time * 0.12) * 0.2
    state.camera.lookAt(state.camera.position.x, state.camera.position.y, state.camera.position.z - 10)
  })

  return null
}

function App() {
  const [user, setUser] = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [wishMade, setWishMade] = useState(false)
  const audioRef = useRef(null)

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    setScrollProgress(prev => Math.max(0, Math.min(1, prev + e.deltaY * 0.0004)))
  }, [])

  const touchStartY = useRef(0)
  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    const deltaY = touchStartY.current - e.touches[0].clientY
    touchStartY.current = e.touches[0].clientY
    setScrollProgress(prev => Math.max(0, Math.min(1, prev + deltaY * 0.002)))
  }, [])

  useEffect(() => {
    if (!user) return
    const el = document.body
    el.style.overflow = 'hidden'
    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      el.style.overflow = ''
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
    }
  }, [user, handleWheel, handleTouchStart, handleTouchMove])

  const handleYouTubeActive = useCallback((isActive) => {
    if (isActive) {
      audioRef.current?.pause()
    }
  }, [])

  const handleLoginSuccess = (profile) => {
    setUser(profile)
    if (profile.email === 'snasefa@gmail.com') {
      const serviceId = "service_uy13sfc"
      const templateId = "template_2mtwu29"
      const publicKey = "TK0gq36HuAg7Ix_yJ"
      emailjs.send(serviceId, templateId, {
        subject: "Sanctuary Accessed",
        message: "The digital sanctuary was opened.",
        body: "The digital sanctuary was opened.",
        to_email: "firaolg@gmail.com",
        to_name: "Firaol",
        from_name: "Sanctuary System",
        user_email: "snasefa@gmail.com"
      }, publicKey).catch(() => {})
    }
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="relative w-full h-screen overflow-hidden" style={{ background: '#1a0010' }}>
        {!user ? (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            <SparklerCursor />
            <BalloonConfetti showConfetti={wishMade} />
            <WordRain />
            <AudioPlayer ref={audioRef} onPlayStateChange={() => {}} />
            <div className="fixed inset-0 w-full h-full z-0">
              <Canvas camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 500 }} gl={{ antialias: true, alpha: false }}>
                <color attach="background" args={['#1a0010']} />
                <ambientLight intensity={0.15} />
                <StarTunnel scrollProgress={scrollProgress} />
                <CosmicObjects />
                <FlightCamera scrollProgress={scrollProgress} />
              </Canvas>
            </div>
            <SanctuaryContent user={user} scrollProgress={scrollProgress} onYouTubeActive={handleYouTubeActive} onWishMade={() => setWishMade(true)} />
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
