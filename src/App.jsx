import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene.jsx'

export default function App() {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app-root">
      <Canvas
        className="scene-canvas"
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 45, near: 0.1, far: 200, position: [0, 9, 22] }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      <div className={`hint-overlay ${showHint ? 'hint-visible' : ''}`}>
        <span className="hint-text">CLICK THE EARTH</span>
      </div>
    </div>
  )
}
