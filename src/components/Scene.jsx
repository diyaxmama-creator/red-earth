import { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import Earth from './Earth.jsx'
import Stars from './Stars.jsx'
import Satellites from './Satellites.jsx'

const EARTH_URL = 'https://sites.google.com/view/YOUR-GOOGLE-SITE'

function CameraIntro({ controlsRef }) {
  const introState = useRef({ t: 0, done: false })
  const { camera } = useThree()

  const startPos = useMemo(() => new THREE.Vector3(0, 9, 22), [])
  const endPos = useMemo(() => new THREE.Vector3(0, 1.4, 8), [])

  useFrame((_, delta) => {
    if (introState.current.done) return

    introState.current.t = Math.min(introState.current.t + delta / 3.2, 1)
    const t = introState.current.t
    const eased = 1 - Math.pow(1 - t, 3)

    camera.position.lerpVectors(startPos, endPos, eased)
    camera.lookAt(0, 0, 0)

    if (t >= 1) {
      introState.current.done = true
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      }
    }
  })

  return null
}

export default function Scene() {
  const controlsRef = useRef()
  const [hovered, setHovered] = useState(false)

  const handleSelect = () => {
    window.open(EARTH_URL, '_blank')
  }

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 18, 70]} />

      <ambientLight intensity={0.15} color="#ff4433" />
      <pointLight position={[8, 4, 8]} intensity={3.5} color="#ff5533" distance={50} decay={2} />
      <pointLight position={[-8, -4, -6]} intensity={1.2} color="#ff2200" distance={40} decay={2} />
      <directionalLight position={[5, 6, 5]} intensity={0.6} color="#ffffff" />

      <Stars />
      <Satellites />
      <Earth onSelect={handleSelect} hovered={hovered} setHovered={setHovered} />

      <CameraIntro controlsRef={controlsRef} />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={4}
        maxDistance={30}
        zoomSpeed={0.6}
        rotateSpeed={0.5}
        dampingFactor={0.08}
        enableDamping
        autoRotate={false}
      />

      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.8}
        />
        <Vignette eskil={false} offset={0.15} darkness={0.9} />
      </EffectComposer>
    </>
  )
}
