import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Pre-load all photo textures at module level — no Suspense needed
const _loader = new THREE.TextureLoader()
const photoTextures = [
  "/assets/seni-2.jpeg",
  "/assets/seni-3.jpeg",
  "/assets/seni-4.jpeg",
  "/assets/seni-5.jpeg",
  "/assets/seni-6.jpeg",
  "/assets/seni-7.jpeg",
  "/assets/seni-8.jpeg",
].map((url) => {
  const t = _loader.load(url)
  t.colorSpace = THREE.SRGBColorSpace
  return t
})

// Sparkle cloud
function SparkleCloud({ position, count = 120, spread = 8, color = "#f9a8d4" }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.pow(Math.random(), 0.5) * spread
      pos[i*3]   = Math.sin(phi)*Math.cos(theta)*r + position[0]
      pos[i*3+1] = Math.sin(phi)*Math.sin(theta)*r + position[1]
      pos[i*3+2] = Math.cos(phi)*r + position[2]
    }
    return pos
  }, [])
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.getElapsedTime() * 0.04 })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color={color} size={0.12} sizeAttenuation transparent opacity={0.75}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

// Floating photo frame — texture pre-loaded, no Suspense
function PhotoFrame({ position, texIndex, rotY = 0 }) {
  const ref = useRef()
  const tex = photoTextures[texIndex % photoTextures.length]
  useFrame((s) => {
    if (!ref.current) return
    const t = s.clock.getElapsedTime()
    ref.current.position.y = position[1] + Math.sin(t * 0.38 + texIndex) * 0.3
    ref.current.rotation.y = rotY + Math.sin(t * 0.18 + texIndex) * 0.07
  })
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[3.6, 4.7, 0.09]} />
        <meshStandardMaterial color="#fff0f5" emissive="#f9a8d4" emissiveIntensity={0.3} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh>
        <planeGeometry args={[3.1, 4.1]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <pointLight color="#f9a8d4" intensity={5} distance={12} decay={2} />
    </group>
  )
}

// 1. Tiered Birthday Cake with candles
function BirthdayCake({ position }) {
  const group = useRef()
  const flames = useRef([])
  const candleColors = ["#fb923c","#a78bfa","#34d399","#f472b6","#60a5fa"]
  const candlePos = useMemo(() => Array.from({length:5},(_,i)=>{
    const a=(i/5)*Math.PI*2; return [Math.cos(a)*0.65,0,Math.sin(a)*0.65]
  }),[])

  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    if (group.current) { group.current.rotation.y=t*0.1; group.current.position.y=position[1]+Math.sin(t*0.4)*0.2 }
    flames.current.forEach((f,i)=>{ if(f){f.scale.y=1+Math.sin(t*7+i)*0.2;f.scale.x=1+Math.cos(t*5+i)*0.12} })
  })

  const pink  = <meshStandardMaterial color="#f472b6" emissive="#be185d" emissiveIntensity={0.25} roughness={0.4}/>
  const rose  = <meshStandardMaterial color="#fb7185" emissive="#e11d48" emissiveIntensity={0.2}  roughness={0.4}/>
  const white = <meshStandardMaterial color="#fff1f5" emissive="#fce7f3" emissiveIntensity={0.1}  roughness={0.5}/>

  return (
    <group ref={group} position={position}>
      <mesh><cylinderGeometry args={[2.2,2.4,1.0,32]}/>{pink}</mesh>
      <mesh position={[0,0.52,0]}><torusGeometry args={[2.1,0.12,8,48]}/>{white}</mesh>
      <mesh position={[0,1.45,0]}><cylinderGeometry args={[1.5,1.7,0.9,32]}/>{rose}</mesh>
      <mesh position={[0,1.92,0]}><torusGeometry args={[1.4,0.1,8,48]}/>{white}</mesh>
      <mesh position={[0,2.7,0]}><cylinderGeometry args={[0.9,1.1,0.8,32]}/>{pink}</mesh>
      <mesh position={[0,3.12,0]}><torusGeometry args={[0.85,0.09,8,48]}/>{white}</mesh>
      {candlePos.map((cp,i)=>(
        <group key={i} position={[cp[0],3.15,cp[2]]}>
          <mesh><cylinderGeometry args={[0.07,0.07,0.7,8]}/>
            <meshStandardMaterial color={candleColors[i]} emissive={candleColors[i]} emissiveIntensity={0.3}/>
          </mesh>
          <mesh ref={el=>{flames.current[i]=el}} position={[0,0.5,0]}>
            <sphereGeometry args={[0.11,8,8]}/><meshBasicMaterial color="#ffe066"/>
          </mesh>
          <pointLight position={[0,0.55,0]} color="#ffaa44" intensity={3} distance={8} decay={2}/>
        </group>
      ))}
      {[0,72,144,216,288].map((deg,i)=>(
        <mesh key={i} position={[Math.cos(deg*Math.PI/180)*0.35,3.65,Math.sin(deg*Math.PI/180)*0.35]}
          rotation={[Math.PI/2,0,deg*Math.PI/180]}>
          <sphereGeometry args={[0.18,8,8,0,Math.PI]}/>
          <meshStandardMaterial color="#be185d" emissive="#9d174d" emissiveIntensity={0.4}/>
        </mesh>
      ))}
      <mesh position={[0,3.7,0]}><sphereGeometry args={[0.12,8,8]}/><meshBasicMaterial color="#fde68a"/></mesh>
      <pointLight color="#f9a8d4" intensity={8} distance={20} decay={2}/>
    </group>
  )
}

// 2. Fireworks burst
function Fireworks({ position }) {
  const group = useRef()
  const trails = useMemo(() => {
    const colors=["#f472b6","#fbbf24","#a78bfa","#34d399","#fb7185","#60a5fa","#f9a8d4"]
    return Array.from({length:7},(_,i)=>{
      const angle=(i/7)*Math.PI*2
      const pos=new Float32Array(40*3)
      for(let j=0;j<40;j++){
        const s=0.3+Math.random()*3
        const ja=angle+(Math.random()-0.5)*1.1
        const je=(Math.random()-0.5)*1.1
        pos[j*3]=Math.cos(ja)*Math.cos(je)*s
        pos[j*3+1]=Math.sin(je)*s
        pos[j*3+2]=Math.sin(ja)*Math.cos(je)*s
      }
      return {pos,color:colors[i%colors.length]}
    })
  },[])

  useFrame((s)=>{
    const t=s.clock.getElapsedTime()
    if(group.current){group.current.rotation.y=t*0.12;group.current.position.y=position[1]+Math.sin(t*0.3)*0.3}
  })

  return (
    <group ref={group} position={position}>
      <mesh><sphereGeometry args={[0.3,16,16]}/><meshBasicMaterial color="#fffde7"/></mesh>
      {trails.map((t,i)=>(
        <points key={i}>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[t.pos,3]}/></bufferGeometry>
          <pointsMaterial color={t.color} size={0.2} sizeAttenuation transparent opacity={0.9}
            blending={THREE.AdditiveBlending} depthWrite={false}/>
        </points>
      ))}
      {Array.from({length:14},(_,i)=>{
        const a=(i/14)*Math.PI*2; const len=1.5+Math.random()*2
        return (
          <mesh key={i} position={[Math.cos(a)*len*0.5,Math.sin(a*0.7)*len*0.4,Math.sin(a)*len*0.5]}>
            <cylinderGeometry args={[0.025,0.025,len,4]}/>
            <meshBasicMaterial color={["#f472b6","#fbbf24","#a78bfa","#34d399"][i%4]}/>
          </mesh>
        )
      })}
      <pointLight color="#fbbf24" intensity={12} distance={24} decay={2}/>
    </group>
  )
}

// 3. Gift box with bow
function GiftBox({ position }) {
  const group = useRef()
  const lid = useRef()
  const confetti = useRef()

  useFrame((s)=>{
    const t=s.clock.getElapsedTime()
    if(group.current){group.current.rotation.y=t*0.12;group.current.position.y=position[1]+Math.sin(t*0.5)*0.25}
    if(lid.current) lid.current.position.y=1.35+Math.abs(Math.sin(t*0.6))*0.55
    if(confetti.current) confetti.current.rotation.y=t*0.35
  })

  const ribbon=<meshStandardMaterial color="#be185d" emissive="#9d174d" emissiveIntensity={0.35} metalness={0.3} roughness={0.3}/>

  return (
    <group ref={group} position={position}>
      <mesh><boxGeometry args={[2.4,2.0,2.4]}/>
        <meshStandardMaterial color="#fce7f3" emissive="#fbcfe8" emissiveIntensity={0.15} roughness={0.4}/>
      </mesh>
      <mesh><boxGeometry args={[0.22,2.05,2.45]}/>{ribbon}</mesh>
      <mesh><boxGeometry args={[2.45,2.05,0.22]}/>{ribbon}</mesh>
      <group ref={lid}>
        <mesh position={[0,1.35,0]}><boxGeometry args={[2.6,0.4,2.6]}/>
          <meshStandardMaterial color="#f9a8d4" emissive="#ec4899" emissiveIntensity={0.2} roughness={0.35}/>
        </mesh>
        <mesh position={[-0.45,1.6,0]} rotation={[0,0,0.5]}><torusGeometry args={[0.35,0.08,8,16,Math.PI*1.4]}/>{ribbon}</mesh>
        <mesh position={[0.45,1.6,0]} rotation={[0,0,-0.5]}><torusGeometry args={[0.35,0.08,8,16,Math.PI*1.4]}/>{ribbon}</mesh>
        <mesh position={[0,1.6,0]}><sphereGeometry args={[0.16,10,10]}/>{ribbon}</mesh>
      </group>
      <group ref={confetti}>
        {["#f472b6","#a78bfa","#34d399","#60a5fa","#fbbf24","#fb7185"].map((c,i)=>{
          const a=(i/6)*Math.PI*2
          return <mesh key={i} position={[Math.cos(a)*2.2,0.8+(i%3)*0.5,Math.sin(a)*2.2]}>
            <boxGeometry args={[0.15,0.15,0.05]}/>
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5}/>
          </mesh>
        })}
      </group>
      <pointLight color="#f9a8d4" intensity={7} distance={18} decay={2}/>
    </group>
  )
}

// 4. Cherry blossom tree
function CherryBlossom({ position }) {
  const group = useRef()
  const petalsGroup = useRef()
  const fallingRefs = useRef([])

  const petals = useMemo(()=>Array.from({length:90},()=>({
    x:(Math.random()-0.5)*4, y:2.5+Math.random()*2,
    z:(Math.random()-0.5)*4, s:0.12+Math.random()*0.2,
    c:["#fbb6ce","#f9a8d4","#fbcfe8","#fce7f3","#f472b6"][Math.floor(Math.random()*5)]
  })),[])

  const falling = useMemo(()=>Array.from({length:22},()=>({
    x:(Math.random()-0.5)*5, y:Math.random()*5,
    z:(Math.random()-0.5)*3, speed:0.3+Math.random()*0.5,
    off:Math.random()*Math.PI*2
  })),[])

  useFrame((s)=>{
    const t=s.clock.getElapsedTime()
    if(group.current) group.current.position.y=position[1]+Math.sin(t*0.2)*0.15
    if(petalsGroup.current) petalsGroup.current.rotation.y=t*0.04
    fallingRefs.current.forEach((r,i)=>{
      if(!r) return
      const p=falling[i]
      r.position.y=p.y-((t*p.speed+p.off)%5.5)
      r.position.x=p.x+Math.sin(t*0.9+p.off)*0.35
      r.rotation.z=t*p.speed*2
    })
  })

  return (
    <group ref={group} position={position}>
      <mesh><cylinderGeometry args={[0.22,0.35,3.0,10]}/>
        <meshStandardMaterial color="#7c4a3a" emissive="#5c3323" emissiveIntensity={0.1} roughness={0.8}/>
      </mesh>
      <mesh position={[0.7,2.0,0]} rotation={[0,0,0.5]}><cylinderGeometry args={[0.1,0.18,1.5,8]}/>
        <meshStandardMaterial color="#7c4a3a" roughness={0.8}/>
      </mesh>
      <mesh position={[-0.6,2.2,0.3]} rotation={[0.2,0,-0.45]}><cylinderGeometry args={[0.09,0.15,1.4,8]}/>
        <meshStandardMaterial color="#7c4a3a" roughness={0.8}/>
      </mesh>
      <group ref={petalsGroup}>
        {petals.map((p,i)=>(
          <mesh key={i} position={[p.x,p.y,p.z]}>
            <sphereGeometry args={[p.s,6,6]}/>
            <meshStandardMaterial color={p.c} emissive={p.c} emissiveIntensity={0.2} roughness={0.5}/>
          </mesh>
        ))}
      </group>
      {falling.map((p,i)=>(
        <mesh key={i} ref={el=>{fallingRefs.current[i]=el}} position={[p.x,p.y,p.z]}>
          <planeGeometry args={[0.2,0.2]}/>
          <meshBasicMaterial color="#fbb6ce" transparent opacity={0.85} side={THREE.DoubleSide}/>
        </mesh>
      ))}
      <pointLight color="#fbb6ce" intensity={7} distance={18} decay={2}/>
    </group>
  )
}

// 5. Candle cluster
function CandleCluster({ position }) {
  const group = useRef()
  const flameRefs = useRef([])

  const candles = useMemo(()=>[
    {x:0,z:0,h:3.5,r:0.25,color:"#f9a8d4"},
    {x:1.2,z:0.5,h:2.8,r:0.2,color:"#c084fc"},
    {x:-1.1,z:0.4,h:3.0,r:0.22,color:"#fb7185"},
    {x:0.6,z:-1.2,h:2.4,r:0.18,color:"#fdba74"},
    {x:-0.7,z:-1.0,h:3.2,r:0.21,color:"#a5f3fc"},
  ],[])

  useFrame((s)=>{
    const t=s.clock.getElapsedTime()
    if(group.current) group.current.rotation.y=t*0.07
    flameRefs.current.forEach((f,i)=>{
      if(f){f.scale.y=1+Math.sin(t*6+i*1.5)*0.18;f.scale.x=1+Math.cos(t*4.5+i)*0.1}
    })
  })

  return (
    <group ref={group} position={position}>
      <mesh position={[0,-0.1,0]}><cylinderGeometry args={[2.2,2.2,0.15,32]}/>
        <meshStandardMaterial color="#fce7f3" emissive="#fbcfe8" emissiveIntensity={0.1} roughness={0.5}/>
      </mesh>
      {candles.map((c,i)=>(
        <group key={i} position={[c.x,0,c.z]}>
          <mesh position={[0,c.h/2,0]}><cylinderGeometry args={[c.r,c.r*1.05,c.h,16]}/>
            <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={0.15} roughness={0.5}/>
          </mesh>
          <mesh position={[c.r*0.7,c.h*0.7,0]}><sphereGeometry args={[0.07,6,6]}/>
            <meshStandardMaterial color="#fff1f5" roughness={0.6}/>
          </mesh>
          <mesh ref={el=>{flameRefs.current[i]=el}} position={[0,c.h+0.32,0]}>
            <sphereGeometry args={[0.13,8,8]}/><meshBasicMaterial color="#ffe566"/>
          </mesh>
          <pointLight position={[c.x,c.h+0.35,c.z]} color="#ffbb44" intensity={4} distance={10} decay={2}/>
        </group>
      ))}
    </group>
  )
}

export default function CosmicObjects() {
  return (
    <group>
      {/* z=-25: Birthday Cake + photo 0 on opposite side */}
      <BirthdayCake position={[4.5, 0.5, -25]} />
      <SparkleCloud position={[4.5, 0.5, -25]} count={130} spread={9} color="#f9a8d4" />
      <PhotoFrame position={[-5.5, 0, -22]} texIndex={0} rotY={0.35} />

      {/* z=-75: Fireworks + photo 1 */}
      <Fireworks position={[-4, 0, -75]} />
      <SparkleCloud position={[-4, 0, -75]} count={140} spread={10} color="#fbbf24" />
      <PhotoFrame position={[5.5, 0.5, -72]} texIndex={1} rotY={-0.35} />

      {/* z=-130: Gift Box + photo 2 */}
      <GiftBox position={[4, 0, -130]} />
      <SparkleCloud position={[4, 0, -130]} count={120} spread={9} color="#c084fc" />
      <PhotoFrame position={[-5.5, 0, -127]} texIndex={2} rotY={0.28} />

      {/* z=-185: Cherry Blossom + photo 3 */}
      <CherryBlossom position={[-3.5, -1, -185]} />
      <SparkleCloud position={[-3.5, -1, -185]} count={160} spread={11} color="#fbb6ce" />
      <PhotoFrame position={[5.5, 0.5, -182]} texIndex={3} rotY={-0.28} />

      {/* z=-240: Candle Cluster + photo 4 */}
      <CandleCluster position={[3.5, -0.5, -240]} />
      <SparkleCloud position={[3.5, -0.5, -240]} count={130} spread={10} color="#fdba74" />
      <PhotoFrame position={[-5.5, 0, -237]} texIndex={4} rotY={0.22} />

      {/* Extra photos between waypoints */}
      <PhotoFrame position={[5, 1, -155]} texIndex={5} rotY={-0.18} />
      <PhotoFrame position={[-5.5, 0.5, -210]} texIndex={6} rotY={0.25} />

      {/* Ambient sparkle gems */}
      {[
        {pos:[-7,4,-45],c:"#f9a8d4"},{pos:[8,-3,-95],c:"#c084fc"},
        {pos:[-6,3,-160],c:"#fb7185"},{pos:[7,-2,-210],c:"#fde68a"},
      ].map((g,i)=>(
        <group key={i}>
          <mesh position={g.pos}>
            <octahedronGeometry args={[0.35,0]}/>
            <meshStandardMaterial color={g.c} emissive={g.c} emissiveIntensity={0.7} metalness={0.5}/>
          </mesh>
          <pointLight position={g.pos} color={g.c} intensity={3} distance={12} decay={2}/>
        </group>
      ))}
    </group>
  )
}
