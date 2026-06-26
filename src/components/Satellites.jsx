import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function OrbitRing({ radius, tilt }) {
  const points = useMemo(() => {
    const segments = 128
    const pts = []
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return pts
  }, [radius])

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  return (
    <line geometry={geometry} rotation={[tilt[0], tilt[1], tilt[2]]}>
      <lineBasicMaterial color="#ff2a1a" transparent opacity={0.35} />
    </line>
  )
}

function Satellite({ radius, speed, tilt, offset, scale }) {
  const orbitGroup = useRef()
  const bodyRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    if (orbitGroup.current) {
      orbitGroup.current.rotation.y = t
    }
    if (bodyRef.current) {
      bodyRef.current.rotation.y += 0.01
      bodyRef.current.rotation.x += 0.005
    }
  })

  return (
    <group rotation={tilt}>
      <group ref={orbitGroup}>
        <group position={[radius, 0, 0]} scale={scale}>
          <group ref={bodyRef}>
            {/* satellite body */}
            <mesh>
              <boxGeometry args={[0.18, 0.18, 0.32]} />
              <meshStandardMaterial
                color="#3a0a0a"
                emissive="#ff2200"
                emissiveIntensity={0.6}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* solar panels */}
            <mesh position={[0.32, 0, 0]}>
              <boxGeometry args={[0.3, 0.02, 0.5]} />
              <meshStandardMaterial color="#220404" emissive="#ff1100" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[-0.32, 0, 0]}>
              <boxGeometry args={[0.3, 0.02, 0.5]} />
              <meshStandardMaterial color="#220404" emissive="#ff1100" emissiveIntensity={0.4} />
            </mesh>
            {/* beacon light */}
            <mesh position={[0, 0, 0.2]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial color="#ff6644" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}

export default function Satellites() {
  const satellites = useMemo(
    () => [
      { radius: 3.4, speed: 0.35, tilt: [0.3, 0, 0.1], offset: 0, scale: 1 },
      { radius: 4.1, speed: -0.22, tilt: [1.1, 0.4, 0], offset: 2, scale: 0.85 },
      { radius: 4.8, speed: 0.18, tilt: [-0.5, 1.2, 0.3], offset: 4, scale: 1.1 },
      { radius: 5.4, speed: -0.28, tilt: [0.8, -0.6, 0.2], offset: 1, scale: 0.9 },
    ],
    []
  )

  const rings = useMemo(
    () => [
      { radius: 3.4, tilt: [0.3, 0, 0.1] },
      { radius: 4.1, tilt: [1.1, 0.4, 0] },
      { radius: 4.8, tilt: [-0.5, 1.2, 0.3] },
      { radius: 5.4, tilt: [0.8, -0.6, 0.2] },
    ],
    []
  )

  return (
    <>
      {rings.map((ring, i) => (
        <OrbitRing key={i} radius={ring.radius} tilt={ring.tilt} />
      ))}
      {satellites.map((sat, i) => (
        <Satellite
          key={i}
          radius={sat.radius}
          speed={sat.speed}
          tilt={sat.tilt}
          offset={sat.offset}
          scale={sat.scale}
        />
      ))}
    </>
  )
}
