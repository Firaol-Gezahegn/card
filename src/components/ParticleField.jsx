import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const createStarTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.15, 'rgba(255, 210, 230, 0.9)')
  gradient.addColorStop(0.4, 'rgba(220, 80, 130, 0.3)')
  gradient.addColorStop(1, 'rgba(255, 240, 245, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  return new THREE.CanvasTexture(canvas)
}

export default function StarTunnel({ scrollProgress }) {
  const pointsRef = useRef()
  const starCount = 3000
  const tunnelLength = 300
  const tunnelRadius = 40

  const starTexture = useMemo(() => createStarTexture(), [])

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(starCount * 3)
    const col = new Float32Array(starCount * 3)
    const siz = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3

      // Distribute stars in a cylinder-like corridor stretching deep into Z
      const angle = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * tunnelRadius
      const z = Math.random() * tunnelLength

      pos[idx] = Math.cos(angle) * radius
      pos[idx + 1] = Math.sin(angle) * radius
      pos[idx + 2] = -z // Stars extend into negative Z (ahead of the camera)

      // Color variation: soft pinks, hibiscus rose, and warm whites
      const colorSeed = Math.random()
      const c = new THREE.Color()
      if (colorSeed < 0.45) {
        c.setHSL(0.92, 0.7, 0.75 + Math.random() * 0.2) // Soft pink
      } else if (colorSeed < 0.75) {
        c.setHSL(0.88, 0.85, 0.55 + Math.random() * 0.2) // Hibiscus deep rose
      } else {
        c.setHSL(0.0, 0.0, 0.90 + Math.random() * 0.1) // Warm white
      }
      col[idx] = c.r
      col[idx + 1] = c.g
      col[idx + 2] = c.b

      siz[i] = 0.15 + Math.random() * 0.4
    }

    return [pos, col, siz]
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position

    // Camera Z position based on scroll
    const cameraZ = -(scrollProgress * (tunnelLength - 30))

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3
      let sz = posAttr.array[idx + 2]

      // If star is now behind the camera, respawn it far ahead
      if (sz > cameraZ + 10) {
        posAttr.array[idx + 2] = cameraZ - tunnelLength * 0.8 - Math.random() * 40
        const angle = Math.random() * Math.PI * 2
        const radius = 3 + Math.random() * tunnelRadius
        posAttr.array[idx] = Math.cos(angle) * radius
        posAttr.array[idx + 1] = Math.sin(angle) * radius
      }
    }

    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors={true}
        size={0.3}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.9}
        map={starTexture || undefined}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
