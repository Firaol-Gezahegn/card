import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CompassRose({ candleState }) {
  const outerRef = useRef()
  const innerRef = useRef()
  const lightRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Rotate the astrolabe rings
    if (outerRef.current) {
      outerRef.current.rotation.y = time * 0.08
      outerRef.current.rotation.x = time * 0.04
      outerRef.current.rotation.z = time * 0.02
    }
    
    // Rotate the inner core
    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.15
      innerRef.current.rotation.z = time * 0.08
    }

    // Dynamic light burst (flare) and scale morphing when the candle is blown!
    const isBlown = candleState === 'blown'
    const targetScale = isBlown ? 2.4 : 1.2
    const targetLight = isBlown ? 15.0 : 3.5

    if (innerRef.current) {
      // Smoothly interpolate inner core scale
      const s = THREE.MathUtils.lerp(innerRef.current.scale.x, targetScale, 0.06)
      innerRef.current.scale.set(s, s, s)
    }

    if (lightRef.current) {
      // Smoothly interpolate point light intensity
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetLight, 0.05)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Outer elegant astrolabe rings */}
      <group ref={outerRef}>
        {/* Ring 1: Equatorial */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.0, 0.04, 8, 64]} />
          <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.15} />
        </mesh>
        
        {/* Ring 2: Meridian */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[2.95, 0.04, 8, 64]} />
          <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Ring 3: Diagonal Orbit */}
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[2.9, 0.03, 8, 64]} />
          <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Inner physical gold octahedron shape */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[1.0, 0]} />
        <meshPhysicalMaterial
          color="#fbbf24"
          transmission={0.3}
          thickness={1.0}
          roughness={0.2}
          metalness={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Warm gold point light at the center */}
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={3.5} distance={20} color="#fb923c" />
    </group>
  )
}
