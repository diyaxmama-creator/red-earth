import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Procedural continent-style displacement so the surface reads as a planet
// rather than a flat sphere, without depending on any external texture file.
function useEarthTexture() {
  return useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size / 2
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#1a0303'
    ctx.fillRect(0, 0, size, size / 2)

    const blobs = 46
    let seed = 1337
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = 0; i < blobs; i++) {
      const x = rand() * size
      const y = rand() * (size / 2)
      const r = 14 + rand() * 46
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
      const bright = 0.35 + rand() * 0.5
      grad.addColorStop(0, `rgba(255, ${Math.floor(60 + bright * 80)}, ${Math.floor(40 + bright * 40)}, 0.9)`)
      grad.addColorStop(1, 'rgba(20, 4, 4, 0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true
    return texture
  }, [])
}

function useEmissiveTexture() {
  return useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size / 2
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, size, size / 2)

    const dots = 220
    let seed = 4242
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = 0; i < dots; i++) {
      const x = rand() * size
      const y = rand() * (size / 2)
      const r = 0.6 + rand() * 1.8
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
      grad.addColorStop(0, 'rgba(255,120,80,0.9)')
      grad.addColorStop(1, 'rgba(255,40,20,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true
    return texture
  }, [])
}

export default function Earth({ onSelect, hovered, setHovered }) {
  const earthRef = useRef()
  const atmosphereRef = useRef()
  const glowRef = useRef()

  const surfaceMap = useEarthTexture()
  const emissiveMap = useEmissiveTexture()

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.06
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.04
    }
    if (glowRef.current) {
      const t = performance.now() * 0.001
      const pulse = 1 + Math.sin(t * 1.5) * 0.04
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      {/* Core planet */}
      <mesh
        ref={earthRef}
       onClick={(e) => {
  e.stopPropagation()

  window.location.href =
    "https://sites.google.com/view/diyax404/home"
}} 
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
        }}
      >
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial
          map={surfaceMap}
          emissiveMap={emissiveMap}
          emissive={new THREE.Color(hovered ? '#ff5533' : '#ff2200')}
          emissiveIntensity={hovered ? 1.8 : 1.1}
          color={new THREE.Color('#7a0e0e')}
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>

      {/* Inner atmosphere shell - thin glowing red haze close to surface */}
      <mesh ref={atmosphereRef} scale={1.04}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#ff2a1a"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer atmosphere glow - large soft falloff for the rim-light look */}
      <mesh ref={glowRef} scale={1.18}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#ff1100"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
