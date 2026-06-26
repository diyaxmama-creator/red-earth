import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function randomOnSphereShell(minRadius, maxRadius) {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  const r = minRadius + Math.random() * (maxRadius - minRadius)
  const x = r * Math.sin(phi) * Math.cos(theta)
  const y = r * Math.sin(phi) * Math.sin(theta)
  const z = r * Math.cos(phi)
  return [x, y, z]
}

function Starfield() {
  const pointsRef = useRef()

  const positions = useMemo(() => {
    const count = 6000
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const [x, y, z] = randomOnSphereShell(60, 160)
      arr[i * 3] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.003
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.18}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  )
}

function FloatingParticles() {
  const pointsRef = useRef()
  const count = 900

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const [x, y, z] = randomOnSphereShell(3.2, 14)
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      speeds[i] = 0.2 + Math.random() * 0.6
    }
    return { positions, speeds }
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const positionAttr = pointsRef.current.geometry.attributes.position
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 1
      positionAttr.array[idx] += Math.sin(t * speeds[i] + i) * 0.0015
    }
    positionAttr.needsUpdate = true
    pointsRef.current.rotation.y += delta * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ff3320"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default function Stars() {
  return (
    <>
      <Starfield />
      <FloatingParticles />
    </>
  )
}
